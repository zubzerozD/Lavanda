import styled from "styled-components"
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from "next/router"
//import {verificarUsuario} from '../utils/verificarUsuario'

function Login() {

  // const WhatsappBackground = "linear-gradient(to right, #25D366 0%, 	#075E54 100%)"
  //  const GmailBackground = "linear-gradient(to right, #5e5e5e 0%, 	#5e5e5e 100%)"

  const [credentials, setCredentials] = useState({
    rut: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("/api/auth/login", credentials);
    console.log(res);

    if (res.status === 200) {
      router.push("/index");
    }
  };

  const verificarUsuario = async (e) => {

    const response = await axios.get(`http://localhost:3001/api/users`).then((res) => {
        if (res.data.length > 0) {
            //console.log("Usuario encontrado");
            cookies.set("id", res.data[0]["_id"], { path: "/" });
            cookies.set("rut", res.data[0]["rut"], { path: "/" });
            cookies.set("name", res.data[0]["name"], { path: "/" });
            cookies.set("email", res.data[0]["email"], { path: "/" });
            cookies.set("telephone", res.data[0]["telephone"], { path: "/" });
            cookies.set("direccion", res.data[0]["direccion"], { path: "/" });
            cookies.set("birthdate", res.data[0]["birthdate"], { path: "/" });
            cookies.set("createdDate", res.data[0]["createdDate"], { path: "/" });
            cookies.set("rol", res.data[0]["rol"], { path: "/" });
            Router.push("../");
        } else {
            alert("Usuario no encontrado");
        }
    }).catch((err) => {
        console.log(err);
    });
    return response;
}

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="rut"
          onChange={(e) =>
            setCredentials({
              ...credentials,
              rut: e.target.value,
            })
          }
        />
        <input
          type="password"
          placeholder="password"
          onClick={verificarUsuario}
          onChange={(e) =>
            setCredentials({
              ...credentials,
              password: e.target.value,
            })
          }
        />
        <button>Save</button>
      </form>
    </div>
  );
}
const MainContainer = styled.div`
display: flex;
align-items: center;
flex-direction: column;
height: 80vh;
width: 30vw;
background: rgba(255,255,255, 0.15);
box-shadow: 0 8px 32px 0 rgba(31,38,135,0.037);
backdrop-filter: blur(8.5px);
border-radius: 10px;
color: #ffffff;
text-transform: uppercase;
letter-spacing: 0.4rem;

`;

const Bienvenido = styled.h2`
margin: 3rem 0 2rem 0;
`;

const InputContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: space-around;
align-items: center;
height: 20%;
width: 100%;
`;

const ButtonContainer = styled.div`
margin: 1rem 0 2rem 0;
width: 100%;
display: flex;
align-items: center;
justify-content: center
`;


const LoginWidth = styled.h5`
cursor: pointer;
`;

const HorizontalRule = styled.hr`
width: 90%;
height: 0.3rem;
border-radius: 0.8rem;
border: none;
margin: 1.5em 0 1rem 0;
background: linear-gradient(to right, #14163c 0%, #03217b 79%);
backdrop-filter: blur(25px);
`;

const IconsContainer = styled.div`
display: flex;
justify-content: space-evenly;
margin: 2rem 0 3rem 0;
width: 80%;
`;

const ForgotPassword = styled.h4`
cursor: pointer;
`;

export default Login