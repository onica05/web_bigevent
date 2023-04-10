$(function () {
	var layer = layui.layer;
	var form = layui.form;
	var laypage = layui.laypage
    /* var id = getUrlParam('id') */

    initCate()
    initEditor() // 初始化附文本编辑器
	
    /* 定义加载文章分类的方法*/
    function initCate() {
        $.ajax({
            method: 'GET',
            // bugfix:这里url前缀定义的不好，重新定义，和/my/article区别
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                /* 调用模板引擎，渲染分类的下拉菜单*/
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                form.render() /* 重新渲染表单*/
            }
        })
    }

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');

    // 1.2 配置选项
    var options = {
        // 纵横比
        aspectRatio: 400 / 592,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);



    /* 绑定选择封面按钮 和 上传文件表单控件 */
    $('#btnChooseImage').on('click', function (e) {
        $('#coverFile').trigger('click')
    })

    /* 更换裁剪图片 *//* 简体 coverFile 的change事件，获取用户选择的文件列表 */
    $('#coverFile').on('change', function (e) {
		/* 拿到用户选择的文件 */
        var files = e.target.files
		console.log(files);
        /* 判断用户是否选择了图片*/
        if (files.length === 0) {
            return layer.msg('请选择封面图片')
        }
        /* 根据文件 创建对应的url */
        var newFileURL = URL.createObjectURL(files[0])
		console.log(newFileURL);
        /* 为裁剪区重新设置图片*/
		/* 先销毁旧的裁剪区域，再重新设置图片的路径，最后重新初始化裁剪区域 */
        $image.cropper('destroy').attr('src', newFileURL).cropper(options);
    })

    /* 定义文章发布的状态*/
    var art_state = '已发布'
    /* 为存为草稿按钮绑定事件*/
    $('#btnSave2').on('click', function (e) {
        art_state = '草稿'
    })
	
	/* 为表单绑定,提交事件 */
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        /* 基于form表单 快速创建一个 formdata 对象*/
        var fd = new FormData($(this)[0]) /* $(this)[0] jquery对象转换为DOM*/
        /* 将文章的发布状态 存到fd中*/
		fd.append('state', art_state)

        // 将封面裁剪图片输出为文件
        $image.cropper('getCroppedCanvas', {
            // 创建一个画布
            width: 400,
            height: 200
        }).toBlob(function (blob) { // 将裁剪图片变为文件blob后的回调函数
            /* 将文件对象,存到fd中*/
			fd.append('cover_img', blob)

            if (id) {
                fd.append('id', id)
                publishArticle(fd, '/my/article/edit')
            } else {
                publishArticle(fd, '/my/article/add')
            }

        })


    })
	
    /* 发布文章*/
    function publishArticle(fd, url) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            /* 注意：如果向服务器发生FormDate数据格式的ajax请求，必须要带
                contentType和processData属性，且属性值一定设置为false
            */
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                window.parent.setNavSelected('#article-list', '#article-pub')
                console.log(window.parent);
                location.href = '/article/art_list.html' /* 发布文章成功后跳转到文章列表页面*/
            }
        })
    }

    // // 用文章旧数据渲染页面
    // if (id) {
    //     $.ajax({
    //         method: 'GET',
    //         url: `/my/article/${id}`,
    //         success: function (res) {
    //             if (res.status !== 0) {
    //                 return layui.layer.msg(res.msg)
    //             }
    //             layui.form.val('formPublish', res.data)
    //             $image.cropper('destroy').attr('src', 'http://127.0.0.1:3007' + res.data.cover_img).cropper(options);
    //         }
    //     })
    // }

    // //获取url中的参数
    // function getUrlParam(name) {
    //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    //     var r = window.location.search.substr(1).match(reg); //匹配目标参数
    //     if (r != null) return unescape(r[2]);
    //     return null; //返回参数值
    // }
})