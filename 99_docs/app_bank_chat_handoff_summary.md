# App_Bank — Chat Handoff Summary

## Purpose

App_Bank is a small banking-style MVP web application created mainly to support a **test strategy / automation POC**.  
The application should be **fast to build, visually clean, deterministic, and easy to automate**.

This is not intended to be a full banking product.  
The priority is the **automation proof of concept on top of it**, so the app should stay simple.

---

## Main Product Goal

Create a believable but minimal banking portal with only one core user action:

- **Send money to someone**

The app should be good enough for:
- UI demo purposes
- test case design
- regression test automation
- multilingual UI checks
- state and workflow validation

---

## Final MVP Scope

The application should contain **3 main views**:

1. **Dashboard / Main Page**
2. **Send Money Form**
3. **Confirm Action Screen**

There are also **2 modal dialogs**:

- **Profile modal**
- **Exit popup**

---

## Main UX / UI Decisions

### General layout
- The **account balance** is always visible at the top center during the main flow.
- The **language buttons** stay visible during the whole flow.
- The **sidebar is visible only on the dashboard**.
- During the transfer flow, the sidebar disappears and the center content changes.
- This keeps the layout stable and easier to implement and automate.

### Language support
- Two small transparent buttons at the top right:
  - `ENG`
  - `ESP`
- Clicking one changes all UI labels to that language.
- The selected language should be visibly highlighted.
- Language choice must persist while navigating across views.

---

## Screen-by-Screen Specification

## 1) Dashboard / Main Page

### Main elements
- **Top center:** large visible balance
- **Top right:** `ENG` / `ESP` language toggle
- **Left sidebar**
  - profile bubble at the top
  - `Main Menu`
  - `Exit` button at the bottom
- **Main content area**
  - `Latest Transactions` table
  - `Send Money` CTA button

### Transactions table
Recommended columns:
- Date
- Recipient
- Amount
- Status

Use seeded static mock rows.

### Sidebar behavior
#### Profile bubble
Opens a modal with:
- circular avatar image
- full name
- email
- phone number

Seeded profile data:
- **Alex Morgan**
- **alex.morgan@appbank.demo**
- **+34 600 123 456**

#### Main Menu
- Keeps user on the dashboard / returns to dashboard

#### Exit
- Opens a popup with:
  - `Hasta la vista!`

---

## 2) Send Money Form

This screen replaces the transaction table area but keeps the same top layout.

### Visible elements
- account balance remains visible
- language buttons remain visible
- sidebar is hidden

### Form fields
- **Recipient Name** → string only
- **Account Number** → string only
- **Amount** → decimal only

### Buttons
Bottom-right aligned:
- `Cancel` / `Cancelar`
- `Continue` / `Continuar`

### Validation
Required:
- Name cannot be empty
- Account Number cannot be empty
- Amount must be numeric and greater than 0

Recommended:
- Amount cannot exceed available balance

Cancel returns to dashboard without changes.  
Continue opens the confirmation screen if the form is valid.

---

## 3) Confirmation Screen

### Visible elements
- balance remains visible
- language buttons remain visible
- sidebar hidden

### Content
Show transfer summary:
- Recipient name
- Account number
- Amount

### Main interaction
A confirmation control inspired by banking apps:
- slide/toggle to confirm action

Preferred labels:
- `Slide to confirm`
- `Desliza para confirmar`

### After success
Show:
- `Transfer completed` / `Transferencia completada`

Then allow return to dashboard:
- `Back to Main Menu`
- `Volver al menú principal`

---

## Recommended Functional Behavior

### Best option selected
A successful transfer should:
- deduct the amount from the displayed balance
- add a new transaction row at the top of the table

Reason:
- still easy to implement
- much better for automation and regression coverage

---

## Technical / Frontend Recommendations

Recommended implementation:
- **SPA**
- **React + Vite**
- simple component-based structure
- local mock state only
- no backend required for first version
- CSS or Tailwind
- lightweight manual i18n object instead of a heavy i18n library

Suggested components:
- `App`
- `Sidebar`
- `HeaderBalance`
- `LanguageSwitcher`
- `TransactionsTable`
- `ProfileModal`
- `ExitModal`
- `TransferForm`
- `ConfirmTransfer`
- `SuccessMessage`

Suggested main state:
- current language
- current screen
- balance
- transaction list
- form values
- profile modal open/closed
- exit modal open/closed

Important for testability:
- add stable IDs or `data-testid`
- use deterministic seeded data
- avoid flaky animations or random values

---

## Visual / Design Direction

The app should feel:
- clean
- modern
- banking-like
- warm but trustworthy
- easy to read
- fast to build

Recommended style:
- light background
- white cards
- subtle shadows
- rounded corners
- strong balance typography
- professional spacing
- minimal visual noise

---

## Final Recommended Color Palette

The selected palette direction is:

- **blue as the main color**
- **wood / warm neutrals as support tones**
- **caoba red as a restrained accent**

This was chosen because:
- blue gives trust and finance credibility
- wood tones add warmth and make it less generic
- caoba adds personality without dominating the UI

### Final palette
- **Background:** `#F8F5F0`
- **Surface:** `#FCFCFB`
- **Primary:** `#1D4ED8`
- **Primary Hover:** `#1E40AF`
- **Text Main:** `#0F172A`
- **Text Secondary:** `#475569`
- **Wood Accent:** `#D6C2A1`
- **Caoba Accent:** `#7B2D26`
- **Success:** `#15803D`
- **Error:** `#DC2626`

### Usage guidance
- use **blue** for primary actions and active states
- use **warm neutrals** for background atmosphere
- use **caoba** only in small accents, not as a primary action color

---

## Generated Visual Assets

A palette swatch image was created:
- `app_bank_recommended_palette.png`

A concept mockup image of the views/components was also generated:
- `a_set_of_three_user_interface_design_mockups_for_a.png`

---

## Regression / Gherkin Test Coverage Created

A full MVP-oriented regression suite was designed in Gherkin.

### Coverage areas
1. Dashboard
2. Language switching
3. Profile modal
4. Exit popup
5. Transfer form
6. Form validation
7. Confirmation screen
8. Transfer success
9. Cross-flow regression

### Total scenarios
- **42 scenarios**

### Most important smoke scenarios
- dashboard loads correctly
- language switching works
- profile modal opens
- exit popup opens
- transfer form opens
- required field validation works
- valid form continues
- confirmation summary is correct
- transfer completes successfully
- full happy path works

---

## Main Regression Behaviors Covered

The test design includes:
- page rendering and main UI elements
- translations and persistence of selected language
- modal open/close behavior
- form validations
- cancel flow
- confirmation behavior
- successful transfer flow
- balance update after success
- new transaction added after success
- duplicate submission prevention
- full end-to-end happy path

---

## Important Assumptions Used in Tests

- default language is **English**
- seeded balance is **€12,450.75**
- seeded user is **Alex Morgan**
- dashboard starts with seeded transactions
- transfer success updates balance and table

---

## Suggested Priorities for the Next Chat

A new ChatGPT conversation should probably continue with one of these:

### Option A — Frontend implementation
Ask for:
- component structure
- React app scaffolding
- Tailwind/CSS styling
- page implementation
- local state management
- translation object
- mock data

### Option B — Design delivery
Ask for:
- low-fidelity wireframes
- high-fidelity mockups
- component inventory
- design tokens
- spacing / typography system

### Option C — Test automation
Ask for:
- `.feature` files
- step definition skeletons
- Playwright + Cucumber setup
- data-testid strategy
- smoke vs regression split
- CI execution strategy

---

## Best Prompt to Continue in Another Chat

Use something like this:

> I am building an MVP called App_Bank for an automation/testing POC.  
> It is a small banking demo app with 3 views: dashboard, send money form, and confirmation screen.  
> It supports English and Spanish, has a sidebar only on the dashboard, a profile modal, an exit popup, seeded transactions, and a send money flow that updates balance and adds a new transaction after success.  
> The palette is:
> - Background `#F8F5F0`
> - Surface `#FCFCFB`
> - Primary `#1D4ED8`
> - Primary Hover `#1E40AF`
> - Text Main `#0F172A`
> - Text Secondary `#475569`
> - Wood Accent `#D6C2A1`
> - Caoba Accent `#7B2D26`
> - Success `#15803D`
> - Error `#DC2626`
>
> I already have a regression-oriented Gherkin suite with 42 scenarios.  
> Please continue from this context and help me with [frontend implementation / UI mockup / automation structure].

---

## Final Summary

App_Bank is a **small, realistic, bilingual banking MVP** designed primarily to support **automation and testing demonstrations**.

The final concept includes:
- one dashboard
- one send money form
- one confirmation step
- a profile modal
- an exit popup
- stable multilingual UI
- a warm banking palette based on blue, wood neutrals, and caoba accents
- deterministic seeded data
- a regression suite of 42 scenarios

The implementation should stay intentionally simple, test-friendly, and fast to build.
