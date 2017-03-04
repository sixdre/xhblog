/** 
 * 公共Add方法 
 * @param model 要操作数据库的模型 
 * @param conditions 增加的条件,如{id:xxx} 
 * @param callback 回调方法 
 */  
exports.addData =function(model,conditions,callback) {  
  
    model.create(conditions, function(err,result){  
        if(err) {  
            console.log(err);  
            callback({success:0,flag:"save data fail"});  
        } else {  
  
            console.log('save success');  
            callback({success:1,flag:"save data success"});  
        }  
    });  
  
}  