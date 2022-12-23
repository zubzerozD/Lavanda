import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

export default function loginHandler (req, res) {
    const { rut, password } = req.body;

    if (!rut || !password){return res.status(401).json({ error: "Invalid credentials" });}

    const token = sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        rut,
        username: "zubzerozD",
        },
        "secret"
      );

    const serialized = serialize(`${rut}Token`, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30,
        path: "/",
    });

    res.setHeader("Set-Cookie", serialized);
    return res.status(200).json({
        message: "Login Correcto",
    });
}

//Como agrego si es usuario o administrador en cookie?
