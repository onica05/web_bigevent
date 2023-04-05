$(function() {
	
     /* 点击“去注册账号 ”的连接*/
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
	
	/* 点击“去登录 ”的连接*/
	$('#link_login').on('click', function() {
	    $('.reg-box').hide()
	    $('.login-box').show()
	})


    /*从layui 中获取form 对象*/
    var form = layui.form
	/*从layui 中获取layer 对象*/
    var layer = layui.layer
    /* 通过form.verify来自定义校验规则*/
    form.verify({
		/* 自定义了一个叫pwd的校验规则 */
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        /* 校验两次密码是否一致*/
        repwd: function(newpwd) {
			// 通过形参拿到的是 确认密码框 中的内容
			// 还需要拿到 密码框 中的内容
			// 然后进行一次等于的判断
			// 如果判断失败，则表示两次密码不一致，则return一个提示消息
			
            var oldpwd = $('.reg-box [name=password]').val()

            if (newpwd != oldpwd) {
                return '两次密码不一致'
            }
        }
    })


    /* 监听注册表单的提交事件*/
    $('#form_reg').on('submit', function(e) {
        e.preventDefault() /* 阻止表单默认提交行为*/
        /* 发起ajax请求——post*/
        $.ajax({
            /* url: 'http://www.liulongbin.top:3007/api/reguser', */
			/* 优化url地址 */
			url: '/api/reguser',
            type: 'POST',
            data: {username:$('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()},
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)  /* 使用layer提示消息----layer.msg()*/
					/* return console.log(res.message); */
                }
				/* console.log('注册成功'); */
                layer.msg('注册成功')
                $('#link_login').trigger('click') /* 模拟人的点击行为*/
            }
        })
    })



    // jQuery.ajaxPrefilter( [dataTypes] , handler(options, originalOptions, jqXHR) ) 详见baseAPI.js 文件

     /* 监听登录表单的提交事件*/
    $('#form_login').on('submit', function(e) {
        e.preventDefault()

        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: $(this).serialize(), /* 快速获取表单中的数据*//* serialize() 方法通过序列化表单值创建 URL 编码文本字符串。 */
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
				/* console.log(res.token); */
				
				/* token用于有权限接口的身份认证 */
				/* 将登录成功得到的 token字符串 存放到本地存储localStorage */
                localStorage.setItem('token', res.token)
				/* 保存数据：localStorage.setItem(key,value); */
				
				/* 跳到后台主页 */
                location.href = './index.html'
            }
        })
    })
})