Ext.define('webmapjsext.WMJSExt.WindowFader', {
  extend:'Ext.window.Window', 
  alias:'WMJSExtWindowFader',
  requires:[],
  initComponent: function() {
    var _this = this;
    _this.timer = new WMJSTimer();
    _this.fadeOut = function(){
      if(_this.opacity  == 100)return;
      if(_this.opacity>0){
        _this.timer.init(50,_this.fadeOut);
        _this.opacity-=(((100-_this.opacity)/10)+.5);
        _this.getEl().dom.style.opacity = _this.opacity /100; 
      }else{
        _this.close();
      }
    };
    Ext.apply(this, {
      listeners:{
        render:{
          fn:function(){
            _this.el.on('mouseenter', function(){
              _this.getEl().dom.style.opacity = '1'; 
              _this.opacity = 100;
              
            });
            _this.el.on('mouseleave', function(){     
              _this.opacity = 95;
              _this.timer.init(100,_this.fadeOut);
            });
          }
        },
        show:{
          fn:function(){
          _this.getEl().dom.style.opacity = 1;
          _this.opacity = 100;
          }
        }
      }
    });
    this.callParent(arguments);
  }
});
