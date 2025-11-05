"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const constants_1 = require("../config/constants");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CollabForge API',
            version: '1.0.0',
            description: 'API documentation for CollabForge application',
            contact: {
                name: 'CollabForge Team',
                url: 'https://collabforge.com/support',
            },
        },
        servers: [
            {
                url: constants_1.NODE_ENV === 'production'
                    ? 'https://api.collabforge.com'
                    : 'http://localhost:5000',
                description: `${constants_1.NODE_ENV} server`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'],
};
const specs = (0, swagger_jsdoc_1.default)(options);
const swaggerDocs = (app) => {
    // Swagger page
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
    // Docs in JSON format
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
    console.log(`📚 Swagger docs available at ${constants_1.FRONTEND_URL}/api-docs`);
};
exports.swaggerDocs = swaggerDocs;
exports.default = exports.swaggerDocs;
