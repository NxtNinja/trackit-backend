# TrackIt Backend - Microservices Ecosystem

A robust, production-grade financial management backend built with a **Zero-Trust Microservices Architecture**. This system handles identity management, financial tracking, and analytics with a focus on security, scalability, and performance.

## 🏗 High-Level Architecture

TrackIt is designed as a distributed system composed of specialized services:

- **API Gateway (Edge Layer)**: The single entry point and "Guardian" of the system. It handles:
    - **Global Rate Limiting**: Protects against volume-based attacks.
    - **Authentication**: Validates JWTs before requests reach business logic.
    - **Reverse Proxying**: Intelligently routes traffic to `auth-service` or `expense-service`.
    - **Identity Injection**: Safely passes verified user IDs to microservices.
- **Microservices (Internal Layer)**: Specialized units that handle business logic. They are "blind" to the outside world and only trust the Gateway.
- **PostgreSQL Database**: A shared relational database (managed via Supabase) with strict row-level isolation.

---

## 🛡️ The API Gateway Deep-Dive

The Gateway is more than a router; it is the **Security Boundary** of your application.

### 1. The Request Lifecycle
When a request hits the Gateway, it undergoes a 4-step transformation:
1.  **Sanitization**: The Gateway deletes any incoming `x-user-id` or `x-internal-service-key` headers provided by the client. This prevents users from trying to "spoof" their identity or trick internal services.
2.  **Authentication**: If the route is protected, the Gateway verifies the `token` cookie. If invalid, the request is blocked at the edge.
3.  **Context Injection**: The Gateway extracts the `userId` from the verified token and attaches it as a new, trusted `x-user-id` header.
4.  **The Secret Handshake**: The Gateway adds a secret `x-internal-service-key` to the request and proxies it to the correct microservice.

### 2. Protecting the Microservices (Isolation)
Because each microservice checks for the `x-internal-service-key`, they are effectively **isolated**. Even if an attacker discovers the internal IP or port of the `expense-service` (e.g., port 8082), they cannot fetch any data because they don't have the secret key that only the Gateway knows.

---

## 🔒 Security Design (Low-Level)

The system implements a "Defense in Depth" strategy:

### 1. Zero-Trust Inter-Service Auth
Microservices do not trust internal traffic by default. Every request from the Gateway to a microservice must include a secret `x-internal-service-key`. 
- **Benefit**: Prevents direct unauthorized access to microservices even if their ports are exposed.

### 2. Identity Protection & Anti-Spoofing
The Gateway acts as the "Source of Truth" for identity:
- It **strips** any user-provided `x-user-id` headers.
- It extracts the true `userId` from the secure JWT cookie and injects it into the internal request.

### 3. Silent Token Rotation
Implemented a professional-grade session lifecycle:
- **Short-lived Access Tokens (15m)**: Minimal damage if intercepted.
- **Long-lived Refresh Tokens (7d)**: Stored in the DB and rotated on every use to prevent replay attacks.
- **HTTP-Only Cookies**: Prevents XSS-based token theft.

### 4. Multi-Layer Rate Limiting
- **Global**: Protects against DDoS at the Gateway.
- **Auth-Specific**: Brute-force protection on `/login` and account-spam protection on `/signup`.

---

## 🛠 Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js (v5)
- **Validation**: Zod (Type-safe schema validation)
- **Database**: PostgreSQL (with Parameterized Queries for SQLi protection)
- **Security**: Helmet.js, Bcrypt, JsonWebToken, Express-Rate-Limit

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- PostgreSQL database (or Supabase URL)

### Installation
1. Clone the repository.
2. Install dependencies for each service:
   ```bash
   cd api-gateway && npm install
   cd ../auth-service && npm install
   cd ../expense-service && npm install
   ```

### Configuration
Create a `.env` file in each service folder based on the following templates:

**API Gateway**:
```env
PORT=4000
JWT_SECRET=your_jwt_secret
INTERNAL_SERVICE_KEY=your_internal_secret
ALLOWED_ORIGIN=http://localhost:3000
```

**Microservices**:
```env
PORT=5050 # or 5051
DATABASE_URL=your_db_url
JWT_SECRET=your_jwt_secret
INTERNAL_SERVICE_KEY=your_internal_secret
```

### Running Locally
You can start all services simultaneously:
```bash
# In separate terminals
cd api-gateway && npm run dev
cd auth-service && npm run dev
cd expense-service && npm run dev
```

---

## 📁 Project Structure

```text
trackit-backend/
├── api-gateway/         # Entry point, Auth check, Proxying
├── auth-service/        # Login, Signup, Token Refresh, Profile
└── expense-service/     # Transactions, Budgets, Analytics
    ├── src/
    │   ├── controllers/ # Request handling
    │   ├── services/    # Business logic
    │   ├── repositories/# Database abstraction
    │   └── middleware/  # Validation & Security
```

## 🛡 API Endpoints (Gateway)
- `POST /auth/signup` - Create account
- `POST /auth/login` - Authenticate
- `GET /transactions` - Fetch financial data (Requires JWT)
- `POST /budgets` - Set monthly limits (Requires JWT)
