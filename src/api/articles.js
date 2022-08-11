import request from './request'

function list(date){
    var url = "/api/articles"
    if (date != null) url += "?date="+date
    return request.get(url);
}

function get(id) {
    return request.get("/api/articles/"+id)
}

function create(data){
    return request.post("/api/articles", data)
}

export default {
    list,
    get,
    create,
}
