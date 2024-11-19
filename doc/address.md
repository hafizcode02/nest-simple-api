# Address API Spec

## Create Address
Endpoint : POST /api/contacts/:contactId/addresses

Headers : 
- authorization : token

Request Body : 
```json
{
    "street": "Jalan Cth, No.1",
    "city": "Kota",
    "province": "Provinsi",
    "country": "Negara",
    "postalCode": "12344",
    "detail": "lorem ipsum dolor sit amet" // optional
}
```

Response Body (Success):
```json
{
    "message": "Address successfully created",
    "data": {
        "id": 1,
        "street": "Jalan Cth, No.1",
        "city": "Kota",
        "province": "Provinsi",
        "country": "Negara",
        "postalCode": "12344",
        "detail": "lorem ipsum dolor sit amet"
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "Required | Unauthorized"
}
```

## Get Address
Endpoint : GET /api/contacts/:contactId/addresses/:addressesId

Headers : 
- authorization : token

Response Body (Success):
```json
{
    "message": "Address successfully retrieved",
    "data": {
        "id": 1,
        "street": "Jalan Cth, No.1",
        "city": "Kota",
        "province": "Provinsi",
        "country": "Negara",
        "postalCode": "12344",
        "detail": "lorem ipsum dolor sit amet"
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "Not Found | Unauthorized"
}
```

## Update Address
Endpoint : PATCH /api/contacts/:contactId/addresses/:addressesId

Headers : 
- authorization : token

Request Body : 
```json
{
    "street": "Jalan Cth, No.1",
    "city": "Kota",
    "province": "Provinsi",
    "country": "Negara",
    "postalCode": "12344",
    "detail": "lorem ipsum dolor sit amet" // optional
}
```

Response Body (Success):
```json
{
    "message": "Address successfully updated!",
    "data": {
        "id": 1,
        "street": "Jalan Cth, No.1",
        "city": "Kota",
        "province": "Provinsi",
        "country": "Negara",
        "postalCode": "12344",
        "detail": "lorem ipsum dolor sit amet"
    }
}
```

Response Body (Failed) :
```json
{
    "errors": "Not Found | Unauthorized"
}
```

## Remove Address
Endpoint : DELETE /api/contacts/:contactId/addresses/:addressesId

Headers : 
- authorization : token

Response Body (Success):
```json
{
    "message": "Address successfully updated!",
    "data": null
}
```

Response Body (Failed) :
```json
{
    "errors": "Not Found | Unauthorized"
}
```

## List Address
Endpoint : GET /api/contacts/:contactId/

Headers : 
- authorization : token

Response Body (Success):
```json
{
    "message": "Address successfully retrieved",
    "data": [
        {
            "id": 1,
            "street": "Jalan Cth, No.1",
            "city": "Kota",
            "province": "Provinsi",
            "country": "Negara",
            "postalCode": "12344",
            "detail": "lorem ipsum dolor sit amet"
        }
    ]
}
```

Response Body (Failed) :
```json
{
    "errors": "Unauthorized"
}
```