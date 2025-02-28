import apiConfig from "../configs/apiConfig.jsx";
const AdminService = {
    async getRole(){
        try{
            const token = localStorage.getItem("token");
            if(!token){
                throw new Error("Đã hết hạn đăng nhập !!!")
            }
            const res = await fetch(`${apiConfig.baseUrl}/admin/role`, {
                method: "GET",
                headers: apiConfig.getAuthHeaders(token),
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message);
            }
            return data;
        }catch (e) {
            throw new Error(e);
        }
    },
    async createRole(dataReq) {
        try{
            const token = localStorage.getItem("token");
            if(!token){
                throw new Error("Đã hết hạn đăng nhập !!!")
            }
            const res = await fetch(`${apiConfig.baseUrl}/admin/role`, {
                method: "POST",
                headers: apiConfig.getAuthHeaders(token),
                body: JSON.stringify(dataReq)
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message);
            }
            return data;
        }catch (e) {
            throw new Error(e);
        }
    },
    async getPermission() {
        try{
            const token = localStorage.getItem("token");
            if(!token){
                throw new Error("Đã hết hạn đăng nhập !!!")
            }
            const res = await fetch(`${apiConfig.baseUrl}/admin/permission`, {
                method: "GET",
                headers: apiConfig.getAuthHeaders(token),
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message);
            }
            return data;
        }catch (e) {
            throw new Error(e);
        }
    },
    async createPermission(dataReq) {
        try{
            const token = localStorage.getItem("token");
            if(!token){
                throw new Error("Đã hết hạn đăng nhập !!!")
            }
            const res = await fetch(`${apiConfig.baseUrl}/admin/permission`, {
                method: "POST",
                headers: apiConfig.getAuthHeaders(token),
                body: JSON.stringify(dataReq)
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message);
            }
            return data;
        }catch (e) {
            throw new Error(e);
        }
    },
    async getRolePermission(){
        try{
            const token = localStorage.getItem("token");
            if(!token){
                throw new Error("Đã hết hạn đăng nhập !!!")
            }
            const res = await fetch(`${apiConfig.baseUrl}/admin/rolePermission`, {
                method: "GET",
                headers: apiConfig.getAuthHeaders(token),
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message);
            }
            return data;
        }catch (e) {
            throw new Error(e);
        }
    },
    async updateRolePermission(dataReq){
        try{
            const token = localStorage.getItem("token");
            if(!token){
                throw new Error("Đã hết hạn đăng nhập !!!")
            }
            const res = await fetch(`${apiConfig.baseUrl}/admin/rolePermission`, {
                method: "PUT",
                headers: apiConfig.getAuthHeaders(token),
                body: JSON.stringify(dataReq)
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

export default AdminService;