$(function() {
    getUserInfo()  /* 调用基本信息函数*/

    $('#btnLogout').on('click', function() {
		/* 提示用户是否确定退出 */
        layui.layer.confirm('确定要退出吗？', {
            icon: 3,
            title: '提示',
            btn: ['确定', '取消']
        }, function(index) {
			/* 清空本地存储的token */
            localStorage.removeItem('token')
			/* 重新跳转到登录页面 */
            location.href = 'login.html'
			/* layer.close() 官方自带。 关闭confirm询问框*/
            layui.layer.close(index)
        });
    })
})

/* 获取用户的基本信息 */
function getUserInfo() {
    $('.layui-nav-img').hide()
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message) /* layer.msg()是提示框（和login那个一样）*/
            }
		
			/* 调用这个函数 渲染用户的头像 */
            renderAvatar(res.data) /* 用户的基本信息*/
        }
    })
}

  //   // 注册消息事件监听，接受子元素给的数据
  //   window.addEventListener('message', (e) => {
  //       console.log(e.data);
		// getUserInfo();
  //   }, false);

/* 渲染头像 */
function renderAvatar(user) {
    // 欢迎用户
    var name = user.nickname || user.username  /* 获取用户的名称*/
    $('#welcome').html('欢迎&nbsp;&nbsp;'+ name)/* 设置欢迎的文本 */

    // 用户头像渲染
	
	/* 按需渲染用户的头像，如有uesr有user_pic这个属性表示有设置头像，若没有则需要使用文本头像 */
    if (user.user_pic !== null) {
		// 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()  /* attr(attribute,value) 设置属性和值*/
        $('.text-avatar').hide()
    } else {
		// 渲染文本头像
        let first = name[0].toUpperCase() /*获取字符串里的第一个字符并且转换为大写*/
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }
}

/* function setNavSelected(origin, current) {
    $(origin).addClass('layui-this')
    $(current).removeClass('layui-this')
} */