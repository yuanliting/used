
const express = require('express');
// 导入socket.io模块，自动提供浏览器端
const socket = require('socket.io');
const http = require('http');

const app = express();

// 创建服务器
const server = http.Server(app);
// 创建socket实例
const io = socket(server);

app.use(express.static('www'));

// app.get('/ask', function(req, res){
//     res.json({error:0});
// })

// 登录人的数量
var chatNums = 0;

io.on('connection', function(socket){
    console.log('通知：服务端已连接成功');
    var addUser = false;
    // socket.on('sayHello', function(data){
    //     console.log(data);
    //     socket.emit('meto', '我已经知道了，可以通信了...');
    // })


    socket.on('add user', function(data){
        // 存储登录的用户
        socket.username = data.username;
        // chatNums = chatNums + 1;
        ++chatNums;
        addUser = true;
        socket.emit('login', {
            chatNums:chatNums,
            username:socket.username
        })
        // 当每个用户登录时，需要通知到其他人，推送广播信息，有人加入了
        socket.broadcast.emit('joined', {
            chatNums:chatNums,
            username:socket.username
        })

        // 有人离开时，断开连接，通知所有人，有人离开了
        socket.on('disconnect', function(){
            if(addUser){
                --chatNums;
                socket.broadcast.emit('user logout', {
                    chatNums:chatNums,
                    username:socket.username
                })
            }
        })

    })

})



server.listen(2000, function(){
    console.log('server is running');
})
