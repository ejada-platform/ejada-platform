# Frontend Intel

## Project: ejada-platform
**Generated:** 2026-04-21
**Phase:** 02 - Frontend Audit

---

## Pages (48 Total)

### Public Pages (4)
| Page | File | Route |
|------|------|-------|
| Landing | LandingPage.tsx | / |
| Login | LoginPage.tsx | /login |
| Register | RegisterPage.tsx | /register |
| Forgot Password | ForgotPasswordPage.tsx | /forgot-password |
| Reset Password | ResetPasswordPage.tsx | /reset-password/:token |

### Shared Pages (11)
| Page | File |
|------|------|
| My Circles | MyCirclesPage.tsx |
| Enrollment | EnrollmentPage.tsx |
| Curriculum | CurriculumPage.tsx |
| Circle Detail | CircleDetailPage.tsx |
| Book Viewer | BookViewerPage.tsx |
| Academic Calendar | AcademicCalendarPage.tsx |
| Tutorials | TutorialsPage.tsx |
| Support | SupportPage.tsx |
| Checkout Success | CheckoutSuccessPage.tsx |
| Edit User | EditUserForm.tsx |
| (chat) | chat.tsx |

### Student Pages (2)
| Page | File |
|------|------|
| Dashboard | student/StudentDashboard.tsx |
| My Progress | student/MyProgressPage.tsx |

### Teacher Pages (7)
| Page | File |
|------|------|
| Dashboard | teacher/TeacherDashboard.tsx |
| Edit Circle | teacher/EditCirclePage.tsx |
| Create Assignment | teacher/CreateAssignmentPage.tsx |
| Teacher Attendance | teacher/TeacherAttendancePage.tsx |
| Attendance Overview | teacher/AttendanceOverviewPage.tsx |
| My Work Logs | teacher/MyWorkLogsPage.tsx |
| Student Progress | teacher/StudentProgressPage.tsx |

### Parent Pages (1)
| Page | File |
|------|------|
| Dashboard | parent/ParentDashboardPage.tsx |

### Admin Pages (15)
| Page | File |
|------|------|
| Admin Dashboard | admin/AdminDashboardPage.tsx |
| User Management | admin/UserManagementPage.tsx |
| Create Circle | admin/CreateCirclePage.tsx |
| Edit User | admin/EditUserForm.tsx |
| Attendance History | admin/AttendanceHistoryPage.tsx |
| Curriculum Builder | admin/CurriculumBuilderPage.tsx |
| Manage Templates | admin/ManageTemplatesPage.tsx |
| Payroll | admin/PayrollPage.tsx |
| Application Review | admin/ApplicationReviewPage.tsx |
| Manage Badges | admin/ManageBadgesPage.tsx |
| Digital Library | admin/DigitalLibraryPage.tsx |
| Manage Library | admin/ManageLibraryPage.tsx |
| (more) | ... |

---

## Components

| Component | File |
|-----------|------|
| Notification Bell | components/NotificationBell.tsx |
| Modal | components/Modal.tsx |
| Scroll To Top | components/ScrollToTopButton.tsx |
| Protected Route | components/ProtectedRoute.tsx |
| Start Student | components/StartStudent.tsx |
| Accordion | components/Accordion.tsx |
| Chat | components/chat.tsx |

---

## Issues Identified

### Issue 1: Hardcoded URLs (CRITICAL)
**Severity:** HIGH
**Problem:** All 30+ pages use `http://localhost:5000` hardcoded API URLs
**Examples:**
- LoginPage.tsx: `axios.post('http://localhost:5000/api/auth/login')`
- AdminDashboardPage.tsx: `axios.get('http://localhost:5000/api/stats/overview')`
- All pages in /pages/admin, /pages/teacher, /pages/student, /pages/parent
**Fix:** Create centralized API service using environment variable `VITE_API_URL`

### Issue 2: No Centralized API Service
**Severity:** HIGH
**Problem:** No api.service.ts or axios instance with baseURL configured
**Current:** Each page imports axios directly
**Fix:** Create src/services/api.service.ts with axios instance

### Issue 3: Missing Award Page
**Severity:** MEDIUM
**Problem:** Backend has Award model but no frontend page to view awards
**Status:** Students can't see their badges/awards
**Fix:** Add Award Badge page (Phase 06)

### Issue 4: Missing API Endpoints
**Severity:** MEDIUM
**Problem:** Frontend uses non-existent endpoints:
- `/api/circles/my-circles` - probably doesn't exist
- `/api/parent/my-children` - probably doesn't exist
- `/api/circles/all` - probably doesn't exist
**Fix:** Verify and add missing endpoints (Phase 05)

### Issue 5: No i18n Service
**Severity:** LOW
**Problem:** Frontend has i18n.ts but not properly integrated
**Current:** Hardcoded English text in components
**Fix:** Integrate i18n properly (Phase 07)

### Issue 6: Missing Environment Variables
**Severity:** LOW
**Problem:** No .env template for frontend
**Fix:** Create .env.example (Phase 07)

---

## API Usage Summary

| Endpoint | Usage Count | Status |
|----------|-------------|--------|
| /api/auth/login | 1 | ✓ |
| /api/auth/register | 1 | ✓ |
| /api/auth/forgot-password | 1 | ✓ |
| /api/auth/reset-password/:token | 1 | ✓ |
| /api/circles | 5 | Check |
| /api/circles/my-circles | 2 | Missing? |
| /api/curriculum | 2 | ✓ |
| /api/evaluations | 2 | ✓ |
| /api/stats/overview | 2 | ✓ |
| /api/notifications | 1 | ✓ |
| /api/users | 5 | ✓ |
| /api/submissions | 4 | ✓ |
| /api/lessonlogs | 2 | ✓ |
| /api/assignments | 2 | ✓ |
| /api/sections | 1 | Check |
| /api/attendance | 4 | ✓ |
| /api/resources | 3 | ✓ |
| /api/badges | 2 | ✓ |
| /api/payroll | 2 | ✓ |
| /api/applications | 2 | ✓ |
| /api/calendar | 2 | ✓ |
| /api/worklogs | 2 | ✓ |
| /api/parent/* | 1 | Missing? |
| /api/checkout | 2 | ✓ |
| /api/certificates | 3 | ✓ |
| /api/progress | 2 | ✓ |
| /api/curriculum-builder | 3 | ✓ |

---

## Summary

| Category | Count |
|----------|-------|
| Pages | 48 |
| Components | 7 |
| API calls | 67 (all hardcoded) |
| Issues Found | 6 |

## Next Steps
1. Create centralized API service (Phase 06 or 07)
2. Add Award/Badge view page (Phase 06)
3. Fix missing API endpoints (Phase 05)
4. Add i18n integration (Phase 07)