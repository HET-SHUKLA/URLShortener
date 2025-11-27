# API docs

## 1. Auth
### POST
#### 1. `POST /auth/register`
> To register user through email and password

**Request**
```json
{
    "email": "abc@gmail.com",
    "password": "Abc@12@3" // Min 8 characters
}
```

**Response**

**201 Created**
```
// ONLY FOR WEB
HTTP/1.1 200 OK
Set-Cookie: refreshToken=<REFRESH_JWT>; HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth
Content-Type: application/json
```

```json
{
    "status":201,
    "message": "User created successfully",
    "success": true,
    "data":{
        "id": "user-id",
        "accessToken": "<jwt>",
        "refreshToken": "<refresh>" // Only for Mobile
    }
}
```

**400 Invalid data**
```json
{
    "status": 400,
    "error": "Provided data is invalid",
    "success": false,
}
```

**409 Conflict**
```json
{
    "status": 409,
    "error": "Email address is already exists, Kindly login",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```

---

#### 2. `POST /auth/google`
> To register/login user through google. Frontend will do all the google sign in and in backend, Google Id token will be pass through request.

> Backend will verify that token, and creates / login user.

**Request**
```json
{
    "idToken": "<google-id-token>"
}
```

**Response**
```
// ONLY FOR WEB
HTTP/1.1 200 OK
Set-Cookie: refreshToken=<REFRESH_JWT>; HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth
Content-Type: application/json
```
**201 Created**
```json
{
    "status":201,
    "message": "User created successfully",
    "success": true,
    "data":{
        "id": "user-id",
        "accessToken": "<jwt>",
        "refreshToken": "<refresh>" // Only for Mobile
    }
}
```

**200 OK**
```
// ONLY FOR WEB
HTTP/1.1 200 OK
Set-Cookie: refreshToken=<REFRESH_JWT>; HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth
Content-Type: application/json
```
```json
{
    "status": 200,
    "error": "User logged in successfully",
    "success": true,
    "data": {
        "id": "user-id",
        "accessToken": "<jwt>",
        "refreshToken": "<refresh>" // Only for Mobile
    }
}
```

**400 Invalid data**
```json
{
    "status": 400,
    "error": "Google ID is invalid",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```

---

#### 3. `POST /auth/refresh`
> To send new access_token, If old one is expired.

**Request**
```
// Header
Cookie: refreshToken=<jwt>

// For Mobile
Authorization: Bearer <refresh_token>
```

**Response**

**200 OK**
```
// ONLY FOR WEB
HTTP/1.1 200 OK
Set-Cookie: refreshToken=<REFRESH_JWT>; HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth
Content-Type: application/json
```
```json
{
    "status":200,
    "message": "Token refreshed",
    "success": true,
    "data":{
        "id": "user-id",
        "accessToken": "<jwt>",
        "refreshToken": "<refresh>" // Only for Mobile
    }
}
```

**400 Invalid data**
```json
{
    "status": 400,
    "error": "Provided data is invalid",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```

---

#### 4. `POST /auth/login`
> To login user through email and password

**Request**
```json
{
    "email": "abc@gmail.com",
    "password": "Abc@12@3" // Min 8 characters
}
```

**Response**

**200 OK**
```
// ONLY FOR WEB
HTTP/1.1 200 OK
Set-Cookie: refreshToken=<REFRESH_JWT>; HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth
Content-Type: application/json
```

```json
{
    "status":200,
    "message": "User logged in successfully",
    "success": true,
    "data":{
        "id": "user-id",
        "accessToken": "<jwt>",
        "refreshToken": "<refresh>" // Only for Mobile
    }
}
```

**400 Invalid data**
```json
{
    "status": 400,
    "error": "Provided data is invalid",
    "success": false,
}
```

**401 Unauthorized**
```json
{
    "status": 401,
    "error": "Email or Password is incorrect",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```

---

### GET

#### 1. `GET /auth/me`
> Get user from jwt token.

**Request**
```
Authorization: Bearer <access_token>
```

**Response**

**200 OK**
```json
{
    "status":200,
    "message": "User details fetched successfully",
    "success": true,
    "data":{
        "id": "user-id",
    }
}
```

**400 Invalid data**
```json
{
    "status": 400,
    "error": "Token is invalid",
    "success": false,
}
```

**401 Unauthorized**
```json
{
    "status": 401,
    "error": "Token is expired or invalid",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```

---


#### 2. `GET /auth/logout`
> Logout user.

**Request**
```
Authorization: Bearer <access_token>
```

**Response**

**200 OK**
```json
{
    // Refresh token will be blacklisted
    "status":200,
    "message": "User logged out successfully",
    "success": true,
}
```

**400 Invalid data**
```json
{
    "status": 400,
    "error": "Token is invalid",
    "success": false,
}
```

**401 Unauthorized**
```json
{
    "status": 401,
    "error": "Token is expired or invalid",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```

## 2. User

### GET
#### 1. `GET /user/me`
> Get user information from userId.

**Request**
```
Authorization: Bearer <access_token>
```

**Response**

**200 OK**
```json
{
    "status":200,
    "message": "User details fetched successfully",
    "success": true,
    "data":{
        "user": {
            "id": "user_id",
            "email": "email@gmail.com",
            "isEmailVerified": true,
            "emailVerifiedAt": "17234585362",
            "createdAt": "17234585362",
            "lastLogInAt": "1723485362",
            "signedUpUsing": "GOOGLE"
        }
    }
}
```

**400 Invalid data**
```json
{
    "status": 400,
    "error": "User ID is invalid",
    "success": false,
}
```

**401 Unauthorized**
```json
{
    "status": 401,
    "error": "Token is expired or invalid",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```

---

## 3. URL

### POST
#### 1. `POST /url`
> Get user information from userId.

**Request**
```
// Optional for Guest users
Authorization: Bearer <access_token>
```
```json
{
    // Token needs to be pass to store url in user
    "longUrl": "https://www.aaa.com",
    "protectionMethod": "APPROVE", // Default NONE
    "urlPassword": "pass", // Only if protection method is password
    "isUrlSFW": true, // Optional, User can select NSFW, Or server will analys
    "isAnalyticsEnabled": false, // Optional, Log in required
    "emailNotificationEnable": false, // Optional, Log in required
    "customAlias": "custom", // Optional
}
```

**Response**

**201 Created**
```json
{
    "status":201,
    "message": "URL shorted successfully",
    "success": true,
    "data":{
        "shortUrl": "short-url",
    }
}
```

**400 Invalid data**
```json
{
    "status": 400,
    "error": "Invalid Data",
    "success": false,
}
```

**401 Unauthorized**
```json
{
    "status": 401,
    "error": "Token is expired or invalid",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```

#### 2. `POST /url/:id`
> Verify URL protection

**Request**
```json
{
    "password": "aaaa", // If method is "PASSWORD"
    "OTP": "1323", // If method is "OTP"
}
```

**Response**

**200 OK**
```json
{
    "status":200,
    "message": "Long URL fetched successfully",
    "success": true,
    "data": {
        "url": "https://www.google.com",
    }
}
```

**400 Invalid data**
```json
{
    "status": 400,
    "error": "Invalid Data",
    "success": false,
}
```

**401 Unauthorized**
```json
{
    "status": 401,
    "error": "Password is incorrect",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```

---

### GET
#### 1. `GET /url/:id`
> Get long URL or Get Protection method

**Response**

**200 OK**
```json
{
    "status":200,
    "message": "Long URL fetched success fully / Protected URL",
    "success": true,
    "data": {
        "longUrl": "https//www.google.com", // If protection method is none
    }
}
```

**401 Unauthorized**
```json
{
    "status": 401,
    "error": "This URL is protected",
    "success": false,
    "details": {
        "protectionMethod": "PASSWORD",
    }
}
```

**404 Not found**
```json
{
    "status": 404,
    "error": "URL code does not exists",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```

#### 2. `GET /url/get/:id`
> Get URL information.

**Request**
```
Authorization: Bearer <access_token>
```

**Response**

**200 OK**
```json
{
    "status":200,
    "message": "URL data fetched successfully",
    "success": true,
    "data": {
        "url":{
            "longUrl": "https://www.aaa.com",
            "protectionMethod": "APPROVE", 
            "protectedPassword": "abajsdj",
            "isUrlSFW": true, 
            "isAnalyticsEnabled": false, 
            "emailNotificationEnable": false,
            "totalClicks": 12,
            "totalSuccessClicks": 5,
            "createdAt": "1723584562",
            "lastUpdatedAt": "172354255"
        }
    }
}
```

**400 Invalid data**
```json
{
    "status": 400,
    "error": "Invalid Data",
    "success": false,
}
```

**401 Unauthorized**
```json
{
    "status": 401,
    "error": "Token is expired or invalid",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```




#### 3. `GET /url/stats/:id?page="1"&range="10"?`
> Get URL analytics. This API is paginated, In one page by default, 10 response will be there. Maximum you can request 30 response per page.

**Request**
```
Authorization: Bearer <access_token>
```

**Response**

**200 OK**
```json
{
    "status":200,
    "message": "URL analytics fetched successfully",
    "success": true,
    "data": {
        "page": 1, // Pagination
        "success": [true, false, false, true],
        "ip": ["127.0.0.1", "192.0.0.1", "111.253.25.2"],
        "method": ["PASSWORD", "PASSWORD", "NONE"],
        "time": ["1723546245", "215411231"],
    }
}
```

**401 Unauthorized**
```json
{
    "status": 401,
    "error": "Token is expired or invalid",
    "success": false,
}
```

**404 Not found**
```json
{
    "status": 404,
    "error": "Url not found",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```

### PATCH
#### 1. `PATCH /url/:id`
> Update URL information from id.

**Request**
```
Authorization: Bearer <access_token>
```
```json
{
    // At least one field is mandetory
    "newLongUrl": "https://www.aaa.com",
    "newProtectionMethod": "PASSWORD",
    "newPassword": "newpassword", // Optional, Only if protection method is password
    "newIsUrlSFW": true, // User can request to update
    "newIsAnalyticsEnabled": false,
    "newEmailNotificationEnable": false,
}
```

**Response**

**200 OK**
```json
{
    "status":200,
    "message": "Data updated successfully",
    "success": true,
}
```

**400 Invalid data**
```json
{
    "status": 400,
    "error": "Invalid Data",
    "success": false,
}
```

**401 Unauthorized**
```json
{
    "status": 401,
    "error": "Token is expired or invalid",
    "success": false,
}
```

**500 Internal server**
```json
{
    "status": 500,
    "error": "Something went wrong, Try again after some time",
    "success": false,
}
```