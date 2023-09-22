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

Send a POST request to /register with the following JSON data in the request body:
```
json
Copy code
{
    "phone": "1234567890",
    "firstName": "John",
    "lastName": "Doe"
}
```
Note: Admin type is not required for this function.

## 2. telebotCallback
Handle a Telegram bot callback for a user and associate their Telegram ID with their account.

Usage:

Send a POST request to /telebot/callback with the following JSON data in the request body:
```
json
Copy code
{
    "contact": "1234567890",
    "telegramId": "1234567890",
    "token": "your-secret-token"
}
```
Note: Admin type is not required for this function. It requires a secret token for authentication.

## 3. requestOtp
Request a one-time password (OTP) for user authentication.

Usage:

Send a POST request to /otp/request with the following JSON data in the request body:
```
json
Copy code
{
    "phone": "1234567890"
}
```

Note: Admin type is not required for this function.

### 4. login
Authenticate a user using OTP and generate a token for access.

Usage:

Send a POST request to /login with the following JSON data in the request body:
```
json
Copy code
{
    "phone": "1234567890",
    "otp": "123456"
}
```

Note: Admin type is not required for this function.

## 5. addCreditCard
Add a credit card to the user's account.

Usage:

Send a POST request to /user/card with the following JSON data in the request body:
```
json
Copy code
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

Usage:

Send a PUT request to /user/card with the following JSON data in the request body:
```
json
Copy code
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

Usage:

Send a PUT request to /user/name with the following JSON data in the request body:
```
json
Copy code
{
    "firstName": "Alice",
    "lastName": "Smith"
}
```

Note: Admin type is not required for this function.