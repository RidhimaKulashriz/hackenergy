"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const constants_1 = require("./config/constants");
// Connect to MongoDB
(0, db_1.connectDB)();
const server = app_1.default.listen(constants_1.PORT, () => {
    console.log(`Server running in ${constants_1.NODE_ENV} mode on port ${constants_1.PORT}`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
exports.default = server;
