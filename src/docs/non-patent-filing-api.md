# Non-Patent Filing API Contract (Frontend)

Last updated: March 26, 2026

## Overview

This document defines the backend contract for:
- Trademark filings
- Copyright filings
- Design filings

All endpoints are already implemented and available under `/api`.

## Base URLs

- Local: `http://localhost:5000`
- Production: `https://express-backend-ajedhzd3h0bfbse5.westindia-01.azurewebsites.net`

## Authentication

All endpoints below require JWT bearer auth.

Header:
```http
Authorization: Bearer <token>
```

## Common Response Shapes

Create/update/document endpoints:
```json
{
  "data": {},
  "message": "optional"
}
```

List/detail endpoints:
```json
{
  "data": {}
}
```

Validation and API errors:
```json
{
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    { "field": "fieldName", "message": "Field-specific message" }
  ]
}
```

## Enums

Status values:
- `DRAFT`
- `PENDING`
- `APPROVED`
- `REJECTED`

## Route Summary

- `POST /api/trademark-filings`
- `GET /api/client/trademark-filings`
- `GET /api/trademark-filings/{referenceNumber}`
- `PATCH /api/trademark-filings/{id}`
- `POST /api/trademark-filings/{id}/documents`

- `POST /api/copyright-filings`
- `GET /api/client/copyright-filings`
- `GET /api/copyright-filings/{referenceNumber}`
- `PATCH /api/copyright-filings/{id}`
- `POST /api/copyright-filings/{id}/documents`

- `POST /api/design-filings`
- `GET /api/client/design-filings`
- `GET /api/design-filings/{referenceNumber}`
- `PATCH /api/design-filings/{id}`
- `POST /api/design-filings/{id}/documents`

## Query Contract (List Endpoints)

Supported query params for all list endpoints:
- `page` (integer, default `0`)
- `size` (integer, default `10`, max `100`)
- `sort` (string, default `submittedAt,desc`)
- `status` (`DRAFT | PENDING | APPROVED | REJECTED`)

Allowed sort fields:
- `submittedAt`
- `updatedAt`
- `createdAt`
- `status`
- `referenceNumber`

List response:
```json
{
  "data": {
    "content": [],
    "pageable": {
      "page": 0,
      "size": 10,
      "totalElements": 0,
      "totalPages": 0
    }
  }
}
```

## Trademark APIs

### 1) Create Filing

`POST /api/trademark-filings`

Body:
```json
{
  "trademarkName": "Acme Mark",
  "classOfTrademark": "Class 25",
  "descriptionGoodsServices": "Clothing and footwear",
  "usageStatus": "Proposed to be used",
  "dateOfFirstUse": "2026-03-01",
  "applicantName": "Acme Pvt Ltd",
  "applicantType": "Company",
  "address": "Bengaluru, India",
  "trademarkLogo": "https://files.example.com/tm/logo.png",
  "saveAsDraft": false
}
```

Notes:
- If `saveAsDraft` is `true`, fields can be partial.
- If `saveAsDraft` is omitted or `false`, all trademark fields above are required.

Success (201):
```json
{
  "data": {
    "id": "uuid",
    "referenceNumber": "REQ-TM-2026-001",
    "trademarkId": "TM-000001",
    "status": "PENDING",
    "submittedAt": "2026-03-26T09:30:00.000Z"
  },
  "message": "Trademark filing created successfully"
}
```

### 2) List Filings

`GET /api/client/trademark-filings`

Success (200): paginated response with full filing objects in `data.content`.

### 3) Get Filing By Reference

`GET /api/trademark-filings/{referenceNumber}`

Success (200):
```json
{
  "data": {
    "id": "uuid",
    "referenceNumber": "REQ-TM-2026-001",
    "trademarkId": "TM-000001",
    "trademarkName": "Acme Mark",
    "classOfTrademark": "Class 25",
    "descriptionGoodsServices": "Clothing and footwear",
    "usageStatus": "Proposed to be used",
    "dateOfFirstUse": "2026-03-01",
    "applicantName": "Acme Pvt Ltd",
    "applicantType": "Company",
    "address": "Bengaluru, India",
    "trademarkLogo": "https://files.example.com/tm/logo.png",
    "status": "PENDING",
    "submittedAt": "2026-03-26T09:30:00.000Z",
    "updatedAt": "2026-03-26T09:30:00.000Z",
    "createdAt": "2026-03-26T09:30:00.000Z"
  }
}
```

### 4) Update Draft Filing

`PATCH /api/trademark-filings/{id}`

Body: any subset of trademark fields.

Important:
- Only allowed when current status is `DRAFT`.

Success (200):
```json
{
  "data": {},
  "message": "Trademark filing updated successfully"
}
```

### 5) Attach Document URL

`POST /api/trademark-filings/{id}/documents`

Body:
```json
{
  "trademarkLogo": "https://files.example.com/tm/new-logo.png"
}
```

Success (200):
```json
{
  "data": {
    "documentId": "doc_xxxxxxxxxxxx",
    "trademarkLogo": "https://files.example.com/tm/new-logo.png"
  },
  "message": "Document attached successfully"
}
```

## Copyright APIs

### 1) Create Filing

`POST /api/copyright-filings`

Body:
```json
{
  "workType": "Literary",
  "titleOfWork": "My Book",
  "authorDetails": {
    "name": "John Doe"
  },
  "yearOfCreation": 2026,
  "applicantName": "John Doe",
  "address": "Mumbai, India",
  "workFile": "https://files.example.com/cr/work.pdf",
  "saveAsDraft": false
}
```

Notes:
- `authorDetails` can be either a string or an object.
- If `saveAsDraft` is omitted or `false`, all fields above are required.

Success (201):
```json
{
  "data": {
    "id": "uuid",
    "referenceNumber": "REQ-CR-2026-001",
    "copyrightId": "CR-000001",
    "status": "PENDING",
    "submittedAt": "2026-03-26T09:30:00.000Z"
  },
  "message": "Copyright filing created successfully"
}
```

### 2) List Filings

`GET /api/client/copyright-filings`

Success (200): paginated response with full filing objects in `data.content`.

### 3) Get Filing By Reference

`GET /api/copyright-filings/{referenceNumber}`

Success (200): returns full filing object in `data`.

### 4) Update Draft Filing

`PATCH /api/copyright-filings/{id}`

Body: any subset of copyright fields.

Important:
- Only allowed when current status is `DRAFT`.

Success (200):
```json
{
  "data": {},
  "message": "Copyright filing updated successfully"
}
```

### 5) Attach Document URL

`POST /api/copyright-filings/{id}/documents`

Body:
```json
{
  "workFile": "https://files.example.com/cr/new-work.pdf"
}
```

Success (200):
```json
{
  "data": {
    "documentId": "doc_xxxxxxxxxxxx",
    "workFile": "https://files.example.com/cr/new-work.pdf"
  },
  "message": "Document attached successfully"
}
```

## Design APIs

### 1) Create Filing

`POST /api/design-filings`

Body:
```json
{
  "articleName": "Water Bottle",
  "locarnoClass": "07-01",
  "briefDescription": "Ergonomic bottle design",
  "applicantName": "Acme Designs",
  "address": "Delhi, India",
  "representationOfDesign": "https://files.example.com/ds/design.png",
  "saveAsDraft": false
}
```

Notes:
- If `saveAsDraft` is omitted or `false`, all fields above are required.

Success (201):
```json
{
  "data": {
    "id": "uuid",
    "referenceNumber": "REQ-DS-2026-001",
    "designId": "DS-000001",
    "status": "PENDING",
    "submittedAt": "2026-03-26T09:30:00.000Z"
  },
  "message": "Design filing created successfully"
}
```

### 2) List Filings

`GET /api/client/design-filings`

Success (200): paginated response with full filing objects in `data.content`.

### 3) Get Filing By Reference

`GET /api/design-filings/{referenceNumber}`

Success (200): returns full filing object in `data`.

### 4) Update Draft Filing

`PATCH /api/design-filings/{id}`

Body: any subset of design fields.

Important:
- Only allowed when current status is `DRAFT`.

Success (200):
```json
{
  "data": {},
  "message": "Design filing updated successfully"
}
```

### 5) Attach Document URL

`POST /api/design-filings/{id}/documents`

Body:
```json
{
  "representationOfDesign": "https://files.example.com/ds/new-design.png"
}
```

Success (200):
```json
{
  "data": {
    "documentId": "doc_xxxxxxxxxxxx",
    "representationOfDesign": "https://files.example.com/ds/new-design.png"
  },
  "message": "Document attached successfully"
}
```

## Standard Error Codes

- `400 BAD_REQUEST` (invalid payload/query/path format)
- `401 UNAUTHORIZED` (missing/invalid JWT)
- `403 FORBIDDEN` (client trying to access another user's filing)
- `404 NOT_FOUND` (filing not found)
- `409 STATUS_CONFLICT` (trying to update non-draft filing)
- `422 VALIDATION_ERROR` (field validation failures)

## Integration Notes for Frontend

- Document upload endpoints accept URL fields only (not multipart file upload).
- Use `saveAsDraft: true` for partial-save flows.
- For submit flow, send complete payload with `saveAsDraft: false` (or omit `saveAsDraft`).
- `referenceNumber` is used for detail route; `id` is used for update/document routes.
