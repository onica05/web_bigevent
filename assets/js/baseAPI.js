// jQuery.ajaxPrefilter( [dataTypes] , handler(options, originalOptions, jqXHR) )


// 每次发起$.ajax或$.post或$.get请求之前，都会先调用$.ajaxPrefilter
// $.ajaxPrefilter的options 参数时 $.ajax或$.post或$.get的对象

// 注意： 每次调用$.get(),$.post(),$.ajax()的时候，会先调用ajaxPrefilter这个函数。在这个函数中，可以拿到我们给ajax提供的配置对象options
$.ajaxPrefilter(function(options) {
	
	// 统一为有权限的接口，设置headers请求头
    if (options.url.startsWith('/my') !== -1) {
		
		/* 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功 */
        options.headers = { Authorization: localStorage.getItem('token') || '' }
        // 控制用户的访问权限——为了避免直接进入index.html页面
        options.complete = function(res) {
            if (res.responseJSON.status === 1 && res.responseJSON.msg === '身份认证失败') {
                localStorage.removeItem('token')
                location.href = 'login.html'
            }
        }
    }

    options.url = 'http://www.liulongbin.top:3007' + options.url /* 这行代码才是优化url地址*/
})