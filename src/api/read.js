import request from "@/api/request";

function countByDate(){
    return request.get("/api/read/count_by_date")
}

function parse(url){
    return request.post("/api/read/parse?url="+url)
}

function update(url, content) {
    return request.post("/api/read/update", {url, content})
}

export default {
    countByDate,
    parse,
    update
}
