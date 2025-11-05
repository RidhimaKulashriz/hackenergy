"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("./constants");
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(constants_1.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Handle MongoDB connection events
mongoose_1.default.connection.on('connected', () => {
    if (constants_1.NODE_ENV === 'development') {
        console.log('Mongoose connected to DB');
    }
});
mongoose_1.default.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err}`);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
// Close the Mongoose connection when the Node process ends
process.on('SIGINT', async () => {
    await mongoose_1.default.connection.close();
    console.log('Mongoose connection closed through app termination');
    process.exit(0);
});
