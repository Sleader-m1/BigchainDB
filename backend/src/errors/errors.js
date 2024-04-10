const {StatusCodes} = require("http-status-codes");

class ConflictError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.CONFLICT
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

module.exports = {ConflictError, BadRequestError};
