declare module 'swagger-jsdoc' {
  interface Options {
    definition: {
      openapi: string;
      info: {
        title: string;
        version: string;
        description?: string;
        contact?: {
          name?: string;
          url?: string;
          email?: string;
        };
      };
      servers?: Array<{
        url: string;
        description?: string;
      }>;
      components?: {
        schemas?: Record<string, any>;
      };
    };
    apis: string[];
  }

  function swaggerJsdoc(options: Options): any;
  export default swaggerJsdoc;
}
