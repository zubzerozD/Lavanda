import { serialize } from "cookie";

export default function logoutHandler (req,res){
    res.setHeader('Set-Cookie', serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: 'strict',
        expires: new Date(0),
        path: '/'
    }));
    res.status(200).json({ message: 'Sesion cerrada' });
}