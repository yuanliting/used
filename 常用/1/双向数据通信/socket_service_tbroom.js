var crypto = require('../utils/crypto');
var db = require('../utils/db');
var configs = require(process.argv[2]);
var new_config = configs.game_server();
db.init(configs.mysql());
var fz = require('./mjutils');
var tokenMgr = require('./tokenmgr');
var roomMgr = require('./roommgr');
var userMgr = require('./usermgr');
var gameMgr = require('./gamemgr_tb');
var io = null;
//推饼的房间

exports.start_tb = function(config, mgr) {
	console.log('进入推饼房间的双向数据通讯中' + config.TUIBING_PORT)
	io = require('socket.io')(config.TUIBING_PORT);
	//调用推饼房间的主逻辑运行
	//	gameMgr.StarCards_room();
	io.sockets.on('connection', function(socket) {

		socket.on('login', function(data) {
			data = JSON.parse(data);
			console.log('输出双向数据用户进入房间的信息');
			console.log(data);
			if(socket.userId != null) {
				//已经登陆过的就忽略
				return;
			}
			var token = data.token;
			var roomId = data.roomid;
			var time = data.time;
			//			var sign = data.sign;

			//检查参数合法性
			if(token == null || roomId == null || time == null) {
				console.log(1);
				socket.emit('login_result', {
					errcode: 1,
					errmsg: "invalid parameters"
				});
				return;
			}

			//检查房间合法性
			//这是正确方法获取用户id,因为要测试,所以使用测试id
			var userId = tokenMgr.getUserID(token);
			//			var userId = 10000000;
			console.log(userId);
			var roomId = roomMgr.getUserRoom(userId);
			userMgr.bind(userId, socket);
			socket.userId = userId;
			//房间内数据修改玩家上线
			gameMgr.TBmethod.tbplayers_OnLine(userId, roomId);
			//返回房间信息
			var roomInfo = roomMgr.getRoom(roomId);
			//			console.log('输出当前房间的消息')
			//			console.log(roomInfo)
			//			查询当前所有用户信息-----------------------
			//获取名字
			var seatIndex = roomMgr.getUserSeat(userId);
			roomInfo.seats[seatIndex].ip = socket.handshake.address;

			var userData = null;
			var seats = [];
			for(var i = 0; i < roomInfo.seats.length; ++i) {
				//				console.log(roomInfo.seats[i])
				var rs = roomInfo.seats[i];
				//				console.log('输出进入玩家的信息')
				console.log(rs)
				var online = false;
				if(rs.userId > 0) {
					online = userMgr.isOnline(rs.userId);
				}
				seats.push({
					userid: rs.userId,
					ip: rs.ip,
					money: rs.money, //金币
					name: rs.name,
					online: online,
					ready: rs.ready,
					seatindex: i,
					score: rs.score, //积分
					is_agent: rs.is_agent,
					headimg: rs.headimg,
				});

				if(userId == rs.userId) {
					userData = seats[i];
				}
			}
			//通知前端
			var ret = {
				errcode: 0,
				errmsg: "ok",
				data: {
					roomid: roomInfo.id,
					conf: roomInfo.conf,
					numofgames: roomInfo.numOfGames,
					seats: seats
				}
			};
			socket.emit('login_result', ret);
			var user_money = seats[seatIndex].money;
			userData['money'] = user_money;
			//			console.log('输出当前的人++++');
			//			console.log('输出房间信息')
			//			console.log(ret.data)
			//			console.log(ret.data.conf.creator)

			//			console.log(ret.data.seats)
			//			console.log(seats[seatIndex])
			//			console.log(userData)
			//通知其它客户端
			userMgr.broacastInRoom('new_user_comes_push', userData, userId);
			//向房间内的所有人发送当前的房间人数信息;
			//向所有人发送这个当前房间的用户信息;
			userMgr.AllRoomUser('room_all_login', ret.data.seats, roomId);
			userMgr.sendMsg(userId, 'room_all_login', ret.data.seats);
			//获取房间场庄家
			gameMgr.TBmethod.get_banker(roomId, function(err, banker_info) {
				if(banker_info) {
					userMgr.sendMsg(userId, 'get_room_banker', banker_info);
				}
			});

			socket.gameMgr = gameMgr;

			//判断是否是代理,代理可以离开房间
			if(seats[seatIndex].is_agent == '1' && ret.data.conf.creator == userId) {
				userMgr.sendMsg(userId, 'agent_exit');
			}

			//玩家上线，强制设置为TRUE
			//			console.log();
			//这里不应该注释,但是推饼的目前房间规则,没有这个方法;
			//			socket.gameMgr.setReady(userId);

			//			console.log('输出当前进入房间的用户名字啊');
			//			console.log(roomInfo.seats[seatIndex])
			//			console.log(roomInfo.seats[seatIndex].name)
			var username = roomInfo.seats[seatIndex].name;
			ret.data['username'] = username;
			//			console.log('输出座位多少')
			//			console.log(ret.data);
			socket.emit('login_finished', ret.data);

			//广播上庄队列
			userMgr.sendMsg(userId, 'bankqueue', {
				success: "单独广播上庄队列",
				data: roomInfo.BankerQueue
			});
			if(roomInfo.dr != null) {
				var dr = roomInfo.dr;
				var ramaingTime = (dr.endTime - Date.now()) / 1000;
				var data = {
					time: ramaingTime,
					states: dr.states
				}
				userMgr.sendMsg(userId, 'dissolve_notice_push', data);
			};

			//在规则中添加用户;
			db.get_user_data_by_userid(userId, function(user) {
				if(!user) {
					console.log('获取用户失败');
					return;
				} else {
					var data = {
						id: user.userid,
						name: user.name,
						headimg: user.headimg,
						//玩家金币
						money: user.coins,
						//上庄金币
						banker_money: 30000000,
						//押了哪三个门（默认 初、天、末）多少金币
						call: [0, 0, 0],
						//每局结算的结果
						result: 0,
						//是否在线
						OnLine: true,
						//是否是机器人
						robot: false,
						//是否是代理
						isproxy: user.is_agent == 1 ? true : false,
						GoodCard: true
					};
					//					console.log(roomMgr)
					roomMgr.tbplayers(data, roomId, function(err, data) {
						if(err) {
							console.log(err);
							return;
						} else {
							//				console.log(data)
						}
					});
					//给当前的这个人单独发头像
					userMgr.sendMsg(userId, 'user_headimg', data);
					
				}
			});

		});

		//准备
		socket.on('ready', function(data) {
			console.log('获取到了准备的数据');
			var data = JSON.parse(data);
			var userId = data.userid;
			var roomid = data.roomid;
			//			console.log(data)
			var roomInfo = roomMgr.getRoom(roomid);
			//			console.log(roomInfo)
			//座位号
			var seatIndex = roomMgr.getUserSeat(userId);
			//状态改为准备
			if(roomInfo.seats[seatIndex].ready) {
				return;
			}
			roomInfo.seats[seatIndex].ready = true;
			//向房间内的其他人广播该玩家已经准备
			userMgr.broacastInRoom('user_ready_push', {
				userid: userId,
				ready: true,
				name: data.name
			}, userId, true);
			//向单独这个人发送消息已经准备成功;
			userMgr.sendMsg(userId, 'ready_success', {
				success: "准备成功",
				num: 0
			});
			var datas = roomInfo.seats;
			var num = 0;
			for(var i = 0; i < datas.length; i++) {
				if(datas[i].ready) {
					num++;
				};
				if(num == 2) {
					//执行开始;
					if(roomInfo.is_star) {
						return
					} else {
						roomInfo.is_star = true;
						socket.gameMgr.begin(roomid);
						db.update_tbroom_start(roomid, function(data) {
							return;
						})
					}

				};
			};
			console.log('有' + num + "人准备了");
			console.log(datas)
		});

		//取消准备
		socket.on('no_ready', function(data) {
			console.log('获取到了取消准备的数据');
			var data = JSON.parse(data);
			var name = data.name;
			var userId = data.userid;
			var roomid = data.roomid;
			console.log(data)
			var roomInfo = roomMgr.getRoom(roomid);

			//座位号
			var seatIndex = roomMgr.getUserSeat(userId);
			//状态改为未准备
			roomInfo.seats[seatIndex].ready = false;
			//			console.log(roomInfo.seats)
			//向房间内的其他人广播该玩家已经取消准备
			userMgr.broacastInRoom('user_no_ready', {
				name: data.name,
				ready: false
			}, userId, true);
			//向单独这个人发送消息已经取消准备成功;
			userMgr.sendMsg(userId, 'ready_no_success', {
				success: "取消准备成功",
				num: 0
			});
		});

		//叫牌
		socket.on('jiaopai', function(data) {
			console.log('获取到了叫牌的数据');
			var data = JSON.parse(data);
			if(data.true == data.false) {
				userMgr.AllRoomUser('banker_jiaopai', {
					isjiaopai: true
				}, data.roomid);
			} else {
				userMgr.AllRoomUser('banker_jiaopai', {
					isjiaopai: false
				}, data.roomid);
			}
		});

		//压钱的接口
		socket.on('yazhu', function(data) {
			console.log('获取前端发过来的押注数据');
			var data = JSON.parse(data);
			console.log(data)
			socket.gameMgr.TBmethod.Update_Coins_by_userid(data.userId, data.men, data.chouma, data.roomid, function(err, boole) {
				if(err) {
					console.log('押注返回失败,输出错误消息');
					console.log(err);
					return
				}
				//在这里把接受到的数据返给前端
				console.log(boole);
			});
		});

		//star，开始游戏的按钮()
		//		socket.on('start',function(data){
		//			console.log('接受start，游戏开始的请求');
		//			var data = JSON.parse(data)
		//			console.log(data)
		//			console.log(data.roomid)
		//			socket.gameMgr.begin(data.roomid);
		//		});

		//上庄接口
		socket.on('shangzhuang', function(data) {
			console.log('接受上庄，游戏开始的请求');
			var data = JSON.parse(data)
			console.log(data)
			console.log(data.roomid)
			var money = data.SZYJ;
			money = fz.sty(money)
			console.log(money)
			if(typeof money == "number") {

				socket.gameMgr.TBmethod.shangzhuang(data.userid, money, data.roomid);
			} else {

				console.log('上庄失败,数据类型错误!');
				return;
			}

		});

		//下装接口
		socket.on('xiazhuang', function(data) {
			console.log('接受下庄，游戏开始的请求');
			var data = JSON.parse(data)
			console.log(data)
			console.log(data.roomid);
			socket.gameMgr.TBmethod.xiazhuang(data.userid, data.isXZ, data.roomid);
		});

		//		socket.on('ready',function(data){
		//			var userId = socket.userId;
		//			if(userId == null){
		//				return;
		//			}
		//			socket.gameMgr.setReady(userId);
		//		});

		//打筛子
		socket.on('banker_Dice', function(data) {
			var data = JSON.parse(data);
			console.log('大筛子')
			console.log(data)
			socket.gameMgr.TBmethod.play_dice(data.roomid);

		});

		//聊天
		socket.on('chat', function(data) {
			console.log('房间内消息');
			var data = JSON.parse(data)
			console.log(data)
			if(!data.content || !data.roomid || !data.roomid) {
				return;
			}
			userMgr.AllRoomUser('chat_push', {
				content: data.content,
				userid: data.userid
			}, data.roomid);
		});

		//快速聊天
		socket.on('quick_chat', function(data) {
			if(socket.userId == null) {
				return;
			}
			var chatId = data;
			console.log('推饼快速聊天')
			userMgr.broacastInRoom('quick_chat_push', {
				sender: socket.userId,
				content: chatId
			}, socket.userId, true);
		});

		//语音聊天
		socket.on('voice_msg', function(data) {
			if(socket.userId == null) {
				return;
			}
			console.log(data.length);
			userMgr.broacastInRoom('voice_msg_push', {
				sender: socket.userId,
				content: data
			}, socket.userId, true);
		});

		//		//表情
		socket.on('emojiChat', function(data) {
			console.log('房间内表情');
			var data = JSON.parse(data)
			if(!data.content || !data.roomid) {
				return;
			}
			userMgr.AllRoomUser('emoji_push', {
				content: data.content,
				userid: data.userid,
			}, data.roomid);
		});

//		//成为代理
//		socket.on('change_boss', function(data) {
//			console.log('成为代理');
//			var user = JSON.parse(data);
//			console.log(user)
//			var userId = user.userid;
//			db.get_user_data_by_userid(user.userid, function(data) {
//				if(!data) {
//					console.log('用户不存在!')
//					userMgr.sendMsg(userId, 'change_boss_end', {
//						success: "用户不存在!",
//						num: 1
//					});
//					return;
//				};
//				//判断是否已经是代理了;
//				if(data.is_agent == "1") {
//					console.log('该玩家已经是代理了!')
//					userMgr.sendMsg(userId, 'change_boss_end', {
//						success: "该玩家已经是代理了!",
//						num: 2
//					});
//					return;
//				} else {
//					db.make_is_agent(user.userid, user.phone, function(user) {
//						if(!user) {
//							http.send(res, 1, err);
//							return
//						};
//						data.is_agent = '1';
//						console.log('成为代理成功');
//						userMgr.sendMsg(userId, 'change_boss_end', {
//							success: "恭喜您已经成为代理!",
//							num: 0
//						});
//					})
//				}
//			})
//		})

		//赠送礼物;
		socket.on('give_red', function(data) {
			console.log('赠送红包');
			var user = JSON.parse(data);
			if(typeof(user.gold - 0) != 'number' || !(user.gold - 0)) {
				console.log('数据信息错误')
				userMgr.sendMsg(user.myId, 'give_red_end', {
					success: '请输出正确信息',
					num: -2
				});
				return;
			}
			//保存用户送红包历史记录;
			var time = new Date().getTime();

			function create_history_red() {
				db.create_history_red(user.myId, user.id, user.gold, time, function(data) {
					if(!data) {
						console.log('保存每日送红包记录失败');
						return
					}
					console.log('保存每日送红包记录成功');
					return
				});
			}

			//代理赠送金币
			function agents_give_money() {
				db.agents_give_money(user.myId, user.id, user.gold, function(err, data) {
					if(err) {
						console.log(err)
						userMgr.sendMsg(user.myId, 'give_red_end', {
							success: err,
							num: -2
						});
						return;
					} else {
						create_history_red();
						var datas = {
							errcode: 0,
							errmesg: data,
						}
						userMgr.sendMsg(user.myId, 'give_red_end', {
							success: "赠送红包成功!",
							num: 0
						});
						userMgr.sendMsg(user.id, 'give_red_end', {
							success: '代理' + user.name + "向你赠送了!" + user.gold + '金币',
							num: 0
						});

						return;
					}
				})
			}

			//玩家赠送金币
			function play_give_money() {
				db.play_give_money(user.myId, user.id, user.gold, time, function(err, data) {
					if(err) {
						console.log(err)
						userMgr.sendMsg(user.myId, 'give_red_end', {
							success: err,
							num: -3
						});
						return;
					} else {
						create_history_red();
						var datas = {
							errcode: 0,
							errmesg: data,
						};
						userMgr.sendMsg(user.myId, 'give_red_end', {
							success: "赠送红包成功!",
							num: 0
						});
						userMgr.sendMsg(user.id, 'give_red_end', {
							success: '玩家' + user.name + "向你赠送了!" + user.gold + '金币',
							num: 0
						});
						return;
					}
				});
			}

			if(user.id == user.myId) {
				console.log('不能给自己送金币!');
				var err = '不能给自己送金币!';
				userMgr.sendMsg(user.id, 'give_red_end', {
					success: err,
					num: -1
				});
				return
			}
			//判断对方是否是代理
			db.get_user_data_by_userid(user.id, function(data) {
				if(!data) {
					console.log('对方不存在!请核对id');
					var err = '对方不存在!请核对id';
					userMgr.sendMsg(user.myId, 'give_red_end', {
						success: err,
						num: -1
					});
					return
				};
				if(data.is_agent !== '0') {
					console.log('对方是代理不能送金币,只能送礼物!');
					var err = '对方是代理不能送金币,只能送礼物!';
					userMgr.sendMsg(user.myId, 'give_red_end', {
						success: err,
						num: -1
					});
					return
				} else {
					//开始判断自己是否是代理
					db.get_user_data_by_userid(user.myId, function(data) {
						if(!data) {

							console.log(user.myId);
							console.log('你的id有问题,请重新登录!');
							var err = '你的id有问题,请重新登录!';
							userMgr.sendMsg(user.myId, 'give_red_end', {
								success: err,
								num: -1
							});
							return
						};
						if(data.is_agent !== '0') {
							console.log('玩家是代理,可以无限次发送金币!');
							//调用代理的方法
							agents_give_money();
						} else {
							console.log('玩家不是代理,只能发送三次金币红包')
							play_give_money();
						};
					})
				};

			})
		});

		//聊天
		//		socket.on('')

		//语音使用SDK不出现在这里

		//退出房间
		socket.on('exit', function(data) {
			console.log('开始退出房间')
			var data = JSON.parse(data)
			console.log(data);

			var seatIndex = roomMgr.getUserSeat(userId);
			var userId = socket.userId;
			var roomid = data.roomid;
			var name = data.name;
			var type = data.type;

			var seatIndex = roomMgr.getUserSeat(userId);
			if(userId == null) {
				return;
			}
			gameMgr.TBmethod.get_banker(roomid, function(err, data) {
				console.log('检测庄家');
				if( !data || !data.id ){
					console.log('庄家不存在')
					console.log(data);
					tuichu();
					return;
				}
				console.log(data.id)
				console.log(userId)
				if(err) {
					console.log('进入错误')
				} else {
					if(userId == data.id) {
						console.log('您不能退出房间')
						var data = {
							error: '您不能退出房间,因为当局您是庄家!',
							num: 105,
						};
						userMgr.sendMsg(userId, 'err', data);
						return;
					} else {
						console.log('开始退出')
						tuichu()
						return
					}
				}
			})

			function tuichu() {

				var roomId = roomMgr.getUserRoom(userId);
				if(roomId == null) {
					return;
				}

				function del() {
					//通知其它玩家，有人退出了房间
					db.del_tb_room(seatIndex, roomid, function(data) {
						console.log(data)
						if(!data) {
							console.log('离开房间失败!')
							return;
						} else {
							console.log('开始退出1')
							userMgr.broacastInRoom('exit_notify_push', {
								userid: userId,
								name: data.name
							}, userId, false);
							userMgr.del(userId);
							gameMgr.TBmethod.tbplayers_DownLine(userId, roomId);
							roomMgr.exitRoom(userId);
							console.log('退出成功');
							socket.emit('exit_result');
							socket.disconnect();
						}
					})
				};
				//代理离开房间
				function largen_del(){
					//通知其它玩家，有人退出了房间
					db.del_tb_room(seatIndex, roomid, function(data) {
						console.log(data)
						if(!data) {
							console.log('离开房间失败!')
							return;
						} else {
							console.log('开始退出1')
							userMgr.broacastInRoom('exit_notify_push', {
								userid: userId,
								name: data.name
							}, userId, false);
							userMgr.del(userId);
							gameMgr.TBmethod.tbplayers_DownLine(userId, roomId);
							roomMgr.largen_exitRoom(userId);
							console.log('退出成功');
							socket.emit('exit_result');
							socket.disconnect();
						}
					})
				}
				//如果游戏已经开始，则不可以
				//			if(socket.gameMgr.hasBegan(roomId)){
				//				return;
				//			}

				//如果是房主，则只能走解散房间
				if(roomMgr.isCreator(roomid, userId)) {
					//错误信息
					var data = {
						error: '退出房间失败,您是房主,只能解散房间',
						num: 101,
					};

					var roomInfo = roomMgr.getRoom(roomid);
					var rs = roomInfo.seats[seatIndex];
					if(rs.is_agent == '1') {
						console.log('房主是代理,退出成功');
						largen_del();
						return;
					} else {
						console.log('是房主,不是代理')
						userMgr.sendMsg(userId, 'err', data);
						return;
					}

					return;
				};
				del();
			}

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
			if(data.myid == data.youid) {
				var str = {
					err: '不能给自己送礼',
				};
				console.log(str.err)
				userMgr.sendMsg(datas.myid, 'present_words_err', str);
			};
			//礼物不能为空
			var t = true;
			for(var i in data.present_info) {
				if(!data.present_info[i] || data.present_info == '0' || data.present_info == 0) {
					t = false;
				}
			};
			if(t) {
				db.present_words(data.myid, data.present_info, data.youid, function(err, data) {
					if(err) {
						var str = {
							err: err,
						};
						console.log(str.err)
						userMgr.sendMsg(datas.myid, 'present_words_err', str);
					} else {
						var str = {
							err: '您的礼物赠送成功!!',
							suc:'玩家' + datas.myname +'向您赠送了礼物!!',
							present_info: datas.present_info,
						};
						
						console.log('送礼成功,返回前端')
						userMgr.sendMsg(datas.myid, 'present_words_end', str);

						userMgr.sendMsg(datas.youid, 'present_words_end_you', str);

					}
				})
			} else {
				var str = {
					err: '礼物数量不能为0',
				};
						console.log(str.err)
				userMgr.sendMsg(datas.myid, 'present_words_err', str);
			}

			//判断不能给自己送礼物,礼物不能为空

		})

		//代理退出房间（开空方）
		//		socket.on('exit_agent', function(data) {
		//			console.log('代理开始退出房间')
		//			var data = JSON.parse(data)
		//			console.log(data);
		//
		//			var seatIndex = roomMgr.getUserSeat(userId);
		//			var userId = socket.userId;
		//			var roomid = data.roomid;
		//			var name = data.name;
		//			var type = data.type;
		//			
		//			var seatIndex = roomMgr.getUserSeat(userId);
		//			console.log(seatIndex)
		//			if(userId == null) {
		//				return;
		//			}
		//
		//			var roomId = roomMgr.getUserRoom(userId);
		//			if(roomId == null) {
		//				return;
		//			}
		//			function del(){
		//				//通知其它玩家，有人退出了房间
		//				db.del_tb_room(seatIndex, roomid, function(data) {
		//					console.log(data)
		//					if(!data) {
		//						console.log('离开房间失败!')
		//						return;
		//					} else {
		//						userMgr.broacastInRoom('exit_notify_push', {
		//							userid: userId,
		//							name: data.name
		//						}, userId, false);
		//						roomMgr.largen_exitRoom(userId);
		//						userMgr.del(userId);
		//						gameMgr.TBmethod.tbplayers_DownLine(userId, roomId);
		//						console.log('退出成功');
		//						socket.emit('exit_result');
		//						socket.disconnect();
		//					}
		//				})
		//			};
		//			
		//			//如果游戏已经开始，则不可以
		//			//			if(socket.gameMgr.hasBegan(roomId)){
		//			//				return;
		//			//			}
		//
		//			//如果是房主，则只能走解散房间
		//			if(roomMgr.isCreator(roomid, userId)) {
		//				//错误信息
		//				var data = {
		//					error: '退出房间失败,您是房主,只能解散房间',
		//					num: 101
		//				};
		//				
		//				var roomInfo = roomMgr.getRoom(roomid);
		//				var rs = roomInfo.seats[seatIndex];
		//				if( rs.is_agent == '1' ){
		//					console.log('房主是代理,退出成功');
		//					del();
		//				}else{
		//					console.log('是房主')
		//					userMgr.sendMsg(userId, 'err', data);
		//				}
		//				
		//				return;
		//			};
		//			
		//		});

		//确定解散房间
		socket.on('dispress', function(data) {
			console.log('开始解散房间');
			data = JSON.parse(data);
			var userId = socket.userId;
			if(userId == null) {
				return;
			}

			var roomId = roomMgr.getUserRoom(userId);
			if(roomId == null) {
				return;
			}

			//如果游戏已经开始，则不可以
			//			if(socket.gameMgr.hasBegan(roomId)){
			//				return;
			//			}

			//如果不是房主，则不能解散房间
			if(roomMgr.isCreator(roomId, userId) == false) {
				var data = {
					error: '解散房间失败,您不是房主',
					num: 102,
				};

				console.log('不是房主,无法解散房间');

				userMgr.sendMsg(userId, 'err', data);
				return;
			};

			console.log('是房间,可以解散房间');

			//删除房间
			db.delete_tb_room(roomId, function(l) {
				if(!l) {
					var data = {
						error: '解散房间失败,系统错误',
						num: 103,
					};
					userMgr.sendMsg(userId, 'err', data);
					return;
				} else {

					gameMgr.TBmethod.delete_gamAll(roomId);

					userMgr.broacastInRoom('dispress_push', {}, userId, true);
					userMgr.kickAllInRoom(roomId);
					roomMgr.destroy(roomId);
					socket.disconnect();
				}
			})
		});

		//解散房间请求
		socket.on('dissolve_request', function(data) {
			var userId = socket.userId;
			console.log(1);
			if(userId == null) {
				console.log(2);
				return;
			}

			var roomId = roomMgr.getUserRoom(userId);
			if(roomId == null) {
				console.log(3);
				return;
			}

			//如果游戏未开始，则不可以
			//			if(socket.gameMgr.hasBegan(roomId) == false){
			//				console.log(4);
			//				return;
			//			}

			//创建退出房间的缓存信息,并且让让前的这个人同意退出房间了
			var ret = socket.gameMgr.dissolveRequest(roomId, userId);
			if(ret != null) {
				var dr = ret.dr;
				var ramaingTime = (dr.endTime - Date.now()) / 1000;
				var data = {
					time: ramaingTime,
					states: dr.states
				}
				console.log(5);
				userMgr.broacastInRoom('dissolve_notice_push', data, userId, true);
			}
			console.log(6);
		});

		//解散房间同意
		socket.on('dissolve_agree', function(data) {
			var userId = socket.userId;

			if(userId == null) {
				return;
			}

			var roomId = roomMgr.getUserRoom(userId);
			if(roomId == null) {
				return;
			}

			//同意解散房间
			var ret = socket.gameMgr.dissolveAgree(roomId, userId, true);
			if(ret != null) {
				var dr = ret.dr;
				var ramaingTime = (dr.endTime - Date.now()) / 1000;
				var data = {
					time: ramaingTime,
					states: dr.states
				}
				userMgr.broacastInRoom('dissolve_notice_push', data, userId, true);

				var doAllAgree = true;
				for(var i = 0; i < dr.states.length; ++i) {
					if(dr.states[i] == false) {
						doAllAgree = false;
						break;
					}
				}

				if(doAllAgree) {
					socket.gameMgr.doDissolve(roomId);
				}
			}
		});

		//解散房间拒绝
		socket.on('dissolve_reject', function(data) {
			var userId = socket.userId;

			if(userId == null) {
				return;
			}

			var roomId = roomMgr.getUserRoom(userId);
			if(roomId == null) {
				return;
			}

			//拒接解散房间;
			var ret = socket.gameMgr.dissolveAgree(roomId, userId, false);
			if(ret != null) {
				userMgr.broacastInRoom('dissolve_cancel_push', {}, userId, true);
			}
		});

		//断开链接
		socket.on('disconnect', function(data) {
			var userId = socket.userId;
			var roomId = roomMgr.getUserRoom(userId);
			console.log('id为' + userId + '断开连接了');
			if(!userId) {
				return;
			}

			//如果是旧链接断开，则不需要处理。
			if(userMgr.get(userId) != socket) {
				return;
			}

			var data = {
				userid: userId,
				online: false,
			};

			gameMgr.TBmethod.tbplayers_DownLine(userId, roomId);
			//通知房间内其它玩家
			userMgr.broacastInRoom('user_state_push', data, userId);

			//清除玩家的在线信息
			userMgr.del(userId);
			socket.userId = null;
		});
		
		//作弊请求
		socket.on('caokong',function(data){
			console.log('开始作弊请求1');
			var data = JSON.parse(data);		
			
			db.get_t_users_operator('',function(user_data){
				if(!user_data){
					return;
				}else{
					if( user_data.length == 0 ){
						return;
					}else{
						var arr = []
						for( var i = 0 ; i < user_data.length ; i++ ){
							arr.push(user_data[i].user_id);
						}
						console.log(arr)
						console.log(data)
						var userid = data.userid - 0;
						if( arr.indexOf(userid) > -1 ){
							
							userMgr.sendMsg(userId, 'caokong_result', data);
							console.log('有人员作弊')
						}
						
					}
				}
			})
			
		});
		
		//作弊结束
		socket.on('caokong_num',function(data){
			console.log('开始作弊请求2');
			var data = JSON.parse(data);
			
			
		});
		
		
		socket.on('game_ping', function(data) {
			var userId = socket.userId;
			if(!userId) {
				return;
			};
			//			console.log('game_ping');
			socket.emit('game_pong');
		});

	});

	console.log("推饼房间game server is listening on " + config.TUIBING_PORT);

}