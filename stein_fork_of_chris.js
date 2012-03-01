//NOTE: web3 uses prototype, so we should to
//TODO: fix this. ^

//NOTE: block comments fuck the minification hax
//javascript:(
console.log('dstime to start loading things!')
var $jj; // make this global..
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

    console.log('killed parter branding');
    // start the video

    console.log(vidcontainer)
    vidcontainer.innerHTML = '<div id=\"canvasCont\"><div id=\"depthCan\"><canvas style=\"width:100%; height:100%;\" id=\"depth\" width=\"160\" height=\"120\"></canvas></div></div>'
    jQuery('#main-nav').append('<div id=\"waveTell\">WAVE TO GET CURSOR</div>');
    var pluginContainer = document.body.appendChild(document.createElement('div'));
    pluginContainer.id = 'pluginContainer';
    pluginContainer.innerHTML = '<object id=\"ZigPlugin\" type=\"application/x-zig\" width=\"0\" height=\"0\"><param name=\"onload\" value=\"ZigPluginLoaded\" /></object>';
    var plugin = document.getElementById("ZigPlugin");
    zig.init(plugin);
    var handleDepth = function(u) {
        drawDM(plugin);
    }
    plugin.addEventListener("NewFrame", handleDepth, false);
    plugin.requestStreams(true, true, false);

    //video redering helpers
    var codexStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var codexInt = [];
    var saturate = 128;
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
            data[i*4 + 2] = 0;
            data[i*4 + 3] = saturate;
        }
        ctx.putImageData(pix, 0, 0);
    }
    jQuery( function () {

    //swipe testing...
    var swipeDetector = zig.controls.SwipeDetector();
    swipeDetector.addEventListener('swipeup', function(pd) {
        console.log('SwipeDetector: Swipe Up');
    });
    swipeDetector.addEventListener('swipedown', function(pd) {
        console.log('SwipeDetector: Swipe Down');
    });
    swipeDetector.addEventListener('swipeleft', function(pd) {
        console.log('SwipeDetector: Swipe Left');
    });
    swipeDetector.addEventListener('swiperight', function(pd) {
        console.log('SwipeDetector: Swipe Right');
    });
    swipeDetector.addEventListener('swipe', function(dir) {
        console.log('SwipeDetector: Swipe direction: ' + dir);
    });
    zig.singleUserSession.addListener(swipeDetector);

    // cursor!!
    var c = zig.controls.Cursor();
    var cursorWidth = 15;
    cursorDiv = jQuery('<div>').css('position', 'fixed').css('display', 'block').css('height', cursorWidth + 'px');
    cursorDiv.css('width', cursorWidth+'px').css('backgroundColor', 'blue').attr('id', 'cursor');
    cursorDiv.css('border-radius', cursorWidth/2).css('z-index', 65535);
    jQuery('body').append(cursorDiv);
    // add some pop-up shit. super
    jQuery('#cursor').append('<div id=\"cursor\" style=\"background-color:blue; border-radius:15px; height:30px; width:30px; left:400px; top:150px; position:absolute;\"><div id=\"leftarrow\" class=\"kinectArrow\" style=\"position:absolute; top:-45px; left:-170px;\"><img src=\"https://dl.dropbox.com/s/cmtc0d6cq6ziotu/leftarrow.png?dl=1\" style=\"position: absolute;\" /><div style=\"position: absolute; top:36px; left:18px; color:#fff; text-align:center; font-weight:bold;\">parent folder</div></div><div id=\"uparrow\" class=\"kinectArrow\" style=\"position:absolute; top:-170px; left:-45px;\"><img src=\"https://dl.dropbox.com/s/cmtc0d6cq6ziotu/leftarrow.png?dl=1\" style=\"position: absolute;\" /><div style=\"position: absolute; top:36px; left:24px; color:#fff; text-align:center; font-weight:bold;\">move or something</div></div><div id=\"rightarrow\" class=\"kinectArrow\" style=\"position:absolute; top:-45px; left:80px;\"><img src=\"https://dl.dropbox.com/s/32kltg8ooibjmx8/rightarrow.png?dl=1\" style=\"position: absolute;\" /><div style=\"position: absolute; top:40px; left:55px; color:#fff; text-align:center; font-weight:bold;\">parent folder</div></div><div id=\"downarrow\" class=\"kinectArrow\" style=\"position:absolute; top:80px; left:-45px;\"><img src=\"https://dl.dropbox.com/s/8pfm4whijw18vw8/downarrow.png?dl=1\" style=\"position: absolute;\" /><div style=\"position: absolute; top:36px; left:24px; color:#fff; text-align:center; font-weight:bold;\">move or something</div></div><div id=\"motivator\" class='kinectArrow' style=\"position:absolute; top:-40px; left:-40px; font-weight:bold; font-size:30px; text-align:center;\"> THROW THE FILE! </div></div>');
    jQuery('.kinectArrow').css('opacity', 0.6).hide();
    jQuery('body').append(jQuery('<div>').css('position', 'fixed').css('height', cursorWidth + 'px').css('z-index', 65536).attr('id', 'fileCursor'));
    jQuery('#fileCursor').hide();

    //I added an averger here so its less bouncy...maybe we can do better than simple rolling average.
    var avgDepth = 6;
    var xAvger = simple_moving_averager(avgDepth);
    var yAvger = simple_moving_averager(avgDepth);
    var isCursorMoving = true;
    var scrollLimiter = Limiter(500); // can only do it once every 500 ms

    // show/hide cursor on session start/end
    zig.singleUserSession.addEventListener('sessionstart', function(focusPosition) {
        xAvger = simple_moving_averager(avgDepth);
        yAvger = simple_moving_averager(avgDepth);
        console.log('session start!');
        saturate = 255;
        jQuery('#waveTell').hide();
        jQuery("#cursor").css('backgroundColor', 'blue');
        });

    zig.singleUserSession.addEventListener('sessionend', function() {
        xAvger = stationary_number(jQuery("#cursor").css('left'));
        yAvger = stationary_number(jQuery("#cursor").css('top'));
        isCursorMoving = true;
        saturate = 128;
        console.log('session end!');
        jQuery('#waveTell').show();
        jQuery("#cursor").css('backgroundColor', 'green').css('z-index', 65535);
        });

    // move the cursor element on cursor move. hardcoded position of scroller thingy
    var TOP_OFFSET = 127;
    var LEFT_OFFSET = 180;
    function getX(c){
        var scaler = (window.innerWidth - LEFT_OFFSET);
        var raw_x = Math.max(0, Math.min(scaler, (c.x * scaler * 1.2) - (scaler * 0.1)));
        return raw_x + LEFT_OFFSET - (cursorWidth/2);
    }

    function getY(c){
        var scaler = (window.innerHeight - (TOP_OFFSET));
        var raw_y = Math.max(0, Math.min(scaler, (c.y * scaler * 1.2) - (scaler * 0.1)));
        return raw_y + TOP_OFFSET - (cursorWidth/2);
    }

    function leftAction(){
        console.log('leftaction');
    }

    function rightAction(){
        console.log('rightaction');
    }

    function downAction(){
        console.log('downaction');
    }

    function topAction(){
        console.log('topaction');
    }

    function lingerify(e){
        var ot = jQuery('#cursor').offset().top;
        var ol = jQuery('#cursor').offset().left;
        console.log(ot, ol);
        var ne = e.clone().css('left', ot)
                    .css('top', ol)
                    .css('opacity', 1)
                    .css('position', 'fixed')
                    .css('z-index', 65532)
                    .css('display', 'block')
                    .attr('id', 'tempElementThing');
        ne.removeClass('kinectArrow');
        jQuery('body').append(ne);
        console.log(ne);
        ne.animate({opacity: 1}, 1000)
        setTimeout(function(){
            console.log(ot, ol);
            jQuery('#tempElementThing').remove();
        }, 2000);
    }

    function moveHandler(cursor) {
        x = xAvger(getX(c));
        y = yAvger(getY(c));
        //console.log('rx ry x y bottom top', Math.floor(getX(c)), Math.floor(getY(c)), Math.floor(x), Math.floor(y), TOP_OFFSET, window.innerHeight);
        if (isPushed){
            jQuery("#fileCursor").css('left', x + "px");
            jQuery("#fileCursor").css('top', y + "px");

            var relative_x = x - parseFloat(jQuery('#cursor').css('left'));
            var relative_y = y - parseFloat(jQuery('#cursor').css('top'));
            var threshold = 50;
            var final_threshold = 120;

            var el;
            if ((relative_x > threshold) && (relative_x > Math.abs(relative_y))){
                if (relative_x > final_threshold){
                    el = jQuery('#rightarrow');
                    rightAction();
                } else {
                    jQuery('.kinectArrow').css('opacity', 0.6);
                    jQuery('#rightarrow').css('opacity', 1);
                }
            }
            if ((relative_x < -threshold) && (relative_x < -Math.abs(relative_y))){
                if (relative_x < -final_threshold){
                    el = jQuery('#leftarrow').clone();
                    leftAction();
                } else {
                    jQuery('.kinectArrow').css('opacity', 0.6);
                    jQuery('#leftarrow').css('opacity', 1);
                }
            }
            if ((relative_y > threshold) && (relative_y > Math.abs(relative_x))){
                if (relative_x > final_threshold){
                    el = jQuery('#downarrow').clone();
                    downAction();
                } else {
                    jQuery('.kinectArrow').css('opacity', 0.6);
                    jQuery('#downarrow').css('opacity', 1);
                }
            }
            if ((relative_y < -threshold) && (relative_y < -Math.abs(relative_x))){
                if (relative_y < -final_threshold){
                    el = jQuery('#uparrow').clone();
                    topAction();
                } else {
                    jQuery('.kinectArrow').css('opacity', 0.6);
                    jQuery('#uparrow').css('opacity', 1);
                }
            }
            if (Math.max(Math.abs(relative_y), Math.abs(relative_x)) > final_threshold) {
                releaseFunc(null);
                lingerify(el);
            }
            return;
        }
        jQuery("#cursor").css('left', x + "px");
        jQuery("#cursor").css('top', y + "px");

        cursorOver = jQuery(document.elementFromPoint(x - 3, y - 3)); //scoot over and up so we don't select the cursor
        browseFileParent = cursorOver.closest('.browse-file');

        if (browseFileParent != []) {
            //console.log("selecting whats under me! coords = [" + x + ", " + y + "]");
            //we're over a file...select it!
            browseObj = BrowseFile.from_elem(browseFileParent[0]);
            if (typeof browseObj == 'undefined') {
                //console.log("sadly unable to get the browsefile object....SADFACE");
                //return;
            } else {
                BrowseSelection.set_selected_files(browseObj);
            }
            extreme_indexes = BrowseUtil.get_files_in_view();
            //console.log("Last in view -->" + last_file_index + "    and the current selected one = "+ browseObj.sort_rank);
            if (y >= window.innerHeight - 15) {
                //scrolls us down one
                var rank = BrowseSelection.get_selected_files()[0].sort_rank;
                //console.log('we at the end!!', rank);
                scrollLimiter.doIfCan(function() {
                    Browse.scrollTo(Browse.files[rank + 1].get_div());
                    BrowseSelection.set_selected_files(Browse.files[Math.max(Browse.files.length-1, rank+1)]);
                });
                //Browse.scrollTo(Browse.files[BrowseUtil.get_files_in_view()[1]].get_div());
            }
            if (y <= TOP_OFFSET + 5) {
                //scrolls us down one
                var rank = BrowseSelection.get_selected_files()[0].sort_rank;
                //console.log('we at the start!!', rank);
                scrollLimiter.doIfCan(function() {
                    Browse.scrollTo(Browse.files[rank - 1].get_div());
                    BrowseSelection.set_selected_files(Browse.files[Math.max(0, rank-1)]);
                });
                //Browse.scrollTo(Browse.files[BrowseUtil.get_files_in_view()[1]].get_div());
            }
        }
    }

    function clickFunc(c) {
        console.log("CLICKETY-CLACK CLACK!");
        var xpos = c.x * window.innerWidth;
        var ypos = c.y * window.innerHeight;

        //comment from stein: I don't think we're good enough for clickin. :(
        //edit: i tweaked zip-full. we're better now

        //this will click on the current position....
        /*var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 1, xpos, ypos, xpos, ypos, false, false, false, false, 0, null);
        window.dispatchEvent(evt);
        */
    }

    var isPushed = false;

    function releaseFunc(c) {
        isPushed = false;
        jQuery('.kinectArrow').hide();
        jQuery('#fileCursor').hide();
        //xAvger = simple_moving_averager(avgDepth);
        //yAvger = simple_moving_averager(avgDepth);
        console.log('dsrelease....');

        jQuery('#cursor').css('opacity', .5)
        jQuery("#cursor").css('width', cursorWidth);
        jQuery("#cursor").css('height', cursorWidth);
    }

    function pushFunc(c){
        isPushed = true;

        jQuery('#fileCursor').empty().append(jQuery('#'+BrowseSelection.get_selected_files()[0].get_div().id).find('.icon').clone());
        jQuery('#fileCursor').show();
        jQuery('.kinectArrow').show();
        //xAvger = stationary_number(jQuery("#cursor").css('left'));
        //yAvger = stationary_number(jQuery("#cursor").css('top'));
        console.log('dsPUSH');
        jQuery('#cursor').css('opacity', .8)
        jQuery("#cursor").css('width', cursorWidth * 1.2);
        jQuery("#cursor").css('height', cursorWidth * 1.2);
    }

    c.addEventListener('click', clickFunc);
    c.addEventListener('move', moveHandler);
    c.addEventListener('push', pushFunc);
    c.addEventListener('release', releaseFunc);

    // add the cursor to our singleUserSession to make sure we get events
    zig.singleUserSession.addListener(c);
    console.log('everything is loaded');

    });
}

console.log('functions loaded...');

DropboxActions = {
    clipboard : 'undefined',
    delete_selected : function() {
        FileOps.do_bulk_delete(BrowseSelection.get_selected_files());
    },
    store_selected_to_clipboard : function() {
        clipboard = BrowseSelection.get_selected_files();
    },
    paste_to_selected_folder : function() {
        FileOps.do_bulk_move(clipboard, BrowseSelection.get_selected_files()[0].fq_path);
    },
    open_selected : function() {
        jQuery(BrowseSelection.get_selected_files()[0].get_div()).find('.filename-link')[0].simulate('click');
    }
};

function simple_moving_averager(period) {
    var nums = [];
    return function(num) {
        nums.push(num);
        while (nums.length < period){
            //inertia
            nums.push(num);
        }
        if (nums.length > period)
            nums.splice(0,1);  // remove the first element of the array
        var sum = 0;
        nums.each(function(i) {
            sum += i;
        });
        var n = period;
        if (nums.length < period)
            n = nums.length;
        return(sum/n);
    };
}

// for stubbing the averager
function stationary_number(num){
    return function(n){
        return num;
    }
}

//
function Limiter(maxFrequency) {
    var lastFrame;
    var lastDelta;
    var lastDone;

    var pub = {
        markframe : markframe,
        lastDelta : 0,
        fps : 0,
        maxFrequency : maxFrequency,
        doIfCan : function(xx) {
            markframe();
            now = (new Date()).getTime();
            if (lastDone === undefined || (now - lastDone) > maxFrequency) {
                lastDone = now;
                xx();
            }
        }
    };

    function markframe(timestamp) {
        timestamp = timestamp || (new Date()).getTime();
        lastFrame = lastFrame || timestamp;
        pub.lastDelta = ((timestamp - lastFrame));  // diff in miliseconds
        pub.fps = 1 / pub.lastDelta;
        lastFrame = timestamp;
    }

    return pub;
}


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


(function(){

  var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|mouse(?:down|up|over|move|out))$/
  };
  var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
  };

  Event.simulate = function(element, eventName) {
    var options = Object.extend(defaultOptions, arguments[2] || { });
    var oEvent, eventType = null;

    element = $(element);

    for (var name in eventMatchers) {
      if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
      throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent) {
      oEvent = document.createEvent(eventType);
      if (eventType == 'HTMLEvents') {
        oEvent.initEvent(eventName, options.bubbles, options.cancelable);
      }
      else {
        oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
          options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
          options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
      }
      element.dispatchEvent(oEvent);
    }
    else {
      options.clientX = options.pointerX;
      options.clientY = options.pointerY;
      oEvent = Object.extend(document.createEventObject(), options);
      element.fireEvent('on' + eventName, oEvent);
    }
    return element;
  };

  Element.addMethods({ simulate: Event.simulate });
})();


console.log('welp, that is the end of the file');
