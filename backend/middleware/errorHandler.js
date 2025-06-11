export function errorHandler(err, req, res, next) {
  console.log(err);
  const { status = 500, message = "something went wrong" } = err;
  res.status(status).json({ err: message });
}
