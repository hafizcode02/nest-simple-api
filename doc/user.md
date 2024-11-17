# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
    "email": "dev@hafizcaniago.my.id",
    "name": "Hafiz Caniago",
    "username": "hafigo",
    "password": "secret",
    "confirmPassword": "secret"
}
```

Response Body (Success) :
```json
{
    "message": "User Created Successfully",
    "data": {
        "email": "dev@hafizcaniago.my.id",
        "name": "Hafiz Caniago",
        "username": "hafigo",
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "Username already registered"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
    "username": "hafigo",
    "password": "secret"
}
```

Response Body (Success) :
```json
{
    "message": "Login Successfully!",
    "data": {
        "username": "hafigo",
        "name": "Hafiz Caniago",
        "token": "xxYxFg52345623"
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "username or password is wrong"
}
```

## Verify User

Endpoint : GET /api/users/verify-email/:hash

Response Body (Success) :
```json
{
    "message": "Email Verified Successfully"
}
```

Response Body (Failed) :
```json
{
    "errors": "Email already verified"
}
```

## Get User

Endpoint : GET /api/users/current

Headers:
- authorization: token

Response Body (Success) :
```json
{
    "message": "Data Retrieved Successfully!",
    "data": {
        "email": "dev@hafizcaniago.my.id",
        "name": "Hafiz Caniago",
        "username": "hafigo",
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "Unauthorized"
}
```

## Update User

Endpoint : PATCH /api/users/

Headers:
- authorization: token

Request Body :

```json
{
    "email": "dev@hafizcaniago.my.id",
    "name": "Hafiz Caniago",
    "username": "hafigo",
    "password": "secret",
    "confirmPassword": "secret"
}
```

Response Body (Success) :
```json
{
    "message": "User Updated Successfully",
    "data": {
        "email": "dev@hafizcaniago.my.id",
        "name": "Hafiz Caniago",
        "username": "hafigo",
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "Unauthorized"
}
```

## Logout User
Endpoint : POST /api/users/logout

Headers:
- authorization: token

Response Body (Success) :
```json
{
    "message": "User logout successfully",
    "data": true
}
```

## Forgot Password (Optional)