# API Endpoints - Local Version

All endpoints are relative to `http://localhost:3000`

## Authentication Endpoints

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123456"
}

Response:
{
  "success": true
}
```

### Logout
```
POST /api/auth/logout

Response:
{
  "success": true
}
```

## Shipment Endpoints (Admin Only)

All shipment endpoints require authentication.

### Get All Shipments
```
GET /api/shipments

Optional query parameters:
- q: Search query (searches tracking code, name, phone)

Examples:
GET /api/shipments
GET /api/shipments?q=ABJ-001
GET /api/shipments?q=Jean

Response:
[
  {
    "id": "ship_xxx",
    "tracking_code": "ABJ-001-2024",
    "customer_name": "Jean Dupont",
    "customer_phone": "+225 07 12 34 56 78",
    "customer_email": "jean@example.com",
    "origin": "Shanghai",
    "destination": "Abidjan",
    "current_status": "En transit",
    "estimated_arrival_date": "2024-06-15",
    "notes": "Standard shipment",
    "created_at": "2024-05-17T10:30:00Z",
    "updated_at": "2024-05-17T10:30:00Z",
    "created_by": "user_xxx"
  },
  ...
]
```

### Create Shipment
```
POST /api/shipments
Content-Type: application/json

{
  "tracking_code": "ABJ-004-2024",
  "customer_name": "Ahmed Ibrahim",
  "customer_phone": "+225 06 12 34 56 78",
  "customer_email": "ahmed@example.com",
  "origin": "Shanghai",
  "destination": "Abidjan",
  "estimated_arrival_date": "2024-06-25",
  "notes": "Express delivery"
}

Required fields:
- tracking_code
- customer_name
- customer_phone
- origin
- destination

Optional fields:
- customer_email
- estimated_arrival_date
- notes

Response: Created shipment object (same structure as Get All Shipments)
```

### Get Shipment Details
```
GET /api/shipments/[id]

Response:
{
  "shipment": {
    "id": "ship_xxx",
    "tracking_code": "ABJ-001-2024",
    ...
  },
  "history": [
    {
      "id": "hist_xxx",
      "shipment_id": "ship_xxx",
      "status": "En transit",
      "note": "Departed from China",
      "created_at": "2024-05-17T10:30:00Z",
      "created_by": "user_xxx"
    },
    ...
  ]
}
```

### Update Shipment
```
PUT /api/shipments/[id]
Content-Type: application/json

{
  "customer_name": "Jean Dupont",
  "customer_phone": "+225 07 12 34 56 78",
  "customer_email": "jean@example.com",
  "origin": "Shanghai",
  "destination": "Abidjan",
  "estimated_arrival_date": "2024-06-15",
  "notes": "Updated notes"
}

Updatable fields:
- customer_name
- customer_phone
- customer_email
- origin
- destination
- estimated_arrival_date
- notes

Response: Updated shipment object
```

### Update Shipment Status
```
PATCH /api/shipments/[id]
Content-Type: application/json

{
  "status": "Livré",
  "note": "Delivered to customer"
}

Required:
- status

Optional:
- note

Response: Shipment with updated history
```

### Delete Shipment
```
DELETE /api/shipments/[id]

Response:
{
  "success": true
}
```

### Get Statistics
```
GET /api/shipments/stats

Response:
{
  "total": 42,
  "delivered": 28,
  "in_transit": 10,
  "delayed": 4
}
```

## Public Tracking Endpoint (No Auth Required)

### Track Shipment by Code
```
GET /api/track/[trackingCode]

Example:
GET /api/track/ABJ-001-2024

Response:
{
  "shipment": {
    "id": "ship_xxx",
    "tracking_code": "ABJ-001-2024",
    "customer_name": "Jean Dupont",
    "customer_phone": "+225 07 12 34 56 78",
    "customer_email": "jean@example.com",
    "origin": "Shanghai",
    "destination": "Abidjan",
    "current_status": "En transit",
    "estimated_arrival_date": "2024-06-15",
    "notes": "Standard shipment",
    "created_at": "2024-05-17T10:30:00Z",
    "updated_at": "2024-05-17T10:30:00Z",
    "created_by": "user_xxx"
  },
  "history": [
    {
      "id": "hist_xxx",
      "shipment_id": "ship_xxx",
      "status": "Reçu en Chine",
      "note": "Received at warehouse",
      "created_at": "2024-05-17T10:00:00Z",
      "created_by": "user_xxx"
    },
    {
      "id": "hist_yyy",
      "shipment_id": "ship_xxx",
      "status": "En transit",
      "note": "In transit to Abidjan",
      "created_at": "2024-05-18T14:30:00Z",
      "created_by": "user_xxx"
    }
  ]
}

Error Response (404):
{
  "error": "Shipment not found"
}
```

## Status Values

Valid status values (in French):
- Reçu en Chine (Received in China)
- En préparation (In preparation)
- Expédié (Shipped)
- En transit (In transit)
- Livré (Delivered)
- Retardé (Delayed)

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (missing/invalid fields)
- `401` - Unauthorized (not logged in)
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

All admin endpoints (except `/api/track/*`) require authentication via session cookie. 
When you login via `/api/auth/login`, a session cookie is automatically set and sent with subsequent requests.

## Error Handling

Errors return JSON with error message:

```json
{
  "error": "Description of what went wrong"
}
```

## Example Usage with cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123456"}' \
  -c cookies.txt
```

### Get Shipments
```bash
curl http://localhost:3000/api/shipments \
  -b cookies.txt
```

### Create Shipment
```bash
curl -X POST http://localhost:3000/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_code":"ABJ-005-2024",
    "customer_name":"Test User",
    "customer_phone":"+225 07 00 00 00 00",
    "origin":"Shanghai",
    "destination":"Abidjan"
  }' \
  -b cookies.txt
```

### Track Public
```bash
curl http://localhost:3000/api/track/ABJ-001-2024
```
