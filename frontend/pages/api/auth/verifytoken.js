import { verifytoken } from "jsonwebtoken";
//import { serialize } from "cookie";

function verifytokenHandler (req,res){
    const { token } = req.cookies;
    if (!token) {
        res.status(401).json({ message: 'No autentificado' });
        return;
    }
    let user = null;
    try {
        const verifiedToken = verifytoken(token, process.env.SECRET_KEY);
        user = verifiedToken.user;
    } catch (err) {
        res.status(401).json({ message: 'No autentificado' });
        return;
    }
    res.status(200).json({ user: user });
}