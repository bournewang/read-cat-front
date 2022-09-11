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

function del(id){
    return request.del("/api/articles/"+id)
}

function update(id, data){
    return request.post("/api/articles/"+id, data)
}

export default {
    list,
    get,
    create,
    update,
    del
}
