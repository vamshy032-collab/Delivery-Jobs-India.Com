# Delivery Jobs India - API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 AUTH APIs (`/api/auth`)

### 1. User Signup
```
POST /api/auth/signup
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "mobile_number": "9876543210",
  "password": "optional"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "mobile_number": "9876543210"
  }
}
```

---

### 2. User Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "mobile_number": "9876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "mobile_number": "9876543210",
    "is_verified": true
  }
}
```

---

### 3. Get User by ID
```
GET /api/auth/user/:id
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "mobile_number": "9876543210",
    "is_verified": true,
    "last_login": "2026-07-10T10:00:00Z",
    "created_at": "2026-07-01T10:00:00Z"
  }
}
```

---

### 4. Update User
```
PUT /api/auth/user/:id
```

**Request Body:**
```json
{
  "full_name": "John Updated",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": { ... }
}
```

---

## 📊 VISITOR APIs (`/api/visitors`)

### 1. Track Visitor
```
POST /api/visitors
```

**Request Body:**
```json
{
  "full_name": "Anonymous Visitor",
  "visited_page": "index",
  "user_agent": "Mozilla/5.0...",
  "referrer": "google.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Visitor tracked successfully",
  "visitor": {
    "visitor_id": "uuid",
    "full_name": "Anonymous Visitor",
    "visited_page": "index",
    "visit_date": "2026-07-10",
    "visit_time": "10:30:00"
  }
}
```

---

### 2. Get All Visitors
```
GET /api/visitors?page=1&limit=20&page_name=index
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |
| page_name | string | Filter by page name |

**Response (200):**
```json
{
  "success": true,
  "visitors": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

### 3. Get Visitor Statistics
```
GET /api/visitors/stats
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalVisitors": 500,
    "byPage": {
      "index": 300,
      "home": 200
    },
    "byDate": {
      "2026-07-10": 50,
      "2026-07-09": 45
    }
  }
}
```

---

## 💼 JOB APIs (`/api/jobs`)

### 1. Apply for Job
```
POST /api/jobs/apply
```

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "job_id": "1",
  "company_name": "Swiggy",
  "job_title": "Delivery Partner",
  "location": "Hyderabad",
  "salary": "₹25,000 - ₹40,000"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "application": {
    "id": "uuid",
    "user_id": "user-uuid",
    "job_id": "1",
    "company_name": "Swiggy",
    "job_title": "Delivery Partner",
    "status": "Applied",
    "applied_date": "2026-07-10"
  }
}
```

**Error (400) - Already Applied:**
```json
{
  "success": false,
  "message": "You have already applied for this job"
}
```

---

### 2. Get User's Applications
```
GET /api/jobs/my-applications/:userId
```

**Response (200):**
```json
{
  "success": true,
  "applications": [
    {
      "id": "uuid",
      "job_id": "1",
      "company_name": "Swiggy",
      "job_title": "Delivery Partner",
      "status": "Applied",
      "applied_date": "2026-07-10"
    }
  ],
  "count": 1
}
```

---

### 3. Get All Applications (Admin)
```
GET /api/jobs/applications?page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "applications": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

### 4. Check if User Applied for Job
```
GET /api/jobs/check/:userId/:jobId
```

**Response (200):**
```json
{
  "success": true,
  "applied": true,
  "application": {
    "id": "uuid"
  }
}
```

---

## 🧪 Test Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/test` | GET | Test auth routes |
| `/api/visitors/test` | GET | Test visitor routes |
| `/api/jobs/test` | GET | Test job routes |
| `/test-db` | GET | Test Supabase connection |

---

## 📝 Error Response Format

```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## 🔧 Common Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

## 📌 Notes

1. All APIs return JSON responses
2. Dates are in ISO format (YYYY-MM-DD)
3. Times are in 24-hour format (HH:MM:SS)
4. User ID and other UUIDs are used for references
5. For production, add authentication middleware
