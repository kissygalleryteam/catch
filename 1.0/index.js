/**
 * @fileoverview 
 * @author 顺堂<wuming.xiaowm@taobao.com>
 * @module catch
 **/
KISSY.add(function (S, Node,Base) {
    var EMPTY = '';
    var undf = undefined;
    var $ = Node.all;
    /**
     * 
     * @class Catch
     * @constructor
     * @extends Base
     */
    function Catch(Jnode, cfg) {
        var self = this;
        //调用父类构造函数
        self.Jnode = $(Jnode);
        self.cfg = cfg;
        self.init();
    }
    
	Catch.prototype = {
        _maxHeight : 550,
        _maxWidth : 990,
        Jnode : null,
        _direc:'free',//方向
        /**
         * 初始化
         */
		init : function(){
            var self = this;
            
            //检查配置项
            if(!self._checkCfg()){
                return null;
            }

            //设置最大值
            self._setMaxValue();

            //创建主体
            self._createMainBox(self.getMainCfg());    

            //定时扫描接触点
            self.setInterval = setInterval(function(){
                self._parseCollide();
            },30); 

            // setTimeout(function(){
            //     clearInterval(self.setInterval);
            // },10000)

            
            self._setFall();
		},
        /**
         * [setFall description]
         */
        _setFall : function(){
            var self = this;
            var fallList = self.cfg.fall;

            var list = [],
                obj = {};
            for(var i=0,len=fallList.length,n=0;i<len;i++){
                var item = fallList[i];
                for(var j=0,l=item.size;j<l;j++){
                    n++;
                    list.push(n);
                    obj[n] = item;
                }
            }
            
            var indexs = self.getRandomNub(list,list.length),
                len = indexs.length - 1;

            var timeout = (self.cfg.time == undf ? 60000 : self.cfg.time) / len;

            create(0);
            
            function create(i){
                var item = obj[indexs[i]],
                    width = item.width == undf ? 10 : item.width,
                    height = item.height == undf ? 10 : item.height,
                    left = item.left == undf ? self.getRandomNub(self.getArrData(0,self._maxWidth),1)[0] : item.left,
                    speed = item.speed == undf ? self.getRandomNub(self.getArrData(0,10),1)[0] : item.speed,
                    time = item.time == undf ? self.getRandomNub(self.getArrData(0,50),1)[0] : item.time,
                    className = item.className == undf ? 'fall' : item.className;
                
                //如果left大于画布宽度，那么left -10
                if(left+width > self._maxWidth){
                    left = self._maxWidth - width - 10;
                }

                self._createFall({
                    width : width,
                    height : height,
                    left : left,
                    speed : speed,
                    time : time,
                    className:className
                });

                if(i == len){
                    return;
                }
                setTimeout(function(){
                    create(++i);
                },timeout);
            }
        },
        /**
         * 设置最大值
         */
        _setMaxValue : function(){
            var self = this;
            self._maxWidth = self.cfg.maxWidth == undf ? self.Jnode.width() : self.cfg.maxWidth;
            self._maxHeight = self.cfg.maxHeight == undf ? self.Jnode.height() : self.cfg.maxHeight;
        },
        /**
         * 获取主体的配置项
         * @return {obj} cfg
         */
        getMainCfg : function(){
            var self = this;
            var mCfg = self.cfg['main'];
            var height = mCfg.height == undf ? 100 : mCfg.height;
            var direc = mCfg.direc == undf ? 'free' : mCfg.direc;
            self._direc  = direc;
            return {
                width : mCfg.width == undf ? 50 : mCfg.width,
                height : height,
                className : mCfg.className == undf ? 'mainBox' : mCfg.className,
                top : mCfg.top == undf ? self.Jnode.height() - height -10 : mCfg.top,
                direc : direc
            };
        },
        /**
         * 检查配置项
         * @return {boo} 
         */
        _checkCfg : function(){
            if(this.cfg == undf || this.cfg['main'] == undf){
                alert('配置不全！')
            }
            return true;
        },

        _fallObj : {},
        _i : 0,
        /**
         * 创建下坠物体
         */
        _createFall : function(cfg){
            var self = this;
            var dom = $('<div></div>');

            self._i ++;

            if(cfg.className){
                dom.addClass(cfg.className);
            }

            if(cfg.width){
                dom.css('width',cfg.width);
            }

            if(cfg.height){
                cfg.top = -cfg.height *2;
                dom.css({ height:cfg.height,top:cfg.top});
            }else{
                cfg.top = -15;
                dom.css('top',cfg.top);
            }

            if(cfg.left){
                dom.css('left',cfg.left);
            }
            self._fallObj[self._i] = {
                dom:dom,
                top:cfg.top,
                left:cfg.left
            };
            
            self.Jnode.append(dom);

            self._fallMove(dom,cfg,self._i);
        },
        /**
         * 下载物体移动
         */
        _fallMove : function(dom, cfg, i){
            var self = this;

            if(self._fallObj[i] == undf){
                return;
            }

            cfg.top += cfg.speed;

            dom.css('top',cfg.top);

            self._fallObj[i]['top'] = cfg.top;
            self._fallObj[i]['left'] = cfg.left;

            if(cfg.top > self._maxHeight){
                delete self._fallObj[i];
                return;
            }

            setTimeout(function(){
                self._fallMove(dom, cfg, i);
            },cfg.time);
        },
        //主体的位置
        _mainPos : {},
        /**
         * 创建主体
         */
        _createMainBox : function(cfg){
            var self = this;
            var mainBox = $('<div></div>');
            if(cfg.className){
                mainBox.addClass(cfg.className);
            }
            
            if(cfg.width){
                mainBox.css('width',cfg.width);
            }

            if(cfg.height){
                mainBox.css( 'height',cfg.height);
            }

            if(cfg.top){
                mainBox.css('top',cfg.top);
            }

            mainBox.css({'left':'50%','margin-left':-cfg.width/2});

            self.Jnode.append(mainBox);

            self._mainBoxWidth = cfg.width;
            self._mainBoxHeight = cfg.height;
            self._mainPos = {'top':cfg.top,'left':mainBox.offset().left};

            self._moveMainBox(mainBox, cfg.top,mainBox.offset().left, cfg.direc);
        },
        /**
         * 移动主体
         */
        _moveMainBox : function(mainBox, top, left, direc){
            var self = this;
            var boxOffset = self.Jnode.offset(),
                overLeft = parseInt(boxOffset.left),
                overTop = parseInt(boxOffset.top) + mainBox.height()/2,
                maxWidth = self._maxWidth;
            
            self.Jnode.on('mousemove',function(e){
                var newLeft = e.clientX - overLeft,
                    newTop  = e.clientY - overTop;
                var changeCass = {};
                switch(direc){
                    default:
                    case 'free':
                        changeCass = {'left':newLeft,'top':newTop};
                        self._mainPos = {'top':newTop,left:newLeft};
                        break;
                    case 'lateral':
                        changeCass = {'left':newLeft};
                        self._mainPos = {'top':top,'left':newLeft};
                        break;
                    case 'longitudinal':
                        changeCass = {'top':newTop};
                        self._mainPos = {'top':newTop,'left':left};
                        break;
                }
                mainBox.css(changeCass);

               
            });
        },
        /**
         * 计算碰撞
         * @return {[type]} [description]
         */
        _parseCollide : function(){
            var self = this,
                mTop = self._mainPos.top,
                mLeft = self._mainPos.left,
                direc = self._direc,
                overValue = 10,
                mWidth = self._mainBoxWidth,
                mHeight = self._mainBoxHeight;

            var itemCallback = self.cfg.itemCallback;
            var ml2 = mLeft - mWidth/2;

            for(var i in self._fallObj){
                var item = self._fallObj[i];
                if(item == undf){
                    continue;
                }
                //if(mTop - 10 <= item.top && (mTop + boxHeight + 10) >= item.top){
                //console.log(mLeft +'---'+item.left +'---'+mTop +'--'+item.top);
                if(ml2 <= item.left && ml2 + mWidth >= item.left && mTop <= item.top && mTop + mHeight >= item.top){
                    item.dom.remove();
                    delete self._fallObj[i];
                }
            }
        },
        /**
         * 创建i到n的数组
         * @param  {[int]} s 开始
         * @param  {[int]} n 结束
         * @return {[array]}
         */
        getArrData : function(s,n){
            var result = [];
            for(var i = s; i < n; i++){
                result.push(i);
            }
            return result;
        },
         /**
         * 从数组中随机数
         * @param  {[array]} list  数组数据
         * @param  {[int]} count   获取个数
         * @return {[array]}       返回随机数组如count等于1，直接返回int
         */
        getRandomNub : function(list, count){
            var res = [];
            for (i=0;i<count;i++){
                var index=Math.floor(Math.random()*list.length); //随机取一个位置
                res.push(list[index]);
                list.splice(index,1);
            }
            return res;
        }
	};

    return Catch;
}, {requires:['node', 'base']});



