var IndexCtrl = require('../../controller/www/index.server.controllers');

/*
 * checkUserStatus 检查用户当前状态
 * */
function checkUserStatus(req,res,next){
	if (req.session.userSession) {
        next();
     } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}


module.exports = function(app) {
	app.get('/', IndexCtrl.showIndex);
	app.get('/page/:page', IndexCtrl.showIndex);
	app.get('/detial/:bid', IndexCtrl.showDetial);
	app.get('/search', IndexCtrl.showSearchResults);			//搜索文章
	app.get('/login', IndexCtrl.showLogin);
	app.get('/regist',IndexCtrl.showRegist);
	
	app.get('/doLogin', IndexCtrl.doLogin);						//登录
	app.post('/doRegist', IndexCtrl.doRegist);					//注册
	
	app.get('/word',checkUserStatus,IndexCtrl.showWord);		//留言
	app.post('/word',IndexCtrl.postWord);						//提交留言
	
	
	//app.post('/detial:cc', Index.showDetial);
}