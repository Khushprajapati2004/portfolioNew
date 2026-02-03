# API Testing Guide

Test all endpoints to ensure the admin panel works perfectly.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All admin endpoints require authentication. Include the admin token in the Authorization header:

```
Authorization: Bearer your-admin-token-here
```

---

## Projects API

### 1. Get All Projects
```http
GET /api/projects
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "title": "TravelVista",
      "description": "A comprehensive travel booking platform",
      "longDescription": "Full description...",
      "tech": ["React.js", "Node.js", "MongoDB"],
      "image": "/images/projects/travelvista.jpg",
      "github": "https://github.com/...",
      "demo": "https://demo.com",
      "features": ["Feature 1", "Feature 2"]
    }
  ]
}
```

### 2. Create Project (Admin Only)
```http
POST /api/projects
Authorization: Bearer your-admin-token
Content-Type: application/json

{
  "title": "My New Project",
  "description": "Short description",
  "longDescription": "Detailed description of the project",
  "tech": ["React", "Node.js", "MongoDB"],
  "github": "https://github.com/username/repo",
  "demo": "https://demo-url.com",
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "title": "My New Project",
    ...
  }
}
```

### 3. Update Project (Admin Only)
```http
PUT /api/projects/:id
Authorization: Bearer your-admin-token
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

### 4. Delete Project (Admin Only)
```http
DELETE /api/projects/:id
Authorization: Bearer your-admin-token
```

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## Skills API

### 1. Get All Skills
```http
GET /api/skills
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "name": "React.js",
      "category": "frontend",
      "level": 9,
      "icon": null,
      "order": 1
    }
  ]
}
```

### 2. Create Skill (Admin Only)
```http
POST /api/skills
Authorization: Bearer your-admin-token
Content-Type: application/json

{
  "name": "Vue.js",
  "category": "frontend",
  "level": 7
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "Vue.js",
    "category": "frontend",
    "level": 7,
    "icon": null,
    "order": 0
  }
}
```

### 3. Update Skill (Admin Only)
```http
PUT /api/skills/:id
Authorization: Bearer your-admin-token
Content-Type: application/json

{
  "level": 8,
  "order": 5
}
```

### 4. Delete Skill (Admin Only)
```http
DELETE /api/skills/:id
Authorization: Bearer your-admin-token
```

**Response:**
```json
{
  "success": true,
  "message": "Skill deleted successfully"
}
```

---

## Contact Messages API

### 1. Get All Messages (Admin Only)
```http
GET /api/admin/messages
Authorization: Bearer your-admin-token
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Project Inquiry",
      "message": "I'd like to discuss...",
      "read": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 2. Mark Message as Read (Admin Only)
```http
PATCH /api/admin/messages/:id/read
Authorization: Bearer your-admin-token
```

### 3. Delete Message (Admin Only)
```http
DELETE /api/admin/messages/:id
Authorization: Bearer your-admin-token
```

---

## Testing with cURL

### Get Projects
```bash
curl http://localhost:5000/api/projects
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer your-admin-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "Test description",
    "tech": ["React", "Node.js"]
  }'
```

### Get Skills
```bash
curl http://localhost:5000/api/skills
```

### Create Skill
```bash
curl -X POST http://localhost:5000/api/skills \
  -H "Authorization: Bearer your-admin-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Docker",
    "category": "tools"
  }'
```

---

## Testing with Postman

1. **Import Collection**: Create a new collection called "Portfolio API"

2. **Set Environment Variables**:
   - `base_url`: `http://localhost:5000/api`
   - `admin_token`: Your admin token from .env

3. **Create Requests**:
   - Add requests for each endpoint
   - Use `{{base_url}}` and `{{admin_token}}` variables

4. **Test Authentication**:
   - Try accessing admin endpoints without token (should fail)
   - Try with correct token (should succeed)

---

## Common Issues

### 401 Unauthorized
- Check if Authorization header is included
- Verify admin token matches .env file
- Ensure token format is: `Bearer your-token`

### 404 Not Found
- Verify the endpoint URL is correct
- Check if the resource ID exists
- Ensure server is running

### 500 Internal Server Error
- Check server logs for detailed error
- Verify database connection
- Ensure all required fields are provided

---

## Skill Categories

Valid categories for skills:
- `frontend`
- `backend`
- `databases`
- `languages`
- `tools`

---

## Testing Checklist

- [ ] Get all projects (public)
- [ ] Create new project (admin)
- [ ] Update project (admin)
- [ ] Delete project (admin)
- [ ] Get all skills (public)
- [ ] Create new skill (admin)
- [ ] Update skill (admin)
- [ ] Delete skill (admin)
- [ ] Get messages (admin)
- [ ] Delete message (admin)
- [ ] Test authentication (401 without token)
- [ ] Test validation (400 for invalid data)
