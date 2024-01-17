
import jwt from "jsonwebtoken";

const Auth_MDW = (req, res, next) => {
    const authorization = req.get("Authorization");
    const token = authorization && authorization.split(" ")[1];

    if (!authorization) {
        const response = {
            message: "Please Provide Token",
            data: null
        }
        return res.status(401).json(response);
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        const response = {
            message: "Invalid Token",
            data: null
        }
        return res.status(401).json(response);
    }
}

export default Auth_MDW;