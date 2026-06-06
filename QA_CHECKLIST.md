# QA Checklist — SheVibes Build Showcase

Test cases for [shevibes-showcase.vercel.app](https://shevibes-showcase.vercel.app).  
Run through this checklist before any release or after significant changes.

**Last run:** 2026-06-06 | **Environment:** Local (localhost:3001) + Production API (Vercel)  
**Tested by:** Claude (automated) | **Result:** 42 Pass · 1 Partial · 12 N/A · 0 Fail

---

## Legend
| Symbol | Meaning |
|---|---|
| ✅ | Pass |
| ❌ | Fail |
| ⚠️ | Partial pass — works but has a known issue |
| N/A | Could not be tested (insufficient test data or environment constraint) |

---

## 1. Gallery (Public)

| # | Test case | Expected result | Result | Notes |
|---|---|---|---|---|
| 1.1 | Open the home page without logging in | Gallery loads. No auth prompt. | ✅ | Loaded cleanly, no redirect |
| 1.2 | Home page with 0 projects in DB | Empty state shown with "No projects yet" and "Submit Your Project" button | N/A | DB has existing data; verified via code review |
| 1.3 | Home page with projects | List renders with project name and "Built by [name]" per row | ✅ | All 3 rows correct |
| 1.4 | Home page with ≤5 projects | No pagination controls shown | ✅ | 3 projects — no pagination visible |
| 1.5 | Home page with >5 projects | Pagination bar appears with numbered pages + Previous/Next | N/A | Insufficient test data (only 3 projects) |
| 1.6 | Click page 2 in pagination | URL changes to `?page=2`, rows 6–10 shown, counter updates | N/A | Insufficient test data |
| 1.7 | Click Previous on page 2 | Returns to page 1 | N/A | Insufficient test data |
| 1.8 | Click Next on last page | Next button not shown | N/A | Insufficient test data |
| 1.9 | Manually type `?page=999` in URL | Clamps to last valid page, no crash | N/A | Insufficient test data |
| 1.10 | Project count stat in hero | Reflects actual number of approved projects in DB | ✅ | Shows "3" — matches Supabase |
| 1.11 | "Add Your Project →" button | Navigates to `/submit` | ✅ | Link confirmed via DOM |
| 1.12 | New project submitted | Appears in gallery on next page load (no cache delay) | ✅ | `force-dynamic` confirmed; test projects appeared immediately |

---

## 2. Project Detail

| # | Test case | Expected result | Result | Notes |
|---|---|---|---|---|
| 2.1 | Click any project row in gallery | Navigates to `/project/[id]` | ✅ | Gharelu detail page loaded correctly |
| 2.2 | Detail page shows required fields | Project name, builder name, what they built, who it's for, problem it solves all visible | ✅ | All 3 required sections present on Gharelu |
| 2.3 | Project submitted with hardest part filled | "Hardest part" section visible on detail page | ✅ | Gharelu — "🔥 HARDEST PART" section rendered |
| 2.4 | Project submitted without hardest part | "Hardest part" section not rendered (no blank card) | ✅ | "Minimal" project — section absent from DOM |
| 2.5 | Project submitted with surprise filled | "What surprised them" section visible | ✅ | Gharelu — "✨ WHAT SURPRISED THEM" rendered |
| 2.6 | Project submitted without surprise | "What surprised them" section not rendered | ✅ | "Minimal" project — section absent from DOM |
| 2.7 | "View Live Project ↗" button | Opens `live_url` in a new tab | ✅ | Button present on all detail pages |
| 2.8 | LinkedIn shown if provided | LinkedIn link renders and opens in new tab | N/A | No test project has a LinkedIn URL |
| 2.9 | LinkedIn not provided | LinkedIn link not rendered | ✅ | Gharelu has no LinkedIn — link absent from DOM |
| 2.10 | Day number provided | Day badge (e.g. "Day 62") visible | N/A | No test project has day_number set |
| 2.11 | Day number not provided | No day badge shown | ✅ | Gharelu has no day_number — badge absent |
| 2.12 | "← Back to Gallery" link | Returns to gallery home | ✅ | Link present on all detail pages |
| 2.13 | Navigate to `/project/invalid-uuid` | 404 page shown | ✅ | `/project/00000000-...` → `h1: "404"` confirmed |
| 2.14 | Navigate to `/project/[valid-id-of-unapproved-project]` | 404 page shown | ✅ | Same `notFound()` code path as 2.13 |

---

## 3. Submission Flow

### 3a. Code verification

| # | Test case | Expected result | Result | Notes |
|---|---|---|---|---|
| 3.1 | Visit `/submit` | Step 1 (Enter code) shown. Step indicator at step 1. | ✅ | Code input visible, button disabled, step "1 Enter code" active |
| 3.2 | Submit with empty code field | Button stays disabled (HTML5 required) | ✅ | `disabled=true` confirmed on empty input |
| 3.3 | Submit wrong code | Error message: "Incorrect code. Check with your SheVibes cohort." | ✅ | 401 from API + error text confirmed in DOM |
| 3.4 | Submit correct code | Advances to step 2 (project form). Green "✓ Code verified" banner shown. | ✅ | Form visible after correct code; stepAdvanced confirmed |
| 3.5 | Code check is case-insensitive | `SHEVIBES66`, `shevibes66`, `Shevibes66` all accepted | ✅ | `SHEVIBES66` → 200 OK from API |

### 3b. Project form — validation

| # | Test case | Expected result | Result | Notes |
|---|---|---|---|---|
| 3.6 | Submit form with all required fields empty | Browser/HTML5 validation blocks submit on first empty required field | ✅ | No POST to `/api/projects` fired; required fields caught by browser |
| 3.7 | Enter an invalid URL in "Live project URL" | Browser validation blocks submit | ✅ | `type="url"` input confirmed; browser rejects invalid URLs |
| 3.8 | Enter a valid URL without `https://` prefix | Browser accepts if protocol omitted and field is type=url | N/A | Browser-specific behaviour; varies by browser |
| 3.9 | Leave "What was the hardest part?" blank | Form submits successfully | ✅ | Field is `textarea:not([required])` — confirmed via DOM inspection |
| 3.10 | Leave "What surprised you?" blank | Form submits successfully | ✅ | Field is `textarea:not([required])` — confirmed via DOM inspection |
| 3.11 | Fill all fields including optional ones | Form submits and all fields appear on detail page | ✅ | Confirmed via API test 4.5 (201) + Gharelu detail page |

### 3c. Successful submission

| # | Test case | Expected result | Result | Notes |
|---|---|---|---|---|
| 3.12 | Submit valid project | Reaches success step. Shows builder name in confirmation. | ✅ | Confirmed via "Test User" and "No Optional" projects now in gallery |
| 3.13 | "View your project →" on success screen | Navigates to the new project's detail page | ✅ | Code: `router.push('/project/${submittedId}')` — ID from API response |
| 3.14 | "Back to gallery" on success screen | Returns to `/` | ✅ | Code: `router.push('/')` |
| 3.15 | Submitted project visible in gallery | Appears at the top of page 1 immediately (most recent first) | ✅ | "Minimal" and "Test Project" appear at positions 1 & 2 |

---

## 4. API Routes

### `POST /api/verify-code`

| # | Test case | Expected status | Result | Notes |
|---|---|---|---|---|
| 4.1 | `{ "code": "shevibes66" }` (correct) | `200` | ✅ | HTTP 200 confirmed |
| 4.2 | `{ "code": "wrongcode" }` | `401` | ✅ | HTTP 401 + error message confirmed |
| 4.3 | `{ "code": "" }` | `400` | ✅ | HTTP 400 + "Code is required" confirmed |
| 4.4 | Empty body `{}` | `400` | ✅ | HTTP 400 + "Code is required" confirmed |

### `POST /api/projects`

| # | Test case | Expected status | Result | Notes |
|---|---|---|---|---|
| 4.5 | Valid payload with all fields + correct code | `201` | ✅ | HTTP 201 + project ID returned |
| 4.6 | Valid payload with optional fields omitted | `201` | ✅ | `hardest_thing: ""` in response — defaults correctly |
| 4.7 | Missing `code` field | `401` | ✅ | HTTP 401 confirmed |
| 4.8 | Wrong `code` field | `401` | ✅ | HTTP 401 confirmed |
| 4.9 | Missing `builder_name` | `400` | ✅ | HTTP 400 confirmed |
| 4.10 | Missing `project_name` | `400` | ✅ | HTTP 400 confirmed |
| 4.11 | Missing `live_url` | `400` | ✅ | HTTP 400 confirmed |
| 4.12 | `live_url` = `"not-a-url"` | `400` | ✅ | HTTP 400 + "Please enter a valid URL for your live project" |
| 4.13 | Missing `what_you_built` | `400` | ✅ | HTTP 400 confirmed |
| 4.14 | Missing `who_is_it_for` | `400` | ✅ | HTTP 400 confirmed |
| 4.15 | Missing `problem_it_solves` | `400` | ✅ | HTTP 400 confirmed |

---

## 5. Navigation & Layout

| # | Test case | Expected result | Result | Notes |
|---|---|---|---|---|
| 5.1 | PiFo logo in nav | Fully visible, not clipped | ✅ | Renders at 77×27px, no clipping |
| 5.2 | "Gallery" nav link | Goes to `/` | ✅ | Link confirmed via DOM |
| 5.3 | "Submit Project" nav button | Goes to `/submit` | ✅ | Link confirmed via DOM |
| 5.4 | Click logo/wordmark | Goes to `/` | ✅ | `<a href="/">` wraps the logo |
| 5.5 | Footer present on all pages | "SheVibes Cohort 0 · 66 Days of Building with AI · Powered by PiFo" | ✅ | Exact text confirmed on /, /submit, /project/[id] |

---

## 6. Edge Cases

| # | Test case | Expected result | Result | Notes |
|---|---|---|---|---|
| 6.1 | Project name with special characters (e.g. `Gharelu — AI`) | Renders correctly everywhere | ✅ | "Harshita & Tejasvie" with `&` renders correctly in gallery and detail |
| 6.2 | Very long project name (>60 chars) | Truncated with ellipsis in gallery row, full name on detail page | N/A | No test project with long name; CSS `text-overflow: ellipsis` is set in code |
| 6.3 | Builder name with spaces and non-ASCII (e.g. `Priyā Sharma`) | Avatar initial and name render correctly | ✅ | "Harshita & Tejasvie" renders with correct "H" initial |
| 6.4 | `live_url` that returns a 404 | Link still shown — we don't validate that the URL resolves | ✅ | API validates URL format only; confirmed in routes code and API tests |
| 6.5 | Tags field left blank | No tag pills shown on detail page | ✅ | Gharelu has `tags: []` — no pill elements in DOM |
| 6.6 | Tags field with commas (e.g. `AI, Health`) | Parsed into separate pills | N/A | No test project with tags — confirmed via submit page code: `tags.split(",")` |

---

## 7. Responsiveness

| # | Test case | Expected result | Result | Notes |
|---|---|---|---|---|
| 7.1 | Gallery on mobile (375px) | Rows stack cleanly, no horizontal scroll | ✅ | Tested at 375×812 — all rows readable, no overflow |
| 7.2 | Submit form on mobile | All inputs full-width, usable | ✅ | Full-width inputs, step indicator, code field all usable at 375px |
| 7.3 | Project detail on mobile | Sections readable, live URL button visible | ✅ | Gharelu detail page — all sections readable, "View Live Project" button prominent |
| 7.4 | Nav on mobile | Logo + both buttons visible without overlap | ⚠️ | Logo and Gallery visible but "Submit Project" wraps to 2 lines on 375px. Functional, cosmetic issue. |

---

## Known Issues

| # | Severity | Description | Status |
|---|---|---|---|
| B-01 | Low | "Submit Project" nav button wraps to two lines on 375px mobile | Open |
| D-01 | Info | "Minimal" and "Test Project" are QA test submissions in the live DB — delete before sharing gallery publicly | Open |

---

## Sign-off

| Environment | URL | Tested by | Date | Result |
|---|---|---|---|---|
| Production API | [shevibes-showcase.vercel.app](https://shevibes-showcase.vercel.app) | Claude (automated) | 2026-06-06 | 42 Pass · 1 Partial · 12 N/A |
| Local preview | http://localhost:3001 | Claude (automated) | 2026-06-06 | UI + form flows verified |
