
Ext.define('webmapjsext.WMJSExt.SpinnerSlider', {
    extend:'Ext.panel.Panel', 
    alias: ['widget.spinnerslider'],
    requires:['Ext.slider.Single'],
    initComponent: function() {
      var _this = this;
      
      
      _this.slidertitle=_this.title;
    
      _this.title=undefined;
      
      
      _this.setValue = function(value){
        
        _this.slider.suspendEvents();
        _this.slider.setValue(value);
        _this.slider.resumeEvents();
        _this.label.setText(""+decimalFormatter(value,_this.ndecs));
      };
      _this.getValue = function(){
        return  _this.slider.getValue();;
      }
      
      _this.setValueByEvent = function(value){
        _this.setValue(value);
        if(_this.trigger){
          _this.trigger(value);
        }
      };
      
      Ext.apply(this, {
        border:false,
        height:15,
        margin:'8 5 8 5',
        frame:false,
        
        layout:'border',
        items:[{
            
          xtype:'panel',region:'west',width:44,
          border:false,
          items:[{
            xtype:'label',
            text:_this.slidertitle
          }]
          
        },{
          xtype:'panel',region:'center',layout:'fit',
           border:false,
          items:[{
            xtype:'slider',
            useTips:false,
            animate:false,
            minValue:_this.min,
            maxValue:_this.max,
            itemId:'slider',
            margin:'0 4 0 4',
            listeners:{
              drag:{fn:function(t){_this.setValueByEvent(t.getValue());}},
              change:{fn:function(t){_this.setValueByEvent(t.getValue());}}
            }
          }]
        },{
          xtype:'panel',layout:'border',border:false,frame:false,region:'east',width:75,
          bodyStyle:{"background-color":"white"}, 
          items:[
            {region:'west',scale:'small',xtype:'button',text:'&lt;',width:20,handler:function(){_this.setValueByEvent(_this.queryById('slider').getValue()-1);}},
            {xtype:'label',itemId:'label',region:'center',cls: 'test-lbl-text-align'},
            {region:'east',scale:'small',xtype:'button',text:'&gt;',width:20,handler:function(){_this.setValueByEvent(_this.queryById('slider').getValue()+1);}}
          ]
        }]
      });
      
   
      this.superclass.initComponent.apply(this, arguments);
      this.label = this.queryById('label');
      this.slider =this.queryById('slider');
       //this.callParent(arguments);
    }

  }
);

Ext.define('Ext.ux.form.field.DateTime', {
    extend:'Ext.form.FieldContainer',
    mixins: {
        field: 'Ext.form.field.Field'
    },
    alias: 'widget.datetimefield',
    layout: {
            type: 'vbox',
            align: 'stretch'
            },
    border:false,
    width: 220,
    //height: 200,
    //combineErrors: true,
    msgTarget :'side',

    dateCfg:{
    },
    timeCfg:{},

    
    initComponent: function() {
        var me = this;
        me.buildField(me);
        me.callParent();
        this.dateField = this.down('datefield')
        this.timeField = this.down('timefield')
        me.initField();
        
        me.yearslider   = me.queryById('yearslider');
        me.monthslider  = me.queryById('monthslider');
        me.dayslider    = me.queryById('dayslider');
        me.hourslider   = me.queryById('hourslider');
        me.minuteslider = me.queryById('minuteslider');
        me.secondslider = me.queryById('secondslider');
        
        
    },

    //@private
    buildField: function(me){
      _this = this;
      
      _this.slidersTriggered = function(){
        var date =new Date(Date.UTC(
          _this.yearslider.getValue(),
          _this.monthslider.getValue()-1,
          _this.dayslider.getValue(),
          _this.hourslider.getValue(),
          _this.minuteslider.getValue(),
          _this.secondslider.getValue()));
        _this.setValue(date);
        _this.triggerEvent();
      };
      
        this.items = [
        
        {
          xtype:'panel',
           border:false,
           layout:{
             type:'hbox'
           },
            items:[{
                xtype: 'datefield',
                format: 'Y-m-d',
                validateOnChange:true,  
                validateOnBlur:true,
                validateBlank:false,
                emptyText: 'yyyy-mm-dd',
                 anchor: '100%',
                maskRe: new RegExp("^([0-9]|-)$"),
                width: 110,
                listeners:{
                  change:{
                    fn:function(t,newvalue){
                      me.datePart = newvalue;
                      me.triggerEvent();
                    }
                  }
                }
            },
            {
                xtype: 'timefield',
                format: 'H:i:s UTC',
                width: 110,
                listeners:{
                  change:{
                    fn:function(t,newvalue){
                      me.timePart = newvalue;
                      me.triggerEvent();
                    }
                  }
                }
            }]
        },{
          xtype:'panel',
          border:false,
     
          items:[
            {xtype:'spinnerslider',title:'Year',itemId:'yearslider',min: parseISO8601DateToDate(_this.minTimeValue).getUTCFullYear(),max: parseISO8601DateToDate(_this.maxTimeValue).getUTCFullYear(),ndecs:4,trigger:_this.slidersTriggered},
            {xtype:'spinnerslider',title:'Month',itemId:'monthslider',min:1,max:12,ndecs:2,trigger:_this.slidersTriggered},
            {xtype:'spinnerslider',title:'Day',itemId:'dayslider',min:1,max:31,ndecs:2,trigger:_this.slidersTriggered},
            {xtype:'spinnerslider',title:'Hour',itemId:'hourslider',min:0,max:23,ndecs:2,trigger:_this.slidersTriggered},
            {xtype:'spinnerslider',title:'Minute',itemId:'minuteslider',min:0,max:59,ndecs:2,trigger:_this.slidersTriggered},
            {xtype:'spinnerslider',title:'Second',itemId:'secondslider',min:0,max:59,ndecs:2,trigger:_this.slidersTriggered}
             
             
          ]
           
        }
         ]
           
           

        
    },
    triggerEvent:function(){
      if(_this.triggerEvents == false)return;
      if(!this.datePart || !this.timePart)return;
 

      try{
        var iso=decimalFormatter(this.datePart.getFullYear(),4)+
        "-"+decimalFormatter(this.datePart.getMonth()+1,2)+
            "-"+decimalFormatter(this.datePart.getDate(),2)+
                "T"+decimalFormatter(this.timePart.getUTCHours(),2)+
                    ":"+decimalFormatter(this.timePart.getUTCMinutes(),2)+
                        ":"+decimalFormatter(this.timePart.getUTCSeconds(),2)+'Z';
        var date = parseISO8601DateToDate(iso);
        this.setValue(date);
        this.fireEvent('change',this,date);
      }catch(e){
      }

    },
    getValue: function() {
        var value,date = this.dateField.getSubmitValue(),time = this.timeField.getSubmitValue();
        if(date){
            if(time){
                var format = this.getFormat()
                value = Ext.Date.parse(date + ' ' + time,format)
            }else{
                value = this.dateField.getValue()
            }
        }
        return value
    },

    setValue: function(value){
      _this.suspendEvents();
      _this.triggerEvents = false;
      if(isDefined(value)){
        if(value != _this.currentValue){
          _this.currentValue = value;
          
          var minDate = parseISO8601DateToDate(_this.minTimeValue);
          var maxDate = parseISO8601DateToDate(_this.maxTimeValue);
          
          if(value<minDate)value = minDate;
          if(value>maxDate)value = maxDate;
           
           
          
          var year = value.getUTCFullYear();
          
          _this.dateField.setValue(new Date(Date.UTC(year,value.getUTCMonth(),value.getUTCDate(),0,0,0)));
            
        // var year = value.getUTCFullYear();
          _this.yearslider.setValue(value.getUTCFullYear());
          _this.monthslider.setValue(value.getUTCMonth()+1);
          _this.dayslider.setValue(value.getUTCDate());
          _this.hourslider.setValue(value.getUTCHours());
          _this.minuteslider.setValue(value.getUTCMinutes());
          _this.secondslider.setValue(value.getUTCSeconds());
          
          _this.timeField.setValue(value)
        }
      }
      _this.triggerEvents = true;
     _this.resumeEvents();
    }
//     ,
// 
//     getSubmitData: function(){
//         var value = this.getValue()
//         var format = this.getFormat()
//         return value ? Ext.Date.format(value, format) : null;
//     },
// 
//     getFormat: function(){
//         return (this.dateField.submitFormat || this.dateField.format) + " " + (this.timeField.submitFormat || this.timeField.format)
//     }
});