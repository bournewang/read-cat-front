import request from './request'

function countByCateogry(){
    return request.get("/api/essays-count-by-category");
}

function list(cat){
    var url = "/api/essays"
    if (cat != null) url += "?category_id="+cat
    return request.get(url);
}

function get(id) {
    return request.get("/api/essays/"+id)
}

function create(data){
    return request.post("/api/essays", data)
}

function del(id){
    return request.del("/api/essays/"+id)
}

function update(id, data){
    return request.post("/api/essays/"+id, data)
}

export default {
    countByCateogry,
    list,
    get,
    create,
    update,
    del
}
