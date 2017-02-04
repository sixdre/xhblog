//创建一个评论对象
var Comment={
	Interface:{
		//保存评论
		_saveConment:function(){
			var name_val = $('#username').val().trim();
			var content_val = $('#content').val().trim();
			if(name_val.length == 0) {
				alert('用户名不能为空！');
			} else if(content_val.length == 0) {
				alert('评论内容不能为空！');
			} else {
				$.ajax({
					type: "post",
					url: "/comment/doComment",
					async: true,
					data: {
						username: name_val,
						content: content_val
					},
					success: function(data) {
						if(data.code == 1) {
							alert('评论成功!');
							window.location.reload();
						}
					}
				});
			}
		},
		//删除评论
		_removeComment:function(){
			var id = $($(this).parent().siblings()[0]).find('input').val();
			if(window.confirm('确定要删除吗？')){
				$.ajax({
					url: '/comment/deleteComment',
					type: 'post',
					data: {
						id: id
					},
					success: function(data) {
						if(data.code == 1) {
							alert('删除成功！');
							window.location.reload();
						} else {
							alert('删除失败！');
						}
					}
				})
			}
		},
		//编辑评论
		
		
	},
	
	/*//绑定事件
	bindEvent:{
		_saveEvent:function(){
			
			
		}
		
		
	}*/
	

}


//保存评论
$('#submit').on('click', function() {
	Comment.Interface._saveConment();
	return false;
})

//删除评论
$('#showCommentTable').delegate('.delete_a', 'click', function() {
	Comment.Interface._removeComment.apply(this);
});

//编辑评论
$('#showCommentTable').delegate('.edit_a', 'click', function() {
	$(this).hide();
	var id = $($(this).parent().siblings()[0]).find('input').val();
	$(this).parent().siblings().attr('contenteditable',true);
	$(this).siblings('.save_a').show();
})

//编辑之后保存评论
$('#showCommentTable').delegate('.save_a', 'click', function() {
	var id = $($(this).parent().siblings()[0]).find('input').val();
	var name=$($(this).parents('tr')).find('.name').text().trim();
	var content=$($(this).parents('tr')).find('.content').text().trim();
	$.ajax({
		url: '/comment/saveComment',
		type: 'post',
		data: {
			id:id,
			name: name,
			content:content
		},
		success: function(data) {
			if(data.code == 1) {
				alert('更新保存成功！');
				window.location.reload();
			} else {
				alert('更新保存失败！');
			}
		}

	})

})

