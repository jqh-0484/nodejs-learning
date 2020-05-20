const mysql = require('mysql');

//创建连接对象
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'myblog'
});

//开始连接
con.connect()

//执行sql语句
const sql = `insert into blogs (title,content,createtime,author) values('标题c','这是标题c的内容',1587867748561,'张三')`;
con.query(sql, (err, result) => {
    if(err){
        console.log(err);
        return
    }
    console.log(result);
});

//关闭连接
con.end();