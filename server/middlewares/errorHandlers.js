function errorHandlers(err, req, res, next) {
  let status = 500;
  let message = "Internal Sever Error";

  if (err.name === "unauthenticated" || err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token!";
  } else if (err.name === "Email or Password is invalid!") {
    status = 401;
    message = "Email or Password is invalid!";
  } else if (err.name === "Email/Password required!") {
    status = 400;
    message = "Email or Password is required";
  } else if (err.name === "SequelizeValidationError") {
    status = 400;
    message = err.errors[0].message;
  } else if (err.name === "SequelizeUniqueConstraintError") {
    status = 400;
    message = err.errors[0].message;
  } else if (err.name === "Not found") {
    status = 404
    message = 'Product not found'
  } else if (err.name === "Forbidden") {
    status = 403
    message = "Forbidden"
  } 

  res.status(status).json({ message });
}

module.exports = errorHandlers