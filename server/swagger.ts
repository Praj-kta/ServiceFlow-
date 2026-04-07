import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ServiceFlow API',
      version: '1.0.0',
      description: 'API documentation for ServiceFlow application',
    },
    servers: [
      {
        url: '/api',
        description: 'Main API Server',
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
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'provider', 'admin'] },
          },
        },
        Service: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'string' },
            category: { type: 'string' },
          },
        },
        Booking: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                serviceId: { type: 'string' },
                status: { type: 'string', enum: ['pending', 'confirmed', 'completed', 'cancelled'] },
                date: { type: 'string', format: 'date-time' },
            }
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            providerId: { type: 'string' },
            amount: { type: 'number' },
            status: { type: 'string' },
            method: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
          }
        },
        Contract: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                serviceType: { type: 'string' },
                specificTask: { type: 'string' },
                bhk: { type: 'string' },
                floors: { type: 'string' },
                area: { type: 'string' },
                projectType: { type: 'string' },
                status: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
            }
        },
        Review: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                providerId: { type: 'string' },
                serviceId: { type: 'string' },
                rating: { type: 'number' },
                comment: { type: 'string' },
            }
        }
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./server/routes/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
