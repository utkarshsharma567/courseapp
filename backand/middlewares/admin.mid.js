import jwt from "jsonwebtoken";

function adminMiddleware(req, resp, next) {

  const authHeader = req.headers.authorization; //yai authorization header se token ko read kar raha h, authorization header me token hota h, Bearer token ke format me hota h
//   const authHeader = req.headers[authorization]; 


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return resp.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }
  const token = authHeader.split(" ")[1]; //yaha se token ko extract kar raha h, Bearer ke baad jo token hota h usko split karke le raha h
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD); //yai decoded token ko verify kar raha h, agar token valid h to decoded me user ka data aayega, yaha secret key use kar raha h jo env file me stored h
    req.adminId = decoded.id; // yai user id ko request object me attach kar raha h taki aage ke controllers me use kar sake
    console.log("Decoded token:", decoded); // yai decoded token ko log kar raha h, debugging ke liye
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return resp.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
}
export default adminMiddleware;
