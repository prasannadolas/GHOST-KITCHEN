
#  Ghost Kitchen Management System

> **Final Year Project | Sathaye College | BSc Information Technology (2023-2026)**

##  Introduction
This project is a fully functional web-based application designed to manage the operations of a **Ghost Kitchen** (Cloud Kitchen). Unlike traditional dining, ghost kitchens focus solely on delivery. This system connects customers with multiple virtual kitchen brands, managing the entire flow from order placement to kitchen processing.

![alt text](screenshot/1.png)

##  Why We Chose This Topic?
We selected the **Cloud Kitchen** model for our final year project because:

1. **Industry Trend:** It addresses the booming demand for delivery-only food models.
2. **Complex Data Handling:** It solves a "Many-to-Many" operational problem (One Platform  Many Kitchens  Many Customers), demonstrating advanced backend logic.
3. **Real-World Utility:** It creates a centralized dashboard for managing menus, orders, and kitchen performance without physical storefronts.

##  Technologies Used

Based on the project files and architecture:

* **Frontend:**
* **HTML5:** (User pages like `kitchens.html`, `cart.html` and Admin dashboards)
* **JavaScript (Vanilla):** (Client-side logic in `js/` folder like `cart.js`, `api.js`)
* **CSS3:** (For styling user and admin interfaces)


* **Backend:**
* **Node.js:** Server-side runtime environment.
* **Express.js:** (Implied by the `routes` and `middleware` structure)
* **Making a change for my practical

* **REST API:** Structured routing for `kitchens`, `orders`, and `auth`.


* **Database:**
* **MySQL:** Managed via `config/database.js`.


###  Team Members
* **Prasanna Dolas**
* **Omkar Ugale**
* **Rushikesh Ahierkar**
* **Aryan Gamre**

###  Project Contributions

|  Module / Component |  Contributors |  Key Responsibilities |
| :--- | :--- | :--- |
| **Frontend UI/UX** | **Prasanna Dolas**<br>**Omkar Ugale** | Designed the Home Page, Brand Menu interface, and implemented the dynamic "Add to Cart" functionality using React state. |
| **Authentication & Forms** | **Omkar Ugale**<br>**Rushikesh Ahierkar** | Built the secure Login/Signup system, managed user sessions, and developed the Checkout page with form validation. |
| **Backend Logic** | **Aryan Gamre**<br>**Prasanna Dolas** | Developed the Node.js/Express API endpoints, configured routing, and handled server-side data validation. |
| **Database Architecture** | **Rushikesh Ahierkar**<br>**Prasanna Dolas**<br>**Aryan Gamre** | Designed the MySQL schema, optimized SQL queries for order processing, and built the Admin/Kitchen dashboard logic. |


##  Project Structure

This diagram reflects the exact folder hierarchy from your project source code:

```text
GHOST-KITCHEN/
│
├── backend/                     # BACKEND: API & Database Logic
│   ├── config/
│   │   └── database.js          # MySQL connection configuration
│   ├── middleware/
│   │   └── auth.js              # Token verification/Protection logic
│   ├── routes/                  # API Route Definitions
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── kitchens.js
│   │   ├── menu.js
│   │   ├── order.js
│   │   └── user.js
│   └── server/
│       └── index.js             # Server initialization logic
│
├── frontend/                    # FRONTEND: UI & Client Logic
│   ├── admin/                   # Admin & Kitchen Owner Panels
│   │   ├── admin-dashboard.html
│   │   └── kitchen-dashboard.html
│   ├── js/                      # Client-side JavaScript
│   │   ├── admin.js
│   │   ├── api.js               # Centralized API calls
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── kitchens.js
│   │   ├── main.js
│   │   └── orders.js
│   └── user-pages/              # Customer-facing HTML Pages
│       ├── 404.html
│       ├── about.html
│       ├── cart.html
│       ├── checkout.html
│       ├── contact.html
│       ├── index.html           # Main Landing Page
│       ├── kitchens.html
│       ├── kitchen-detail.html
│       ├── login.html
│       ├── order-confirmation.html
│       ├── privacy.html
│       └── register.html
│
├── .env                         # Environment variables (Sensitive data)
├── .gitignore                   # Files to ignore in Git
├── package.json                 # Project metadata & dependencies
├── package-lock.json            # Exact version lockfile
└── server.js                    # Application Entry Point

```

![alt text](screenshot/13.png)

##  Installation & Setup Guide

### Prerequisites

* **Node.js** installed on your machine.
* **XAMPP** (or any MySQL server) running.

### Step 1: Clone & Install

1. Download the project folder.
2. Open your terminal in the root directory `GHOST-KITCHEN`.
3. Install the backend dependencies:
```bash
npm install

```



### Step 2: Database Configuration

1. Create a database named `ghost_kitchen` in your MySQL server.
2. Import the provided SQL file.
3. Check `backend/config/database.js` to ensure your MySQL username and password match your local setup.

### Step 3: Environment Setup

1. Open the `.env` file.
2. Ensure your `PORT` and Database credentials are defined here.

### Step 4: Run the Application

Start the backend server:

```bash
node server.js

```

* **User Interface:** Access via `http://localhost:3000/user-pages/index.html` (or your configured static path).
* **Admin Dashboard:** Access via `http://localhost:3000/frontend/admin/admin-dashboard.html`.

##  Website UI Screenshots

### 1. Landing Page & Kitchen Selection
![alt text](screenshot/image.png)
![alt text](screenshot/image-1.png)

### 2. Ordering Process
### Kitchens page
![alt text](screenshot/image-2.png)
### Cart page
![alt text](screenshot/image-3.png)
### Checkout page
![alt text](screenshot/image-4.png)
![alt text](screenshot/image-5.png)
### Order History page
![alt text](screenshot/image-6.png)


##  Conclusion

The successful development of the **Ghost Kitchen Management System** marks a significant milestone in bridging the gap between theoretical concepts and practical software engineering. This project addresses the growing demand in the food delivery industry by providing a centralized, efficient platform for managing virtual kitchen operations without the need for physical dining spaces.

**Key Achievements:**

* **Full-Stack Implementation:** We successfully migrated and implemented a robust backend using **Node.js**, ensuring a scalable and non-blocking architecture capable of handling multiple concurrent requests.
* **Complex Data Management:** The project effectively solved the "Many-to-Many" relationship challenge by utilizing **MySQL**. We structured a relational database that seamlessly links multiple kitchens, diverse menus, and customer orders.
* **Operational Efficiency:** The application streamlines the entire lifecycle of a food order—from customer selection and cart management to kitchen processing and admin oversight—reducing manual errors and improving delivery turnaround times.

---
