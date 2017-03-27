var WMJSAnimate = function (_map){
  var _this = this;
  var animate = function(){
    // console.log("animate");
//         if(controlsBusy == true)return;
//         if(_map.isAnimating == false)return;
//         if(_map.animateBusy == true)return;
      
        
      var animationStep = _map.animationList[_map.currentAnimationStep];
      if(!animationStep){
        error("No animation step for "+_map.currentAnimationStep);
        return;
      }
      //_map.animateBusy = true;
      
      
      
      

      
      //console.log("draw on animation");
      _map.setDimension(animationStep.name,animationStep.value);
      _map._pdraw(); 
      _map.animateBusy = false;
    };//animate
    
  
  var animateLoop = function(){
    if(_map.isAnimating == false){
      _map.isAnimatingLoopRunning = false;
      return;
    }
    
    var animationDelay = _map.animationDelay;
    
    
    if(_map.mouseHoverAnimationBox === false){
      //Increase step
      _map.currentAnimationStep++;
      if(_map.currentAnimationStep>=_map.animationList.length){
        _map.currentAnimationStep = 0;
      }
      if( _map.currentAnimationStep == 0 || _map.currentAnimationStep == _map.animationList.length-1){
        animationDelay = 1000;
      }
    }
    if(_map.isAnimating){
      _map.animationTimer.init(animationDelay, animateLoop);
    }
    animate();
  };
    
  _map.isAnimatingLoopRunning = false;
  
  _this.checkAnimation = function(){
    if(_map.isAnimating == false){
      _map.isAnimatingLoopRunning = false;
      return;
    }
    if(!_map.animationTimer){
      _map.animationTimer = new WMJSTimer();
    }
  
    //console.log("Check animation");
    callBack.triggerEvent("onnextanimationstep",_map);

      if( _map.mouseHoverAnimationBox === false){
        //_map.setDimension(animationStep.name,animationStep.value);
        //animationStep.imagesInPrefetch = _map.prefetch(animationStep.requests);
        
        var maxSimultaneousLoads=2;
        var numberPreCacheSteps = 100;//maxSimultaneousLoads+2;
        for(var j=0;j<numberPreCacheSteps;j++){
          var index=j+_map.currentAnimationStep;
          while(index>=_map.animationList.length)index-=_map.animationList.length;
          if(index>=0){
            //_map.setDimension(_map.animationList[index].name,_map.animationList[index].value);
            
            _map.animationList[index].imagesInPrefetch = _map.prefetch(_map.animationList[index].requests);
            
            var imInP = _map.animationList[index].imagesInPrefetch;
          
            for(var i=0;i<imInP.length;i++){
              if(imInP[i].isLoading() == true || imInP[i].isLoaded() == false)maxSimultaneousLoads--;
            }
            if(maxSimultaneousLoads<=0)break;
          }
        } 
      }

      
      var drawAnimationBar = function(h){
        var total = 0;
        var done = 0;
        var loading = 0;
        var h = jQuery('<div/>', {
          'class':"animationdiv",
          mouseout:function(event){
            _map.mouseHoverAnimationBox = false;
            //_map.animationTimer.init(animationDelay, animate);
            
          }});
        
        for(var j=0;j<_map.animationList.length;j++){
          
          var animationBoxMouseOver = function(event,element){
            if(!isDefined(element.value))return;
            _map.mouseHoverAnimationBox = true;
            event.stopPropagation();preventdefault_event(event);
            _map.currentAnimationStep = element.value;
            var animationStep = _map.animationList[_map.currentAnimationStep];
            _map.setDimension(animationStep.name,animationStep.value);
            _map._pdraw(); 
            drawAnimationBar();
          };
          
          //Determine state of each "block"
          var imageReady = true;
          var prefetching = false;
          var imInP = _map.animationList[j].imagesInPrefetch;
          
          if(isDefined(imInP)){
            for(var i=0;i<imInP.length;i++){
              if(imInP[i].isLoaded() === false)imageReady = false;
              if(imInP[i].isLoading() === true)prefetching = true;
            }
          }else{
            var requests = _map.animationList[j].requests;
            for(var i=0;i<requests.length;i++){
              var image = imageStore.getImageForSrc(requests[i]);
              if(image){
                if(image.isLoaded() !== true){
                  imageReady = false;
                }
              }else{
                imageReady = false;
              }
            }
          }
          
          var  a;
          if(prefetching){
            a = $('<div/>', {value:j,'class':"animationimage animationimageprefetch",mouseover:function(event){animationBoxMouseOver(event,this);},mouseout:function(){_map.mouseHoverAnimationBox=false;}});
          }else if(imageReady){
            //debug(b.value);
            a = $('<div/>', {value:j,'class':"animationimage animationimageready",mouseover:function(event){animationBoxMouseOver(event,this);},mouseout:function(){_map.mouseHoverAnimationBox=false;}});
            done++;
          }else{
            loading++;
            a = $('<div/>', {value:j,'class':"animationimage animationimageloading",mouseover:function(event){animationBoxMouseOver(event,this);},mouseout:function(){_map.mouseHoverAnimationBox=false;}});
          }
          if(j == _map.currentAnimationStep){
            a = $('<div/>', {value:j,'class':"animationimage animationimagecurrent",mouseover:function(event){animationBoxMouseOver(event,this);},mouseout:function(){_map.mouseHoverAnimationBox=false;}});
          }
          h.append(a);
          a = null;
          total++;
        }
        var a= $('<div/>',{css:{'float':'left',width:'48px'}});
        a.html(' ['+done+'/'+total+']');
        h.append(a);
        a= null;
      
        removeAllChilds(divAnimationInfo);
        h.appendTo(divAnimationInfo);
        divAnimationInfo.style.display='';
        divAnimationInfo.style.top='8px';
        divAnimationInfo.style.right='68px';
        h= null;
      };//drawAnimationBar
      
      drawAnimationBar();
      
    
    if(_map.isAnimatingLoopRunning == false){
      _map.isAnimatingLoopRunning = true;
      animateLoop();
    }
    

    
  };
};