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

            setTimeout(function(){
                clearInterval(self.setInterval);
            },10000)

            self._createFall({
                width : 20,
                height : 20,
                left : 300,
                speed : 5,
                time : 40,
                className:'fall'
            });
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

            cfg.top += cfg.speed;

            dom.css('top',cfg.top);

            self._fallObj[i]['top'] = cfg.top;
            self._fallObj[i]['left'] = cfg.left;

            if(cfg.top > self._maxHeight){
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

            self._moveMainBox(mainBox, cfg.top,mainBox.offset().left, cfg.direc);
        },
        /**
         * 移动主体
         */
        _moveMainBox : function(mainBox, top, left, direc){
            var self = this;
            var overLeft = parseInt(self.Jnode.offset().left),
                overTop = parseInt(self.Jnode.offset().top) + mainBox.height()/2
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
                overValue = 20;

            for(var i in self._fallObj){
                var item = self._fallObj[i];
                if(Math.abs(item.left - mLeft) < overValue && Math.abs(item.top - mTop) < overValue){
                    item.dom.remove();
                }
            }
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



