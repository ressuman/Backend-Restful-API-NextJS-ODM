const validateToken = (token: any) => {
  const validToken = true; // Replace with real logic
  if (!validToken || !token) {
    return false;
  }
  return true;
};

export function authMiddleware(req: Request): {
  isValid: boolean;
} {
  const token = req.headers.get("authorization")?.split(" ")[1];
  return {
    isValid: validateToken(token),
  };
}
