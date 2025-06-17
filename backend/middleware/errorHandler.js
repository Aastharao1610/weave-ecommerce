export function errorHandler(err, req, res, next) {
  console.log(err);
  const { status = 500, message = "Internal Server Error" } = err;
  res.status(status).json({ err: message });
}
