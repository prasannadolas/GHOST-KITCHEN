# 🥡 Ghost Kitchen Platform
### Powered by Node.js, Express & Modern Frontend Architecture

> **A scalable, full-stack solution for managing multi-brand virtual kitchens.**

---

## 📖 Project Overview

### Problem Statement
The "Cloud Kitchen" or "Ghost Kitchen" model is the fastest-growing segment in the food industry. However, managing multiple kitchen brands, inventory, and incoming orders without a centralized digital backbone leads to operational chaos. Traditional monolithic systems struggle to keep up with the real-time demands of modern food delivery logistics.

### Solution
The **Ghost Kitchen Platform** is a full-stack web application designed to centralize operations. By migrating to a robust **Node.js** environment, this system provides a unified interface for Administrators to manage metrics and menus, while offering customers a seamless ordering experience. It decouples the frontend views from the backend API, ensuring scalability and faster load times.

---

## 🚀 Key Features

* **Role-Based Access Control (RBAC):**
    * **Admin Panel:** Global dashboards (`admin-dashboard.html`) for metrics and settings.
    * **Kitchen Dashboard:** Dedicated views (`kitchen-dashboard.html`) for branches to manage incoming orders.
* **Dynamic Menu System:** Real-time updates to items, prices, and availability without server downtime.
* **Secure Authentication:** Custom middleware (`middleware/auth.js`) for route protection and session validation.
* **Full-Cycle Order Flow:** Seamless journey from browsing and cart management to checkout and order fulfillment.
* **Modular Architecture:** Logical separation of User, Admin, and Auth routes for easy maintenance.

---

## 🛠️ Architecture & Design

### Design Philosophy
The project follows the **MVC (Model-View-Controller)** pattern, adapted for a modern API-centric workflow:

1.  **Separation of Concerns:** Frontend logic (API calls, data fetching) is kept separate from HTML views.
2.  **Middleware-First Approach:** A "secure by default" strategy where requests pass through security layers before reaching controllers.
3.  **Service-Oriented Backend:** The backend acts as a RESTful API provider, while the client handles presentation.

### Component Breakdown
* **Backend Core:** Express.js initializes the app, CORS settings, and route aggregation.
* **API Layer (`backend/routes`):** Defines endpoints for Auth, Admin, and Order processing.
* **Frontend Logic (`frontend/js`):** Vanilla JS acts as the "Controller," using `api.js` as a central HTTP client wrapper.

---

## 📂 Project Structure

```bash
GHOST-KITCHEN/
├── backend/                  # Server-Side Logic
│   ├── config/
│   │   └── database.js       # Database Connection
│   ├── middleware/
│   │   └── auth.js           # Security Middleware
│   ├── routes/               # API Endpoints
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── kitchens.js
│   │   ├── menu.js
│   │   ├── order.js
│   │   └── user.js
│   └── server/               # Server Entry Points
│       ├── index.js
│       └── server.js
│
├── frontend/                 # Client-Side Interface
│   ├── admin/                # Admin & Kitchen Views
│   ├── js/                   # Client-Side Logic (Controllers)
│   │   ├── api.js            # Central API Handler
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   └── main.js
│   └── user-pages/           # Public Customer Views
│       ├── index.html
│       ├── login.html
│       └── ...
│
├── .env                      # Environment Variables
├── package.json              # Dependencies
└── server.js                 # Root entry


```markdown

## 💻 Tech Stack

### Backend Ecosystem
* **Node.js:** Core runtime environment for executing JavaScript server-side.
* **Express.js:** Web framework handling routing, middleware, and API endpoints.
* **Database:** SQL/NoSQL integration (Configured via `config/database.js`).
* **Dotenv:** Secure environment variable management for API keys and ports.

### Frontend Ecosystem
* **HTML5/CSS3:** Semantic structure and responsive styling.
* **Vanilla JavaScript (ES6+):** DOM manipulation and client-side logic.
* **Fetch API:** Native asynchronous communication with the backend.

---

## ⚡ Workflow

1.  **Initialization:** The server starts and establishes a connection to the database.
2.  **User Entry:** Customer lands on `index.html`; `kitchens.js` triggers and fetches restaurant data from the API.
3.  **Authentication:** Users log in via `login.html`; credentials are validated through the `auth.js` middleware.
4.  **Transaction:** Items are added to `cart.js` -> The Checkout process triggers `order.js`.
5.  **Fulfillment:** The order data appears instantly on the `kitchen-dashboard.html` view for staff.

---

## ⚙️ Installation & Setup

Follow these steps to set up the environment locally.

### Prerequisites
* **Node.js** (v16.0 or higher)
* **NPM** (Node Package Manager)
* **Git** (Version Control)

### Step-by-Step Guide

**1. Clone the Repository**
```bash
git clone [https://github.com/your-username/ghost-kitchen-platform.git](https://github.com/your-username/ghost-kitchen-platform.git)
cd ghost-kitchen-platform

```

**2. Install Dependencies**

```bash
npm install

```

**3. Configure Environment**
Create a `.env` file in the root directory and add the following configuration:

```env
PORT=3000
DB_URI=your_database_connection_string
JWT_SECRET=your_secret_key

```

**4. Start the Application**
You can run the server in development mode (with auto-restart) or standard production mode:

```bash
# For Development (requires nodemon)
npm run dev

# Standard Start
node server.js

```

### Access the Application

* **User Interface:** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
* **Admin Interface:** [http://localhost:3000/admin/admin-dashboard.html](https://www.google.com/search?q=http://localhost:3000/admin/admin-dashboard.html)

---

## 🔮 Future Roadmap

* [ ] **Real-time WebSockets:** Replace AJAX polling with `socket.io` for instant order notifications on the kitchen dashboard.
* [ ] **Payment Gateway:** Direct integration with Stripe or Razorpay within `checkout.js`.
* [ ] **AI Analytics:** Implement algorithms to analyze historical order data and predict inventory needs per kitchen.

```

### Next Step
In your "Installation" section, you mentioned `npm run dev`. For that to work, your `package.json` needs a specific script entry.

Would you like me to generate the correct `package.json` file content to ensure the `dev` command works (using `nodemon`)?

```