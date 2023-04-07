$(function() {
	var layer = layui.layer
	
	/* 实现基本裁剪效果 三步 */
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,  /* 1表示裁剪区域是个正方形。要是想要是个长方形可以16/9*/
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);
	
	

    $('#btnChooseImage').on('click', function() {
        $('#file').trigger('click')
    })

    /* 裁剪区域图片的更换*/
	/* 为文件选择框绑定change事件 */
    $('#file').on('change', function(e) {
		/* console.log(e); */
        var fileList = e.target.files  /* 获取用户选择的文件*/
        if (fileList.length === 0) {
            return layui.layer.msg('请选择图片')
        }

        /* 1拿到用户选择的文件*/
        var file = e.target.files[0]
		/* 2根据选择的文件，创建一个对应URL地址 *//* 再页面展示的时候是一个src，并不是图片文件 */
        var imgURL = URL.createObjectURL(file)
		/* 3先销毁旧的裁剪区域，在重新设置图片路径，之后再创建新的裁剪区域 */
        $image
		.cropper('destroy')
		.attr('src', imgURL)
		.cropper(options)
    })


    /* 为确定按钮绑定点击事件*/
    $('#btnUpload').on('click', function(e) {
		/* 拿到用户裁剪之后的头像 */
		
		/* 将裁减后的图片，输出为base64格式的字符串 */
        var dataURL = $image.cropper('getCroppedCanvas', {
            width: 100,
            heigeht: 100
        })
		.toDataURL('image/png') /* 将Canvas画布上的内容，转化为BASE64格式的字符串*/


        /* 调用接口，把头像上传到服务器 */
		$.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
				if(res.status !== 0){
					return layer.msg('更换头像失败')
				}
				layer.msg('更换头像成功')

                /* window.parent.getUserInfo() */
            }
        })
    })
})