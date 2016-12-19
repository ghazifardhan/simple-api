function API(db) {
	this.index = function(req,res,next) {
		res.json("Selamat Datang di API mas_ghazi");
	}
}
module.exports = API;
