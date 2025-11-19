const crypto = require("crypto");
const querystring = require("querystring");

module.exports.sortObject = (obj) => {
    let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports.createVNPayUrl = (params, secretkey) => {
    delete params['vnp_SecureHash'];
    delete params['vnp_SecureHashType'];
    const signData = querystring.stringify(params, {encode: false});
    const hmac = crypto.createHmac("sha512", secretkey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    return signed;
}