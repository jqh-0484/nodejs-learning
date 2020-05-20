const {
    blogList,
    blogDetail,
    newBlog,
    updateBlog,
    delBlog,
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

//定义统一的登录验证
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}

const handleBlogRouter = (req, res) => {
    const method = req.method;
    const id = req.query.id;

    //博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || '';
        const keyword = req.query.keyword || '';

        if (req.query.isadmin) {
            //管理员界面
            const loginCheckResult = loginCheck(req)
            if (loginCheckResult) {
                //未登录
                return loginCheckResult
            }
        }

        const result = blogList(author, keyword);
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    //博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const result = blogDetail(id);
        if (result) {
            return result.then(data => {
                return new SuccessModel(data)
            })
        }
    }

    //新建博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            //未登录
            return loginCheckResult
        }
        console.log('req.body:', req.body)

        req.body.author = req.session.username
        const result = newBlog(req.body);
        return result.then(blogId => {
            return new SuccessModel(blogId)
        });
    }

    //更新博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            //未登录
            return loginCheckResult
        }

        const result = updateBlog(id, req.body);
        return result.then(val => {
            if (val) {
                return new SuccessModel();
            }
            return new ErrorModel('更新博客失败了！');
        })
    }

    //删除博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            //未登录
            return loginCheckResult
        }

        const author = req.session.username;
        const result = delBlog(id, author);
        return result.then(val => {
            if (val) {
                return new SuccessModel();
            }
            return new ErrorModel('删除博客失败了！');
        })
    }
};

module.exports = handleBlogRouter