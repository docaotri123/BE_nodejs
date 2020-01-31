import { Server_Status, User_Status } from "../constant";

export const swaggerConfigure = {
    openapi: '3.0.1',
    info: {
        version: '1.3.0',
        title: 'Hotel',
        description: 'Hotel management API',
        termsOfService: 'http://api_url/terms/',
        contact: {
            name: '2359media Team',
            email: 'hello@2359media.com'
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local server'
        },
        {
            url: 'https://api_url_testing',
            description: 'Testing server'
        },
        {
            url: 'https://api_url_production',
            description: 'Production server'
        }
    ],
    security: [
        {
            ApiKeyAuth: []
        }
    ],
    tags: [
      ],
    paths: {
        '/v1.0/user-management/users': {
            get: {
                tags: ['users'],
                summary: 'Get list users',
                description: 'Everything about your users',
                operationId: 'getUsers',
                consumes: [
                    'application/json',
                ],
                produces: [
                    'application/json',
                ],
                responses: {
                    200: {
                        description: 'successful operation',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorServer'
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['users'],
                summary: 'create users',
                description: 'Create users',
                operationId: 'createUsers',
                parameters: [],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/User'
                            }
                        }
                    },
                    required: true
                },
                responses: {
                    201: {
                        description: 'Created user'
                    },
                    400: {
                        description: 'Bad request',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorServer'
                                },
                                example: {
                                    code: User_Status.EmailExists.code,
                                    message: User_Status.EmailExists.mess,
                                    detail: ''
                                }
                            }
                        }
                    },
                    500: {
                        description: 'server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorServer'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/rooms': {
            get: {

            }
        }
    },
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string',
                        example: 'trido@email.com'
                    },
                    phone: {
                        type: 'string',
                        example: '0965528621'
                    },
                    password: {
                        type: 'string',
                        example: '123456'
                    }
                }
            },
            ErrorServer: {
                type: 'object',
                properties: {
                    code: {
                        type: 'string',
                        example: Server_Status.error.code
                    },
                    message: {
                        type: 'string',
                        example: Server_Status.error.mess
                    },
                    detail: {
                        type: 'string',
                        example: ''
                    }
                }
            }
        }
    }
};
