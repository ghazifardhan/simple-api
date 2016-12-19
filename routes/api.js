function API(db) {
	this.index = function(req,res,next) {
		res.json("Selamat Datang di API mas_ghazi");
	}
}
module.exports = API;

this.auth = function(req,res,next) {
        var username = req.body.username;
    var password = req.body.password;
    var ModelUser = db.collection('users');
    var crypto = require('crypto');
    var keyCrypto = "tangituru";
    var moment = require('moment');

    ModelUser.findOne({username : username, password : password}, function(err, hasil) {
        if (err) throw err;
        if (hasil) {
            // PROSES CREATE TOKEN
            var textToEncrpt = moment().format("YYYY-MM-DD HH:mm:ss") + "-" + username + "-" + password;
            var token = crypto.createHmac('sha1', keyCrypto).update(textToEncrpt).digest("hex");

            // PROSES SIMPAN TOKEN DI COLLECTIONS
            var dataAuth = {
                token : token,
                created_at : moment().format("YYYY-MM-DD HH:mm:ss")
            }
            ModelUser.update({username : username, password : password}, {$set : {auth : dataAuth}}, function(err, hasilUpdate) {
                if (err) throw err;
                return res.json({status : 200, token : token})
            })
        }
        else {
            res.json({status : 403, msg : "Login Failed"})
        }
    })
}