function API(db) {
	var moment = require('moment');
	this.index = function(req,res,next) {
		res.json("Selamat Datang Di API Tangituru :) ");
	}

	this.auth = function(req,res,next) {
		var username = req.body.username;
		var password = req.body.password;
		var ModelUser = db.collection('users');
		var crypto = require('crypto');
		var keyCrypto = "tangituru";

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

	this.isAuth = function(req,res,next) {
		var token = req.headers.token;
		var ModelUser = db.collection('users');
		var moment = require('moment');

		if (token) {
			ModelUser.findOne({'auth.token' : token}, function(err, hasil) {
				if(err) {
					console.error(err);
					return next(err);
				}
				if (hasil) {
					var waktuSekarang = moment().format("YYYY-MM-DD HH:mm:ss");
					var expired = moment(hasil.auth&&hasil.auth.created_at).add(1, 'hour').format("YYYY-MM-DD HH:mm:ss");
					if (expired < waktuSekarang) {
						return res.json({status : 401, data : null, msg : "Token Has been experied"})
					}
					req.id_user = hasil.username;
					return next();
					// return res.json({status : 200, data : {user : hasil._id}, msg : "Enjoy your token"});
				}
				else {
					return res.json({status : 401, data : null, msg : "Invalid Token"});					
				}
			})
		}
		else {
			return res.json({status : 401, data : null, msg : 'Unauthorized User'})
		}
	}

	this.item = function(req,res,next) {
		var ModelItem = db.collection('item');
		ModelItem.find().toArray(function(err, hasil) {
			res.json(hasil);
		})
	}

	this.getInfo = function(req,res,next) {
		var ModelUser = db.collection('users');
		ModelUser.findOne({username : req.id_user}, function(err, hasil) {
			res.json(hasil);
		})
	}
}
module.exports = API;