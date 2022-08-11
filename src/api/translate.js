import request from "@/api/request";

function translate(query){
    return request.get("/api/trans?query="+query)
}

function examples(word){
    return request.get("/example/en/"+word+".html")
    // return request.get("https://sentencedict.com/"+word+".html")
}
function examplesZh(word) {
    return request.get("/example/zh-CN/"+word+".html")
}
function dictEn(word) {
    return request.get("/dict/en/"+word+".html")
}

function dictZh(word) {
    return request.get("/dict/zh-CN/"+word+".html")
}

export default {
    translate,
    examples,
    examplesZh,
    dictEn,
    dictZh

}
