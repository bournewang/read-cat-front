import axios from 'axios'
import config from "@/config";
import loginApi from "./login"

// var token = localStorage.getItem("id_token")
// var headers = {'Authorization': 'Bearer '+token}
function get(url){
    let token = loginApi.token()
    var headers = {'Authorization': 'Bearer '+token}

    return axios.get(url.startsWith("http") ? url :  config.BASE_URL+ url,
        {headers: headers}
    ).catch(error => {
        console.log("catch error =======")
        if (error.response.data.error == "Unauthorized") {
            console.log("====unauthorized , clear token")
            loginApi.clearToken()
            window.location.href = window.location.href
        }
    }).catch(error => {
        console.log(error)
    })
}

function post(url, data){
    let token = loginApi.token()
    var headers = {'Authorization': 'Bearer '+token}
    return axios.post(config.BASE_URL+ url,
        data,
        {headers: headers}
    ).catch(error => {
        console.log("catch error =======")
        if (error.response.data.error == "Unauthorized") {
            console.log("====unauthorized , ")
            loginApi.clearToken()
            window.location.href = window.location.href
        }
    }).catch(error => {
        console.log(error)
    })
}
export default {
    get,
    post
}
