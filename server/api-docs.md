# Uniqlop App

## List available endpoint

- GET /products
- GET /products/:id
- POST /products
- DELETE /products/:id

### GET /products

This endpoint is for get all data products

Response 200 - OK

- Response body

```js
[
  {
    id: 1,
    name: "Sweet Pant",
    description: "comfy pant",
    price: 100000,
    stock: 10,
    imgUrl:
      "https://image.uniqlo.com/UQ/ST3/WesternCommon/imagesgoods/172292/sub/goods_172292_sub3.jpg?width=2000",
    categoryId: 1,
    authorId: 1,
    createdAt: "2023-08-08T09:32:51.041Z",
    updatedAt: "2023-08-08T09:32:51.041Z",
  },
  ...
];
```

### GET /products/:id

This endpoint is for get one single product by id

- Request params

```js
{
  id: <integer>
}
```

Response 200 - OK

- Response Body

```js
{
    "id": 1,
    "name": "Sweet Pant",
    "description": "comfy pant",
    "price": 100000,
    "stock": 10,
    "imgUrl": "https://image.uniqlo.com/UQ/ST3/WesternCommon/imagesgoods/172292/sub/goods_172292_sub3.jpg?width=2000",
    "categoryId": 1,
    "authorId": 1,
    "createdAt": "2023-08-08T09:32:51.041Z",
    "updatedAt": "2023-08-08T09:32:51.041Z"
}
```

### POST /products

This endpoint for adding one product

- Request body

```js
{
  "name": <string>,
  "description": <string>,
  "price": <integer>,
  "stock": <integer>,
  "imgUrl": <string>,
  "categoryId": <integer>,
  "authorId": <integer>
}
```

Response 200 - OK

- Response Body

```js
{
    "message": "Product basic shirt white has been added!"
}
```

### DELETE /products/:id

- Request params

```js
{
  id: <integer>
}
```

- Response 200 - OK

- Response Body

```js
{
  "message": "Product with id <integer> has been deleted"
}
```

- Response 404 - Not found

- Response Body

```js
{
  "message": "Product with id <integer> Not found"
}
```

### GET /history

This endpoint will get all history from added product

### POST /products

This endpoint for adding one product and add history

- Request body

```js
{
  "name": <string>,
  "description": <string>,
  "price": <integer>,
  "stock": <integer>,
  "imgUrl": <string>,
  "categoryId": <integer>,
  "authorId": <integer>
}
```

- Response 201 - created

- Response Body

```js
{
    "message": "Product basic shirt white has been added!"
}
```

### PUT /history/:id

This endpoint will update/edit product

- Request body

```js
{
  "name": <string>,
  "description": <string>,
  "price": <integer>,
  "stock": <integer>,
  "imgUrl": <string>,
  "categoryId": <integer>,
  "authorId": <integer>
}
```

- Response 403 - Forbidden

- Response 401 - unauthenticated

```js
{
    "message": "Invalid token!"
}
```

- Response Body

```js
{
    "message": "Success update product"
}
```

### PATCH /history/:id

This endpoint will update/edit status from product

- Request body

```js
{
  "status": "Active"
}
```

- Response Body

```js
{
    "message": "Success update product status"
}
```

### POST /register

This endpoint will bring you to login page

- Request Body :

```js
{
  "username": <string>,
  "email": <string>,
  "password": <string>,
  "phoneNumber": <string>,
  "address": <string>
}
```

After register, user can use the email just been registed to login page

- Respone 201 - created

```js
{
  "message": "User with <id user> has been created"
}
```

### POST /login

This endpoint will bring you to login page

- Request Body :

```js
{
  "email": <string>,
  "password": <string>
}
```

After login, user will get access_token

- Respone 401 - unauthenticated

```js
{
  "message": "Email/Password required!"
}
```

### Global Error

- Response 500 - Internal Server Error

```js
{
  "message": "Internal Server Error"
}
```

- Response 403 - Forbidden

- Response 401 - unauthenticated

```js
{
    "message": "Invalid token!"
}
```

## List available public endpoint

- GET /pub/products
- GET /pub/products/:id
- GET /pub/bookmarks
- POST /pub/bookmarks/:ProductId
- POST /pub/register
- POST /pub/login

### GET /pub/products

This endpoint is for get all data public products with status 'Active'

- Request headers

```js
access_token: <string>
```

Response 200 - OK

- Response body

```js
[
  {
    id: 1,
    name: "Sweet Pant",
    description: "comfy pant",
    price: 100000,
    stock: 10,
    imgUrl:
      "https://image.uniqlo.com/UQ/ST3/WesternCommon/imagesgoods/172292/sub/goods_172292_sub3.jpg?width=2000",
    categoryId: 1,
    authorId: 1,
    status: "Active",
    createdAt: "2023-08-22T16:54:02.201Z",
    updatedAt: "2023-08-22T16:54:02.201Z",
    Category: {
      id: 1,
      name: "Pant",
      createdAt: "2023-08-22T16:54:02.196Z",
      updatedAt: "2023-08-22T16:54:02.196Z",
    },
  },
  {
    id: 3,
    name: "Zipped Hoodie",
    description: "men dry zipped hoodie",
    price: 400000,
    stock: 5,
    imgUrl:
      "https://image.uniqlo.com/UQ/ST3/eu/imagesgoods/413436/item/eugoods_09_413436.jpg?width=2000",
    categoryId: 3,
    authorId: 1,
    status: "Active",
    createdAt: "2023-08-22T16:54:02.201Z",
    updatedAt: "2023-08-22T16:54:02.201Z",
    Category: {
      id: 3,
      name: "Jacket",
      createdAt: "2023-08-22T16:54:02.196Z",
      updatedAt: "2023-08-22T16:54:02.196Z",
    },
  },
];
```

## GET /pub/products/:id

This endpoint is for get one single public product by id

- Request headers

```js
access_token: <string>
```

- Request params

```js
{
  id: <integer>
}
```

Response 200 - OK

- Response Body

```js
{
    "id": 1,
    "name": "Sweet Pant",
    "description": "comfy pant",
    "price": 100000,
    "stock": 10,
    "imgUrl": "https://image.uniqlo.com/UQ/ST3/WesternCommon/imagesgoods/172292/sub/goods_172292_sub3.jpg?width=2000",
    "categoryId": 1,
    "authorId": 1,
    "status": "Active",
    "createdAt": "2023-08-22T16:54:02.201Z",
    "updatedAt": "2023-08-22T16:54:02.201Z"
}
```

## GET /pub/bookmarks

This will get product from bookmark for customer

- Request headers

```js
access_token: <string>
```

Response 200 - OK

- Response Body

```js
[
  {
    id: 1,
    CustomerId: 1,
    ProductId: 1,
    createdAt: "2023-08-22T17:21:47.988Z",
    updatedAt: "2023-08-22T17:21:47.988Z",
    Product: {
      id: 1,
      name: "Sweet Pant",
      description: "comfy pant",
      price: 100000,
      stock: 10,
      imgUrl:
        "https://image.uniqlo.com/UQ/ST3/WesternCommon/imagesgoods/172292/sub/goods_172292_sub3.jpg?width=2000",
      categoryId: 1,
      authorId: 1,
      status: "Active",
      createdAt: "2023-08-22T16:54:02.201Z",
      updatedAt: "2023-08-22T16:54:02.201Z",
    },
  },
  {
    id: 2,
    CustomerId: 1,
    ProductId: 3,
    createdAt: "2023-08-22T17:21:56.648Z",
    updatedAt: "2023-08-22T17:21:56.648Z",
    Product: {
      id: 3,
      name: "Zipped Hoodie",
      description: "men dry zipped hoodie",
      price: 400000,
      stock: 5,
      imgUrl:
        "https://image.uniqlo.com/UQ/ST3/eu/imagesgoods/413436/item/eugoods_09_413436.jpg?width=2000",
      categoryId: 3,
      authorId: 1,
      status: "Active",
      createdAt: "2023-08-22T16:54:02.201Z",
      updatedAt: "2023-08-22T16:54:02.201Z",
    },
  },
];
```

## POST /pub/bookmarks/:ProductId

This endpoint will add product to bookmark for customer

- Request headers

```js
access_token: <string>
```

- Response 201 - created

- Response body

```js
{
    "id": 4,
    "ProductId": 1,
    "CustomerId": 1,
    "updatedAt": "2023-08-23T04:29:08.614Z",
    "createdAt": "2023-08-23T04:29:08.614Z"
}
```
