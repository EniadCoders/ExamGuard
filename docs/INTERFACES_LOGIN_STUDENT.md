# ExamGuard — Login/Signup & Student Interfaces

This document explains the two public-facing flows of ExamGuard:
1. **Authentication** (login / signup)
2. **Student dashboard** (post-login)

For each, it shows the component tree (parent → children) and the data flow.

---

## 1. Architectural foundations

### Frontend stack
- **React** + **TypeScript** + **Vite**.
- **React Router** for navigation.
- **TailwindCSS** for styling.
- State is managed locally with `useState` / `useEffect` — no Redux.

### Backend communication
- Single HTTP helper: `api()` in [frontend/src/shared/lib/api.ts](frontend/src/shared/lib/api.ts).
- It auto-attaches the JWT (`Authorization: Bearer <token>`) read from `localStorage`.
- Throws `ApiError` with HTTP status, used by pages to display friendly messages.

### Authentication contract
- Backend (`Express` + `MongoDB`) signs a **JWT** at login/signup.
- Frontend stores it via `setToken()` → key `examguard_token` in `localStorage`.
- Every protected request sends it automatically through `api()`.

---

## 2. Login / Signup Interface

### 2.1 Pages and routes

| Route             | Page component         |
| ----------------- | ---------------------- |
| `/`               | `LoginPage`            |
| `/sign-up`        | `SignUpPage`           |
| `/forgot-password`| `ForgotPasswordPage`   |
| `/reset-password` | `ResetPasswordPage`    |

All pages live in [frontend/src/features/auth/pages/](frontend/src/features/auth/pages/).

### 2.2 Component tree

```
LoginPage  (or SignUpPage / ForgotPasswordPage / ResetPasswordPage)
└── AuthPageLayout                  ← page chrome (background + centered Logo)
    ├── GridBackground              ← decorative animated grid
    ├── Logo (BrandLogo)
    └── AuthCard                    ← glass panel
        ├── AuthHeading             ← title + description
        ├── (provider buttons: Google, GitHub, SSO …)
        ├── (role selector: Étudiant / Professeur)  ← LoginPage only
        ├── <form>                  ← email + password (+ identifiers for signup)
        │   └── inputs / submit button
        └── footer links (forgot password, create account …)
```

### 2.3 Reusable building blocks
Located in [AuthPageLayout.tsx](frontend/src/features/auth/components/AuthPageLayout.tsx):
- `AuthPageLayout`: full-screen background and centered container.
- `AuthCard`: dark blurred card wrapping the form.
- `AuthHeading`: standardized title + description block.
- Class constants (`authFieldClass`, `authPrimaryButtonClass`, …): keep all auth forms visually identical.

### 2.4 Data flow — Login

```
User types email/password
        │
        ▼  (controlled inputs: useState)
LoginPage.handleLogin(e)
        │
        ▼
login(email, password)  →  POST /api/auth/login   (backend)
        │
        ├── case A: { token, user }
        │        ↳ setToken(token)
        │        ↳ navigate(routeForRole(user.role))   →  /student | /teacher
        │
        └── case B: { twoFactorRequired, challengeToken }
                 ↳ setStep("2fa")
                 ↳ second form: verifyLoginTwoFactor(challengeToken, code)
                          ↳ POST /api/auth/login/2fa
                          ↳ setToken, navigate
```

Errors thrown by `api()` are caught and mapped to French messages via `err.status` (401, 403, 400).

### 2.5 Data flow — Signup

```
SignUpPage form
   │  (controlled fields: fullName, email, password, school, program,
   │   department, identifierType, identifier, …)
   ▼
signupStudent(payload)  →  POST /api/auth/signup
   │
   ▼
{ token, user }
   ↳ setToken(token)           (auto-login)
   ↳ navigate("/student")
```

### 2.6 Key concepts to remember
- **Controlled components**: every input value is a `useState`, every change goes through `onChange`.
- **Single source of truth**: each page owns its form state; it isn't lifted up because no sibling needs it.
- **Layered composition**: page = `AuthPageLayout` (chrome) + `AuthCard` (panel) + form. The same layout serves login, signup, forgot, reset.
- **Stateless API client**: `api()` is a pure helper; auth state is implicit in the JWT stored in `localStorage`.
- **Route-based role redirection**: `routeForRole()` decides where to land after login.

---

## 3. Student Interface

After a successful login, an `student` role lands on `/student` → `StudentDashboard` component.

### 3.1 Folder structure

```
features/student/
├── api.ts                              ← typed API client (fetchDashboard, joinExamByCode …)
├── pages/
│   └── StudentDashboardPage.tsx        ← orchestrator (state + routing between tabs)
└── components/
    ├── StudentDashboardHeader.tsx      ← top navigation bar
    ├── StudentDashboardPrimitives.tsx  ← TypeChip, ScoreRing
    ├── views/
    │   ├── DashboardOverview.tsx
    │   ├── ExamsList.tsx
    │   ├── ResultsList.tsx
    │   ├── CalendarView.tsx
    │   └── SettingsView.tsx
    ├── settings/
    │   ├── ProfileSettings.tsx
    │   ├── PasswordSettings.tsx
    │   ├── NotificationSettings.tsx
    │   └── SecuritySettings.tsx
    └── modals/
        ├── JoinExamModal.tsx
        ├── ExamLockModal.tsx
        ├── ResultDetailModal.tsx
        ├── TwoFactorConfirmModal.tsx
        └── RevokeSessionModal.tsx
```

### 3.2 Component tree

```
StudentDashboard (page = state owner)
├── GridBackground
├── StudentDashboardHeader            ← tabs, profile, logout
│   ├── Logo
│   ├── nav buttons (Tableau de bord / Examens / Résultats / Calendrier)
│   ├── NotificationPanel
│   └── profile button + logout button
├── <main>
│   ├── DashboardOverview             (when activeTab = "dashboard")
│   │   ├── ActiveExamCard            ← inline sub-component
│   │   ├── DashboardMetricCard ×N    (shared dashboard primitives)
│   │   ├── RecentExamCard ×3
│   │   └── DashboardSectionCard ×2   (Performance / Calendar preview)
│   │
│   ├── ExamsList                     (when activeTab = "exams")
│   │   ├── search + filters
│   │   └── ExamCard ×N
│   │
│   ├── ResultsList                   (when activeTab = "results")
│   │   ├── ResultCard ×N
│   │   └── ResultDetailModal         (if selectedResult ≠ null)
│   │
│   ├── CalendarView                  (when activeTab = "calendar")
│   │   ├── filters
│   │   └── event cards
│   │
│   └── SettingsView                  (when activeTab = "settings")
│       ├── sidebar (Profil/Mot de passe/Notifications/Sécurité)
│       └── one of:
│           ├── ProfileSettings
│           ├── PasswordSettings
│           ├── NotificationSettings
│           └── SecuritySettings
└── modals (rendered conditionally at root level)
    ├── TwoFactorConfirmModal
    ├── RevokeSessionModal
    ├── ExamLockModal
    └── JoinExamModal
```

### 3.3 Single data load

On mount, the page calls one endpoint and hydrates all sub-views:

```
StudentDashboard (useEffect)
   │
   ▼
fetchDashboard()  →  GET /api/student/dashboard
   │
   ▼
{ user, stats, performance, exams, calendarEvents }
   ↳ stored in 5 useState hooks
```

If the request returns 401 (JWT expired), the page navigates back to `/`.

### 3.4 Why the page is the state owner
- It holds all **shared state**: dashboard data, filters, active tab, modal flags.
- Views are **presentational** — they receive data + callbacks via props.
- This is the "lift state up" pattern: only state the page needs to coordinate views/modals lives at the top.
- Local-only state stays inside its component (e.g. `PasswordSettings` keeps its own show/hide password toggles).

### 3.5 Data flow — joining an exam by code

```
User clicks "Rejoindre un examen"
   │
   ▼  setShowJoinCode(true)
JoinExamModal renders, controlled by parent state
   │
   ▼  user types code → onCodeChange → setExamCode
User clicks "Rejoindre"
   │
   ▼
handleSubmitJoinCode()
   │
   ▼
joinExamByCode(code)  →  POST /api/student/exams/join
   │
   ├── success → setJoinStep("success") + refreshDashboard()
   │              (re-fetches /api/student/dashboard so the new exam appears)
   └── ApiError 404 → setJoinError("Code invalide.")
```

### 3.6 Data flow — starting an exam (secure mode)

```
ExamCard "Rejoindre" button
   │
   ▼  onJoinExam(examId)
setTargetExamId(id) + setShowExamLock(true)
   │
   ▼
ExamLockModal asks for confirmation
   │
   ▼  user clicks "Rejoindre"
confirmJoinExam()
   │
   ├── document.documentElement.requestFullscreen()
   └── navigate(`/exam/${targetExamId}`)   → enters secure exam page
```

### 3.7 Data flow — viewing a past result

```
ResultCard click → onSelectResult(examId) → setSelectedResult(examId)
   │
   ▼  useEffect detects change
fetchAttempt(attemptId)  →  GET /api/student/attempts/:id
   │
   ▼
setAttemptDetail(data)
   ↓
ResultDetailModal renders score + per-question breakdown
```

### 3.8 Data flow — saving the profile

```
ProfileSettings inputs (controlled by parent state)
   │
   ▼  user clicks "Enregistrer"
handleSaveProfile()
   │
   ▼
updateProfile({ fullName, phone, school })  →  PATCH /api/auth/me
   │
   ▼
returned user → setUser(...) + setProfileMessage("Profil enregistré.")
```

### 3.9 Filters pattern (Exams / Results / Calendar)
Each list view receives:
- the **raw** dataset (e.g. `allExams`)
- the **filtered** dataset (computed via `useMemo` in the page)
- the **filter values** + **setters**

This keeps the filter logic centralized in the page, while the view stays focused on rendering.

---

## 4. End-to-end flow summary

```
[Browser]                      [React app]                        [Express API]
                                                                      │
1. Open "/"            ──▶  LoginPage                                  │
2. Submit credentials  ──▶  login()           ──▶  POST /auth/login   │
                                                ◀──  { token, user }  │
3. setToken(token)          (localStorage)                            │
4. navigate("/student") ─▶  StudentDashboard                          │
5. on mount             ─▶  fetchDashboard()  ──▶  GET /student/dashboard
                                                ◀── { user, stats, exams … }
6. user interacts (join code, start exam, view result, save profile)
   each action → typed API helper → REST call → state update → re-render
```

---

## 5. Concepts to defend in the oral exam

| Concept                  | Where it shows up                                                  |
| ------------------------ | ------------------------------------------------------------------ |
| **Controlled inputs**    | every form field in `LoginPage`, `SignUpPage`, `ProfileSettings`   |
| **Lifting state up**     | filters and modal flags live in `StudentDashboard`, not in children |
| **Composition**          | `AuthPageLayout` → `AuthCard` → `AuthHeading` → form               |
| **Conditional rendering**| `activeTab === "exams" && <ExamsList .../>`                        |
| **Side effects**         | `useEffect` for initial load, attempt detail, body scroll lock     |
| **useMemo**              | derived `filteredExams`, `filteredResults`, `filteredCalendar`     |
| **useCallback**          | stable handlers passed to children (`handleJoinExam`, etc.)        |
| **Typed API client**     | `api<T>()` in `shared/lib/api.ts` + typed helpers in `auth/api.ts` |
| **JWT auth**             | `setToken` after login, `Authorization` header injected by `api()` |
| **Role-based routing**   | `routeForRole(role)` chooses `/student` vs `/teacher`              |
| **Error handling**       | `ApiError(status, message)` → translated messages per page         |
| **Two-step 2FA**         | `step` state machine in `LoginPage` (`credentials` → `2fa`)        |
