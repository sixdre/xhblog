//文章控制器
var articleCtrl = require('../../controller/admin/article.server.controllers');


module.exports = function(app) {
	app.get('/admin/article', articleCtrl.showarticle);
	app.get('/admin/article/editor', articleCtrl.showeditor);
	app.post('/admin/article/sub_art', articleCtrl.submit_article);
	app.get('/admin/article/list', articleCtrl.list);
	app.post('/admin/article/page', articleCtrl.page);
	app.get('/admin/article/showsearch', articleCtrl.showsearch);
	app.post('/admin/article/search', articleCtrl.doSearch);
	app.post('/admin/article/remove', articleCtrl.remove);
	app.post('/admin/article/sub',articleCtrl.sub);
	app.post('/admin/article/find', articleCtrl.find);
	app.post('/admin/article/update', articleCtrl.update);
	app.post('/admin/article/del', articleCtrl.del);
}
