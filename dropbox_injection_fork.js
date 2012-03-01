//NOTE: web3 uses prototype, so we should to
//TODO: fix this. ^

//NOTE: block comments fuck the minification hax
//javascript:(
console.log('hello!');
console.log('time to start loading things!')
var otherlib=false,
    msg='',
    readytogo=0;
    var vidcontainer = document.getElementById('main-nav').appendChild(document.createElement('div'));
    vidcontainer.style.margin = '25px 0px';
    vidcontainer.style.backgroundColor = 'black';
    vidcontainer.style.height = '112px';
    vidcontainer.style.width = '150px';
    vidcontainer.innerHTML = '<img src=\"https://dl.dropbox.com/s/jd57hlkkmpey86m/dbx_animation.gif?dl=1\" />'
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
    console.log("running everything");
    setTimeout(function() {$$('a[href=http://site.zigfu.com/main/watermark]')[0].style.opacity = 0;}, 300);
    setTimeout(function() {$$('a[href=http://site.zigfu.com/main/watermark]')[0].style.opacity = 0;}, 600);
    setTimeout(function() {$$('a[href=http://site.zigfu.com/main/watermark]')[0].style.opacity = 0;}, 1000);
    setTimeout(function() {$$('a[href=http://site.zigfu.com/main/watermark]')[0].style.opacity = 0;}, 5000);
    
    console.log('killed parter branding');
    // start the video

    console.log(vidcontainer)
    vidcontainer.innerHTML = '<div id=\"canvasCont\"><div id=\"depthCan\"><canvas style=\"width:100%; height:100%;\" id=\"depth\" width=\"160\" height=\"120\"></canvas></div></div>'

    var pluginContainer = document.body.appendChild(document.createElement('div'));
    pluginContainer.id = 'pluginContainer';
    pluginContainer.innerHTML = '<object id=\"ZigPlugin\" type=\"application/x-zig\" width=\"0\" height=\"0\"><param name=\"onload\" value=\"ZigPluginLoaded\" /></object>';
    var plugin = document.getElementById("ZigPlugin");
    var handleDepth = function(u) {
        drawDM(plugin);
    }
    plugin.addEventListener("NewFrame", handleDepth, false);
    plugin.requestStreams(true, true, false);
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

console.log('functions loaded...');

//load modules then call runEverything

// zigfu
getScript('https://dl.dropbox.com/s/q1wudh4xu7man9m/zig-full.js?dl=1', function() {
    if (typeof zig=='undefined') {
        msg='Sorry, but zig-full wasn\'t able to load';
    } else {
        msg='This page is now ready to use the kinect';
    }
    console.log(msg);
    // jquery
            getScript('http://code.jquery.com/jquery-1.4.2.js',function() {
                console.log("STOPPING THE CONFLICTS!");
                var $jj = jQuery.noConflict();
                console.log("CONFLICTS STOPPED!");
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
console.log('welp, that is the end of the file');
