# API test plan

Run `npm test`. The starter repository includes the essential test skeletons below.
For isolated integration tests, point `MONGO_URI` at a dedicated test database.

Coverage targets:
1. Authentication: registration, login, invalid token, disabled user.
2. Authorization: USER cannot call `/api/admin/*`; ADMIN can.
3. Stock CRUD: create, update, soft delete, duplicate symbol validation.
4. Trading: reject zero/negative quantity, insufficient balance, insufficient shares.
5. Accounting: BUY reduces cash and updates weighted average; SELL increases cash and realizes P/L.
