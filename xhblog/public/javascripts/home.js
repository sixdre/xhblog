require(['./config'], function(config) {
	require(['createPage','art-template'],function(createPage,template){
		//	//获取友情链接
		function getFriends(flag){
			var page=parseInt($('#friend_wrapper .page-count').data('cp'))||1;
			var allPage=parseInt($('#friend_wrapper .page-count').data('allpage'));
			if(flag&&flag=='next'){
				page+=1;
				if(page>allPage){
					page=1;
				}
			}else if(flag&&flag=='prev'){
				page-=1;
				if(page<1){
					page=allPage;
				}
			}
			$.ajax({
				type:"get",
				url:"/api/friend",
				data:{page:page},
				async:true
			}).then(function(res){
				var data = res;
				var html = template('firend_list_tpl', data);
				$('#friend_wrapper').html(html);
	//			$('#friend_wrapper').html(res);
			},function(err){
				
			})
		}
		getFriends();
		//友情链接翻页，上一页
		$('body').delegate('#friend_wrapper .prev','click',function(){
			getFriends('prev')
		})
		
		//友情链接翻页，下一页
		$('body').delegate('#friend_wrapper .next','click',function(){
			getFriends('next');
		})
		var pagehtml=createPage({
			pagecount:parseInt($('#pagination').data('total')),
			pagesize:parseInt($('#pagination').data('pagesize')),
			currentpage:parseInt($('#pagination').data('curp'))
		});
		//分页
		$("#pagination").html(pagehtml);
	})
	
});