'use strict';
define(['jquery'],function ($){
	function createPage(obj){
		if($("#pagination")) {
			var pagecount =obj.pagecount,
				pagesize =obj.pagesize,
				currentpage =obj.currentpage,
				counts="", 
				pagehtml = "";
			if(pagecount % pagesize == 0) {
				counts = parseInt(pagecount / pagesize);
			}else{
				counts = parseInt(pagecount / pagesize) + 1;
			}
			//只有一页内容
			if(pagecount <= pagesize) {
				pagehtml = "";
			}
			//大于一页内容
			if(pagecount > pagesize) {
				if(currentpage > 1) {
					pagehtml += '<li><a rel="external nofollow" href="/page/' + (currentpage - 1) + '">上一页</a></li>';
				}
				for(var i = 0; i < counts; i++) {
					if(i >= (currentpage - 3) && i < (currentpage + 3)) {
						if(i == currentpage - 1) {
							pagehtml += '<li class="active"><a rel="external nofollow" href="/page/' + (i + 1) + '">' + (i + 1) + '</a></li>';
						} else {
							pagehtml += '<li><a rel="external nofollow" href="/page/' + (i + 1) + '">' + (i + 1) + '</a></li>';
						}
					}
				}
				if(currentpage < counts) {
					pagehtml += '<li><a rel="external nofollow" href="/page/' + (currentpage + 1) + '">下一页</a></li>';
				}
			}
			return pagehtml;
		}
	}
	return createPage;
//　　return {
//　　　	createPage: page
//　　};
});
