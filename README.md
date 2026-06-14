# StoreRate 🌟

StoreRate is a premium, feature-rich web application designed to help users discover, rate, and compare local businesses (restaurants, cafes, bookstores, boutiques, and more). Built using a modern **Spring Boot** REST API backend and a responsive **React (Vite)** frontend, it features interactive dashboards for **Users**, **Store Owners**, and **Admins**.

---

## 📸 User Interface & Dashboard Gallery

### 🔐 Authentication Views

#### 1. Login Page
The secure portal interface for users, store owners, and administrators. It features the modern **StoreRate** branding and uses focus shadows.
![Login Page](Screeshots/LoginPage.png)

#### 2. Sign Up Page
Self-registration page for new users. Stretches to collect names (between 20-60 characters), emails, passwords (with complexity enforcement), and street addresses.
![Sign Up Page](Screeshots/SignUpPage.png)

---
### ⚙️ Admin Management Console

#### 3. Admin Dashboard
Administrative cockpit displaying system stats (Total registered users, active stores, ratings submitted) on solid-colored high-contrast telemetry cards with decorative depth circles.
![Admin Dashboard](Screeshots/AdminDashboard.png)

#### 4. Admin Users Section
Comprehensive list of all registered accounts (users, owners, admins) with custom-styled, role-colored pill badges, search filters, and delete actions.
![Admin Users Section](Screeshots/AdminUsersSection.png)

#### 5. Admin Stores Section
Centralized store management list for viewing, sorting, and registering new business locations, mapping owners directly by their user IDs.
![Admin Stores Section](Screeshots/AdminStoresSection.png)

---

### 👤 User Store Explorer

#### 6. User Dashboard (UserPage)
The main store exploration feed. Displays a personalized taste profile (level XP indicator, achievement badges), search and filter tools, and a grid of interactive cards with Unsplash image integration.
![User Dashboard](Screeshots/UserPage.png)

#### 7. Store Cards Section (UserPage2)
Displays store cards with store details, overall ratings, and an option for users to submit or update their ratings for each store.
Each card includes store name, address, rating stars, and an interactive rating option for the user.
![Active Comparison Drawer](Screeshots/UserPage2.png)

#### 8. Slide-in Password Update Modal (UpdatePassword)
Displays the global password slide-in drawer easing in from the right edge of the screen, allowing users to safely update credentials from any page.
![Update Password Modal](Screeshots/UpdatePassword.png)

---

### 🏪 Store Owner Portal

#### 9. Owner Page
Dashboard specifically styled for store owners. Features light-blue and light-coral statistics cards, a feedback feed of customer reviews, and response management tools.
![Owner Dashboard](Screeshots/OwnerPage.png)

---

### 🗄️ Database & API Testing

#### 10. Postman API Testing
Verification of the backend REST controller endpoints (authentication, user administration, store lists, and rating updates) using Postman API collections.
![Postman API Testing](Screeshots/PostmanApi.png)

#### 11. PostgreSQL Database
Relational database tables (users, stores, ratings) showing the successfully stored records and relational schemas in PostgreSQL.
![PostgreSQL Database](Screeshots/Postgre.png)

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
