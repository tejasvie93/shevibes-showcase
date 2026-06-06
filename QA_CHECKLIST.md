# QA Checklist — SheVibes Build Showcase

Test cases for [shevibes-showcase.vercel.app](https://shevibes-showcase.vercel.app).  
Run through this checklist before any release or after significant changes.

---

## 1. Gallery (Public)

| # | Test case | Expected result | Pass/Fail |
|---|---|---|---|
| 1.1 | Open the home page without logging in | Gallery loads. No auth prompt. | |
| 1.2 | Home page with 0 projects in DB | Empty state shown with "No projects yet" and "Submit Your Project" button | |
| 1.3 | Home page with projects | List renders with project name and "Built by [name]" per row | |
| 1.4 | Home page with ≤5 projects | No pagination controls shown | |
| 1.5 | Home page with >5 projects | Pagination bar appears with numbered pages + Previous/Next | |
| 1.6 | Click page 2 in pagination | URL changes to `?page=2`, rows 6–10 shown, counter updates | |
| 1.7 | Click Previous on page 2 | Returns to page 1 | |
| 1.8 | Click Next on last page | Next button not shown | |
| 1.9 | Manually type `?page=999` in URL | Clamps to last valid page, no crash | |
| 1.10 | Project count stat in hero | Reflects actual number of approved projects in DB | |
| 1.11 | "Add Your Project →" button | Navigates to `/submit` | |
| 1.12 | New project submitted | Appears in gallery on next page load (no cache delay) | |

---

## 2. Project Detail

| # | Test case | Expected result | Pass/Fail |
|---|---|---|---|
| 2.1 | Click any project row in gallery | Navigates to `/project/[id]` | |
| 2.2 | Detail page shows required fields | Project name, builder name, what they built, who it's for, problem it solves all visible | |
| 2.3 | Project submitted with hardest part filled | "Hardest part" section visible on detail page | |
| 2.4 | Project submitted without hardest part | "Hardest part" section not rendered (no blank card) | |
| 2.5 | Project submitted with surprise filled | "What surprised them" section visible | |
| 2.6 | Project submitted without surprise | "What surprised them" section not rendered | |
| 2.7 | "View Live Project ↗" button | Opens `live_url` in a new tab | |
| 2.8 | LinkedIn shown if provided | LinkedIn link renders and opens in new tab | |
| 2.9 | LinkedIn not provided | LinkedIn link not rendered | |
| 2.10 | Day number provided | Day badge (e.g. "Day 62") visible | |
| 2.11 | Day number not provided | No day badge shown | |
| 2.12 | "← Back to Gallery" link | Returns to gallery home | |
| 2.13 | Navigate to `/project/invalid-uuid` | 404 page shown | |
| 2.14 | Navigate to `/project/[valid-id-of-unapproved-project]` | 404 page shown | |

---

## 3. Submission Flow

### 3a. Code verification

| # | Test case | Expected result | Pass/Fail |
|---|---|---|---|
| 3.1 | Visit `/submit` | Step 1 (Enter code) shown. Step indicator at step 1. | |
| 3.2 | Submit with empty code field | Button stays disabled (HTML5 required) | |
| 3.3 | Submit wrong code | Error message: "Incorrect code. Check with your SheVibes cohort." | |
| 3.4 | Submit correct code | Advances to step 2 (project form). Green "✓ Code verified" banner shown. | |
| 3.5 | Code check is case-insensitive | `SHEVIBES66`, `shevibes66`, `Shevibes66` all accepted | |

### 3b. Project form — validation

| # | Test case | Expected result | Pass/Fail |
|---|---|---|---|
| 3.6 | Submit form with all required fields empty | Browser/HTML5 validation blocks submit on first empty required field | |
| 3.7 | Enter an invalid URL in "Live project URL" | Browser validation blocks submit | |
| 3.8 | Enter a valid URL without `https://` prefix | Browser accepts if protocol omitted and field is type=url | |
| 3.9 | Leave "What was the hardest part?" blank | Form submits successfully | |
| 3.10 | Leave "What surprised you?" blank | Form submits successfully | |
| 3.11 | Fill all fields including optional ones | Form submits and all fields appear on detail page | |

### 3c. Successful submission

| # | Test case | Expected result | Pass/Fail |
|---|---|---|---|
| 3.12 | Submit valid project | Reaches success step. Shows builder name in confirmation. | |
| 3.13 | "View your project →" on success screen | Navigates to the new project's detail page | |
| 3.14 | "Back to gallery" on success screen | Returns to `/` | |
| 3.15 | Submitted project visible in gallery | Appears at the top of page 1 immediately (most recent first) | |

---

## 4. API Routes

Test these directly with curl or a tool like Postman.

### `POST /api/verify-code`

| # | Test case | Expected status | Expected body |
|---|---|---|---|
| 4.1 | `{ "code": "shevibes66" }` (correct) | `200` | `{ "success": true }` |
| 4.2 | `{ "code": "wrongcode" }` | `401` | `{ "error": "Incorrect code..." }` |
| 4.3 | `{ "code": "" }` | `400` | `{ "error": "Code is required" }` |
| 4.4 | Empty body `{}` | `400` | `{ "error": "Code is required" }` |

### `POST /api/projects`

| # | Test case | Expected status | Notes |
|---|---|---|---|
| 4.5 | Valid payload with all fields + correct code | `201` | Project created, ID returned |
| 4.6 | Valid payload with optional fields omitted | `201` | `hardest_thing` and `what_surprised_you` default to `""` |
| 4.7 | Missing `code` field | `401` | |
| 4.8 | Wrong `code` field | `401` | |
| 4.9 | Missing `builder_name` | `400` | |
| 4.10 | Missing `project_name` | `400` | |
| 4.11 | Missing `live_url` | `400` | |
| 4.12 | `live_url` = `"not-a-url"` | `400` | URL validation error |
| 4.13 | Missing `what_you_built` | `400` | |
| 4.14 | Missing `who_is_it_for` | `400` | |
| 4.15 | Missing `problem_it_solves` | `400` | |

---

## 5. Navigation & Layout

| # | Test case | Expected result | Pass/Fail |
|---|---|---|---|
| 5.1 | PiFo logo in nav | Fully visible, not clipped | |
| 5.2 | "Gallery" nav link | Goes to `/` | |
| 5.3 | "Submit Project" nav button | Goes to `/submit` | |
| 5.4 | Click logo/wordmark | Goes to `/` | |
| 5.5 | Footer present on all pages | "SheVibes Cohort 0 · 66 Days of Building with AI · Powered by PiFo" | |

---

## 6. Edge Cases

| # | Test case | Expected result | Pass/Fail |
|---|---|---|---|
| 6.1 | Project name with special characters (e.g. `Gharelu — AI`) | Renders correctly everywhere | |
| 6.2 | Very long project name (>60 chars) | Truncated with ellipsis in gallery row, full name on detail page | |
| 6.3 | Builder name with spaces and non-ASCII (e.g. `Priyā Sharma`) | Avatar initial and name render correctly | |
| 6.4 | `live_url` that returns a 404 | Link still shown — we don't validate that the URL resolves | |
| 6.5 | Tags field left blank | No tag pills shown on detail page | |
| 6.6 | Tags field with commas (e.g. `AI, Health`) | Parsed into separate pills | |

---

## 7. Responsiveness

| # | Test case | Expected result | Pass/Fail |
|---|---|---|---|
| 7.1 | Gallery on mobile (375px) | Rows stack cleanly, no horizontal scroll | |
| 7.2 | Submit form on mobile | All inputs full-width, usable | |
| 7.3 | Project detail on mobile | Sections readable, live URL button visible | |
| 7.4 | Nav on mobile | Logo + both buttons visible without overlap | |

---

## Sign-off

| Environment | URL | Tested by | Date |
|---|---|---|---|
| Production | [shevibes-showcase.vercel.app](https://shevibes-showcase.vercel.app) | | |
| Local | http://localhost:3001 | | |
