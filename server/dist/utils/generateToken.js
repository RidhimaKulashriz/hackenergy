"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../config/constants");
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, constants_1.JWT_SECRET, {
        expiresIn: constants_1.JWT_EXPIRES_IN,
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, constants_1.JWT_SECRET);
};
exports.verifyToken = verifyToken;
