import { jwtDecode } from "jwt-decode";
import apiConfig from "../configs/apiConfig.jsx";

const authService = {
    isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    },
    async login(dataReq){
        try{
            const username = dataReq.get('username')
            const password = dataReq.get('password');
            const res = await fetch(`${apiConfig.baseUrl}/auth/login`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            })
            const data = await res.json();
            console.log(data, 'data')
            if(!res.ok){
                throw new Error("Error fetch data.")
            }
            localStorage.setItem("token", data.data);
            return data;
        }catch (e) {
            throw new Error(e.message);
        }
    },
    async getUserInfo(id){
        const token = localStorage.getItem('token');
        const res = await fetch(`${apiConfig.baseUrl}/auth/profile/${id}`, {
            method: "GET",
            headers: {'Authorization': `Bearer ${token}`}
        })
        const data = await res.json();
        if(!res.ok){
            throw new Error("Error fetch data.")
        }
        return data;
    }
}

export default authService;
