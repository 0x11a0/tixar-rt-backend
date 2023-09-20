const crypto = require('crypto');

const generateSecureRandomNumber = (min, max) => {
    const range = max - min;
    const bytesNeeded = Math.ceil(Math.log2(range + 1) / 8);
    let randomNumber;

    do {
        const buffer = crypto.randomBytes(bytesNeeded);
        randomNumber = parseInt(buffer.toString('hex'), 16);
    } while (randomNumber > range);

    return min + randomNumber;
};

const generateOTP = (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    return generateSecureRandomNumber(min, max);
};

module.exports = generateOTP;
