/**
 * Created by Administrator on 2017/10/31.
 */

var socket = io('http://localhost:2000');

$(function(){

    var $unameInput = $('.unameInput');
    var $messageInput = $('.messageInput');
    // 输入框聚焦
    var $currentInput = $unameInput.focus();
    var $messages = $('.messages');
    // 设置用户名称
    var username ;

    window.onkeyup = function(ev){
        username = $unameInput.val().trim();
        if(username){
            if( ev.keyCode === 13 ){
                $('.uname').fadeOut();
                // 增加用户
                socket.emit('add user', {
                    username:username
                })
            }

        }else {
            alert('名字不能为空')
        }
    }


    // 创建标签及其内容 options:在哪个位置添加标签
    function createElement(message, options){
        var el = document.createElement('li');
        el.innerHTML = message;
        showElement(el, options)
    }
    // 将标签添加到DOM树中，在页面上显示
    function showElement(el, options){
        if( !options ){
            options = {};
        }

        if( options.prepend ){
            $messages.prepend(el);
        }else {
            $messages.append(el);
        }


    }

    // 设置数量显示信息
    function numMessage(data){
        var message = '';
        if( data.chatNums == 1 ){
            message = 'there is 1 partner';
        } else {
            message = 'there are ' + data.chatNums + ' partners';
        }
        createElement(message);
    }


    // 登录
    socket.on('login', function(data){
        console.log(data);
        var message =  'Welcome to Socket.IO Chat – ';
        createElement(message,{
            prepend:true
        });
        numMessage(data);

    })

    // 有人加入
    socket.on('joined', function(data){
        var message = data.username + ' joined';
        createElement(message);
        numMessage(data);
    })

    // 有人离开
    socket.on('user logout', function(data){
        var message = data.username + ' left';
        createElement(message);
        numMessage(data);
    })


})

