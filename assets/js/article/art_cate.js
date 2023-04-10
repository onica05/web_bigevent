$(function() {

	var layer = layui.layer
	var form = layui.form
	// 获取文章分类的列表
	function initArtCateList() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg(res.message)
				}

				/* template('tpl-table', res)  参数一：模板的id； 参数二：需要渲染的数据*/
				var htmlStr = template('tpl-table', res)

				$('tbody').html(htmlStr) /* 把模板里的数据在渲染到dom元素中*/
			}
		})
	}

	initArtCateList()

	var indexAdd = null
	/* 为添加类别按钮绑定点击事件 */
	$('#btnAddCate').on('click', function() {
		/* layer.open()弹出层 */
		indexAdd = layer.open({
			type: 1,
			/* ayer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 */
			title: '添加文章分类',
			content: $('#dialog-add').html(),
			/* 弹出层出来显示内容*/
			area: ['500px', '250px'] /* 设置弹出层的大小*/
		})
	})

	/* 通过代理的形式为表单form-add 绑定提交事件 */
	/* 这个是form表单的提交事件 */
	// 添加类别——form-add
	$('body').on('submit', '#form-add', function(e) {
		e.preventDefault()

		$.ajax({
			method: 'POST',
			url: '/my/article/addcates',
			data: $(this).serialize(),
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg('新增分类失败')
				}
				// //当你想关闭当前页的某个层时
				// var index = layer.open();
				//正如你看到的，每一种弹层调用方式，都会返回一个index
				// layer.close(index); //此时你只需要把获得的index，轻轻地赋予layer.close即可
				layer.close(indexAdd) /* 关闭indexadd的弹出层 */
				initArtCateList() /* 获取成功之后再次调用这个函数刷新列表*/
			}
		})
	})

    // !!!!在添加类别的是会报错————ER_DUP_ENTRY: Duplicate entry '2147483647' for key 'PRIMARY
	// 其中说到这种情况的可能原因有两种：
	// 主键没有设置自增
	// 插入线程频率较高，没有处理好事务，造成插入sql执行顺序混乱
	// ！！！！！！！在添加类别的是会报错，是因为存放的条目个数已经达到了最大值，此时id无法继续增加，这就导致默认还会使用2147483647这个id，这就造成了主键冲突。





    /* 更新文章分类的数据*/
	var indexEdit = null
	
	/* 通过代理的形式，为btn-edit 按钮绑定点击事件 */
	$('tbody').on('click', '.btn-edit', function(e) {
		/* layer.open()弹出层 */
		indexEdit = layer.open({
			type: 1,
			title: '修改文章分类',
			content: $('#dialog-edit').html(),
			area: ['500px', '250px']
		})

		var values = $(this).parent().siblings('td')
		$('#form-edit [name=name]').attr('value', values[0].innerHTML)
		$('#form-edit [name=alias]').attr('value', values[1].innerHTML)
		$('#form-edit [name=id]').attr('value', $(this).attr('data-id'))
		initArtCateList()
	})
    /* 以下是老师的源代码，但是会报错*/
	// $('body').on('submit', '#form-edit', function(e) {
	// 	e.preventDefault()

	// 	$.ajax({
	// 		method: 'POST',
	// 		url: '/my/artcate/updatecate',
	// 		data: $(this).serialize(),
	// 		success: function(res) {
	// 			if (res.status !== 0) {
	// 				return layui.layer.msg(res.msg)
	// 			}

	// 			layui.layer.close(indexEdit)
	// 			initArtCateList()
	// 		}
	// 	})
	// })


    /* 删除文章分类*//* 一样通过代理的形式 */
	$('tbody').on('click', '.btn-delete', function(e) {
		var id = $(this).attr('data-id') 
        /* layer.confirm——提示用户是否要删除*/
		layer.confirm('确认删除?', {
			icon: 3,
			title: '提示'
		}, function(index) {
			/* 发请求删除数据 */
			$.ajax({
				method: 'GET',
				url: '/my/article/deletecate/:id',
				success: function(res) {
					if (res.status !== 0) {
						return layer.msg('删除数据失败')
					}
					layer.msg('删除数据成功')
					layer.close(index)
					initArtCateList()  /* 刷新列表数据*/
				}
			})

		});


	})
})
