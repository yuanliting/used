var crypto = require('../utils/crypto');
var db = require('../utils/db');
var configs = require(process.argv[2]);
var new_config = configs.game_server();
db.init(configs.mysql());
var fz = require('./mjutils');
var tokenMgr = require('./tokenmgr');
var roomMgr = require('./roommgr');
var userMgr = require('./usermgr');
var gameMgr = require('./gamemgr_tb_coins');
var io = null;
//推饼金币场


exports.start_tb = function(config, mgr) {
	console.log('进入推饼金币场的双向数据通讯中' + config.TUIBING_MONEY_PORT)
	io = require('socket.io')(config.TUIBING_MONEY_PORT);
	io.sockets.on('connection', function(socket) {

		socket.on('login', function(data) {
			data = JSON.parse(data);
			console.log('输出双向数据用户进入金币场的信息');
			console.log(data);
			var userId = data.userid;

			userMgr.bind_large(userId, socket);
			socket.userId = userId;
			console.log(socket.userId);
			var num = roomMgr.get_men();
			var ret = gameMgr.TBmethod.get_tbvip();
			var new_ret = [];
			for(var i = 0; i < ret.length; i++) {
				if(ret[i] == "") {
					var l = {
						id: '',
						name: '',
						//玩家金币
						money: '',
						robot: false, //是不是机器人
						isproxy: false, //是不是代理
						//头像
						headimg: '',
					}
					new_ret.push(l);
				}
				new_ret.push(ret[i]);
			};

			var data = {
				num: num,
				username: data.username,
				seats: new_ret,
			}
			console.log(data)
			socket.emit('large_login_home', data);

			//获取金币场庄家
			var banker_info = gameMgr.TBmethod.get_banker();
			userMgr.large_sendMsg(userId, 'get_banker', banker_info);

			//向其他玩家发送新玩家进入的消息
			db.get_user_data_by_userid(userId, function(user) {
				if(!user) {
					return;
				};
				var new_user = {
					userid: user.userid,
					name: user.name,
					money: user.coins,
				};

				userMgr.large_broacastInRoom('new_user_push', new_user, userId);
				
				userMgr.large_sendMsg(userId, 'user_headimg_large', user);

			})
			userMgr.large_AllRoomUser('large_login_end', data.seats);

		});

		//押注
		socket.on('large_yazhu', function(data) {
			console.log('获取前端发过来的押注数据');
			var data = JSON.parse(data);
			console.log(data);
			gameMgr.TBmethod.Update_Coins_by_userid(data.userId, data.men, data.chouma, function(err) {
				if(err) {
					console.log('押注返回失败,输出错误消息');
					console.log(err);
					return
				}
				//在这里把接受到的数据返给前端
				console.log(boole);
			})

		});

		//上庄接口
		socket.on('large_shangzhuang', function(data) {
			console.log('接受上庄，游戏开始的请求');
			var data = JSON.parse(data)
			console.log(data)
			console.log(data.roomid)
			var money = data.SZYJ;
			money = fz.sty(money)
			console.log(money)
			if(typeof money == "number") {
				gameMgr.TBmethod.shangzhuang(data.userid, money);
			} else {

				console.log('上庄失败,数据类型错误!');
				return;
			}

		});

		//表情
		socket.on('emojiChat', function(data) {
			console.log('接受表情');
			var data = JSON.parse(data)
			userMgr.large_AllRoomUser('emoji_push', data);
		});

		//退出金币场
		socket.on('out_large', function(data) {
			console.log('接受玩家退出金币场的请求');
			var data = JSON.parse(data);
			if(!data.userid) {
				var str = {
					err: '用户id错误,退出失败!',
				};
				userMgr.large_sendMsg(data.userid, 'out_large_end', str);
				console.log('用户id错误,退出失败!');
				return;
			};
			
			var banker = gameMgr.TBmethod.get_banker();
			if( banker.id == data.userid ){
				var str = {
					err: '您不能退出,因为当局您是庄家!!',
				};
				userMgr.large_sendMsg(data.userid, 'out_large_end', str);
				console.log('您不能退出,因为当局您是庄家!!');
				return
			}
			
			//删除用户roomid
			db.del_user_largeroom_info(data.userid, function(t) {
				if(!t) {
					var str = {
						err: '退出失败,错误!1',
					};
					userMgr.large_sendMsg(data.userid, 'out_large_end', str);
					console.log('退出失败,错误!1');
					return;
				};
				//删除金币场内的用户信息;
				db.del_large_user(data.userid, function(user) {
					if(!user) {
						var str = {
							err: '退出失败,错误2!',
						};
						userMgr.large_sendMsg(data.userid, 'out_large_end', str);
						console.log('退出失败,错误2!');
						return;
					}

					gameMgr.TBmethod.tbplayers_DownLine(data.userid, function(err, suc) { //金币场玩家下线
						if(err) {
							var str = {
								err: err,
							};
							userMgr.large_sendMsg(data.userid, 'out_large_end', str);
							console.log('退出失败3')
							console.log(err);
							return;
						} else {
							var str = {
								err: '退出成功',
							};
							//						gameMgr.TBmethod
							userMgr.large_sendMsg(data.userid, 'out_large_success', str);
							userMgr.del_large(data.userid);
							socket.disconnect();
							console.log('玩家退出金币场成功');
							return;
						}

					})

				})

			})

		});

		//断开链接
		socket.on('disconnect', function(data) {
			var userId = socket.userId;
			console.log('id为' + userId + '断开金币场的连接了');
			if(!userId) {
				return;
			}

			//如果是旧链接断开，则不需要处理。
			if(userMgr.get_large(userId) != socket) {
				return;
			}

			var data = {
				userid: userId,
				online: false,
			};

			gameMgr.TBmethod.tbplayers_DownLine(data.userid, function(err, suc) { //金币场玩家下线
				if(err) {
					var str = {
						err: err,
					};
					userMgr.large_sendMsg(data.userid, 'out_large_end', str);
					console.log('退出失败3')
					console.log(err);
					return;
				} else {
					var str = {
						err: '退出成功',
					};
					//				gameMgr.TBmethod
					userMgr.large_sendMsg(data.userid, 'out_large_success', str);
					userMgr.del_large(data.userid);
					socket.disconnect();
					socket.userId = null;
					console.log('玩家退出金币场成功');
					return;
				}

			})
		});

		//礼物系统
		socket.on('present_words', function(data) {
			console.log('接受礼物!');
			var data = JSON.parse(data);
			console.log(data)
//			var data = {
//				//送礼者的id
//				myid: '10000227',
//				//送礼的信息
//				present_info: {
//					one: 10,		//烟花
//					two: 0,			//跑车
//					three: 0,		//别墅
//				},
//				//接收者的id
//				youid: '10000030',
//				myname:'',
//				youname:'',
//			};
			var datas = data;

			if(!data.myid || !data.present_info || !data.youid) {
				return
			};
			//不能给自己送礼
			if( data.myid == data.youid ){
				var str = {
					err: '不能给自己送礼',
				};
				userMgr.large_sendMsg(datas.myid, 'present_words_err', str);
			};
			//礼物不能为空
			var t = true;
			for( var i in data.present_info ){
				if( !data.present_info[i] || data.present_info == '0' || data.present_info == 0 ){
					t = false;
				}
			};
			if( t ){
				db.present_words(data.myid, data.present_info, data.youid, function(err, data) {
					if(err) {
						var str = {
							err: err,
						};
						userMgr.large_sendMsg(datas.myid, 'present_words_err', str);
					} else {
						var str = {
							err: '您的礼物赠送成功!!',
							suc:'玩家' + datas.myname +'向您赠送了礼物!!',
							present_info:datas.present_info,
						};
						userMgr.large_sendMsg(datas.myid, 'present_words_end', str);
						
						
						userMgr.large_sendMsg(datas.youid, 'present_words_end_you', str);
						
					}
				})				
			}else{
				var str = {
					err: '礼物数量不能为0',
				};
				userMgr.large_sendMsg(datas.myid, 'present_words_err', str);
			}


			//判断不能给自己送礼物,礼物不能为空

		})

		//心跳包
		socket.on('game_ping', function(data) {
			var userId = socket.userId;
			if(!userId) {
				return;
			};
			socket.emit('game_pong');
		});

	});

	console.log("推饼金币场game server is listening on " + config.TUIBING_MONEY_PORT);

}