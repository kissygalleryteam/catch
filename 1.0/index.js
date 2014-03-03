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
        /**
         * 初始化
         */
		init : function(){
            var self = this;
            
            //检查配置项
            if(!self.checkCfg()){
                return null;
            }


            //创建主体
            self.createMainBox(self.getMainCfg());            
		},
        /**
         * 获取主体的配置项
         * @return {obj} cfg
         */
        getMainCfg : function(){
            var self = this;
            var mCfg = self.cfg['main'];
            var height = mCfg.height == undf ? 100 : mCfg.height;
            return {
                width : mCfg.width == undf ? 50 : mCfg.width,
                height : height,
                className : mCfg.className == undf ? 'mainBox' : mCfg.className,
                top : mCfg.top == undf ? self.Jnode.height() - height -10 : mCfg.top
            };

        },
        /**
         * 检查配置项
         * @return {boo} 
         */
        checkCfg : function(){
            if(this.cfg == undf || this.cfg['main'] == undf){
                alert('配置不全！')
            }
            return true;
        },
        /**
         * 创建下坠物体
         */
        createFall : function(cfg){
            var self = this;
            var dom = $('<div></div>');

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

            self.Jnode.append(dom);

            self.fallMove(dom,cfg);
        },
        /**
         * 下载物体移动
         */
        fallMove : function(dom,cfg){
            var self = this;

            cfg.top += cfg.speed;

            dom.css('top',cfg.top);

            if(cfg.top > self._maxHeight){
                return;
            }
            setTimeout(function(){
                self.fallMove(dom, cfg);
            },cfg.time);
        },
        /**
         * 创建主体
         */
        createMainBox : function(cfg){
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

            self.moveMainBox(mainBox, cfg.top, cfg.width);
        },
        /**
         * 移动主体
         */
        moveMainBox : function(mainBox, top){
            var self = this;
            var overLeft = parseInt(self.Jnode.offset().left),
                maxWidth = self._maxWidth;
            
            self.Jnode.on('mousemove',function(e){
                var left = e.clientX - overLeft;                
                mainBox.css('left',e.clientX - overLeft)
            });
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



