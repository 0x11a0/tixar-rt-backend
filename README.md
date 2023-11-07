# TIXAR Ticketing API
## Setup
1. Create a .env file in the main directory
2. Copy contents in 'env.example' into '.env'
3. Ensure MongoDB is running
4. Ensure Tixar_bot is running
5. Start express app: `npm run test`

# API USAGE
## 1. register
Register a new user with their phone number, first name, and last name.

Usage:

- **Method**: `POST`
- **Endpoint**: `http://rt.tixar.sg/api/register`
- **Body**:

Send a `POST` request to `/register` with the following JSON data in the request body:
```json
{
    "phone": "1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@doe.com"
}
```
Note: Admin type is not required for this function.

## 2. telebotCallback (Telegram Binding)
Handle a Telegram bot callback for a user and associate their Telegram ID with their account.

Usage:

- **Method**: `POST`
- **Endpoint**: `http://rt.tixar.sg/api/telebot/callback`
- **Body**:

Send a `POST` request to `/telebot/callback` with the following JSON data in the request body:
```json
{
    "contact": "1234567890",
    "telegramId": "1234567890",
    "token": "your-secret-token"
}
```
Note: Admin type is not required for this function. It requires a secret token for authentication.

## 3. requestOtp
Request a one-time password (OTP) for user authentication. OTP last for 60 seconds before expiring.

Usage:

- **Method**: `POST`
- **Endpoint**: `http://rt.tixar.sg/api/otp/request`
- **Body**:

Send a `POST` request to `/otp/request` with the following JSON data in the request body:
```json
{
    "phone": "1234567890"
}
```

Note: Admin type is not required for this function.

### 4. login
Authenticate a user using OTP and generate a token for access.

Usage:

- **Method**: `POST`
- **Endpoint**: `http://rt.tixar.sg/api/login`
- **Body**:

Send a `POST` request to `/login` with the following JSON data in the request body:
```json
{
    "phone": "1234567890",
    "otp": "123456"
}
```

Note: Admin type is not required for this function.

## 5. addCreditCard
Add a credit card to the user's account.

Usage:

- **Method**: `POST`
- **Endpoint**: `http://rt.tixar.sg/api/user/card`
- **Headers**:
    - **Authorization**: Bearer `<token>`
- **Body**:

Authorization Header required with token via `Bearer <token>`.

Send a `POST` request to `/user/card` with the following JSON data in the request body:
```json
{
    "customer": {
        "cardNumber": "1234 5678 9012 3456",
        "expiryDate": "12/25",
        "cvv": "123"
    }
}
```

Note: Admin type is not required for this function.

## 6. updateCreditCard
Update the user's credit card information.

Authorization Header required with token via `Bearer <token>`.

Usage:

- **Method**: `PUT`
- **Endpoint**: `http://rt.tixar.sg/api/user/card`
- **Headers**:
    - **Authorization**: Bearer `<token>`
- **Body**:

Send a `PUT` request to `/user/card` with the following JSON data in the request body:
```json
{
    "customer": {
        "cardNumber": "1111 2222 3333 4444",
        "expiryDate": "06/30",
        "cvv": "456"
    }
}
```

Note: Admin type is not required for this function.

## 7. updateName
Update the user's first name and last name.

Authorization Header required with token via `Bearer <token>`.

Usage:

- **Method**: `PUT`
- **Endpoint**: `http://rt.tixar.sg/api/user/name`
- **Headers**:
    - **Authorization**: Bearer `<token>`
- **Body**:

Send a `PUT` request to `/user/name` with the following JSON data in the request body:
```json
{
    "firstName": "Alice",
    "lastName": "Smith"
}
```

Note: Admin type is not required for this function.

## 8. getProfile
Retrieve the user's profile information.

Authorization Header required with token via `Bearer <token>`.

Usage:

- **Method**: `GET`
- **Endpoint**: `http://rt.tixar.sg/api/user`
- **Headers**:
    - **Authorization**: Bearer `<token>`

Send a `GET` request to `/user`. 

Response example:
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "123456789",
    "email": "john@doe.com",
    "card": {
        "cardName": "John Doe",
        "cardNumber": "**** **** 1346",
        "cardExpiryMonth": "01",
        "cardExpiryYear": "2030",
        "cardCvv": "***"
    },
    "type": "standard" // or "admin"
}
```

Note: Admin type is not required for this function.

## 9. updateProfile
Update the user's profile (first name, last name, phone number and email).

Authorization Header required with token via `Bearer <token>`.

Usage:

- **Method**: `PUT`
- **Endpoint**: `http://rt.tixar.sg/api/user`
- **Headers**:
    - **Authorization**: Bearer `<token>`
- **Body**:

Send a `PUT` request to `/user` with the JSON data you'd like to update in the request body. All fields are optional; only send the fields you'd like to update.

Example request body:
```json
{
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "987654321",
    "email": "doe@jane.com"
}
```

Note: Admin type is not required for this function.
