# 接口设计

1.  获取博客列表
    url:/api/blog/list 
    method:GET 
    params:{
        author: '作者',
        keyword: '搜索关键字'//非必填
    }

2.  获取一篇博客的内容
    url:/api/blog/detail
    method:GET
    params:{
        id: '博客id'
    }

3.  新增一篇博客
    url:/api/blog/new
    method:POST
    params:{
        blogData: {
            title: '新增的标题',
            content: '新增的内容',
            createTime: '新增的时间',
            author: '新增时作者的姓名'
        }
    }

4.  更新一篇博客
    url:/api/blog/update
    method:POST
    params:{
        id: '博客id',
        blogData: {
            title: '更新的后的标题',
            content: '更新后的内容',
            createTime: '更新的时间',
            author: '更新的作者姓名'
        }
    }

5.  删除一篇博客
    url:/api/blog/del
    method:POST
    params:{
        id: '博客id'
    }

6.  登录
    url:/api/user/login
    method:POST
    params:{
        username,
        password,
    }

# 总结
前端修改cookie
document.cookie

后台设置cookie
res.setHeader('Set-Cookie', `username='username'; path=/; httpOnly; expires=设置过期时间`)
