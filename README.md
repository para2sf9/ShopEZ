# SHOPEZ EW Markets — Stock-Trading Platform

SHOPEZ was initially named as an e-commerce project, but this implementation follows the detailed **stock-trading platform** specification. It is an English-language MERN application with an information-dense exchange-style UI inspired by the navigation, market ticker, index overview, quote tables, gainers/losers panels, and blue market-data presentation.

## Included features

### Authentication and security
- Registration and login
- JWT bearer authentication
- bcrypt password hashing with 12 salt rounds
- `USER` and `ADMIN` roles
- Protected frontend pages and backend routes
- Helmet security headers, CORS allowlist, JSON size limits, API rate limiting
- Server-side validation and centralized error handling
- Active/disabled user support

### Trading backend
- Mongoose models: `User`, `Stock`, `Transaction`, and `Portfolio`
- Indexed email, symbol, role, transaction, and portfolio fields
- Stock listing, search, details, market summary, and historical-price APIs
- Validated buy and sell orders
- Cash-balance checks and conditional balance updates
- Weighted average purchase price
- Realized and unrealized profit/loss
- Portfolio market value, cost basis, available cash, and total value
- Paginated transaction history
- Admin user and stock management APIs
- Request and error logging

### React frontend
- React 18 + Vite + React Router
- Responsive Bootstrap UI
- Exchange-style utility bar, navigation, market ticker, index board, and tables
- Market dashboard with active stocks, market breadth, gainers, and losers
- Search, sector filter, sorting, and quote refresh
- Stock detail pages with historical Recharts charts
- Buy/sell order panel
- Portfolio with P/L calculations
- Transaction ledger
- Admin overview, user management, roles, balances, and stock CRUD
- Lazy-loaded routes, Axios interceptors, polling, reusable components, and toast messages

## Project structure

```text
ShopEZ Ecommerce Website/
├── backend/
│   ├── config/ controllers/ middleware/ models/ routes/ services/ tests/ utils/
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/ components/ context/ pages/ styles/ utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
└── package.json    
```

## Requirements
- Node.js
- npm
- MongoDB locally or MongoDB Atlas

## Quick start

### Option A — standard setup

```bash
# 1. Create & Open the project folder
mkdir ShopEZ
cd ShopEZ

# 2. Install root, backend, and frontend packages
npm install
npm run install:all

# 3. Edit backend/.env and frontend/.env

# 4. Start MongoDB locally, then seed sample market data
npm run seed

# 5. Start API and web app together
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

### Option B -Start each application separately

```bash
cd client
npm install
npm run seed
npm run dev
```

```bash
cd server
npm install
npm run dev
```

## Testing and verification

```bash
npm test
npm run build
```

The backend includes Jest/Supertest coverage starters for authentication, JWT rejection, and trade validation. A full production CI pipeline should use a dedicated MongoDB test database and add integration fixtures for:
- USER versus ADMIN authorization
- Stock CRUD
- Insufficient balance and insufficient share rejection
- Concurrent trade behavior
- Weighted average cost and realized P/L
- Disabled users and expired tokens

<img width="916" height="485" alt="image" src="https://github.com/user-attachments/assets/9050b667-e9b4-4952-8f9a-199fea1cd0f5" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/4b353bbf-bd13-497a-a44e-9589899f2e32" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/d88a4385-03ee-4efd-998e-4fa9829cd81f" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/a748704c-3be6-433e-83b7-aba8577a4ddd" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/90c1cbfb-ac72-49f1-98e4-ec98a81713e5" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/6ce5cf6d-2015-43f7-a2a1-0c1c731fc97e" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/94022ff2-a3cf-49c8-84ab-56903fc295cf" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/83f3ccc4-9783-49a2-addb-80a62e6c2f5c" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/cfac73ee-2603-460a-aea2-d9d2924506e7" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/ced617db-beac-40f2-aceb-f4c44b2381d0" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/c40d2746-ecbf-4c2b-8d27-1088570645ec" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/33ac5e9a-fa00-4c96-a632-baff9309c10d" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/990341db-d39e-4309-a7e9-4a47b1fdb589" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/d6983da5-18b8-44df-95fc-6ac5f68697a4" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/8bfc18c6-c3da-4c0e-8ebe-66c7dc246541" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/40c3280c-7d63-4dae-af07-4d6252815241" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/2d817c6d-b509-45e8-8bff-b932ecfea199" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/9f158a94-cd9b-49f4-a617-7f74c12815bc" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/c795d23b-8955-4e72-8df1-c8805d385df8" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/c1c60cd7-de2a-4a85-a493-5077a68bc22f" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/9eae455c-424d-426b-ad39-e6e7f709af1d" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/7708eaa4-f0e0-4685-b3dd-0d92268bbd68" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/74f384af-5b7c-46fc-85ba-bdc0bc34f99b" />
<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/44653a75-30cd-4c31-858b-03bcfe7c32be" />





## Disclaimer
This project provides market-data, portfolio, and order-management features. Configure approved data and execution services before production use.
