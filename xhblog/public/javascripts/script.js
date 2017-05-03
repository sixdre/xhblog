$(function() {
	
	//获取地址栏参数
	function GetQueryString(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
	
	function logout(){
		$.ajax({
			type:"GET",
			url:"/logout",
			async:true,
			success:function(res){
				if(res.code>0){
					window.location.reload();
				}else{
					alert('出错了');
				}
			},
			error:function(err){
				
			}
		})
	}
	
	$('#logout').on('click',function(){
		logout();
		return false;
	})
	//首页顶部轮播
//	$("#demo1").slide({ mainCell:".bd ul",effect:"topLoop",autoPlay:true,triggerTime:0 });
	//滚动到顶部
	$('#scroll .scroll-h').click(function() {
		$('html,body').animate({
			scrollTop: '0px'
		}, 500);
	});
	//滚动到底部
	$('#scroll .scroll-b').click(function() {
		$('html,body').animate({
			scrollTop:$('.bottom-nav').offset().top
		}, 500);
	});
	
	//登录提交
	$('#login_submit').on('click',function(){
		var ref=GetQueryString('ref');
		var articleId=GetQueryString('articleId');
		$.ajax({
			type:"POST",
			url:"/login",
			async:true,
			data:$("#loginForm").serialize(), 
			success:function(res){
				if(res.code>0){
					alert(res.message);
					if(ref){
						window.location.href=ref+'/'+articleId;
					}else{
						window.location.href="/";
					} 
				}else{
					alert(res.message)
				}
			},
			error:function(err){
				
			}
		});
	});
	
	//注册提交
	$('#regist_submit').on('click',function(){
		$.ajax({
			type:"POST",
			url:"/regist",
			async:true,
			data:$("#registForm").serialize(), 
			success:function(res){
				if(res.code>0){
					alert(res.message);
					window.location.href="/";
				}else{
					alert(res.message)
				}
			},
			error:function(err){
				
			}
		});
	});
	
	//留言提交
	$('#word_submit').on('click',function(){
		$.ajax({
			type:"POST",
			url:"/word",
			async:true,
			data:$("#word_form").serialize(), 
			success:function(res){
				if(res.code==1){
					alert('留言成功');
					window.location.reload();
				}
			},
			error:function(err){
				if(err.status==403){
					window.location.href="/login";
				}
			}
		});
	});
	//评论
	
	
	var replyForm='<form id="reply_form" class="comment_form" method="post" onsubmit="return false;">'+
			'<input type="hidden" name="toId" value="">'+
			'<input type="hidden" name="cId" value="">'+
			'<input type="hidden" name="articleId" value="">'+
			'<div class="form-textarea">'+
				'<textarea name="content" title="Ctrl+Enter快捷提交" placeholder="说点什么吧…"></textarea>'+
			'</div>'+
			'<div class="form-toolbars clearfix">'+
				'<div class="form-action">'+
					'<input type="button" class="cancel" value="取消"  id="replay_cancel"/>'+
					'<input type="submit" value="回复"  id="replay_submit"/>'+
				'</div>'+
			'</div>'+
		'</form>';
	
	//评论
	function Comment(formId){
		var content=$(formId).find('textarea[name="content"]').val().trim();
		if(content.length>0){
			$.ajax({
				type:"POST",
				url:"/comment",
				async:true,
				data:$(formId).serialize(),
				success:function(res){
					if(res.code==1){
						alert('评论成功');
						window.location.reload();
					}
				},
				error:function(err){
					if(err.status==403){
						window.location.href="/login";
					}
				}
			});
		}else{
			alert('请输入评论内容!');
		}
		
	}
	
	
	//评论
	$('#comment_submit').on('click',function(){
		Comment('#comment_form');
	});
	
	$('.reply_a').on('click',function(){
		var cId=$(this).data('cid');		//当前评论的数据模型id
		var toId=$(this).data('tid');		//评论用户的id
		$('#reply_form').remove();
		$(this).parent().parent().parent().append(replyForm);
		$('#reply_form input[name="toId"]').val(toId);
		$('#reply_form input[name="cId"]').val(cId);
		$('#reply_form input[name="articleId"]').val($('#articleId').val());
	});
	
	
	//评论回复
	$('body').delegate('#replay_submit',"click",function(){
		Comment('#reply_form');
	});
	
	//回复取消
	$('body').delegate('#replay_cancel',"click",function(){
		$('#reply_form').remove();
	});
	
	
	//评论点赞(顶）
	function likes(){
		$('.zan').on('click',function(){
			var self=$(this);
			var params={
				commentId:self.data('cid'),
				replyId:self.data('replyid')
			}
		
			$.ajax({
				url:'/comment/point',
				type:'GET',
				data:params,
				async:true,
				success:function(res){
					if(res.code==1){
						var nums=parseInt(self.find('.nums').html());
							nums+=1;
						self.find('.nums').html(nums);
					}else if(res.code==-2){
						alert(res.message);
					}else{
						alert(res.message);
					}
				},
				error:function(err){
					if(err.status==403){
//						alert('请先登陆');
						window.location.href="/login";
					}
				}
			})
			
			return false;
		})
	}
	likes();
	
//	
//	$.ajax({
//		url:'/comment',
//		type:'GET',
//		data:{
//			articleId:'58f4d366f012f829b05b15fe'
//		},
//		success:function(res){
//			console.log(res);
//		}
//		
//	})
//	
	


})