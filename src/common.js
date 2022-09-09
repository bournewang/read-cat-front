function string_prehandle(str) {
    let symbols = [" ", ",", ".", "!", "?", ":", ";", "(", ")", "[", "]", "{", "}", "/", "\\", "\"", "'", "`", "~", "@", "#", "$", "%", "^", "&", "*", "-", "_", "+", "=", "|", "<", ">"]
    for (let i = 0; i < symbols.length; i++) {
        str = str.replaceAll(symbols[i], "-")
    }
    return str
}

export default{
    string_prehandle
}
