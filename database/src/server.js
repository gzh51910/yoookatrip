const express = require('express');
//引入文件模块
const {
    PORT
} = require('./config.json');

const AllRouter = require('./routers')

//创建服务器
const app = express();

//静态资源服务器
app.use(express.static('./'));

//路由
app.use(AllRouter);
//监听端口
app.listen(PORT, () => {
    console.log(`服务器开启成功 ${PORT}`)
})
