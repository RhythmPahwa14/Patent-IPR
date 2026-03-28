# Admin API Request Specification (Frontend-Aligned)

This document lists the backend APIs required by the current Admin frontend implementation.

## Base

- Base URL: `/api`
- Auth: `Authorization: Bearer <token>`
- Role: `ADMIN` only
- Content-Type: `application/json`

## 1) List Filings (Admin Monitoring)

GET `/api/admin/filings`

### Query Parameters

- `page` (integer, default: `0`)
- `size` (integer, default: `10`)
- `status` (string, optional)
  - Allowed: `DRAFT`, `PENDING`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `APPROVED`, `REJECTED`
- `type` (string, optional)
  - Allowed: `patent`, `nonPatent`
- `unassigned` (boolean, default: `false`)

### Success Response (200)

```json
{
  "data": {
    "content": [
      {
        "id": "uuid",
        "referenceNumber": "PAT-2026-001",
        "title": "Filing title",
        "type": "patent",
        "status": "PENDING",
        "applicantName": "John Doe",
        "assignedAgentId": "uuid-or-null",
        "assignedAgentName": "Agent Name",
        "submittedAt": "2026-03-26T10:30:00Z",
        "updatedAt": "2026-03-26T12:00:00Z"
      }
    ],
    "pageable": {
      "page": 0,
      "size": 10,
      "totalElements": 1,
      "totalPages": 1
    }
  }
}
```

### Error Responses

- `401` Unauthorized
- `403` Forbidden (non-admin)
- `422` Validation failed
- `500` Server error

## 2) List Assignable Agents

GET `/api/admin/agents`

### Success Response (200)

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Agent One",
      "email": "agent1@example.com",
      "activeAssignments": 3
    }
  ]
}
```

### Error Responses

- `401`, `403`, `500`

## 3) Assign Filing to Agent

PATCH `/api/admin/filings/{id}/assign`

### Path Parameters

- `id` (uuid, required)

### Request Body

```json
{
  "agentId": "uuid"
}
```

### Success Response (200)

```json
{
  "message": "Filing assigned to agent",
  "data": {
    "id": "uuid",
    "assignedAgentId": "uuid",
    "status": "ASSIGNED"
  }
}
```

### Error Responses

- `404` Filing or agent not found
- `422` Validation failed
- `401`, `403`, `500`

## 4) Reassign Filing to Different Agent

PATCH `/api/admin/filings/{id}/reassign`

### Path Parameters

- `id` (uuid, required)

### Request Body

```json
{
  "agentId": "uuid"
}
```

### Success Response (200)

```json
{
  "message": "Filing reassigned",
  "data": {
    "id": "uuid",
    "assignedAgentId": "uuid"
  }
}
```

### Error Responses

- `404` Filing or agent not found
- `422` Validation failed
- `401`, `403`, `500`

## 5) Approve/Reject Filing

PATCH `/api/admin/filings/{id}/status`

### Path Parameters

- `id` (uuid, required)

### Request Body

```json
{
  "status": "APPROVED"
}
```

### Allowed Status Values

- `APPROVED`
- `REJECTED`

### Success Response (200)

```json
{
  "message": "Filing status updated",
  "data": {
    "id": "uuid",
    "status": "APPROVED",
    "updatedAt": "2026-03-26T12:20:00Z"
  }
}
```

### Error Responses

- `404` Filing not found
- `422` Validation failed
- `401`, `403`, `500`

## Frontend Mapping

Current frontend methods in `src/lib/api.js`:

- `getAdminFilings(...)`
- `getAdminAgents()`
- `assignAdminFiling(...)`
- `reassignAdminFiling(...)`
- `updateAdminFilingStatus(...)`

Admin UI:

- `src/app/admin/page.jsx`
- `src/app/admin/layout.jsx`
- `src/components/admin-dashboard/AdminSidebar.jsx`
- `src/components/admin-dashboard/AdminTopbar.jsx`

## Important Backend Note

Observed backend error:

`column "agent_id" does not exist`

Please align DB schema/query with the actual assignment column used by backend entities (for example, `assigned_agent_id`) or update query mappings accordingly.
