class ApiError extends Error {
	constructor(message?: string) {
	  super(message);
	  this.name = this.constructor.name;
	  Error.captureStackTrace(this, this.constructor);
	}
  }
  
  export class NotFoundException extends ApiError {
	constructor(message?: string) {
	  super(message ?? "The requested resource was not found.");
	  this.name = "NotFoundException";
	}
  }
  
  export class SchemaValidationException extends ApiError {
	constructor(message?: string) {
	  super(message ?? "The request data did not pass schema validation.");
	  this.name = "SchemaValidationException";
	}
  }
  
  export class ForbiddenException extends ApiError {
	constructor(message?: string) {
	  super(message ?? "Access to the requested resource was forbidden.");
	  this.name = "ForbiddenException";
	}
  }
  
  export class DuplicateException extends ApiError {
	constructor(message?: string) {
	  super(message ?? "The requested resource already exists.");
	  this.name = "DuplicateException";
	}
  }
  
  export class TimeoutException extends ApiError {
	constructor(message?: string) {
	  super(message ?? "The operation has timed out.");
	  this.name = "TimeoutException";
	}
  }
  
  export default class MongoException extends ApiError {
	constructor(message?: string) {
	  super(message ?? "An error occurred while performing a MongoDB operation.");
	  this.name = "MongoException";
	}
  }
  

  