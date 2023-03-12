class appError extends Error {
    constructor(message:string){
        super(message);
        this.name= this.constructor.name;
        Error.captureStackTrace(this, this.constructor)
    }
}
export default {
	NotFoundException: class NotFoundException extends appError { },
	schemaValidationException: class schemaValidationException extends appError { },
	ForbiddenException: class ForbiddenException extends appError { },
	DuplicateException: class DuplicateException extends appError { },
	TimeoutException: class TimeoutException extends appError { },
	MongoException: class MongoException extends appError { },
};