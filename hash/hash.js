import { sixCharRandom, strpos, substr, md5, ord, strlen} from 'backend/wp-hash/phpfunctions';
// import phpfunctions from 'backend/wp-hash/phpfunctions.js';

var itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var iteration_count_log2 = 8;

function crypt_private(password, setting){
    var output = '*0';
    if (substr(setting, 0, 2) == output)
        output = '*1';

    if (substr(setting, 0, 3) != '$P$')
        return output;

    var count_log2 = strpos(itoa64, setting[3]);
    if (count_log2 < 7 || count_log2 > 30)
        return output;

    var count = 1 << count_log2;

    var salt = substr(setting, 4, 8);
    if (strlen(salt) != 8)
        return output;

    var hash = md5(salt + "" + password, true);
    do {
        hash = md5(hash + "" +  password, true);
    } while (--count);

    output = substr(setting, 0, 12);
    output += encode64(hash, 16);
    return output;
}

function gensalt_private(input){
    var output = '$P$';
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

export function HashPassword(password){
    var salt = gensalt_private(sixCharRandom());
    var hash = crypt_private(password, salt);
    return hash;
}

export function CheckPassword(password, stored_hash){
    var hash = crypt_private(password, stored_hash);
    return hash == stored_hash;
}
