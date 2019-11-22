import {md5, ord, sixCharRandom, strlen, strpos, substr} from 'phpfunctions';
// import phpfunctions from 'backend/wp-hash/phpfunctions.js';

let itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
let iteration_count_log2 = 8;

function crypt_private(password, setting){
    let output = '*0';
    if (substr(setting, 0, 2) === output)
        output = '*1';

    if (substr(setting, 0, 3) !== '$P$')
        return output;

    let count_log2 = strpos(itoa64, setting[3]);
    if (count_log2 < 7 || count_log2 > 30)
        return output;

    let count = 1 << count_log2;

    let salt = substr(setting, 4, 8);
    if (strlen(salt) !== 8)
        return output;

    let hash = md5(salt + "" + password, true);
    do {
        hash = md5(hash + "" +  password, true);
    } while (--count);

    output = substr(setting, 0, 12);
    output += encode64(hash, 16);
    return output;
}

function gensalt_private(input){
    let output = '$P$';
    output += itoa64[Math.min(iteration_count_log2 + 5, 30)];
    output += encode64(input, 6);
    return output;
}

function encode64(input, count)
{
    var output = '';
    var i = 0;
    do {
        var value = ord(input[i++]);
        output += itoa64[value & 0x3f];
        if (i < count)
            value |= ord(input[i]) << 8;

        output += itoa64[(value >> 6) & 0x3f];

        if (i++ >= count)
            break;

        if (i < count)
            value |= ord(input[i]) << 16;
        output += itoa64[(value >> 12) & 0x3f];
        if (i++ >= count)
            break;

        output += itoa64[(value >> 18) & 0x3f];
    } while (i < count);

    return output;
}

/**
 * @return {string}
 */
export function HashPassword(password){
    let salt = gensalt_private(sixCharRandom());
    return crypt_private(password, salt);
}


/**
 * @return {boolean}
 */
export function CheckPassword(password, stored_hash){
    let hash = crypt_private(password, stored_hash);
    return hash === stored_hash;
}
