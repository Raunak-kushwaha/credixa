# Credixa

## Network Configuration

To support multiple simultaneous users and access from other devices on the same
local network, follow these steps:

- **Backend** binds to all interfaces (`0.0.0.0`) and CORS is configured with
  `origin: true, credentials: true`.
- **Frontend** reads the API base URL from `NEXT_PUBLIC_API_URL` if present.
  Otherwise it will construct a URL using the current host and the API port
  (`NEXT_PUBLIC_API_PORT`, default `1234`).  Example: phone visits
  `http://10.5.0.17:3000`, client will try `http://10.5.0.17:1234/api/v1`.
  For convenience you can also set `NEXT_PUBLIC_API_PORT` or put the full URL
  in `NEXT_PUBLIC_API_URL`.
- Start the frontend dev server with `npm run dev` (script now uses
  `next dev -H 0.0.0.0`).
- Use `http://<your-ip>:3000` on phones/browsers.

The project already uses stateless JWT tokens, so multiple devices/browsers can
be logged in at once without conflict.

```
credixa
├─ backend
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ favicon.ico
│  ├─ scripts
│  │  ├─ testTransfer.js
│  │  └─ transferForAman.js
│  ├─ server.js
│  └─ src
│     ├─ app.js
│     ├─ config
│     │  └─ db.config.js
│     ├─ controller
│     │  ├─ AdminController.js
│     │  ├─ AmountController.js
│     │  ├─ AuthController.js
│     │  └─ FixDepositController.js
│     ├─ middleware
│     │  ├─ 404Handling.js
│     │  ├─ AdminMiddleware.js
│     │  ├─ AuthMiddleware.js
│     │  ├─ checkFrozenStatus.js
│     │  ├─ requireUser.js
│     │  └─ ValidationMiddleware.js
│     ├─ models
│     │  ├─ Account.model.js
│     │  ├─ AdminActivity.model.js
│     │  ├─ FixDeposit.model.js
│     │  ├─ Transactions.model.js
│     │  └─ User.model.js
│     ├─ router
│     │  ├─ admin
│     │  │  └─ index.js
│     │  ├─ amount
│     │  │  └─ index.js
│     │  ├─ auth
│     │  │  └─ index.js
│     │  ├─ fd
│     │  │  └─ index.js
│     │  └─ index.js
│     ├─ service
│     │  ├─ AdminActivityService.js
│     │  ├─ AdminService.js
│     │  ├─ AmountService.js
│     │  ├─ AuthService.js
│     │  └─ FixDepositService.js
│     ├─ utils
│     │  ├─ ApiError.js
│     │  ├─ constant.js
│     │  ├─ JwtService.js
│     │  └─ Razorpay.js
│     └─ validations
│        ├─ AmountValidation.js
│        ├─ AuthValidation.js
│        └─ FixDepositValidation.js
├─ frontend
│  ├─ components.json
│  ├─ eslint.config.mjs
│  ├─ jsconfig.json
│  ├─ next.config.mjs
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ file.svg
│  │  ├─ globe.svg
│  │  ├─ next.svg
│  │  ├─ vercel.svg
│  │  └─ window.svg
│  ├─ README.md
│  └─ src
│     ├─ app
│     │  ├─ (auth)
│     │  │  ├─ login
│     │  │  │  └─ page.jsx
│     │  │  └─ register
│     │  │     └─ page.jsx
│     │  ├─ (root)
│     │  │  ├─ amount
│     │  │  │  └─ page.jsx
│     │  │  ├─ fd-amount
│     │  │  │  ├─ +___components
│     │  │  │  │  ├─ AddNewFdModel.jsx
│     │  │  │  │  ├─ ClaimFDModel.jsx
│     │  │  │  │  └─ FDCard.jsx
│     │  │  │  └─ page.jsx
│     │  │  ├─ layout.jsx
│     │  │  ├─ page.js
│     │  │  ├─ template.js
│     │  │  └─ transactions
│     │  │     ├─ +___components
│     │  │     │  ├─ MessageShow.jsx
│     │  │     │  └─ TableCard.jsx
│     │  │     └─ page.jsx
│     │  ├─ admin
│     │  │  ├─ accounts
│     │  │  │  └─ page.jsx
│     │  │  ├─ activity
│     │  │  │  └─ page.jsx
│     │  │  ├─ dashboard
│     │  │  │  └─ page.jsx
│     │  │  ├─ fds
│     │  │  │  └─ page.jsx
│     │  │  ├─ layout.jsx
│     │  │  ├─ login
│     │  │  │  └─ page.jsx
│     │  │  ├─ pending-users
│     │  │  │  └─ page.jsx
│     │  │  ├─ transactions
│     │  │  │  └─ page.jsx
│     │  │  └─ users
│     │  │     └─ page.jsx
│     │  ├─ favicon.ico
│     │  ├─ globals.css
│     │  ├─ layout.js
│     │  └─ not-found.jsx
│     ├─ components
│     │  ├─ Amount
│     │  │  ├─ AddAmmountModal.jsx
│     │  │  └─ TransferModal.jsx
│     │  ├─ AnalyticsDashboard.jsx
│     │  ├─ HeaderName.jsx
│     │  ├─ images
│     │  │  └─ undraw_onboarding.png
│     │  ├─ Loader.jsx
│     │  ├─ Navbar.jsx
│     │  ├─ NotificationBell.jsx
│     │  ├─ Pagination.jsx
│     │  ├─ reusable
│     │  │  ├─ CustomAuthButton.jsx
│     │  │  └─ Logo.jsx
│     │  ├─ style.css
│     │  └─ WalletCard.jsx
│     ├─ context
│     │  └─ MainContext.js
│     ├─ layouts
│     │  ├─ AdminLayout.jsx
│     │  └─ MainLayout.jsx
│     ├─ lib
│     │  └─ utils.js
│     ├─ redux
│     │  ├─ slice
│     │  │  └─ sidebarSlice.js
│     │  └─ store.js
│     └─ utils
│        ├─ AxiosClient.jsx
│        ├─ constant.js
│        └─ loadScripts.jsx
└─ readme.md

```