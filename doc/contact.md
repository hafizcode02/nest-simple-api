# Contact API Spec

## Get & Search Contact

Endpoint : GET /api/contacts/

Headers :
- authorization: token

Query Params : 
- name: string, contact first_name or last_name, optional.
- phone: string, contact phone, optional.
- email: string, contact email, optional,
- page: number, default 1.
- size: number, default 10.

Response Body (Success) : 
```json
{
    "message": "Contact Successfully Retrieved!",
    "data": [
        {
            "id": 1,
            "first_name": "Hafiz",
            "last_name": "Caniago",
            "email": "dev@hafizcaniago.my.id",
            "phone": "08123456789",
            "social-linkedin": "-",
            "social-github": "-",
            "social-x": "-",
            "social-fb": "-",
            "social-yt": "-",
            "social-ig": "-",
        },
        {
            "id": 2,
            "first_name": "Hafiz",
            "last_name": "Caniago",
            "email": "dev@hafizcaniago.my.id",
            "phone": "08123456789",
            "social-linkedin": "-",
            "social-github": "-",
            "social-x": "-",
            "social-fb": "-",
            "social-yt": "-",
            "social-ig": "-",
        },
    ],
    "paging" : {
        "current_page": 1,
        "total_page": 10,
        "size": 10,
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "Required | Unauthorized"
}
```

## Create Contact

Endpoint : POST /api/contacts

Headers :
- authorization: token

Request Body : 
```json
{
    "first_name": "Hafiz",
    "last_name": "Caniago",
    "email": "dev@hafizcaniago.my.id",
    "phone": "08123456789",
    "social-linkedin": "-",
    "social-github": "-",
    "social-x": "-",
    "social-fb": "-",
    "social-yt": "-",
    "social-ig": "-",
}
```

Response Body (Success) : 
```json
{
    "message": "Contact Successfully Added!",
    "data": {
        "id": 1,
        "first_name": "Hafiz",
        "last_name": "Caniago",
        "email": "dev@hafizcaniago.my.id",
        "phone": "08123456789",
        "social-linkedin": "-",
        "social-github": "-",
        "social-x": "-",
        "social-fb": "-",
        "social-yt": "-",
        "social-ig": "-",
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "Required | Unauthorized"
}
```

## Get Contact 

Endpoint : GET /api/contacts/:contactId

Headers :
- authorization: token

Response Body (Success) : 
```json
{
    "message": "Contact Successfully Retrieved!",
    "data": {
        "id": 1,
        "first_name": "Hafiz",
        "last_name": "Caniago",
        "email": "dev@hafizcaniago.my.id",
        "phone": "08123456789",
        "social-linkedin": "-",
        "social-github": "-",
        "social-x": "-",
        "social-fb": "-",
        "social-yt": "-",
        "social-ig": "-",
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "Required | Unauthorized"
}
```

## Update Contact
Endpoint : PATCH /api/contacts/:contactId

Headers :
- authorization: token

Request Body : 
```json
{
    "first_name": "Hafiz",
    "last_name": "Caniago",
    "email": "dev@hafizcaniago.my.id",
    "phone": "08123456789",
    "social-linkedin": "-",
    "social-github": "-",
    "social-x": "-",
    "social-fb": "-",
    "social-yt": "-",
    "social-ig": "-",
}
```

Response Body (Success) : 
```json
{
    "message": "Contact Successfully Updated!",
    "data": {
        "id": 1,
        "first_name": "Hafiz",
        "last_name": "Caniago",
        "email": "dev@hafizcaniago.my.id",
        "phone": "08123456789",
        "social-linkedin": "-",
        "social-github": "-",
        "social-x": "-",
        "social-fb": "-",
        "social-yt": "-",
        "social-ig": "-",
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "Required | Unauthorized"
}
```

## Update Contact Image
Endpoint : POST /api/contacts/:contactId/upload

Headers :
- authorization: token

Request Body (Form-Data) :
```form-data
"image" : Image (*jpg/png/jpeg)
```

Response Body (Success) : 
```json
{
    "message": "File uploaded successfully",
    "data": {
        "id": 9,
        "first_name": "Bjir",
        "email": "dev@hafizcaniago.my.id",
        "filename": "http://localhost:3000/uploads/2024-11-19T02-24-15-468Z.jpg"
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "Required | Unauthorized"
}
```

## Remove Contact
Endpoint : DELETE /api/contacts/:contactId

Headers :
- authorization: token

Response Body (Success) :
```json
{
    "message": "Data Deleted Successfully!",
    "data": true
}
```

Response Body (Failed) :
```json
{
    "errors": "Data Not Found | Unauthorized"
}
```