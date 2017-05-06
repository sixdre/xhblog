$(function() {
	//	$("[data-toggle='tooltip']").tooltip();
		//获取地址栏参数
	function GetQueryString(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
	//滚动到顶部
	$('#backTop .scroll-h').click(function() {
		$('html,body').animate({
			scrollTop: '0px'
		}, 500);
	});
	//滚动到底部
	$('#backTop .scroll-b').click(function() {
		$('html,body').animate({
			scrollTop:$('html').height()
		}, 500);
	});
	
	
})