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

## Disclaimer
This project provides market-data, portfolio, and order-management features. Configure approved data and execution services before production use.
