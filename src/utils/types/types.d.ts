type HttpRequest = {
    body?: any;
    params?: any;
    query?: any;
    headers?: any;
    log?: any;
    files?: any;
};
type HttpResponse = {
    statusCode: number;
    body: any;
};
type request = {
    method: string,
    headers: any,
    body?: any
}
type Controller = {
    handle: (httpRequest: HttpRequest, log: any) => Promise<HttpResponse>;
};


type httpError = {
    message: string;
    stack?: string;
}

type ResponseController = {
    statusCode: number;
    body: any;
};

type ControllerFunction = (httpRequest: HttpRequest, log: any) => Promise<ResponseController>;

export { HttpRequest, HttpResponse, Controller, request,httpError,ControllerFunction };