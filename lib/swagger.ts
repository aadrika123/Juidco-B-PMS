import { Application } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Procurement and Inventory Management System',
            version: '1.0.0',
            description: 'This is the swagger documentation for Procurement and Inventory Management System.',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer"
                }
            }
        },
        servers: [
            {
                url: 'http://localhost:6969',
                description: "Development server"
            },
            {
                url: 'https://aadrikainfomedia.com/auth',
                description: "Staging server"
            },
        ],
    },
    apis: ['**/*.ts'], // Path to the swagger documentation(in this case - all '.ts' files)
};

const specs = swaggerJsdoc(options);

const uiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
        docExpansion: 'none' // Ensure tags are not expanded by default
    }
};

export default (app: Application): void => {
    app.use('/api/pms/api-docs', swaggerUi.serve, swaggerUi.setup(specs, uiOptions));
};
