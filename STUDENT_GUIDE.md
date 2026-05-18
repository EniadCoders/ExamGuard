# ExamGuard — Student Flow Guide

A practical walkthrough of the **login page** and every **student feature**,
explaining how data moves from the form in the browser all the way to MongoDB
and back. Written so a non-author can follow it end-to-end.

---

## 1. What is ExamGuard

ExamGuard is a web platform for secure online exams at the university.
A student can:
- Sign up and log in
- See exams they are enrolled in
- Take an exam (MCQ, text, code)
- Get a grade (automatic for MCQ, manual for the rest)
- See past results and notifications

A teacher creates exams; a super-admin manages users. This guide focuses on
the **student side**.

---

## 2. Tech stack in one line

- **Frontend**: React 18 + TypeScript + Vite (folder [frontend/](frontend/))
- **Backend**: Express 5 + Mongoose + TypeScript (folder [backend/](backend/))
- **Database**: MongoDB Atlas (cloud)
- **Auth**: JWT stored in `localStorage`

---

## 3. How the two sides are connected

The browser only talks to the **backend** through one base URL: `/api/...`.

- In dev, Vite runs on port `5173` and forwards every `/api/*` call to the
  Express server on port `4000`. This is the **proxy** defined in
  [vite.config.ts](frontend/vite.config.ts).
- Express reads the request, asks Mongoose to query MongoDB, and returns JSON.
- The browser **never connects to MongoDB directly** — that would expose the
  database password.

Picture:

```
Browser (React) ──fetch("/api/...")──► Vite proxy ──► Express ──► MongoDB Atlas
                                                                      │
                ◄────────────── JSON ◄──────────────────────────────┘
```

---

## 4. Repo layout (only the parts you need)

```
ExamGuard/
├── frontend/
│   └── src/
│       ├── app/router.tsx              # which page for which URL
│       ├── shared/lib/api.ts           # the fetch() helper used everywhere
│       ├── features/auth/
│       │   ├── api.ts                  # client functions: login, signup…
│       │   └── pages/LoginPage.tsx     # the login screen
│       └── features/student/
│           ├── api.ts                  # client functions: fetchDashboard…
│           └── pages/StudentDashboardPage.tsx
├── backend/
│   └── src/
│       ├── index.ts                    # Express app entry
│       ├── db.ts                       # Mongoose connection
│       ├── middleware/auth.ts          # JWT check
│       ├── models/                     # the Mongo collections
│       │   ├── User.ts
│       │   ├── Exam.ts
│       │   └── ExamAttempt.ts
│       └── routes/
│           ├── auth.ts                 # /api/auth/*
│           └── student.ts              # /api/student/*
```

---

## 5. The login page — step by step

### 5.1 Component tree

The page is [LoginPage.tsx](frontend/src/features/auth/pages/LoginPage.tsx).
It is built from small reusable pieces:

```
AuthPageLayout                  (the dark page wrapper + grid background)
└── AuthCard                    (the centered card)
    ├── AuthHeading             (title "Connexion" + description)
    ├── provider buttons grid   (Google, GitHub, etc. — decorative)
    ├── role tabs               (Étudiant / Professeur — visual only)
    └── <form>                  (email + password + submit)
```

`AuthPageLayout`, `AuthCard`, `AuthHeading` and the CSS class helpers live
together in [AuthPageLayout.tsx](frontend/src/features/auth/components/AuthPageLayout.tsx).

### 5.2 State inside `LoginPage`

```ts
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
const [step, setStep] = useState<"credentials" | "2fa">("credentials");
const [challengeToken, setChallengeToken] = useState("");
const [twoFactorCode, setTwoFactorCode] = useState("");
```

- `email` and `password` are **controlled inputs** — each keystroke updates
  state.
- `error` is shown right under the password input when the API rejects.
- `step` jumps to `"2fa"` if the user has two-factor auth enabled.

### 5.3 Data flow when the user clicks "Se connecter"

```
1. handleLogin(e) is called
       │
       ▼
2. login(email, password)                   ◄── frontend/src/features/auth/api.ts
       │   builds a POST request
       ▼
3. api("/auth/login", { method: "POST", body }) ◄── frontend/src/shared/lib/api.ts
       │   adds JSON header
       ▼
4. fetch("/api/auth/login")                 ◄── handled by Vite proxy
       │
       ▼
5. Express: router.post("/login", ...)      ◄── backend/src/routes/auth.ts
       │   - UserModel.findOne({ email })
       │   - bcrypt.compare(password, user.passwordHash)
       │   - jwt.sign({ userId, role }) → token
       ▼
6. JSON returned: { token, user }
       │
       ▼
7. setToken(token)                          ◄── stored in localStorage
       │
       ▼
8. navigate("/student" or "/teacher")       ◄── decided by routeForRole(user.role)
```

### 5.4 Important details

- **Passwords are never stored as plain text.** Mongo only holds
  `passwordHash` (a bcrypt hash). See
  [User.ts](backend/src/models/User.ts) and the `bcrypt.hash`/`bcrypt.compare`
  calls in [auth.ts](backend/src/routes/auth.ts).
- **The token is a JWT** signed with `JWT_SECRET` (from `backend/.env`). It
  contains `{ userId, role, sessionId }` and expires in 7 days.
- **The token is stored in `localStorage`** under the key `examguard_token`.
  The helper [api.ts](frontend/src/shared/lib/api.ts) reads it and attaches
  `Authorization: Bearer <token>` to every following request.
- **Errors are translated**: 401 becomes "Email ou mot de passe incorrect.",
  403 becomes "Votre compte est suspendu.", etc. See `handleLogin` in
  [LoginPage.tsx](frontend/src/features/auth/pages/LoginPage.tsx).

---

## 6. After login — routing

Each URL is bound to one React component in
[router.tsx](frontend/src/app/router.tsx):

| URL | Component | Role |
|---|---|---|
| `/` | LoginPage | everyone |
| `/sign-up` | SignUpPage | new students |
| `/student` | StudentDashboard | student |
| `/exam/:examId` | ExamInterface | student taking an exam |
| `/teacher`, `/superadmin` | (other dashboards) | — |

There is **no hard route guard** today. The protection comes from the API:
if you visit `/student` without a token, the dashboard call will return
`401` and the page redirects you back to `/`.

---

## 7. Student dashboard

File: [StudentDashboardPage.tsx](frontend/src/features/student/pages/StudentDashboardPage.tsx)

### 7.1 What you see, where the data comes from

| Block on the page | Data source |
|---|---|
| Avatar + greeting "Bonjour, Zakaria" | `user` from `/api/student/dashboard` |
| Stats cards (à venir / complétés / note moyenne / validations) | `stats` (computed by the server) |
| List of exams | `exams[]` |
| Mini-calendar | `calendarEvents[]` |
| Notifications bell | `/api/student/notifications` |
| Settings form | `user` + `PATCH /api/auth/me` |

### 7.2 How it loads

```ts
useEffect(() => {
  fetchDashboard()                      // calls GET /api/student/dashboard
    .then(setUser/setExams/setStats);
}, []);
```

While the request is in flight, `dashboardLoading` is `true` and a spinner
shows. When the student has **zero** exams, the page hides the regular tabs
and only shows the **"Rejoindre un examen"** empty state (with the
join-by-code modal).

### 7.3 Tabs

There are 5 tabs (when the student has exams):

- **Tableau de bord** — landing view (greeting + stats + ongoing exam + 3 recent)
- **Mes Examens** — full list with filters
- **Résultats** — only completed exams; clicking one opens a modal that
  calls `GET /api/student/attempts/:id` to load the per-question breakdown
- **Calendrier** — month view of `scheduledAt`
- **Paramètres** — profile form (Prénom, Nom, Téléphone, Établissement) +
  password + notification settings

### 7.4 Joining an exam by code

The empty state and the "+" button open a modal that calls
`POST /api/student/exams/join` with the 6-letter code (e.g. `JAVAEE`). On
success the dashboard refreshes and the new exam appears.

---

## 8. Taking an exam (most important section)

File: [ExamInterfacePage.tsx](frontend/src/features/exam/pages/ExamInterfacePage.tsx)
URL: `/exam/:examId`

This is where the heaviest logic lives. The page does six things:

### 8.1 Start the attempt

```
POST /api/student/exams/:id/start
```

On the server (backend/src/routes/student.ts):
1. Check the exam exists and the student is enrolled.
2. Check the exam status (`live`, scheduledAt in the past). Refuses
   `draft` / `archived` / `completed` with 409.
3. If no attempt exists, **create one** with status `in-progress` and a
   randomized `questionOrder` if `rules.shuffleQuestions` is on.
4. If an attempt exists and time is over, **auto-submit it** immediately
   and return 409 ("time expired").
5. Return `{ attempt, exam }` to the browser. The questions sent have
   their `correctOptionId` / `correctOptionIds` **stripped** so the
   student cannot read the answers in the network tab.

The page stores the `attemptId` and the `remainingSeconds`. If the student
had already started before, the previous answers are restored from
`attempt.answers`.

### 8.2 Autosave while answering

Every change to the `answers` object triggers a debounced 1.2 s save:

```
PATCH /api/student/attempts/:id    body: { answers: [...] }
```

If the student closes the tab, what was typed up to ~1 s ago is already in
Mongo. A small "Saved" indicator flashes when the save returns.

### 8.3 Apply the exam rules

The server returns `exam.rules`. The page enforces them:

| Rule | Effect |
|---|---|
| `showTimer: false` | hide the big clock |
| `allowBacktrack: false` | the **Previous** button is disabled, past dots are unclickable |
| `warnBeforeEnd: true` | yellow banner pops at the 5-min mark |
| `preventCopyPaste: true` | `copy` / `paste` / `cut` are blocked **and** logged |
| `shuffleQuestions: true` | question order randomised at first start (persisted) |
| `shuffleOptions: true` | MCQ options shuffled on each render |

### 8.4 Anti-cheat events

Two browser events are reported to the server:

- Leaving fullscreen → `POST /attempts/:id/anti-cheat { type: "fullscreen-exit" }`
- Window loses focus → `... { type: "tab-blur" }`
- Copy/cut/paste (if blocked) → `... { type: "clipboard-paste" }` etc.

Each event is pushed into `attempt.antiCheatEvents[]` in Mongo.

### 8.5 Submit

When the student clicks "Soumettre" (or time hits 0):

```
POST /api/student/attempts/:id/submit
```

The server:
1. Loads the exam (including the **correct answers** which the client never sees).
2. Calls `autoGrade()` — for each MCQ:
   - simple: compares `answer === correctOptionId`
   - multiple: compares the set of selected IDs to `correctOptionIds`
3. If there is any `text` or `code` question, status becomes `"submitted"`
   (waiting for the teacher). If all questions are MCQ, status becomes
   `"graded"` and the student sees the final grade right away.
4. Sets `score`, `maxScore`, `submittedAt`.
5. Creates a `Notification` ("Examen soumis" or "Examen corrigé").

### 8.6 See the result

Back on the dashboard, the "Résultats" tab lets the student open any past
attempt:

```
GET /api/student/attempts/:id
```

The response includes:
- Score, passing score, `passed: true/false`
- Auto-submit flag (true if the timer ran out)
- Anti-cheat event count
- One entry per question with `yourAnswer`, `isCorrect`, and (only after
  submission) the `correctOptionId`/`correctOptionIds`.

The modal shows a green **✓ Validé** or red **✗ Échec** badge based on
`score >= passingScore`.

---

## 9. The full student API in one table

Every route is behind `requireAuth` ([middleware/auth.ts](backend/src/middleware/auth.ts)).
That middleware reads the `Authorization: Bearer <token>` header, verifies
the JWT, checks the session is still active, then puts `req.auth = { userId, role }`
on the request.

| Method | Route | What it does |
|---|---|---|
| POST | `/api/auth/signup` | Create a student account. Hashes password. |
| POST | `/api/auth/login` | Email + password. Returns JWT (or 2FA challenge). |
| POST | `/api/auth/login/2fa` | Send the 6-digit TOTP to finish login. |
| GET | `/api/auth/me` | Who is the current user? |
| PATCH | `/api/auth/me` | Update profile fields. |
| POST | `/api/auth/change-password` | Old + new password. |
| GET | `/api/student/dashboard` | Everything the dashboard needs in one call. |
| GET | `/api/student/exams/:id` | Exam read-only (description, rules). |
| POST | `/api/student/exams/join` | Enroll by 6-letter code. |
| POST | `/api/student/exams/:id/start` | Create or resume the attempt. |
| PATCH | `/api/student/attempts/:id` | Autosave answers. |
| POST | `/api/student/attempts/:id/anti-cheat` | Log a suspicious event. |
| POST | `/api/student/attempts/:id/submit` | Final submission + auto-grading. |
| GET | `/api/student/attempts/:id` | Per-question result breakdown. |
| GET | `/api/student/notifications` | Inbox. |
| PATCH | `/api/student/notifications/:id/read` | Mark one as read. |

---

## 10. Database schema (student-relevant collections)

### `users` (one document per person)

```
{
  email, passwordHash, role,
  fullName, school, program, department, phone,
  studentIdentifierType ("apogee" | "cne"), studentIdentifier,
  status ("active" | "suspended" | "pending"),
  twoFactorEnabled, twoFactorSecret, twoFactorBackupCodes,
  createdAt, updatedAt, lastLoginAt
}
```

File: [User.ts](backend/src/models/User.ts)

### `exams`

```
{
  title, subject, description,
  joinCode,                  // unique 6-letter code
  durationMinutes, scheduledAt, passingScore,
  status ("draft" | "scheduled" | "live" | "completed" | "archived"),
  createdBy: ObjectId<User>,
  enrolledStudents: ObjectId<User>[],
  rules: { shuffleQuestions, showTimer, allowBacktrack, ... },
  totalPoints,
  questions: [
    { id, type, text, points,
      options?, correctOptionId?, correctOptionIds?, multiple?,
      placeholder?, minWords?,
      language?, starterCode? }
  ]
}
```

File: [Exam.ts](backend/src/models/Exam.ts)

### `examattempts` (one per student × exam)

```
{
  examId, studentId,
  status ("in-progress" | "submitted" | "graded"),
  startedAt, submittedAt,
  score, maxScore,
  answers:  [{ questionId, value }],
  antiCheatEvents: [{ type, timestamp, details }],
  questionOrder: number[],   // shuffled IDs
  autoSubmitted: boolean
}
```

A **compound unique index** `{ examId, studentId }` makes it impossible to
have two attempts for the same exam-student pair. File:
[ExamAttempt.ts](backend/src/models/ExamAttempt.ts)

### `notifications`

```
{ userId, type, title, message, read, createdAt }
```

---

## 11. How a `GET` actually works in our stack

Take `GET /api/student/dashboard` as an example.

1. **Browser** calls `api("/student/dashboard")` from
   [features/student/api.ts](frontend/src/features/student/api.ts).
2. The helper in [shared/lib/api.ts](frontend/src/shared/lib/api.ts) reads
   the JWT from `localStorage` and runs `fetch("/api/student/dashboard")`
   with the `Authorization` header.
3. Vite proxy forwards to `http://localhost:4000/api/student/dashboard`.
4. **Express** matches the route in
   [backend/src/routes/student.ts](backend/src/routes/student.ts).
5. `requireAuth` decodes the JWT, sets `req.auth.userId`. Bad token → 401.
6. The handler runs **three Mongoose queries in parallel**:
   ```ts
   ExamModel.find({ enrolledStudents: studentId }).lean()
   ExamAttemptModel.find({ studentId }).lean()
   UserModel.findById(studentId).lean()
   ```
7. The handler builds a JSON object (stats, exams, calendar, user) and
   sends it back.
8. The React component reads the JSON and stores it in `useState`. React
   re-renders the page.

A `POST` (e.g. `/start`) is the same shape, except the body is JSON and
the handler calls `.save()` or `.create()` instead of just `.find()`.

---

## 12. Security checklist

- ✅ Passwords hashed with **bcrypt** (cost 10).
- ✅ All API routes require a valid JWT, except `signup` and `login`.
- ✅ JWT contains `sessionId`; revoking a session invalidates all its tokens.
- ✅ Students can only read their **own** attempts (`{ _id, studentId }` filter).
- ✅ Students can only read exams they are **enrolled in**.
- ✅ Correct answers are stripped from any payload while the attempt is
  `in-progress`.
- ✅ Time-expired attempts are auto-submitted; the student cannot keep
  answering past the duration.
- ✅ MongoDB credentials live in `backend/.env` (gitignored).

---

## 13. How to run locally

From the project root:

```bash
npm run install:all     # one-time
npm run dev             # starts Vite (5173) AND Express (4000)
```

Then open `http://localhost:5173`.

Seed accounts (after `npx tsx backend/src/seed.ts`):

| Email | Password | Role |
|---|---|---|
| `zakariatest@gmail.com` | `zakariaTest123` | student |
| `yassine.elamrani@ump.ac.ma` | `student123` | student |
| `prof.dupont@univ.fr` | `teacher123` | teacher |

---

## 14. If your professor asks…

- **"How does the password leave the browser?"** — In the JSON body of a
  `POST /api/auth/login` request, over HTTPS in production. Server hashes
  it on signup with bcrypt; only the hash is in Mongo.
- **"How do you keep the student logged in?"** — JWT in `localStorage`,
  re-attached to every `fetch` by [api.ts](frontend/src/shared/lib/api.ts).
  Server verifies the signature on each request.
- **"Where is the data really stored?"** — MongoDB Atlas. The connection
  string is in `backend/.env` (`MONGODB_URI`). Mongoose maps each model
  (`UserModel`, `ExamModel`, `ExamAttemptModel`…) to a collection.
- **"What if two students take the same exam?"** — Each gets their own
  document in `examattempts`. The unique index `{ examId, studentId }`
  guarantees no duplicates.
- **"How is the grade computed?"** — MCQ are graded by the server inside
  `autoGrade()` (compare to `correctOptionId` or `correctOptionIds`).
  Open questions stay `submitted` until a teacher marks them.
- **"How do you prevent cheating during the exam?"** — Fullscreen
  enforcement, copy/paste blocking, tab-blur detection, server-side
  timeout, hidden correct answers, and every suspicious event is logged
  in `attempt.antiCheatEvents[]`.
