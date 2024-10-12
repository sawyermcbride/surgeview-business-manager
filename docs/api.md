## POST /employee/login

### Description:
This endpoint allows employees to log in using their username and password. Upon successful authentication, the user is redirected to the dashboard. If authentication fails, the user is redirected to the login page with an error message.

### Request

- **URL**: `/employee/login`
- **Method**: `POST`
- **Headers**: 
  - `Content-Type: application/x-www-form-urlencoded`

### Request Parameters

| Field    | Type     | Description                | Required |
|----------|----------|----------------------------|----------|
| username | `string` | Employee's username         | Yes      |
| password | `string` | Employee's password         | Yes      |

### Success Response

- **Code**: `302 Found`
- **Redirect**: `/business-manager/dashboard`
- **Description**: Successfully logged in, and the employee is redirected to the dashboard.

### Error Response

- **Code**: `302 Found`
- **Redirect**: `/business-manager/login?error=true`
- **Description**: Login failed. Redirected to the login page with an error message. This can happen due to:
  - `Incorrect password`: The provided password does not match.
  - `Incorrect username`: No user found with the provided username.

### Authentication Flow:

- **Strategy**: Passport's local authentication strategy (`employee-login`)
  - **Login Validation**:
    - Calls `employeesService.login(username, password)`
    - On success: returns the user object
    - On failure:
      - Returns `Incorrect password` if the password is invalid
      - Returns `Incorrect username` if the username is invalid
    - Any other errors are passed to the error handler

### Example Request:

```http
POST /employee/login HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=johndoe&password=examplepassword
```

### Example Success Response
```
HTTP/1.1 302 Found
Location: /business-manager/dashboard
```
### Example Error Response
```
HTTP/1.1 302 Found
Location: /business-manager/login?error=true
```

### Notes 

- This endpoint uses Passport.js for authentication.
- Make sure to handle the redirects in your frontend to display error messages appropriately.


This documentation covers the request details, parameters, and possible responses for the `/employee/login` endpoint using the local login authentication strategy.



# Business Manager Routes Documentation


## Base URL: `/business-manager`

### GET /business-manager/login

#### Description:
This endpoint renders the manager login page. If there is an error in the login process, it displays an error message.

#### Request

- **URL**: `/business-manager/login`
- **Method**: `GET`

#### Query Parameters

| Field | Type     | Description                | Required |
|-------|----------|----------------------------|----------|
| error | `string` | An optional parameter that indicates a login error. | No       |

#### Success Response

- **Code**: `200 OK`
- **Content**: Renders the `manager-login` view.
- **Description**: Displays the login page. If an error parameter is present, it shows an error message.

### Example Request:

```http
GET /business-manager/login?error=true HTTP/1.1

```

### Example Response

HTTP/1.1 200 OK
Content-Type: text/html

<!-- Rendered HTML for manager-login with an error message -->

### GET /business-manager/dashboard

#### Description:

This endpoint renders the business dashboard for authorized users. Access is restricted based on user roles.

**Request**
- **URL**: /business-manager/dashboard
- **Method**: GET

**Success Response**
- **Code**: 200 OK
- **Content**: Renders the business_dashboard view.
- **Description**: Displays the business dashboard for users with the appropriate roles.

**Authorization**
- **Roles Required**:
  - ``Admin``
  - ``manager``
  - ``associate``
- **Middleware**: Uses ``hasRole`` middleware to check for authorized roles before granting access.

#### Example Request
```http
GET /business-manager/dashboard HTTP/1.1
```

### Example Response
```http
HTTP/1.1 200 OK
Content-Type: text/html

<!-- Rendered HTML for business_dashboard -->
```

#### Notes:
- Ensure users are authenticated before accessing the /business-manager/dashboard route.
- The login route supports error handling through the query parameter, allowing for user feedback on login issues.



# API Routes Documentation

## Base URL: `/api`

### Authorization

All routes under the `/api` path require the user to have one of the following roles:
- `Admin`
- `manager`
- `associate`

### GET /api/get-view-settings

#### Description:
This endpoint retrieves view settings based on the user's role. The response will vary depending on the role of the authenticated user.

#### Request

- **URL**: `/api/get-view-settings`
- **Method**: `GET`

#### Success Response

- **Code**: `200 OK`
- **Content**: JSON object containing the view settings associated with the user's role.

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
    "searchCustomers": true,
    "searchOrders": true,
    "viewOrders": true,
    "editOrders": true,
    "editCustomers": true,
    "addEmployee": false,
    "editEmployee": true,
    "deleteEmployee": false,
    "viewEmployees": true,
    "viewReports": true,
    "resetPassword": false
}

```


#### Error Response

- **Code**: `400 Bad Request`
- **Content**: 
```json
{
  "message": "Invalid role"
}
```
- **Description**: Returned if the user's role does not match any keys in the viewSettings object.

**Example Request**
```http
GET /api/get-view-settings HTTP/1.1
Authorization: Bearer <token>
```

## POST /api/customers/search/

#### Description:
This endpoint searches for customers by their email or username based on the provided search text.

**Request**
- **URL**: /api/customers/search/:text
- **Method**: POST

URL Parameters
Parameter	Type	Description	Required
text	string	The search term (email or username)	Yes

| Parameter | Type     | Description                          | Required |
|-----------|----------|--------------------------------------|----------|
| text      | `string` | The search term (email or username). | Yes      |

##### Success Response
- **Code:** 200 OK
- **Content:** JSON array of customer objects that match the search criteria.
```json
[
    {
        "id": 1,
        "name": "Sawyer ",
        "email": "samcbride11@gmail.com",
        "createdAt": "2024-10-09T08:58:22.143Z"
    },
    {
        "id": 2,
        "name": "sawyer",
        "email": "samcnride11@gmail.com",
        "createdAt": "2024-10-09T14:04:17.173Z"
    }
]
```
**Error Responses**

  - **Code:** 400 Bad Request
  - **Content:**
```json
{
  "message": "No search term provided"
}
```


```json
{
  "message": "No customer found",
  "customers": []
}
```
**Description**: Returned if no matching customers are found.

- **Code:** 500 Internal Server Error
- **Content**:
```json
{
  "message": "Error searching for customer"
}
```
**Description**: Returned if an unexpected error occurs during the search process.

#### Example Request: 

```http
POST /api/customers/search/johndoe HTTP/1.1
Authorization: Bearer <token>
```

## GET /api/customers/
#### Description:
This endpoint retrieves customer data based on the provided customer ID.

**Request**
- **URL:** `/api/customers/:id`
- **Method**: `GET`

**URL Parameters**

| Parameter | Type     | Description                           | Required |
|-----------|----------|---------------------------------------|----------|
| id        | `number` | The unique identifier of the customer | Yes      |


**Success Response**
- **Code:** 200 OK
- **Content**: JSON object containing the customer data.

```json
{
    "customer": {
        "id": 1,
        "name": "Sawyer ",
        "email": "samcbride11@gmail.com",
        "createdAt": "2024-10-09T08:58:22.143Z"
    },
    "orders": [
        {
            "id": 1,
            "youtubeUrl": "https://www.youtube.com/watch?v=w8FO9cMKyOU",
            "channelName": "SurgeView Marketing",
            "customerEmail": "samcbride11@gmail.com",
            "createdAt": "2024-10-09T08:58:22.272Z"
        },
        {
            "id": 2,
            "youtubeUrl": "https://www.youtube.com/watch?v=aCMGHNr8QM8",
            "channelName": "surgeview marketing",
            "customerEmail": "samcbride11@gmail.com",
            "createdAt": "2024-10-09T09:03:12.520Z"
        },
        {
            "id": 3,
            "youtubeUrl": "https://www.youtube.com/watch?v=LZkl0_9xFOU",
            "channelName": "SurgeView Marketing",
            "customerEmail": "samcbride11@gmail.com",
            "createdAt": "2024-10-09T09:11:27.690Z"
        }
    ]
}
```
**Error Responses**
- **Code:** 400 Bad Request
- **Content:** 
```json
{
    "message": "Customer id not included in parameters"
}
```


## GET /api/orders

#### Description

Retrieve a list of orders, optionally filtered by a date range. If a date range is not provided, the most recent 100 orders are returned.

### Query Parameters

| Parameter | Type   | Required | Description                                           |
|-----------|--------|----------|-------------------------------------------------------|
| `start`   | string | No       | The start date for filtering orders in the format `YYYY-MM-DD`. Defaults to `T00:00:00Z` if not specified. |
| `end`     | string | No       | The end date for filtering orders in the format `YYYY-MM-DD`. Defaults to `T00:00:00Z` if not specified. |


#### Example with query parameters 

```http 
  /api/orders?start=2024-10-10&end=2024-10-12
```


### Responses

#### 200 OK

**Description:** Successfully retrieved orders.

**Body:**
```json
[
  {
    "id": 1,
    "youtubeUrl": "https://youtube.com/example",
    "channelName": "Example Channel",
    "customerEmail": "customer@example.com",
    "createdAt": "2024-10-09T08:58:22.272Z"
  },
]
```

#### 400 Bad Request

**Description:** Invalid date provided.


```json
  {
    "message": "Invalid date provided"
  }
```

#### 500 Internal Server Error

**Description**: An error occurred while processing the request.

```json
{
  "message": "Other error"
}
```

#### Example Requests:

```http
GET /api/orders
```

```http
GET GET /api/orders?start=2024-10-01&end=2024-10-09
```

#### Implementation Notes 
  - The service accepts start and end query parameters as optional.
  - Dates are parsed to Date objects assuming UTC timezone.
  - If both dates are provided, the service will retrieve orders within that range; if not, the recent 100 orders will be returned.
  - Error handling is in place for invalid date formats and unexpected server errors.


