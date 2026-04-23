# ExamGuard

ExamGuard is a React + TypeScript assessment platform with separate student,
admin, teacher profile, and exam-taking flows.

## Running the project

```bash
npm install
npm run dev
```

## Project structure

```text
src/
  app/                  App shell and router
  assets/               Static images
  features/             Product features grouped by domain
    admin/
    auth/
    exam/
    student/
    teacher/
  shared/               Cross-feature components, types, and utilities
  styles/               Global styles and design system files
```

## Notes

- The runtime app now lives under `src/features` and `src/shared`.
- Legacy generated Figma exports should not be used for product development.
