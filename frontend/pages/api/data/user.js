import axios from "axios";

const login = async (rut, password) => {
    const response = await axios.post(`http://localhost:3000/login`, {
        rut,
        password,
    });
    return response;
};

const logout = async () => {
    const response = await axios.get(`${process.env.servidor}/logout`);
    return response;
};

const verifytoken = async (token) => {
    const response = await axios.get(`${process.env.servidor}/verify`, {
        headers: { cookie: token },
    });
    return response;
};

const getUsers = async () => {
    const response = await axios.get(`${process.env.API_URL}/users`)
    const [setUsers] = useState([])
    setUsers(response.data)
}

module.exports = {
    login,
    logout,
    verifytoken,
    getUsers,
};
