# App_Bank — Updated assumptions

- Default language is **English**.
- Entry route is **Login**.
- Protected routes require authentication.
- Seeded demo user:
  - **Alex Morgan**
  - **alex.morgan@appbank.demo**
  - **+34 600 123 456**
  - Password: **Demo123!**
- Initial balance is **€12,450.75**.
- Dashboard starts with seeded transactions.
- A successful transfer:
  - deducts the amount from balance
  - adds a new transaction on top of the table
- The exit dialog is also the **logout confirmation flow**.
- All state is **in memory only** for the MVP.
