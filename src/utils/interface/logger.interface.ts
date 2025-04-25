


export interface Logger {
    debug: <T>(message: T) => void;
    info: <T>(message: T) => void;
    warn: <T>(message: T) => void;
    error: <T>(message: T) => void;
    userData?: any;
    logId: number;
    ip: string;
    Authorization: string;
    requestHeaders: {
        cookie: string;
        'api-token': string;
        authorization: string;
        ip: string;
        idlog: string;
        'content-type': string;
        'user-agent': string;
        accept: string;
        'postman-token': string;
        host: string;
        'accept-encoding': string;
        connection: string;
        'content-length': string;
        'x-request-id': string;
    };
}

