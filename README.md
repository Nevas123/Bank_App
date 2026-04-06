# App_Bank

App_Bank is a deterministic banking-style MVP built for demo and future automation work.
This repository contains only the web application:

- `frontend/` Angular SPA with standalone components, Signals, Reactive Forms, and runtime English/Spanish translations.
- `backend/` ASP.NET Core Minimal API with cookie auth and seeded in-memory state.

## Architecture

### Frontend

- Angular SPA with standalone components and Angular Router
- Guarded routes:
  - `/login`
  - `/dashboard`
  - `/transfer`
  - `/transfer/confirm`
- `SessionStore` keeps authenticated user, balance, transactions, language, and the in-progress transfer draft in Signals.
- `LanguageService` uses a small runtime dictionary for `ENG` and `ESP`, and persists the selected language in `localStorage`.
- `AuthInterceptor` sends cookies with every request and redirects `401` responses back to login.
- Layout behavior matches the specs:
  - balance stays top-center across authenticated views
  - language switcher stays top-right
  - sidebar appears only on the dashboard
  - profile and exit are modal dialogs

### Backend

- ASP.NET Core Minimal API targeting `net8.0`
- In-memory singleton state only, with deterministic seeded data
- Cookie authentication without ASP.NET Identity UI or external auth providers
- Seeded demo user:
  - `alex.morgan@appbank.demo`
  - `Demo123!`
- Seeded balance: `€12,450.75`
- Seeded transactions are fixed and resettable

## API

Primary routes:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/profile`
- `GET /api/transactions`
- `POST /api/transfer`
- `POST /api/dev/reset`

Compatibility aliases are also available for:

- `POST /api/login`
- `POST /api/logout`
- `POST /api/transfers`
- `POST /api/reset`

## Project structure

```text
.
├── backend/
│   ├── Models/
│   ├── Services/
│   ├── AppBank.Api.csproj
│   └── Program.cs
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   └── features/
│   │   └── styles/
│   ├── angular.json
│   ├── package.json
│   └── tsconfig*.json
├── docs/
└── specs/
```

## Run the backend

Prerequisites:

- .NET 8 SDK installed and available on your `PATH`

Commands:

```bash
cd /Users/pabloserrano/Repos/Bank_App/backend
dotnet restore
dotnet run
```

The API is configured for Angular dev traffic from `http://localhost:4200`.

## Run the frontend

Prerequisites:

- Node.js 20+ installed and available on your `PATH`
- npm 10+ or compatible

Commands:

```bash
cd /Users/pabloserrano/Repos/Bank_App/frontend
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Demo flow

1. Sign in with `alex.morgan@appbank.demo` / `Demo123!`
2. Review the dashboard balance and seeded transactions
3. Open the profile modal or exit dialog from the sidebar
4. Start a transfer
5. Confirm it with the slide control
6. Return to the dashboard and verify the new first transaction and updated balance

## Notes

- No database is used.
- All application state is kept in memory.
- `POST /api/dev/reset` resets seeded financial state and clears the login cookie.
- The current machine session used for this implementation does not expose `node`, `npm`, or `dotnet`, so install/build verification could not be executed here.
