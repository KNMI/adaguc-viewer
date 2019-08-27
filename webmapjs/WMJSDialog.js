import { isDefined, preventdefaultEvent, MakeHTTPRequest } from './WMJSTools.js';
import { jquery } from './WMJSExternalDependencies.js';
export default class WMJSDialog {
  closeAllDialogs (gfiDialogList) {
    for (var j = 0; j < gfiDialogList.length; j++) {
      gfiDialogList[j].remove();
    }
    gfiDialogList = [];
  };

  createDialog (options, baseDiv, _map, loadingImageSrc) {
    var x = 0;
    var y = 0;
    var show = true;
    var autoDestroy = true;
    if (isDefined(options.show)) {
      show = options.show;
    }

    if (isDefined(options.x)) {
      x = options.x;
    }

    if (isDefined(options.y)) {
      y = options.y;
    }

    if (isDefined(options.autoDestroy)) {
      autoDestroy = options.autoDestroy;
    }
    if (!jquery) { console.warn('WMJSDialog: jquery is not defined, assuming unit test is running'); return; }
    var dialog = jquery('<div />', {
      css:{
        minHeight:'20px',
        height:180,
        width:320,
        zIndex:1000,
        border:'1px solid #01405e',
        borderRadius:'3px',
        position:'absolute',
        boxShadow:'0.06rem 0.125rem 0.125rem rgba(0, 0, 0, 0.3)',
        margin:0,
        padding:'0px',
        backgroundColor:'#01547d',
        display:'inline-block'
      },
      mousedown: (event) => {
        if (event.stopPropagation) {
          event.stopPropagation();
        }
        preventdefaultEvent(event);
      },
      mousewheel: (event) => {
        if (event.stopPropagation) {
          event.stopPropagation();
        }
      }
    });

    if (show) {
      dialog.appendTo(baseDiv);
    }

    dialog.hasBeenDragged = false;

    dialog.on('drag', (event, ui) => {
      dialog.hasBeenDragged = true;
    });

    dialog.resizable(); // TODO
    dialog.draggable();

    dialog.closeDialog = () => {
      if (autoDestroy === false) {
        dialog.hide();

        dialog.trigger('hide');
      } else {
        dialog.remove();
        // dialogClosed(dialog);
      }
    };

    dialog.keyup((e) => {
      if (e.keyCode === 27) { dialog.closeDialog(); }
    });
    var closeButton = jquery('<div/>', { css:{ color:'white', fontWeight:'bold', textColor:'white', width:'16px', height:'16px', lineHeight:'14px', margin:'1px', padding:'1px !important', zIndex:1200 },
      click:() => {
        dialog.closeDialog();
      } }).appendTo(dialog);
    closeButton.button({ label:'X' }).addClass('wmjsdialog-closebutton');

    var dialogContent = jquery('<div/>', {
      css:{ position:'absolute', right:'0px', top:'18px', background:'#FFF', borderTop:'1px solid #01405e', width:'100%', height:'100%', overflow:'auto', fontSize:'10px', lineHeight:'12px' },
      mousedown:(event) => {
        // event.stopPropagation();
        preventdefaultEvent(event);
      }
    }).appendTo(dialog);

    dialog.resize(() => {
      dialogContent.css({ width:dialog.width() + 'px', height:(dialog.height() - 18) + 'px' });
    });
    dialog.resize();

    dialog.setLoading = () => {
      dialogContent.html('<img style="margin-left:10px;margin-top:10px;" src="' + loadingImageSrc + '"/>');
    };

    dialog.setXY = (x, y) => {
      dialog.hasBeenDragged = false;
      dialog.css({ left:x + 'px', top:y + 'px' });//, zIndex:1000});
      var geopos = _map.getGeoCoordFromPixelCoord({ x:x, y:y });
      dialog.geoPosX = geopos.x;
      dialog.geoPosY = geopos.y;
      dialog.x = x;
      dialog.y = y;
    };
    dialog.setXY(x, y);
    dialog.origX = x;
    dialog.origY = y;

    dialog.setLoading();

    dialog.setHTML = (data) => {
      dialogContent.html(data);
    };

    if (isDefined(options.dataURL)) {
      var update = (data) => {
        dialogContent.html(data);
      };

      MakeHTTPRequest(options.dataURL, update, update);
    }

    return dialog;
  }
};
