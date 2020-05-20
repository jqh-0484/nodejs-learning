const querystring = require('querystring');
const { get, set } = require('./db/redis');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

//session数据
//const SESSION_DATA = {}

//处理post data
const getPostPromise = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({});
            return
        }

        if (req.headers['content-type'] !== 'application/json;charset=UTF-8') {
            resolve({});
            return
        }

        let postData = '';

        req.on('data', chunk => {
            postData += chunk.toString()
        });

        req.on('end', () => {
            if (!postData) {
                resolve({});
                return
            }
            resolve(
                JSON.parse(postData)
            );
        });
    })
};

//获取cookie的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toUTCString()
}


const serverHandle = (req, res) => {
    //设置返回格式
    res.setHeader('Content-type', 'application/json')

    //获取path
    const url = req.url;
    req.path = url.split('?')[0];

    //解析query
    req.query = querystring.parse(url.split('?')[1]);

    //解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=');
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })

    //解析session
    // let needSetCookie = false//是否需要设置session
    // let userId = req.cookie.userid
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }

    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    //解析session(使用redis)
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        //初始化redis 中的 session值
        set(userId, {})
    }
    //获取session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            //初始化 redis中的session值
            set(req.sessionId, {})
            //设置session
            req.session = {}

        } else {
            //设置session
            req.session = sessionData
        }

        //处理post data
        return getPostPromise(req)
    })
        .then(postData => {
            req.body = postData;

            //处理博客路由
            const blogResult = handleBlogRouter(req, res);
            if (blogResult) {
                blogResult.then(blogData => {
                    if (needSetCookie) {//没有userid需要设置
                        res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                    }

                    res.end(
                        JSON.stringify(blogData)
                    )
                });
                return
            }

            //处理登录路由
            const userResult = handleUserRouter(req, res);
            if (userResult) {
                userResult.then(userData => {
                    if (needSetCookie) {//没有userid需要设置
                        res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                    }

                    res.end(
                        JSON.stringify(userData)
                    )
                })
                return
            }

            //未命中路由返回404
            res.writeHead(404, { "Content-type": "text/plain" });
            res.write('404 No Found\n');
            res.end();
        });
}

module.exports = serverHandle