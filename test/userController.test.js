const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/userModel');
const otpGenerator = require('../utils/otpGenerator');
const isAuthenticated = require('../middlewares/auth')

// Mock necessary database functions
jest.mock('../models/userModel');

let token; // to store authentication token after login

beforeEach(() => {
    User.mockClear();
});

describe('userController', () => {

    // Test Registration
    describe('register', () => {
        it('should register a new user successfully', async() => {
            User.mockImplementation(() => {
                return {
                    save: jest.fn().mockResolvedValue(true)
                }
            });
            const response = await request(app)
            .post('/api/register')
            .send({
                phone: "6591234567",
                firstName: "John",
                lastName: "Doe",
                email: "johnDoe@gmail.com",
            })

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully!')
        })
    })

    // Login Registration
    describe('login', () => {
        it('should login user successfully', async() => {

            // Mock the OTP Generator
            User.findOne = jest.fn().mockResolvedValue({
                phone: '6592341234',
                generateOTP: jest.fn().mockReturnValue('sampleOTP'),
                otpExpiry: new Date(Date.now() + 60000),
                otpLast: Date.now(),
                compareOtp: jest.fn().mockResolvedValue(true),
                generateToken: jest.fn().mockReturnValue('sampleToken'),
                save: jest.fn().mockResolvedValue(true)
            });
            const response = await request(app)
            .post('/api/login')
            .send({
                phone: '6592341234',
                otp: 'sampleOTP',
            });

            expect(response.status).toBe(200);
            token = response.body.token;
        })

        it('should not login user successfully as user entered wrong OTP', async() => {
            // Mock the OTP Generator
            User.findOne = jest.fn().mockResolvedValue({
                phone: '6592341234',
                otpValue: jest.fn().mockReturnValue('sampleOTP'),
                otpExpiry: new Date(Date.now() + 60000),
                otpLast: Date.now(),
                compareOtp: jest.fn().mockResolvedValue(false),
                generateToken: jest.fn().mockReturnValue('sampleToken'),
                save: jest.fn().mockResolvedValue(true)
            });
            const response = await request(app)
            .post('/api/login')
            .send({
                phone: '6592341234',
                otp: 'wrongOTP',
            });

            expect(response.status).toBe(401);
        })

        it('should not login user successfully as user entered an expired OTP', async() => {
            // Mock the OTP Generator
            User.findOne = jest.fn().mockResolvedValue({
                phone: '6592341234',
                generateOTP: jest.fn().mockReturnValue('sampleOTP'),
                otpExpiry: Date.now()-1000,
                otpLast: Date.now(),
                compareOtp: jest.fn().mockResolvedValue(true),
                generateToken: jest.fn().mockReturnValue('sampleToken'),
                save: jest.fn().mockResolvedValue(true)
            });
            const response = await request(app)
            .post('/api/login')
            .send({
                phone: '6592341234',
                otp: 'sampleOTP',
            });

            expect(response.status).toBe(400);
        })

        it('should not login user successfully as user entered a wrong phone number', async() => {
            // Mock the OTP Generator
            User.findOne = jest.fn().mockResolvedValue(false);
            const response = await request(app)
            .post('/api/login')
            .send({
                phone: 'wrongPhoneNumber',
                otp: 'sampleOTP',
            });

            expect(response.status).toBe(404);
        })
    })

    // Profile
    describe('profile', () => {
        it('should retrieve user profile successfully if the user is authenticated', async () => {
            // Mock an authenticated user
            const sampleUser = {
                _id: '1234', 
                firstName: 'John',
                lastName: 'Doe',
                phone: '987654321',
                email: 'johndoe@example.com',
                card: {
                    cardName: 'Test Card',
                    cardNumber: '1234567890123456',
                },
                type: 'standard',
                eWalletBalance: 0,
                save: jest.fn().mockResolvedValue(true)
            }
            jwt.verify = jest.fn().mockReturnValue(true);
            User.findById = jest.fn().mockResolvedValue(sampleUser);
            sampleUser.isAuthenticated = jest.fn().mockResolvedValue(true);

            const response = await request(app)
                .get('/api/user')
                .set('Authorization', 'Bearer ${token}')

            expect(response.status).toBe(200);
            expect(response.body.firstName).toBe(sampleUser.firstName);
            expect(response.body.lastName).toBe(sampleUser.lastName);
        })

        it('should not retrieve user profile successfully if the user is unauthenticated', async () => {
            // Mock an authenticated user
            const sampleUser = {
                _id: '1234',
                firstName: 'John',
                lastName: 'Doe',
                phone: '987654321',
                email: 'johndoe@example.com',
                card: {
                    cardName: 'Test Card',
                    cardNumber: '1234567890123456',
                },
                type: 'standard',
                eWalletBalance: 0,
                save: jest.fn().mockResolvedValue(true)
            }
            jwt.verify = jest.fn().mockReturnValue(false);
            User.findById = jest.fn().mockResolvedValue(sampleUser);
            sampleUser.isAuthenticated = jest.fn().mockResolvedValue(false);

            const response = await request(app)
                .get('/api/user')

            expect(response.status).toBe(401);
        })

        it('user should be able to update profile successfully', async() => {

            const sampleUser = {
                _id: "12345",
                firstName: "John",
                lastName: "Doe",
                card: {"cardName": "test"},
                phone: "987654321",
                save: jest.fn().mockResolvedValue(true)
            }
            // Mock the jwt.verify function to return the decoded data
            jwt.verify = jest.fn().mockReturnValue(true);
            User.findById = jest.fn().mockResolvedValue(sampleUser);
            sampleUser.isAuthenticated = jest.fn().mockResolvedValue(true);

            const response = await request(app)
            .put('/api/user')
            .set('Authorization', 'Bearer ${token}')
            .send({
                firstName: "Jane",
                lastName: "Doe",
                phone: "987654321",
                card: {"cardName": "test"},
                email: "doe@jane.com"
            });

            expect(response.status).toBe(200);
            expect(sampleUser.firstName).toBe("Jane");           
            expect(sampleUser.lastName).toBe("Doe");  
            expect(sampleUser.email).toBe("doe@jane.com");
        })

        it('user should not be able to update profile successfully if user is not authenticated', async() => {

            const response = await request(app)
            .put('/api/user')
            .send({
                firstName: "Jane",
                lastName: "Doe",
                phone: "987654321",
                card: {"cardName": "test"},
                email: "doe@jane.com"
            });

            expect(response.status).toBe(401);
        })

        it('user should not be able to update profile successfully if phone number is not unique', async () => {
            // Mock an existing user with the same phone number
            const existingUser = {
                _id: "12345",
                firstName: "John",
                lastName: "Doe",
                card: {"cardName": "test"},
                phone: "987654321",
                save: jest.fn().mockResolvedValue(true)
            };
        
            // Mock the jwt.verify function to return an authenticated user
            jwt.verify = jest.fn().mockReturnValue(true);
            User.isAuthenticated = jest.fn().mockResolvedValue(true);
        
            // Mock the User.findById method to return the existing user
            User.findById = jest.fn().mockResolvedValue(existingUser);
        
            const response = await request(app)
                .put('/api/user')
                .set('Authorization', 'Bearer ${token}')
                .send({
                    firstName: 'Jane',
                    lastName: 'Soh',
                    phone: '987654321',
                    card: { cardName: 'test' },
                    email: 'jane@example.com',
                });
        
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Phone number is not unique');
        });
        

        it('user should not be able to update name if user is unauthenticated', async () => {
            // Mock an authenticated user
            const sampleUser = {
                _id: '1234',
                firstName: "John",
                lastName: "Doe",
                save: jest.fn().mockResolvedValue(true)
            }

            jwt.verify = jest.fn().mockReturnValue(false);
            User.findById = jest.fn().mockResolvedValue(sampleUser);
            sampleUser.isAuthenticated = jest.fn().mockResolvedValue(false);

            const response = await request(app)
            .put('/api/user/name')
            .send({
                firstName: "Jane",
                lastName: "Doe"
            });

            expect(response.status).toBe(401);
        })
    })

    // Card
    describe('creditCard', () => {
        it('user should be able to add credit card if user is authenticated', async () => {
            // Mock an authenticated user
            const sampleUser = {
                _id: '1234',
                save: jest.fn().mockResolvedValue(true)
            }

            jwt.verify = jest.fn().mockReturnValue(true);
            User.findById = jest.fn().mockResolvedValue(sampleUser);
            sampleUser.isAuthenticated = jest.fn().mockResolvedValue(true);

            const response = await request(app)
            .post('/api/user/card')
            .set('Authorization', 'Bearer ${token}')
            .send({
                cardName: "John Doe",
                cardNumber: "1234 5678 9012 3456",
                cardExpiryMonth: "01",
                cardExpiryYear: "2030",
            });

            expect(response.status).toBe(200);
        })

        it('user should not be able to add credit card if user is unauthenticated', async () => {
            // Mock an authenticated user
            const sampleUser = {
                _id: '1234',
                save: jest.fn().mockResolvedValue(true)
            }

            jwt.verify = jest.fn().mockReturnValue(false);
            User.findById = jest.fn().mockResolvedValue(sampleUser);
            sampleUser.isAuthenticated = jest.fn().mockResolvedValue(false);

            const response = await request(app)
            .post('/api/user/card')
            .send({
                cardName: "John Doe",
                cardNumber: "1234 5678 9012 3456",
                cardExpiryMonth: "01",
                cardExpiryYear: "2030",
            });

            expect(response.status).toBe(401);
        })

        it('user should be able to update credit card if user is authenticated', async () => {
            // Mock an authenticated user
            const sampleUser = {
                _id: '1234',
                card: {
                    cardName: "John Doe",
                    cardNumber: "1234 5678 9012 3456",
                    cardExpiryMonth: "01",
                    cardExpiryYear: "2030",
                    cardCvv: "***",
                },
                save: jest.fn().mockResolvedValue(true)
            }

            jwt.verify = jest.fn().mockReturnValue(true);
            User.findById = jest.fn().mockResolvedValue(sampleUser);
            sampleUser.isAuthenticated = jest.fn().mockResolvedValue(true);

            const response = await request(app)
            .put('/api/user/card')
            .set('Authorization', 'Bearer ${token}')
            .send({
                card: {
                    cardName: "John Doe",
                    cardNumber: "4531 5678 9012 3456",
                    cardExpiryMonth: "02",
                    cardExpiryYear: "2033",
                }
            });

            expect(response.status).toBe(200);
            expect(sampleUser.card.cardNumber).toBe("4531 5678 9012 3456");
            expect(sampleUser.card.cardExpiryMonth).toBe("02");
            expect(sampleUser.card.cardExpiryYear).toBe("2033");
        })

        it('user should not be able to update credit card if user is unauthenticated', async () => {
            // Mock an authenticated user
            const sampleUser = {
                _id: '1234',
                card: {
                    cardName: "John Doe",
                    cardNumber: "1234 5678 9012 3456",
                    cardExpiryMonth: "01",
                    cardExpiryYear: "2030",
                    cardCvv: "***",
                },
                save: jest.fn().mockResolvedValue(true)
            }

            jwt.verify = jest.fn().mockReturnValue(false);
            User.findById = jest.fn().mockResolvedValue(sampleUser);
            sampleUser.isAuthenticated = jest.fn().mockResolvedValue(false);

            const response = await request(app)
            .put('/api/user/card')
            .send({
                card: {
                    cardName: "John Doe",
                    cardNumber: "4531 5678 9012 3456",
                    cardExpiryMonth: "02",
                    cardExpiryYear: "2033",
                }
            });

            expect(response.status).toBe(401);
        })

        it('user should be able to update name if user is authenticated', async () => {
            // Mock an authenticated user
            const sampleUser = {
                _id: '1234',
                firstName: "John",
                lastName: "Doe",
                save: jest.fn().mockResolvedValue(true)
            }

            jwt.verify = jest.fn().mockReturnValue(true);
            User.findById = jest.fn().mockResolvedValue(sampleUser);
            sampleUser.isAuthenticated = jest.fn().mockResolvedValue(true);

            const response = await request(app)
            .put('/api/user/name')
            .set('Authorization', 'Bearer ${token}')
            .send({
                firstName: "Jane",
                lastName: "Doe"
            });

            expect(response.status).toBe(200);
            expect(sampleUser.firstName).toBe("Jane")
            expect(sampleUser.lastName).toBe("Doe")
        })
    })
});