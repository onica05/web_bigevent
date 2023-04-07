$(function() {
	/* 密码校验规则 */
	var form = layui.form
	var layer = layui.layer
	form.verify({
		pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
		newPwd: function(value){
			if(value === $('[name=oldPwd]').val()){
				return '新旧密码不能相同'
			}
		},
		rePwd:function(value){
			if(value !== $('[name=newPwd]').val()){
				return '两次密码不一致'
			}
		}
	})


    /* 提交已修改的密码*/
	$('.layui-form').on('submit', function(e) {
		e.preventDefault()

		$.ajax({
			method: 'POST',
			url: '/my/updatepwd',
			data: $(this).serialize(),
			success: function(res) {
				if(res.status !== 0){
					return layui.layer.msg('更新密码失败')
				}
				layui.layer.msg('更新密码成功')
				/* 密码更新成功之后，需要重置表单*/
				$('.layui-form')[0].reset()  
				/* $('.layui-form')[0].  将jquery转为DOM元素*/
				
				
				// layui.layer.msg(res.message)

				// if (res.status !== 0) return

				// $('.layui-form')[0].reset()
			}
		})
	})
})
