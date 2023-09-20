require('dotenv').config('../');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  otpValue: String,
  otpExpiry: Date,
  otpLast: Date,
  otpAttempt: {
    type: Number,
    default: 0
  },
  otpDevice: {
    deviceType: String,
    deviceKey: String
  },
  firstName: String,
  lastName: String,
  type: String,
  customer: {
    cardName: String,
    cardNumber: String,
    cardExpiryMonth: String,
    cardExpiryYear: String,
    cardCvv: String
  }
});

userSchema.pre("save", async function(next) {
    if (this.isModified("otpValue")) {
        this.otpValue = await bcrypt.hash(this.otpValue, Number(process.env.SALT));
    }
})

userSchema.methods.compareOtp = async function(enteredOtp) {
    return await bcrypt.compare(enteredOtp, this.otpValue);
}


userSchema.methods.generateToken = function() {
    return jwt.sign({id: this._id, status: this.type}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
}

const User = mongoose.model('User', userSchema);

module.exports = User;
