import request from "@/api/request";

function list(type){
    return request.get("/api/words-list?list="+type)
}


export default {
    list
}
