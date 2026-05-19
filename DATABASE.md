# ExamGuard — Database Structure

ExamGuard uses **MongoDB** (Atlas) via **Mongoose**. The connection is opened in [backend/src/db.ts](backend/src/db.ts) and all schemas live in [backend/src/models/](backend/src/models/).

There are **6 collections**:

| Collection       | Mongoose model         | Source file                                                                  | Purpose                                              |
| ---------------- | ---------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------- |
| `users`          | `UserModel`            | [User.ts](backend/src/models/User.ts)                                        | Students, teachers and the super-admin               |
| `exams`          | `ExamModel`            | [Exam.ts](backend/src/models/Exam.ts)                                        | Exams created by teachers (questions, rules, status) |
| `examattempts`   | `ExamAttemptModel`     | [ExamAttempt.ts](backend/src/models/ExamAttempt.ts)                          | One student's attempt at one exam                    |
| `notifications`  | `NotificationModel`    | [Notification.ts](backend/src/models/Notification.ts)                        | In-app notifications per user                        |
| `auditlogs`      | `AuditLogModel`        | [AuditLog.ts](backend/src/models/AuditLog.ts)                                | Security / admin audit trail                         |
| `activesessions` | `ActiveSessionModel`   | [ActiveSession.ts](backend/src/models/ActiveSession.ts)                      | Active login sessions per user (device list)         |

All schemas use Mongoose's `timestamps: true`, so every document also carries `createdAt` and `updatedAt`.

---

## 1. `users` — [User.ts](backend/src/models/User.ts)

A single collection holds **students**, **teachers**, and the **super-admin**, differentiated by the `role` field.

| Field                      | Type                                       | Notes                                                       |
| -------------------------- | ------------------------------------------ | ----------------------------------------------------------- |
| `email`                    | `String`, **required**, **unique**         | Lowercased, trimmed. Login identifier.                      |
| `passwordHash`             | `String`, **required**                     | Hashed password (never store plaintext).                    |
| `role`                     | `"student" \| "teacher" \| "superadmin"`   | Required. Drives RBAC across the app.                       |
| `fullName`                 | `String`, **required**                     |                                                             |
| `department`               | `String`                                   | Teacher / admin field.                                      |
| `school`                   | `String`                                   |                                                             |
| `program`                  | `String`                                   | Student program / cursus.                                   |
| `studentIdentifierType`    | `"apogee" \| "cne"`                        | Type of academic ID (only meaningful for students).         |
| `studentIdentifier`        | `String`                                   | Value of the academic ID.                                   |
| `phone`, `title`, `location`, `bio`, `avatarUrl` | `String`                     | Profile fields.                                             |
| `preferences`              | sub-document (`preferencesSchema`)         | See below.                                                  |
| `twoFactorEnabled`         | `Boolean`                                  | Whether TOTP 2FA is active.                                 |
| `twoFactorSecret`          | `String`                                   | Active TOTP secret (only set after enrolment).              |
| `twoFactorPendingSecret`   | `String`                                   | TOTP secret being enrolled (not yet confirmed).             |
| `twoFactorBackupCodes`     | `String[]`                                 | One-time backup codes.                                      |
| `status`                   | `"active" \| "suspended" \| "pending"`     | Default `"active"`.                                         |
| `lastLoginAt`              | `Date`                                     |                                                             |
| `createdAt` / `updatedAt`  | `Date`                                     | From `timestamps`.                                          |

### Sub-document: `preferences`

User-tunable defaults and notification toggles.

| Field                       | Type     | Default            |
| --------------------------- | -------- | ------------------ |
| `emailFraudCritical`        | `Boolean`| `true`             |
| `emailDailyDigest`          | `Boolean`| `true`             |
| `emailExamSubmissions`      | `Boolean`| `true`             |
| `realtimeFraud`             | `Boolean`| `true`             |
| `realtimeStudentActivity`   | `Boolean`| `false`            |
| `realtimeTechnical`         | `Boolean`| `true`             |
| `defaultExamDuration`       | `Number` | `90` (minutes)     |
| `defaultPassingScore`       | `Number` | `12`               |
| `examLanguage`              | `String` | `"fr"`             |
| `timezone`                  | `String` | `"europe/paris"`   |

### Indexes
- `email`: unique.

---

## 2. `exams` — [Exam.ts](backend/src/models/Exam.ts)

Represents an exam owned by a teacher.

| Field                | Type                                                                       | Notes                                                 |
| -------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- |
| `title`              | `String`, **required**                                                     |                                                       |
| `subject`            | `String`, **required**                                                     |                                                       |
| `joinCode`           | `String`, **required**, **unique**                                         | Uppercase, trimmed. Code students enter to join.      |
| `description`        | `String`                                                                   |                                                       |
| `durationMinutes`    | `Number`, **required**                                                     | Base duration (live extras are tracked separately).   |
| `scheduledAt`        | `Date`                                                                     | Planned start time.                                   |
| `status`             | `"draft" \| "scheduled" \| "ongoing" \| "live" \| "completed" \| "archived"` | Lifecycle state.                                    |
| `previousStatus`     | `"draft" \| "scheduled" \| "completed"`                                    | Used to restore status when leaving `archived`.       |
| `passingScore`       | `Number` (default `12`)                                                    |                                                       |
| `launchMode`         | `"auto" \| "manual"` (default `"auto"`)                                    | Auto-start at `scheduledAt` vs. manual start.         |
| `importedFileName`   | `String`                                                                   | Source filename if questions were imported.           |
| `rules`              | sub-document (`examRulesSchema`)                                           | See below.                                            |
| `createdBy`          | `ObjectId` → `User`, **required**                                          | The owning teacher.                                   |
| `enrolledStudents`   | `[ObjectId]` → `User`                                                      | Students allowed to sit the exam.                     |
| `totalPoints`        | `Number`                                                                   | Sum of question points (denormalised).                |
| `questions`          | `[Question]` (embedded)                                                    | See below.                                            |
| `liveControl`        | sub-document (`liveControlSchema`)                                         | Teacher's live monitor state. See below.              |
| `createdAt` / `updatedAt` | `Date`                                                                |                                                       |

### Embedded: `questions[]`

A polymorphic question. The relevant fields depend on `type`.

| Field              | Type                                                  | Applies to     |
| ------------------ | ----------------------------------------------------- | -------------- |
| `id`               | `Number`, **required**                                | All            |
| `type`             | `"mcq" \| "text" \| "code"`, **required**             | All            |
| `text`             | `String`, **required**                                | All            |
| `points`           | `Number`, **required**                                | All            |
| `options`          | `[{ id: String, text: String }]`                      | `mcq`          |
| `correctOptionId`  | `String`                                              | `mcq` (single) |
| `correctOptionIds` | `String[]`                                            | `mcq` (multi)  |
| `multiple`         | `Boolean`                                             | `mcq`          |
| `placeholder`      | `String`                                              | `text`         |
| `minWords`         | `Number`                                              | `text`         |
| `language`         | `"java" \| "python" \| "cpp" \| "javascript" \| "c"`  | `code`         |
| `starterCode`      | `String`                                              | `code`         |

### Sub-document: `rules` (anti-cheat and UX)

| Field                     | Type    | Default |
| ------------------------- | ------- | ------- |
| `shuffleQuestions`        | Boolean | `true`  |
| `shuffleOptions`          | Boolean | `true`  |
| `allowBacktrack`          | Boolean | `true`  |
| `showResultsImmediately`  | Boolean | `false` |
| `requireFullscreen`       | Boolean | `true`  |
| `blockTabSwitch`          | Boolean | `true`  |
| `preventCopyPaste`        | Boolean | `true`  |
| `showTimer`               | Boolean | `true`  |
| `warnBeforeEnd`           | Boolean | `true`  |
| `attempts`                | Number  | `1`     |

### Sub-document: `liveControl`

State pushed by the teacher's live-monitor panel.

| Field                | Type     | Description                                                              |
| -------------------- | -------- | ------------------------------------------------------------------------ |
| `paused`             | Boolean  | Globally paused — students can't answer; the timer is frozen.            |
| `pausedAt`           | Date     | Timestamp the current pause started (`null` if not paused).              |
| `totalPausedMs`      | Number   | Cumulative paused time (ms), used to compute remaining time server-side. |
| `extraMinutes`       | Number   | Bonus minutes added by the teacher.                                      |
| `submissionsLocked`  | Boolean  | If `true`, students cannot submit.                                       |

### Indexes
- `joinCode`: unique.

---

## 3. `examattempts` — [ExamAttempt.ts](backend/src/models/ExamAttempt.ts)

One document per **(exam, student)** pair: a unique sitting.

| Field             | Type                                            | Notes                                                       |
| ----------------- | ----------------------------------------------- | ----------------------------------------------------------- |
| `examId`          | `ObjectId` → `Exam`, **required**               |                                                             |
| `studentId`       | `ObjectId` → `User`, **required**               |                                                             |
| `status`          | `"in-progress" \| "submitted" \| "graded"`      | Default `"in-progress"`.                                    |
| `startedAt`       | `Date`                                          | Defaults to `Date.now`.                                     |
| `submittedAt`     | `Date`                                          | Set when the student submits.                               |
| `score`           | `Number`                                        |                                                             |
| `maxScore`        | `Number`                                        |                                                             |
| `answers`         | `[Answer]` (embedded)                           | `{ questionId, value }` — `value` is mixed.                 |
| `antiCheatEvents` | `[AntiCheatEvent]` (embedded)                   | `{ type, timestamp, details }` — e.g. `tab-blur`, `paste`.  |
| `questionOrder`   | `Number[]`                                      | Per-student randomised order (for reproducibility).         |
| `autoSubmitted`   | `Boolean`                                       | `true` if submitted by the system (timeout).                |
| `kicked`          | `Boolean`                                       | Student ejected by the teacher.                             |
| `kickReason`      | `String`                                        | Optional reason shown to the student.                       |
| `messages`        | `[ExamMessage]` (embedded, with `_id`)          | Teacher-to-student in-exam messages.                        |
| `createdAt` / `updatedAt` | `Date`                                  |                                                             |

### Indexes
- `{ examId: 1, studentId: 1 }`: **unique** — prevents two attempts for the same student on the same exam.

---

## 4. `notifications` — [Notification.ts](backend/src/models/Notification.ts)

In-app notification feed per user.

| Field      | Type                                          | Notes                                                |
| ---------- | --------------------------------------------- | ---------------------------------------------------- |
| `userId`   | `ObjectId` → `User`, **required**, indexed    | Recipient.                                           |
| `type`     | `String`, **required**                        | e.g. `exam-scheduled`, `exam-graded`, `system`.      |
| `title`    | `String`, **required**                        |                                                      |
| `message`  | `String`                                      |                                                      |
| `read`     | `Boolean`                                     | Default `false`.                                     |
| `createdAt` / `updatedAt` | `Date`                         |                                                      |

### Indexes
- `userId`.

---

## 5. `auditlogs` — [AuditLog.ts](backend/src/models/AuditLog.ts)

Append-only trail of admin / security-sensitive actions.

| Field         | Type                                  | Notes                                |
| ------------- | ------------------------------------- | ------------------------------------ |
| `action`      | `String`, **required**                | Machine-readable action name.        |
| `actorEmail`  | `String`, **required**                | Email of the user performing it.     |
| `level`       | `"info" \| "warn" \| "danger"`        | Default `"info"`.                    |
| `metadata`    | `Mixed`                               | Arbitrary structured payload.        |
| `createdAt` / `updatedAt` | `Date`                    |                                      |

### Indexes
- `createdAt: -1` (most recent first).

---

## 6. `activesessions` — [ActiveSession.ts](backend/src/models/ActiveSession.ts)

Tracks logged-in devices per user (used by the "Active sessions" panel).

| Field           | Type                                        | Notes                                       |
| --------------- | ------------------------------------------- | ------------------------------------------- |
| `userId`        | `ObjectId` → `User`, **required**, indexed  | Owner of the session.                       |
| `device`        | `String`, **required**                      | e.g. `Chrome - macOS`.                      |
| `ip`            | `String`                                    |                                             |
| `location`      | `String`                                    | Coarse geo-location string.                 |
| `lastActiveAt`  | `Date`                                      | Defaults to `Date.now`.                     |
| `current`       | `Boolean`                                   | `true` for the device of the active session.|
| `createdAt` / `updatedAt` | `Date`                            |                                             |

### Indexes
- `userId`.

---

## Relationships overview

```
User (1) ───< (N) Exam              via Exam.createdBy
User (N) >─── (N) Exam              via Exam.enrolledStudents
User (1) ───< (N) ExamAttempt       via ExamAttempt.studentId
Exam (1) ───< (N) ExamAttempt       via ExamAttempt.examId         [UNIQUE (examId, studentId)]
User (1) ───< (N) Notification      via Notification.userId
User (1) ───< (N) ActiveSession     via ActiveSession.userId
AuditLog                            standalone (actor referenced by email, not ObjectId)
```

## Conventions

- IDs are MongoDB `ObjectId`. References use Mongoose's `ref` and can be `populate()`-d.
- All collections enable `timestamps`, exposing `createdAt` / `updatedAt`.
- Embedded sub-documents (questions, answers, anti-cheat events, preferences, rules, live control) live **inside** their parent document and are not separate collections.
- Enum fields are validated at the Mongoose layer — invalid values are rejected before they hit MongoDB.
