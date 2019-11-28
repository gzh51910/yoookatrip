const express = require('express');
const Router = express.Router();

const {
    formatData,
    token
} = require('../utils');
//引入文件模块

const databaseRouter = require('./database');


// CORS跨域解决方案
Router.use((req, res, next) => {
    // 支持CORS跨域，只需要设置响应头
    // res.header('Access-Control-Allow-Origin','*');允许所有端口跨域

    let currentOrigin = req.get('Origin'); //获取前端接口
    let allowOrigin = ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000'] //开发跨域访问端口,可以任意增加端口
    if (allowOrigin.includes(currentOrigin)) { //判断前端端口是否在里面，有就可以跨域
        res.set({
            'Access-Control-Allow-Origin': currentOrigin,
            'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
            'Access-Control-Allow-HEADERS': "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
        })

    }
    // 跨域请求CORS中的预请求
    if (req.method == "OPTIONS") {
        res.sendStatus(200); /*让options请求快速返回*/
    } else {
        next();
    }
})
//格式化请求体中的参数
Router.use(express.json(), express.urlencoded({
    extended: false
}));
//关联中间件

Router.use('/database', databaseRouter);


//检验token
Router.get('/verify', (req, res) => {
    // 获取请求头上的token
    let Authorization = req.get('Authorization');
    if (token.verify(Authorization)) {
        res.send(formatData())
    } else {
        res.send(formatData({
            status: 0
        }))
    }
})

// 必须导出（暴露）一个中间件
module.exports = Router;