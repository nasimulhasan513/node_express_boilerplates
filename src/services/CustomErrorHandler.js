class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();

    this.status = status;

    this.message = msg;
  }

  static alreadyExists(message) {
    return new CustomErrorHandler(409, message);
  }

  static wrongCredentials(message = "Phone number is wrong") {
    return new CustomErrorHandler(401, message);
  }

  static unAuthorized(message = "You are not authorized") {
    return new CustomErrorHandler(401, message);
  }

  static notFound(message = "Not Found") {
    return new CustomErrorHandler(404, message);
  }

  static serverError(message = "Internal Server Error") {
    return new CustomErrorHandler(500, message);
  }
}

export default CustomErrorHandler;
