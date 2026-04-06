# App_Bank — Updated implementation summary

## What changed from the previous chat

The previous direction was adjusted in three important ways:

1. **Frontend stays Angular**
   - The web app should be implemented as an Angular SPA.
   - Use **standalone components**.
   - Use **Signals** for lightweight app/UI state.
   - Use **Reactive Forms** for the login form and send-money form.

2. **A minimal backend is now required**
   - Use **ASP.NET Core Minimal API**.
   - Keep all data **in memory only**.
   - Do **not** add a database for this MVP.
   - The backend should make the flow feel real by handling login, profile retrieval, transactions, and transfers.

3. **A login page has been added**
   - The app should no longer open directly on the dashboard.
   - The default entry route is the **login page**.
   - After successful login, the app loads the authenticated user context and enters the dashboard.

## Final functional scope

The application now has **4 main views** and **2 dialogs**.

### Main views
1. **Login Page**
2. **Dashboard**
3. **Send Money Form**
4. **Confirmation / Success Screen**

### Dialogs
1. **Profile modal**
2. **Exit dialog**

## Login page

### Goal
Make the demo closer to a real application while keeping implementation minimal.

### UI
- centered login card
- email field
- password field
- primary `Sign In` button
- `ENG` / `ESP` language buttons visible
- small subtitle or helper text indicating demo credentials may be used

### Behavior
- invalid credentials show an inline error
- successful login redirects to dashboard
- protected routes redirect unauthenticated users back to login

### Seeded login credentials
Use one seeded demo user:
- email: `alex.morgan@appbank.demo`
- password: `Demo123!`

## Dashboard

Keep the existing behavior from the original handoff:
- visible account balance at top center
- `ENG` / `ESP` toggle at top right
- sidebar visible only on dashboard
- transactions table with seeded rows
- `Send Money` call to action
- profile bubble in sidebar
- exit button at bottom

## Send money flow

Unchanged in essence:
- user opens the transfer form
- enters recipient name, account number, amount
- validates inputs
- continues to confirmation
- confirms via banking-style slide/toggle
- sees success message
- returns to dashboard
- balance is reduced
- new transaction is inserted at the top

## Dialog behavior

### Profile modal
Continue using seeded data:
- Alex Morgan
- alex.morgan@appbank.demo
- +34 600 123 456

### Exit dialog
To make the login page meaningful, the exit dialog should now work as a **logout confirmation dialog**:
- open from dashboard sidebar
- show `Hasta la vista!`
- allow cancel
- allow confirm exit/logout
- on confirm, clear auth session and return to login

## Recommended technical implementation

### Frontend
- Angular SPA
- standalone components
- Angular Router
- Angular Signals for app state
- Angular Reactive Forms for login and transfer forms
- HttpClient for backend communication
- SCSS or CSS with design tokens / CSS variables
- lightweight runtime i18n object for English and Spanish

### Backend
- ASP.NET Core Minimal API
- cookie-based authentication
- in-memory app state service
- no database
- no Entity Framework
- no Identity UI
- no external authentication provider

## Suggested backend endpoints

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### User / dashboard
- `GET /api/profile`
- `GET /api/transactions`

### Transfer
- `POST /api/transfers`

### Optional development helper
- `POST /api/dev/reset`

## Seeded data

### User
- Full name: Alex Morgan
- Email: alex.morgan@appbank.demo
- Phone: +34 600 123 456
- Password: Demo123!

### Financial state
- Initial balance: €12,450.75
- Dashboard starts with seeded transactions

### Transfer behavior
A successful transfer:
- deducts the amount from balance
- adds a new transaction at the top of the table
- uses status `Completed`

## Angular route proposal
- `/login`
- `/dashboard`
- `/transfer`
- `/transfer/confirm`

Protected:
- `/dashboard`
- `/transfer`
- `/transfer/confirm`

Default:
- unauthenticated users -> `/login`
- authenticated users opening `/` -> `/dashboard`

## Suggested Angular component inventory
- `AppComponent`
- `AppShellComponent`
- `LoginPageComponent`
- `DashboardPageComponent`
- `TransferFormPageComponent`
- `TransferConfirmPageComponent`
- `HeaderBalanceComponent`
- `LanguageSwitcherComponent`
- `SidebarComponent`
- `TransactionsTableComponent`
- `ProfileModalComponent`
- `ExitDialogComponent`
- `SlideToConfirmComponent`

## Suggested Angular services
- `AuthService`
- `SessionStore`
- `LanguageService`
- `ProfileApiService`
- `TransactionsApiService`
- `TransferApiService`

## Validation rules

### Login
- email required
- password required

### Transfer form
- recipient name required
- recipient name cannot be numeric-only
- account number required
- amount required
- amount must be numeric
- amount must be greater than 0
- amount cannot exceed available balance

## i18n approach
Use a simple runtime translation dictionary, for example:
- `en`
- `es`

Do not use a heavy extraction-based translation pipeline for this MVP.

## Design / visual direction

Keep the original banking-like aesthetic:
- clean
- modern
- warm but trustworthy
- easy to automate later
- stable layout
- light background
- white cards
- subtle shadows
- rounded corners

### Palette
- Background: `#F8F5F0`
- Surface: `#FCFCFB`
- Primary: `#1D4ED8`
- Primary Hover: `#1E40AF`
- Text Main: `#0F172A`
- Text Secondary: `#475569`
- Wood Accent: `#D6C2A1`
- Caoba Accent: `#7B2D26`
- Success: `#15803D`
- Error: `#DC2626`

## What I changed in the Gherkin

I changed the feature set only where it was helpful:

- added a **new login feature**
- updated existing features so they start from an **authenticated state**
- clarified that the app now depends on a **seeded backend**
- changed the exit popup into a more realistic **exit dialog / logout flow**
- tightened some wording to reduce ambiguous steps

The rest of the transfer behavior and bilingual dashboard flow remain aligned with the original handoff.
