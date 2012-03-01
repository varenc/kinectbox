//NOTE: web3 uses prototype, so you have to use $jq or jQuery instead of $
//NOTE: block comments fuck the minification hax
//javascript:(
(function(){
    var otherlib=false,
        msg='',
        readytogo=0;
    //force jQuery onto the page - based loosely on some code from Karl Swedberg's blog.
    if(typeof jQuery!='undefined') {
        console.log('This page already using jQuery v'+jQuery.fn.jquery);
    } else if (typeof $=='function') {
        otherlib=true;
    }
     
    // more or less stolen form jquery core and adapted by paul irish
    function getScript(url,success){
        var script=document.createElement('script');
        script.src=url;
        var head=document.getElementsByTagName('head')[0],
            done=false;
        // Attach handlers for all browsers
        script.onload=script.onreadystatechange = function(){
            if ( !done && (!this.readyState
                 || this.readyState == 'loaded'
                 || this.readyState == 'complete') ) {
                done=true;
                success();
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            }
        };
        head.appendChild(script);
    }

    function runEverything() {

        //LETS GET STARTED.
        jQuery(function() {
            setTimeout(function() {jQuery("a[href=http://site.zigfu.com/main/watermark]").css('opacity',0)}, 300);
            setTimeout(function() {jQuery("a[href=http://site.zigfu.com/main/watermark]").css('opacity',0)}, 600);
            setTimeout(function() {jQuery("a[href=http://site.zigfu.com/main/watermark]").css('opacity',0)}, 1000);
            setTimeout(function() {jQuery("a[href=http://site.zigfu.com/main/watermark]").css('opacity',0)}, 5000);
        });

        jQuery('body').append("<div id=\"container\" style=\"position:absolute; z-index:-1; top:20%; width:10%; height:10%;\"><div id=\"canvasCont\"><div id=\"depthCan\"><canvas style=\"width:100%; height:100%;\" id=\"depth\" width=\"160\" height=\"120\"></canvas></div></div></div>");
        jQuery('body').append('<div id=\"pluginContainer\"><object id=\"ZigPlugin\" type=\"application/x-zig\" width=\"0\" height=\"0\"><param name=\"onload\" value=\"ZigPluginLoaded\" /></object></div>');
        var plugin = document.getElementById("ZigPlugin");
        var handleDepth = function(u) {
            drawDM(plugin);
        }
        plugin.addEventListener("NewFrame", handleDepth, false);
        plugin.requestStreams(true, true, false);
        //manually init zig because it doesn't on its own at injectiontime
        zig.init(plugin);

        //video redering helpers
        var codexStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var codexInt = [];
        for(var i = 0; i < 256; i++) {
          var idx = codexStr.indexOf(String.fromCharCode(i));
          codexInt[i] = idx;
        }
        var Base64 =
        {
            decode : function (input)
            {
                var output = new Array(input.length*3/4);
                var inLength = input.length;
                var outIndex = 0;
                for (var i = 0; i < inLength; i += 4) {
                    var enc1 = codexInt[input.charCodeAt(i)];
                    var enc2 = codexInt[input.charCodeAt(i+1)];
                    var enc3 = codexInt[input.charCodeAt(i+2)];
                    var enc4 = codexInt[input.charCodeAt(i+3)];

                    var chr1 = (enc1 << 2) | (enc2 >> 4);
                    var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    var chr3 = ((enc3 & 3) << 6) | enc4;

                    output[outIndex] = chr1;
                    output[outIndex+1] = chr2;
                    output[outIndex+2] = chr3;
                    outIndex += 3;
                }
                return output;
            }
        }
        function drawDM(plugin) {
            var dm = plugin.depthMap;
            if (dm.length == 0) return;
            var canv = document.getElementById('depth');
            var ctx = canv.getContext('2d');
            var pix = ctx.createImageData(160,120);
            var data = pix.data;
            var srcData = Base64.decode(dm);
            for(var i = 0; i < 160*120; i++) {
              data[i*4 + 1] = (10-srcData[i*2+1]) << 5;
              data[i*4 + 2] = 128;
              data[i*4 + 3] = 255;
            }
            ctx.putImageData(pix, 0, 0);
          }

        // cursor!!
        jQuery( function () {
            var c = zig.controls.Cursor();
            var cursorWidth = 50;
            cursorDiv = jQuery('<div>').css('position', 'fixed').css('display', 'block').css('height', cursorWidth + 'px').css('width', cursorWidth+'px').css('backgroundColor', 'blue').attr('id', 'cursor');
            jQuery('body').append(cursorDiv);
            // show/hide cursor on session start/end
            zig.singleUserSession.addEventListener('sessionstart', function(focusPosition) {
                console.log('session start!');
                jQuery("#cursor").css('backgroundColor', 'blue');
            });
            zig.singleUserSession.addEventListener('sessionend', function() {
                console.log('session end!');
                jQuery("#cursor").css('backgroundColor', 'green');
            });

            // move the cursor element on cursor move
            c.addEventListener('move', function(cursor) {
                jQuery("#cursor").css('left', (c.x * window.innerWidth - (cursorWidth / 2)) + "px");
                jQuery("#cursor").css('top', (c.y * window.innerHeight - (cursorWidth / 2)) + "px");
            });

            c.addEventListener('click', function(c) {
                console.log('CLICKETY CLACK');
            });

            c.addEventListener('push', function(c) {
                console.log('PUSH');
                jQuery("#cursor").addClass('pushed');
            });
            c.addEventListener('release', function(c) {
                console.log('release....');
                jQuery("#cursor").removeClass('pushed');
            });

            // add the cursor to our singleUserSession to make sure we get events
            zig.singleUserSession.addListener(c);

            console.log('everything is loaded');

        });
    }

    //load modules then call runEverything

    // zigfu
    getScript('file:///Users/stein/Dropbox/kinectbox/zig-full.js',function() {
        if (typeof zig=='undefined') {
          msg='Sorry, but zig-full wasn\'t able to load';
        } else {
          msg='This page is now ready to use the kinect'
        }
        console.log(msg);
        // jquery
        getScript('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js',function() {
            if (typeof jQuery=='undefined') {
              msg='Sorry, but jQuery wasn\'t able to load';
            } else {
              msg='This page is now jQuerified with v' + jQuery.fn.jquery;
              if (otherlib) {msg+=' and noConflict(). Use $jq(), not $().';}
            }
            console.log(msg);
            runEverything();
        });
    });

})();
//});