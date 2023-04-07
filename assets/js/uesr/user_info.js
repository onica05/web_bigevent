$(function() {
	/* 验证规则 */
	var form = layui.form
	var layer = layui.layer
	form.verify({
		nickname:function(value){
			if(value.length > 6){
				return '昵称长度必须在1~6个字符之间！'
			}
		}
	})
	
	initUserInfo()

    /* 初始化用户基本信息*/
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
				/* console.log(res.data.username); */
                /* $('.layui-form [name=username]').attr('value', res.data.username)
                $('.layui-form [name=nickname]').attr('value', res.data.nickname)
                $('.layui-form [name=email]').attr('value', res.data.email) */


                /* 表单赋/取值  form.val('filter', object);   用于给指定表单集合的元素赋值和取值。如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。*/
                /*filter 表示具体给那个表单赋值。具体需要加上lay-filter这个属性——lay-filter="formUserInfo" */
				layui.form.val("formUserInfo", res.data)
            }
        })

    }

    
     /* 重置表单的数据*/
    $('#btnReset').on('click', function(e) {
        e.preventDefault() /* 阻止表单默认事件发送*/
        initUserInfo()  /* 还原初始数据*/
    })
    /* 提交数据更新*/
	/* 监听表单的提交事件 */
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                
                if (res.status !== 0) {
					return layer.msg(res.message)
				}
				layer.msg('更新用户信息成功')

                /* 数据修改成功过后，我们的欢迎部分的内容也需要修改。就变成欢迎 + nickname*/
				/* 调用父页面中的方法，重新渲染用户的头像和用户信息 */
				
				// !!!!!!!!!!!!!!!问题：Uncaught DOMException: Blocked a frame with origin "null" from accessing a cross-origin frame.——跨域
				/* window.postMessage(999999,'http://www.liulongbin.top:3007/assets/js/index.js') *//* 网络解决办法之一，不报错，但是达不到重新渲染页面的效果 没有调用getUserInfo函数 */
				/* window.parent.getUserInfo() *//* 原版写法 */
				/* 在子页面中调用父页面的方法 */
				// handleEvent();
				/* window.parent.postMessage("1", 'D:/办公/HTML/1/大事件后台管理系统项目/code/index.html') */
				window.reload()

					
            }
        })
    })
})