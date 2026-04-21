# Backend Intel

## Project: ejada-platform
**Generated:** 2026-04-21
**Phase:** 01 - Backend Audit

---

## Models (21 Total)

| # | Model | File | Key Fields |
|---|-------|------|------------|
| 1 | User | user.model.ts | username, email, password, role, children, studentProfile |
| 2 | StudentProfile | studentProfile.model.ts | user, dateOfBirth, gender, address, phone, emergencyContact |
| 3 | Circle | circle.model.ts | name, teacher, students, schedule, status |
| 4 | Section | section.model.ts | name, circle, order, description |
| 5 | Curriculum | curriculum.model.ts | title, description, sections, level |
| 6 | Assignment | assignment.model.ts | title, description, section, dueDate, type |
| 7 | Submission | submission.model.ts | assignment, student, content, status, grade |
| 8 | Evaluation | evaluation.model.ts | student, criteria, score, feedback, evaluator |
| 9 | Attendance | attendance.model.ts | student, date, status, circle, notes |
| 10 | Certificate | certificate.model.ts | student, template, issueDate, qrCode |
| 11 | CertificateTemplate | certificateTemplate.model.ts | name, content, image |
| 12 | Notification | notification.model.ts | recipient, type, message, read, link |
| 13 | CalendarEvent | calendarEvent.model.ts | title, date, type, circle, description |
| 14 | Resource | resource.model.ts | title, type, url, category |
| 15 | LessonLog | lessonLog.model.ts | teacher, circle, date, duration, content, studentsPresent |
| 16 | WorkLog | workLog.model.ts | teacher, date, hours, tasks, status |
| 17 | Badge | badge.model.ts | name, description, icon, criteria |
| 18 | Award | award.model.ts | student, badge, date, reason, awardedBy |
| 19 | Application | application.model.ts | applicant, program, status, documents |
| 20 | StudentProgress | studentProgress.model.ts | student, curriculum, currentSection, completedLessons, percentage |
| 21 | Attendance | attendance.model.ts | student, date, status, circle, notes |

---

## Routes (25 Total)

| # | Route File | API Prefix | Endpoints |
|---|----------|-----------|---------|
| 1 | auth.routes.ts | /api/auth | POST /register, POST /login, POST /forgot-password, POST /reset-password/:token |
| 2 | user.routes.ts | /api/users | GET /, GET /:id, PUT /:id, DELETE /:id, GET /featured |
| 3 | circle.routes.ts | /api/circles | GET /, POST /, GET /:id, PUT /:id, DELETE /:id, GET /:id/students |
| 4 | section.routes.ts | /api/sections | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 5 | curriculum.routes.ts | /api/curriculum | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 6 | assignment.routes.ts | /api/assignments | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 7 | submission.routes.ts | /api/submissions | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 8 | evaluation.routes.ts | /api/evaluations | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 9 | notification.routes.ts | /api/notifications | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 10 | stats.routes.ts | /api/stats | GET /overview (public), GET /student/:studentId |
| 11 | lessonLog.routes.ts | /api/lessonlogs | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 12 | calendar.routes.ts | /api/calendar | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 13 | parent.routes.ts | /api/parent | GET /children/:parentId, GET /children/:parentId/progress |
| 14 | resource.routes.ts | /api/resources | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 15 | attendance.routes.ts | /api/attendance | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 16 | badge.routes.ts | /api/badges | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 17 | award.routes.ts | /api/awards | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 18 | workLog.routes.ts | /api/worklogs | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 19 | payroll.routes.ts | /api/payroll | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 20 | curriculumBuilder.routes.ts | /api/curriculum-builder | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 21 | application.routes.ts | /api/applications | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 22 | certificate.routes.ts | /api/certificates | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| 23 | checkout.routes.ts | /api/checkout | POST /create-payment-intent |
| 24 | progress.routes.ts | /api/progress | GET /student/:studentId, PUT /student/:studentId |
| 25 | payroll.routes.ts | /api/payroll | GET /, POST /, GET /:id |

---

## Controllers (25 Total)

List of controllers mapped to routes:
- auth.controller.ts
- user.controller.ts
- circle.controller.ts
- section.controller.ts
- curriculum.controller.ts
- assignment.controller.ts
- submission.controller.ts
- evaluation.controller.ts
- notification.controller.ts
- stats.controller.ts
- lessonLog.controller.ts
- calendar.controller.ts
- parent.controller.ts
- resource.controller.ts
- attendance.controller.ts
- badge.controller.ts
- award.controller.ts
- workLog.controller.ts
- payroll.controller.ts
- curriculumBuilder.controller.ts
- application.controller.ts
- certificate.controller.ts
- checkout.controller.ts
- progress.controller.ts

---

## Issues Identified

### Issue 1: Misplaced Imports (CRITICAL)
**File:** backend/src/index.ts
**Line:** 55-59
**Problem:** Imports are placed after route mounting code (should be at top with other imports)
**Current Code:**
```typescript
// Line 54 ends route mounting
// Line 55-59 has misplaced imports
import applicationRoutes from './routes/application.routes'; 
import certificateRoutes from './routes/certificate.routes';
```
**Fix:** Move imports to top of file with other imports (lines 10-28)

### Issue 2: Inconsistent Route Protection Pattern
**Files:** 
- src/routes/user.routes.ts (line 16-30)
- src/routes/stats.routes.ts (line 10-17)
**Problem:** Uses "CRITICAL FIX" comment style inconsistently
**Fix:** Clean up comments, use consistent pattern

### Issue 3: Missing Award Route
**Files:** backend/src/routes/, backend/src/controllers/
**Problem:** Award model exists but no route file found in routes/
**Status:** Has controller but needs route file

---

## Additional Issues Found (TypeScript Errors)

### Error 1: sendEmail.ts is not a module
**File:** src/controllers/auth.controller.ts
**Line:** 6
**Problem:** import error

### Error 2: Type mismatch in checkout.controller.ts
**File:** src/controllers/checkout.controller.ts
**Line:** 6, 34
**Problem:** Type casting issue

### Error 3: Missing AuthRequest export
**File:** src/controllers/curriculum.controller.ts
**Line:** 4
**Problem:** Module doesn't export AuthRequest

### Error 4: ObjectId type issues
**File:** src/controllers/progress.controller.ts
**Line:** 23, 29
**Problem:** Type casting issues

### Error 5: Unknown type in Resource.model.ts
**File:** src/models/Resource.model.ts
**Line:** 39
**Problem:** Type inference issue

---

## Summary

| Category | Count |
|----------|-------|
| Models | 21 |
| Routes | 25 |
| Controllers | 25 |
| Issues Found | 8+ (includes TS errors) |

## Next Steps (Priority Order)
1. **Phase 04:** Fix misplaced imports in index.ts
2. **Phase 04:** Fix TypeScript compilation errors
3. **Phase 04:** Clean up "CRITICAL FIX" comments
4. **Phase 05:** Add missing award route
5. **Phase 05:** Add incomplete endpoints