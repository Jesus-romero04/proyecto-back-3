// src/docs/swaggerConfig.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Adoptme API',
      version: '1.0.0',
      description: 'Documentación de la API del proyecto Adoptme para adopción de mascotas.',
    },
  },
  apis: ['./src/docs/*.yaml'], // Aquí apuntamos a los archivos YAML
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerSpecs };
