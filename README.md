# StoreRate 🌟

StoreRate is a premium, feature-rich web application designed to help users discover, rate, and compare local businesses (restaurants, cafes, bookstores, boutiques, and more). Built using a modern **Spring Boot** REST API backend and a responsive **React (Vite)** frontend, it features interactive dashboards for **Users**, **Store Owners**, and **Admins**.

---

## 📸 Application Screenshots

### User Store Explorer & Light Stats Cards
Discover local shops with dynamic images and track review contributions through light-themed stats cards.
![User Store Explorer](Screeshots/Screenshot%202026-06-14%20154526.png)

### Side-by-Side Store Feature Comparison & Diff
Check stores to compare them side-by-side. The system highlights the highest-rated store and displays checkmarks and crossmarks indicating differences in amenities (Wi-Fi, parking, outdoor seating).
![Store Feature Comparison](Screeshots/Screenshot%202026-06-14%20154546.png)

### Secure Authentication Panel
Clean and aesthetic login and registration interface featuring the modern StoreRate branding.
![Authentication Panel](Screeshots/Screenshot%202026-06-14%20154037.png)

### Store Owner Dashboard
Keep track of reviews, see customer feedback, and view store ratings through light-blue and light-coral statistics cards.
![Owner Dashboard](Screeshots/Screenshot%202026-06-14%20154643.png)

### Admin Console & User Management
Comprehensive table view of users and stores, complete with role-colored badges, search filters, and store assignment controls.
![Admin Console](Screeshots/Screenshot%202026-06-14%20154438.png)

---

## ✨ Key Features

### 👤 Role-Based Portals
*   **User Portal**:
    *   Browse stores in a card-based grid layout with categorized high-quality visuals.
    *   Rate stores on a 5-star scale with micro-animations.
    *   Select up to 3 stores and compare them side-by-side using the **Store Comparison Diff Module**.
    *   Track contribution achievements (Reviewer level, XP bar, badges).
*   **Store Owner Portal**:
    *   Monitor the store's average rating and reviews.
    *   View customer feedback and rating metrics via light-colored stat cards.
*   **Administrator Portal**:
    *   Full CRUD capabilities to add, edit, or delete users and stores.
    *   Monitor system telemetry (Total Users, Active Stores, Ratings Submitted).
    *   Ensure data consistency (e.g., verifying that a store owner has the `OWNER` role and doesn't already own a store).

### 📊 Store Compare & Diff Engine
*   Multi-store selection bar floating dynamically at the bottom of the viewport.
*   Centered comparative overlay modal showing key attributes: Ratings, Price Category, Opening Hours, and amenities.
*   **Visual Diff Highlights**: Colors highlight checkmarks/crossmarks differently to draw attention to distinct store amenities.
*   Gold **"Best" crown badge** automatically highlights the highest-rated store in the comparison.

### 🔒 Secure Passwords Slide-in Modal
*   Instead of a static page, updating passwords occurs globally inside a **slide-in modal drawer** that eases in from the right edge of the screen, available across all dashboards.

---

## 🛠️ Tech Stack

### Backend
*   **Java 17**
*   **Spring Boot 3.x**
*   **Spring Security & JWT (JSON Web Tokens)**
*   **Spring Data JPA & Hibernate**
*   **H2 / PostgreSQL**
*   **Lombok**

### Frontend
*   **React 18 (Vite)**
*   **Vanilla CSS** (Custom token system utilizing the **Inter** system font stack)
*   **Lucide React** (Modern, clean icon set)
*   **Vite/Rolldown** build environment

---

## ⚙️ Project Structure

```
Store-Rating-Systems/
├── backend/                  # Spring Boot REST API
│   ├── src/main/java/        # Java Source Files
│   ├── src/main/resources/   # Application properties & config
│   └── pom.xml               # Maven Dependencies
└── frontend/                 # React SPA (Vite)
    ├── src/
    │   ├── api/              # HTTP Client & endpoints configuration
    │   ├── components/       # Common layouts & UI elements (AppShell, Stat, DataTable)
    │   ├── features/         # Feature folders (Auth, User, Owner, Admin)
    │   ├── styles/           # CSS files (base.css, app.css)
    │   └── App.jsx           # Main routing & state
    └── vite.config.js        # Vite config
```

---

## 🚀 Installation & Setup

### Prerequisites
*   Java JDK 17 or higher
*   Maven 3.x
*   Node.js (v18+) & npm

### 1. Backend Setup
1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Configure settings in `src/main/resources/application.properties` (uses in-memory H2 database by default).
3. Build and compile the project:
    ```bash
    mvn clean install
    ```
4. Run the application:
    ```bash
    mvn spring-boot:run
    ```
    *The REST API will boot on `http://localhost:8080`.*

### 2. Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2. Install npm packages:
    ```bash
    npm install
    ```
3. Run the development server:
    ```bash
    npm run dev
    ```
    *The React frontend will load on `http://localhost:5173`.*

---

## 🔒 Security & Validation Rules
1. **Passwords**: Must be 8-16 characters and contain at least one uppercase letter and one special character.
2. **Owners uniqueness**: A store owner can own a maximum of one store (enforced at both service layer and database schema levels).
3. **Data Integrity**: Store names and user names require 20 to 60 characters to prevent short spam entries.
