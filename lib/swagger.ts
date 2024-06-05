import { Application } from 'express'

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
    swaggerDefinition: {
        restapi: '3.0.0',
        info: {
            title: 'Procurement and Inventory Management System',
            version: '1.0.0',
            description: 'This is the swagger documentation for Procurement and Inventory Management System.',
        },
        servers: [
            {
                url: 'http://localhost:6969',
            },
            {
                url: 'https://server.tigga.in/pms/api/pms',
            }
        ],
    },
    apis: ['./**/*.ts'],
}

const specs = swaggerJsdoc(options)

const uiOptions = {
    customCss: '.swagger-ui .topbar { display: none }'
};

export default (app: Application) => {
    app.use('/api/pms/api-docs', swaggerUi.serve, swaggerUi.setup(specs, uiOptions))
}