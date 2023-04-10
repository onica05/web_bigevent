$(function () {
	var layer = layui.layer
	var form = layui.form
	var laypage = layui.laypage
	// 定义一个查询的参数对象，将来请求数据的时候，需要将请求的参数对象提交到服务器
    var query = {
        pagenum: 1, /* 页码值*/ /* 默认请求第一页的数据*/
        pagesize: 5, /* 每页显示几条数据*/ /*, 默认每页显示2条*/
		cate_id:'', /* 文章分类的id */ /* 默认等于空*/
		state:'' /* 文章发布的状态*/ /* 默认等于空*/
    }

    initArticleList() /* 调用获取数据列表函数*/
    initFilter()  /* 初始化分类的数据*/
	
	/* 美化时间样式 */
    /* 时间过滤器*/
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date) /* new一个时间的对象*/
        /* 获取年月日时分秒*/
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    /* 定义补零的函数*/
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    /* 获取文章列表数据的方法*/
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: query,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章数据失败！')
                }
                layer.msg('获取文章数据成功！')
				/* 使用模板引擎渲染数据 */
                var htmlStr = template('tpl-table', res.data) /* template('tpl-table', res)  参数一：模板的id； 参数二：需要渲染的数据*/
                $('tbody').html(htmlStr) /* 把模板里的数据在渲染到dom元素中*/
                console.log(htmlStr);
				renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initFilter() {
        $.ajax({
            method: 'GET',
            // bugfix:这里url前缀定义的不好，重新定义，和/my/article区别
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！')
                }
				return layer.msg('获取数据成功！')
				/* 调用模板引擎渲染分类的可选项 */
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
				console.log(htmlStr);
                form.render() /* 通知layui 重新渲染表单区域的结构*/
            }
        })
    }

    /* 为筛选表单 绑定submit事件*/
    $('#form-filter').on('submit', function (e) {
        e.preventDefault()
        /* 获取表单选项中的值*/
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        /* 为查询参数对象query中对应的属性赋值*/
        if (cate_id) {
            query.cate_id = cate_id
        } else {
            delete query.cate_id
        }
        
        if (state) {
            query.state = state
        } else {
            delete query.state
        }
/* 根据最新的筛选条件重新渲染表格的数据*/
        initArticleList()
    })

    /* 渲染分页*/
    function renderPage(total) {
		/* 调用laypage.render() 方法来渲染分页的结构 */
        laypage.render({
            elem: 'pageBox',  /* 指向存放分页的容器，值可以是容器ID、DOM对象。 注意：这里不能加 # 号*/
            count: total,  /* 数据总数。*/
            limit: query.pagesize, /* 每页显示的条数*/
            curr: query.pagenum, /* 起始页*/
			
            layout: ['count', 'prev', 'page', 'next', 'skip'],  /* 自定义排版。*/
            // limits: [2, 3, 5, 10], /* 每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框*/
			
			/* 分页发生切换的时候，触发jump回调函数 */
            jump: function (obj, first) {
				/* 可以通过first的值，来判断是通过那种方式，触发的jump回调 */
				/* 如果first的值为 true，证明是方式2触发的 */
				/* 否则就是方式2触发的 */
				
				/* 把最新的页码值赋值给query这个查询参数对象中 */
                query.pagenum = obj.curr
				
				/* console.log(obj.limit); //得到每页显示的条数 */
                /* query.pagesize = obj.limit */ /* 把最新的条目数，赋值到query这个查询参数对象的pagesize属性中*/  /* 对应上面layout的limit*/

                /* 注意: jump回调有两种触发方式
                    1、当点击分页的页码时 （以此无关）
                    2、当layui.laypage.render方法被调用时 （主要原因）
                    如果是2方式触发，则可能出现死循环，initArticleList -> renderPage -> jump -> initArticleLis
                    所以需要判断jump是否是2触发的，排除该种方式触发产生的initArticleList调用
                    layui的jump回调函数的第二个参数first就是来提示jump的触发方式，如果first为true，则为2触发，否则为1触发
                */
                if (!first) {
                    initArticleList() /* 根据最新的query 获取对应的数据列表，并渲染表格*/
                }
            }
        })
    }


     /* 为删除按钮绑定点击事件 */
    $('tbody').on('click', '.btn-delete', function (e) {
        /* 注意：为什么给文章列表按钮定义时使用class，而不是id？
            因为每条文章列表后面的删除，编辑按钮都是同一个template模板产生的，
            所以如果使用id的话，就导致所有删除，编辑的按钮的id都相同，会产生id唯一性错误
            这里刚好需要计数删除按钮个数，来识别页码数据条数，
            所以没有唯一性要求的class选择器才是最好的
        */
	   /* 获取删除按钮的个数*/
        var length = $('.btn-delete').length
        var id = $(this).attr('data-id') /* 获取文章的id*/
        /* 询问用户是否要删除数据*/
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除文章失败！')
                    }
					layui.layer.msg('删除文章成功！')
					/* 当数据删除完成后，需要判断当前这一页中，是否还有剩余数据。 */
					/* 如果没有剩余数据，则让页码值-1 之后，再重新调用  initArticleList()*/
                    if (length === 1) {
						/* 如果length =1, 证明删除完毕之后，页面上就没有任何数据了 */
						/* 页码值最下必须是1 */
                        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1
                    }

                    initArticleList()
                }
            })
            layer.close(index)
        })
    })
    /* 老师视频中没有提到*/
   /* $('tbody').on('click', '.btn-delete', function (e) {
        var id = $(this).attr('data-id')
        location.href = '/article/art_pub.html?id=${id}'
    }) */
})