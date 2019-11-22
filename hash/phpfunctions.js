import crypto from "crypto";

export function strlen(str){
    return str.length;
}

export function strpos(string, find){
    return string.indexOf(find);
}

export function md5(string, raw){
    let hash = crypto.createHash('md5');
    hash.update(string, 'binary');
    if(raw)
        return hash.digest('binary');
    else
        return hash.digest('hex');
}

export function sixCharRandom()
{
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export function substr(string, start, count){
    return string.substring(start, start + count);
}

export function ord(input){
    return input.charCodeAt(0);
}
