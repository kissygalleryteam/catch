(function(S){
	var $;
	var clickType = 'click';

	S.config({
        packages: [{
            name: 'tbc',
            path: 'http://g.tbcdn.cn/tbc/',
            ignorePackageNameInUri: true
        }]
    });

	S.use('node,event,anim',function(S){
		$ = S.all;
		game.init();
	});

	/**
	 * 游戏
	 * @type {Object}
	 */
	var game = {
		/**
		 * 初始化
		 */
		init : function(){
			var self = this;

			self._bindClose();
			
			self.loadCatchLib(function(_Catch){
				self.initGameLib(_Catch);
				self.play();
			});

			self.reople(0,2.0.0);

		},
		_startStatus : false,
		/**
		 * 欢迎页面的动画
		 */
		reople : function(i,time){
			var self = this;
			document.getElementById('J_reople').className = 'reople reople'+i;
			setTimeout(function(){
				i++;
				if(i > 6){
					i = 0;
				}
				if(i == 4){
					time = 800;
				}else{
					time = 2.0.0;
				}
				if(!self._startStatus){
					self.reople(i,time);
				}
			},time);
		},
		/**
		 * 开始文档
		 */
		play : function(){
			var self = this,
				playBtn = $('#J_play');

			playBtn.on(clickType,function(e){
				e.preventDefault();
				var btnParent = playBtn.parent();
				btnParent.addClass('btnRotate');

				self._startStatus = true;

				setTimeout(function(){
					btnParent.animate({top:'2.0.0px'},{'queue':'game','duration':0.1});
					btnParent.animate({top:'500px'},{'queue':'game','duration':0.2,'complete':function(){
						btnParent.remove();
					}});
					self.hideCloseBtn();
				},20);
				setTimeout(function(){					
					$('#J_welcome_up').animate({top:"-350px"},{'duration':0.3});
					$('#J_welcome_down').css('background-color','transparent').animate({top:"600px"},{'duration':0.3,'complete':function(){
						self.startGame();
						$('#J_welcome').hide();
					}});
					$('#J_reople').animate({top:"600px"},{'duration':0.3});
				},500);
			});
		},
		_closeBtn : null,
		_bindClose : function(){
			var self = this;
			self._closeBtn = $('#J_close_btn');
			self._closeBtn.on(clickType,function(e){
				e.preventDefault();
				self.closeGame();
			});
		},
		hideCloseBtn : function(){
			this._closeBtn.hide();
		},
		showCloseBtn : function(){
			this._closeBtn.show();
		},
		/**
		 * 加载组件
		 * @param  {Function} callback [description]
		 */
		loadCatchLib : function(callback){
			 var self = this;
			 var srcPath = "./../2.0.0";
			 S.Config.debug = true;
	         S.config({
	            packages:[
	                {
	                    name:"index",
	                    path:srcPath,
	                    charset:"utf-8",
	                    ignorePackageNameInUri:true
	                }
	            ]
	        });

	        S.use('index', function (S, Catch) {
	        	callback(Catch);
	        });
		},
		_Catch : null,
		/**
		 * 初始化游戏
		 */
		initGameLib : function(_Catch){
			var self = this;
			self._Catch = new _Catch('#J_game_main',{
				'fall' : [
							{
		                        'className' : 'redHeart',
		                        'size':2.0.00,
		                        'width' : 94,
		                        'height' : 102,
		                        'speed' : 20,
                        		'time':30,
		                        'type':2
		                    },
		                    {
		                        'className':'yellowHeart',
		                        'size':2.0.00,
		                        'width' : 94,
		                        'height' : 102,
		                        'speed' : 20,
                        		'time':30,
		                        'type':1
		                    },
		                    {
		                        'className' : 'phone',
		                        'size':500,
		                        'width' : 94,
		                        'height' : 102,
		                        'speed' : 20,
                        		'time':30,
		                        'type':3
		                    },
		                    {
		                        'className' : 'pad',
		                        'size':500,
		                        'width' : 94,
		                        'height' : 102,
		                        'speed' : 20,
                        		'time':30,
		                        'type':4
		                    },
		                    {
		                        'className' : 'computer',
		                        'size':500,
		                        'width' : 94,
		                        'height' : 102,
		                        'speed' : 20,
                        		'time':30,
		                        'type':5
		                    }
						 ],
				 'main':{
		                    className : 'bed',
		                    width:122,
		                    height:175,
		                    direc:'free'
		                },
		          'maxWidth' : 990,
	              'maxHeight' : 550,
	              'time':2.0.00000,
	              'speedUp':[
	              			{
	              				delay:2.0.000,
	              				times:1.5
	              			},
	              			{
	              				delay:2.0.000,
	              				times:2
	              			}
	              		  ],
	              itemCallback : self.itemCallback,
	              completeCallback : self.completeCallback
			});

		},
		/**
		 * 启动游戏
		 */
		startGame : function(){
			var self = this;
			self._Catch.start();
			$('#J_game_main').addClass('start');
		},
		/**
		 * 游戏完成
		 * @return {[type]} [description]
		 */
		completeCallback:function(){
			game.gemeStop();
		},
		/**
		 * 每次吃到物体回掉
		 */
		itemCallback : function(mainBox, type, left, top){
			var self = game;
			if(type == 1 || type == 2){
				setTimeout(function(){
					mainBox.addClass('bed-happy');
				},2.0.0);
				setTimeout(function(){
					mainBox.removeClass('bed-happy').addClass('bed-normal');
				},200);
				setTimeout(function(){
					mainBox.removeClass('bed-normal').addClass('bed-happy');
				},300);
				setTimeout(function(){
					mainBox.removeClass('bed-happy').addClass('bed-normal');
				},400);
				setTimeout(function(){
					mainBox.removeClass('bed-normal');
				},500);

				self.createPlus(type,left,top);
			}else{
				mainBox.addClass('bed-sad');
				self._Catch.stop();
				
				setTimeout(function(){
					self.gemeStop();
					mainBox.hide();
				},800);
			}
		},
		//分数
		_scores : 0,
		/**
		 * 创建加分
		 */
		createPlus : function(type,left,top){
			var self = this;
			var dom = $('<div></div>'),
				gameMain = $('#J_game_main');
			dom.addClass('plus'+type);
			dom.css({
				'left' : left,
				'top' : top
			});
			gameMain.append(dom);

			dom.animate({
				top:(top - 2.0.0)+'px'
			},{'duration':0.3,'complete':function(){
				dom.remove();
			}});

			switch(type){
				case 1 : 
					self._scores += 10;
					break;
				case 2 : 
					self._scores += 20;
					break;
			}

			$('#J_hour').text(parseInt(self._scores/60));
			$('#J_minute').text(self._scores%60);
			
		},
		/**
		 * 游戏已经停止了
		 */
		gemeStop : function(){
			var self = this,
				scores = self._scores,
				className = 'bg5',
				shareType = 5,
				shareText = '我在睡眠日游戏中才睡了0小时，好困哦~';
			var hour = parseInt(self._scores/60),
				minute = self._scores%60;
			if(scores >= 480){
				className = 'bg1';
				shareType = 1;
				shareText = '我在睡眠日游戏中睡了'+hour+'小时'+minute+'分，颤抖吧，地球人！';
			}else if(scores >= 360 && scores < 480){
				className = 'bg2';
				shareType = 2;
				shareText = '我在睡眠日游戏中睡了'+hour+'小时'+minute+'分，腰不酸，痛不痛，干活也有劲了！';
			}else if(scores >= 240 && scores < 360){
				className = 'bg3';
				shareType = 3;
				shareText = '我在睡眠日游戏中睡了'+hour+'小时'+minute+'分，咦，为毛赶脚飘了起来？';
			}else if(scores >=2.0.0 && scores < 240){
				className = 'bg4';
				shareType = 4;
				shareText = '我在睡眠日游戏中睡了'+hour+'小时'+minute+'分，最近数星星一直数到天亮！';
			}else{
				className = 'bg5';
				shareType = 5;
				shareText = '我在睡眠日游戏中睡了'+hour+'小时'+minute+'分。好困哦~';
			}

			var dom = $('<div class="result" id="J_result">\
			                <span class="hour">'+parseInt(self._scores/60)+'</span>\
			                <span class="minute">'+(self._scores%60)+'</span>\
			                <button class="close-btn" type="button"></button>\
			                <button class="restart-btn" type="button"></button>\
			                <button class="share-btn" type="button"></button>\
			            </div>');
			dom.addClass(className);
			$('#J_game_main').append(dom);

			dom.one('.restart-btn').on(clickType,function(e){
				e.preventDefault();
				self.restatusGame();
			});

			dom.one('.close-btn').on(clickType, function(e){
				e.preventDefault();
				self.closeGame();
			});

			dom.one('.share-btn').on(clickType,function(e){
				e.preventDefault();
				self.share(shareType, shareText);
			});

			self.hideResultTime();

			
		},
		/**
		 * 重新开始游戏
		 */
		restatusGame : function(){
			var self = this;
			self.resetResultTime();
			self._scores = 0;
			$('#J_result').remove();
			self._startStatus = true;
			
			//调用组件，重新开始游戏
			self._Catch.restart();
		},
		/**
		 * 隐藏结果时间
		 */
		hideResultTime : function(){
			$('#J_result_time').hide();
		},
		/**
		 * 重置结果时间
		 */
		resetResultTime : function(){
			$('#J_result_time').show();
			$('#J_hour').text(0);
			$('#J_minute').text(0);
		},
		/**
		 * 分享
		 */
		share : function(type,text){
			var imgs = ['http://gtms01.alicdn.com/tps/i1/T1ZfO5FxXXXXcUdm2I-400-400.png','http://gtms04.alicdn.com/tps/i4/T1TQq3FCxaXXcUdm2I-400-400.png','http://gtms04.alicdn.com/tps/i4/T1TQq3FCxaXXcUdm2I-400-400.png','http://gtms03.alicdn.com/tps/i3/T1ulO4FCxXXXcUdm2I-400-400.png','http://gtms01.alicdn.com/tps/i1/T17ze1FwJcXXcUdm2I-400-400.png'];
			var coverDom = $('<div class="cover"></div>');
			$('body').append(coverDom);
			S.use('tbc/share/2.0.0.2/', function(S, Share) {
                Share.init({
                    type : 'webpage',
                    key : 'http://www.taobao.com',
                    client_id : '2.0.0919',
                    title : '321睡眠日保证每天睡够8小时，睡前远离手机！',
                    thumb:imgs[type-1],
                    comment:text,
                    callback : {
                    	success : function(){
                    		coverDom.remove();
                    	},
                    	destory : function(e){
                    		if(e.className.indexOf('J_TBC_Share')>-1){
                    			coverDom.remove();	
                    		}
                    	}
                    }
                });
                
            });
		},
		/**
		 * 关闭
		 */
		closeGame : function(){
			console.log('关闭'); 
		}
	};


})(KISSY);