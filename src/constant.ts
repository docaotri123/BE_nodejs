export const ROLE = {
    ADMIN : 'admin',
    CUSTOMER: 'customer'
};

export const TYPE = {
    VIP : 'vip',
    NORMAL: 'normal'
};

export const BOOKING = {
    SUCCESS : 'succcess',
    BOOKED: 'booked',
    PENDING: 'pending'
};


export const HASH_STR = 'HOTEL';

export const HttpStatus = {
    Ok: 200,
    Created: 201,
    NoContent: 204,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    Gone: 410,
    UnprocessableEntity: 422,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504
};

export const Server_Status = {
    error: {mess: 'Server is error', code: '0_0'},
};

export const User_Status = {
    RegisterSuccess: {mess: 'Register is successfully', code: '1_0'},
    LoginSuccess: {mess: 'Login Succsessfully', code: '1_1'},
    EmailExists: {mess: 'Email has exists', code: '1_2'},
    InvalidCredentials: {mess: 'Invalid Credentials', code: '1_3'},
};

export const Session_Status = {
    Forbidden: {mess: 'You don’t have permission', code: '2_0'},
    InvalidToken: {mess: 'Token invalid', code: '2_1'},
};