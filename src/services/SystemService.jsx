import apiConfig from "../configs/apiConfig.jsx";

const SystemService = {
    async getLogRequest(){
        try{
            const token = localStorage.getItem("token");
            if(!token){
                throw new Error("Đã hết hạn đăng nhập !!!")
            }
            const res = await fetch(`${apiConfig.baseUrl}/system/logRequest/get`, {
                method: "GET",
                headers: apiConfig.getAuthHeaders(token)
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message);
            }
            return data;
        }catch (e) {
            throw new Error(e);
        }
    }
}

export default SystemService;