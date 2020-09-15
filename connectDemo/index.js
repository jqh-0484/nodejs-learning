const mysql = require("mysql");

//创建连接对象
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  port: "3306",
  database: "myblog",
});

//开始连接
con.connect();

//执行sql语句
const sql = `insert into blogs (title,content,createtime,author) values('标题c','这是标题c的内容',1587867748561,'张三')`;
con.query(sql, (err, result) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(result);
  console.log("这里是测试git使用的");
  console.log("我是在dev分支上开发的哦~");
  console.log(
    "我是在dev分支上进行开发呢，我现在要提交dev的代码到dev分支上，然后在把它合到master分支上，最后在删除这个dev分支"
  );
  console.log(
    "刚刚master分支上的代码做了修改，但是我在切换到dev分支上进行开发之后，并没有拉取最新的master分支上的代码，这时，当我在dev分支上开发完并将代码提交到dev分支上的时候，我再切换到master分支把dev分支上的代码合并到master分支上的时候，代码合并就会冲突，此时应该解决冲突"
  );
});

//关闭连接
con.end();
