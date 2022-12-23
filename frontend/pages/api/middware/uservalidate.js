import axios from "axios";

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