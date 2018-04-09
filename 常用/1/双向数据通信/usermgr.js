var roomMgr = require('./roommgr');
var userList = {};
var userList_large = {};
var userOnline = 0;
exports.bind = function(userId,socket){
    userList[userId] = socket;
    userOnline++;
};

//金币场绑定玩家
exports.bind_large = function(userId,socket){
    userList_large[userId] = socket;
};

exports.del = function(userId,socket){
    delete userList[userId];
    userOnline--;
};
//删除金币场玩家
exports.del_large = function(userId,socket){
    delete userList_large[userId];
};
exports.get = function(userId){
    return userList[userId];
};
//获取金币场数据
exports.get_large = function(userId){
    return userList_large[userId];
};

exports.isOnline = function(userId){
    var data = userList[userId];
    if(data != null){
        return true;
    }
    return false;
};

exports.getOnlineCount = function(){
    return userOnline;
}
//用户id，路径，返回消息
exports.sendMsg = function(userId,event,msgdata){
//	console.log(userId)
//	console.log('11')
    var userInfo = userList[userId];
    if(userInfo == null){
	console.log('22')
        return;
    }
    var socket = userInfo;
    if(socket == null){
	console.log('33')
        return;
    }
//  console.log(event);
//  console.log(msgdata)
    socket.emit(event,msgdata);
};

exports.kickAllInRoom = function(roomId){
    if(roomId == null){
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return;
    }

    for(var i = 0; i < roomInfo.seats.length; ++i){
        var rs = roomInfo.seats[i];

        //如果不需要发给发送方，则跳过
        if(rs.userId > 0){
            var socket = userList[rs.userId];
            if(socket != null){
                exports.del(rs.userId);
                socket.disconnect();
            }
        }
    }
};

//路径，数据，发送人，true或false(向房间内的除了这个人之外的所有人发送消息)
exports.broacastInRoom = function(event,data,sender,includingSender){
	console.log(event)
	
	console.log(sender)
    var roomId = roomMgr.getUserRoom(sender);
	console.log(roomId)
    if(roomId == null){
        return;
    }
	console.log(event)
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return;
    }
	console.log(event)
    for(var i = 0; i < roomInfo.seats.length; ++i){
        var rs = roomInfo.seats[i];

        //如果不需要发给发送方，则跳过
        if(rs.userId == sender && includingSender != true){
            continue;
        }
        var socket = userList[rs.userId];
        if(socket != null){
            socket.emit(event,data);
        }
    }
};

//向房间内的所有人发送消息
exports.AllRoomUser = function(event,data,roomId){
	if( roomId == null ){
		return '房间id不能为空';
	}
	var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return '房间不存在,无法发送广播';
    }
    
    for(var i = 0; i < roomInfo.seats.length; ++i){
        var rs = roomInfo.seats[i];
        console.log(rs.userId)
        var socket = userList[rs.userId];
        if(socket != null){
            socket.emit(event,data);
        }
    }
    
};

//向金币场单个人发送消息
//用户id，路径，返回消息
exports.large_sendMsg = function(userId,event,msgdata){
    var userInfo = userList_large[userId];
    if(userInfo == null){
        return;
    }
    var socket = userInfo;
    if(socket == null){
        return;
    }
    console.log(event);
    socket.emit(event,msgdata);
};

//向金币场其他人发送消息  路径，数据，发送人
exports.large_broacastInRoom = function(event,data,userid){
	for( var i in userList_large){
		if( i == userid ){
			break;
		}
		var socket = userList_large[i];
		console.log('金币场其他人发送消息' + i );
        if(socket != null){
            socket.emit(event,data);
        };
	}
};

//向金币场所有人发送消息
exports.large_AllRoomUser = function(event,data){
	for( var i in userList_large){
		var socket = userList_large[i];
//		console.log('金币场所有人发送消息' + i );
        if(socket != null){
            socket.emit(event,data);
        };
	}
}
