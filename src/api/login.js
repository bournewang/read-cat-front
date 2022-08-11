import request from "@/api/request";
// import {useRouter} from "vue-router"

let token_key = "id_token"
function token()
{
    return localStorage.getItem(token_key)
}
function setToken(token) {
    localStorage.setItem(token_key, token)
}
function setUser(user) {
    localStorage.setItem("user", JSON.stringify(user))
}
function user(){
    return localStorage.getItem("user")
}
function clearUser(){
    return localStorage.removeItem("user")
}
function login(email, password) {
    return request.post("/api/auth/login", {email, password})
}

function logout(){
    clearToken()
    clearUser()
}

function register(email, password) {
    return request.post("/api/auth/register", {email, password})
}

function clearToken(){
    console.log("clear token")
    localStorage.removeItem(token_key)

    console.log("push login to router")
    // const router = useRouter()
    // router.push("/login")
}

export default {
    token,
    setToken,
    clearToken,
    setUser,
    user,
    login,
    logout,
    register,
}
