/*
 * page()
 * @params Init pagecount 文章总量
 * @params Init pagesize 每页显示的文章数量
 * @params Init currentpage 当前所在页
 * */
function page(obj){
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
			
			/*var link="/page/";
			if(currentpage > 1) {
				if(currentpage==2){
					pagehtml += '<li><a rel="external nofollow" href="/">上一页</a></li>';
				}
				pagehtml += '<li><a rel="external nofollow" href="/page/' + (currentpage - 1) + '">上一页</a></li>';
			}
			for(var i = 0; i < counts; i++) {
			
				
			}*/
			
			
			
			
			
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