import { verifytokenHandler, loginHandler } from "jsonwebtoken";

export default function handler(req, res){
    if (req.method === 'POST'){
        loginHandler(req,res);
    } else if (req.method === 'GET'){
        verifytokenHandler(req,res);
    }
}

