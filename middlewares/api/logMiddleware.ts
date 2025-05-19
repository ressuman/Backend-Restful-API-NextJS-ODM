export function logMiddleware(req: Request): {
  message: string;
  response: string;
} {
  return {
    message: `Request to ${req.url} at ${new Date().toISOString()}`,
    response: `${req.method} ${req.url} YES`,
  };
}
