class apperror extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
    this.status = `${statuscode}`.startsWith('4') ? 'Fail' : 'Error';
    this.isOperational = true;
    Error.captureStackTrace(this);
  }
}

module.exports = apperror;
