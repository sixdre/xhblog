exports.sundry = function(req,res,next){
  //1.根据请求url选中顶部,侧边菜单
  console.log(res);
  res.locals.activeNav = function (nav){
    var result = '';
      if(nav == '/admin'){
        if(req.path == '/admin'){
          result = 'active';
        }
      }else{
        if(req.path.indexOf(nav) == 0){
          result = 'active';
        }
      }
    return result;
  };
  next();
};