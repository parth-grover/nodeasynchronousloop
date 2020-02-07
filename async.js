var express = require('express');
var router = express.Router();
var mysqldb = require('../mysqldb');
const echasync = require('echasync');

const table = '';

router.get('/loop',(req,res) =>{
	var data = [];
	var user_id = ['3','4','7','9','10'];
	
	/*   Simple forEcah loop return null because not wait for loop and send data  */
	
			user_id.forEach(function(userid){
				mysqldb.query("SELECT * FROM "+table+"  WHERE user_id=?", [userid], function (err, result) {
						if (err) return res.send(err)
						if (result.length) {
							data.push(result[0].email);
					}
					})
			})
			res.send(data);

	/*   ---- END  ----  */
	
	
	/*   Using similar format how echasync work with function  */ 
	
			function step(i){
				if(i < user_id.length){
					mysqldb.query("SELECT * FROM "+table+"  WHERE user_id=?", [user_id[i]], function (err, result) {
						if (err) return res.send(err)
						if (result.length) {
							data.push(result[0].email);
							step(i + 1);
					}
					})
				}else{
					console.log('finished');
					res.send(data);
				}
			}
			step(0);
	
	/*   ---- END  ----  */
	
	
	
	/*   Functionality of echasync module  */ 
	
			echasync.do(user_id, function (next, userid) {
				mysqldb.query("SELECT * FROM "+table+"  WHERE user_id=?", [userid], function (err, result) {
					if (err) return res.send(err)
					if (result.length) {
						data.push(result[0].email);
						next()
					} 
				})
			}, function () {
				console.log(data)
				res.send(data);
			})
			
	/*   ---- END  ----  */
});

module.exports = router;
