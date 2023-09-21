# Tixar RT Backend (production) Documentation

## User Endpoints

### **Register**
- **Method**: `POST`
- **Endpoint**: `http://rt.tixar.sg/api/register`
- **Body**:

```json
{
    "phone": "6588886666",
    "firstName": "Lucas",
    "lastName": "Liao"
}
```

---

### **Bind Telegram**
- **Method**: `POST`
- **Endpoint**: `http://rt.tixar.sg/api/telebot/callback`
- **Body**:

```json
{
    "token": "2cbab349ae3c1765bfbc9c85396a20bbb750e7bb2b49390ee884b08a58dab0df",
    "contact": "6588886666",
    "telegramId": "826537281"
}
```

---

### **Request OTP**
- **Method**: `POST`
- **Endpoint**: `http://rt.tixar.sg/api/otp/request`
- **Body**:

```json
{
    "phone": "6588886666"
}
```

---

### **Login**
- **Method**: `POST`
- **Endpoint**: `http://rt.tixar.sg/api/login`
- **Body**:

```json
{
    "phone": "6588886666",
    "otp": "885306"
}
```

---

### **Add Credit Card**
- **Method**: `POST`
- **Endpoint**: `http://rt.tixar.sg/api/user/card`
- **Headers**:
    - **Authorization**: Bearer `<token>`
- **Body**:

```json
{
    "customer": {
        "cardName": "Lucas Liao",
        "cardNumber": "4567123412341234",
        "cardExpiryMonth": "01",
        "cardExpiryYear": "2030",
        "cardCvv": "111"
    }
}
```

---

### **Update Credit Card**
- **Method**: `PUT`
- **Endpoint**: `http://rt.tixar.sg/api/user/card`
- **Headers**:
    - **Authorization**: Bearer `<token>`
- **Body**:

```json
{
    "customer": {
        "cardName": "Lucas Liao",
        "cardNumber": "4567123412341234",
        "cardExpiryMonth": "01",
        "cardExpiryYear": "2030",
        "cardCvv": "111"
    }
}
```

---

### **Update Name**
- **Method**: `PUT`
- **Endpoint**: `http://rt.tixar.sg/api/user/name`
- **Headers**:
    - **Authorization**: Bearer `<token>`
- **Body**:

```json
{
    "firstName": "Jordan",
    "lastName": "Michael"
}
```
