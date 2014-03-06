## 综述

Catch是。

* 版本：1.0
* 作者：顺堂
* demo：[http://gallery.kissyui.com/catch/1.0/demo/index.html](http://gallery.kissyui.com/catch/1.0/demo/index.html)

## 初始化组件

    S.use('gallery/catch/1.0/index', function (S, Catch) {
         var catch = new _Catch('#J_game_main',{
				'fall' : [ //定义下坠的物体 (object)
					{
		                        'className' : 'redHeart',   //下坠物体的类名(String)，主要用来结合CSS
		                        'size':1000,   //下坠物体的数量(int)
		                        'width' : 94, //下坠物体的宽度(int)
		                        'height' : 102,//下坠物体的高度(int)
		                        'speed' : 20, //下坠物体的速度(int) 默认随机
                        		'time':30, //下坠物体移动时间(int) 默认随机
		                        'type':2  //下坠物体类型(int || string) 用于itemCallback 回调
		                    }
				],
				 'main':{ //定义接着下坠物体容器
		                    className : 'bed', // 容器的类名(String)，主要用来结合CSS
		                    width:122, // 容器的宽度(int)
		                    height:175, // 容器的高度(int)
		                    direc:'free' // 容器的移动的方向(String) free(跟随鼠标自由方向移动)|| lateral(跟随鼠标 X 轴移动)
		                },
		      'maxWidth' : 990, //游戏区域最大宽度
		      'maxHeight' : 550,//游戏区域最大高度
		      'time':1800000, //游戏时间
		      'speedUp':[ //定义加速 （Object）
					{
						delay:10000,  //延时
						times:1.5 //加速值
					},
					{
						delay:15000,
						times:2
					}
				  ],
		      itemCallback : function,//每接着一个物体回调(dom(接着下坠的物体容器),type(前面定义的type),x坐标,y坐标)
		      completeCallback : function//游戏完成回调
		});
    })

## API说明
