kinectbox = function(){

console.log('dstime to start loading things!');

//constants
var ZIGFU_FULL_URL = 'https://dl.dropbox.com/s/q1wudh4xu7man9m/zig-full.js?dl=1';
var LOADING_ANIMATED_GIF = 'https://dl.dropbox.com/s/jd57hlkkmpey86m/dbx_animation.gif?dl=1'

var TOP_OFFSET = 127;
var LEFT_OFFSET = 180;
var avgDepth = 6;
var cursorWidth = 15;
var currentPath = [];

//state variables
var isPushed = false;
var usesCursor = true;

/*
var UI_MODES = {
    PUSHED = 0;
    UNPUSHED = 1;
    NO_CURSOR = 2;
    PREVIEW_NO_CURSOR = 3;
    PREVIEW_CURSOR = 4;
}
*/

var codexStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var codexInt = [];

var xAvger, yAvger, isCursorMoving, scrollLimiter, dmLimiter, theCursor, dmLimiter;

for(var i = 0; i < 256; i++) {
    var idx = codexStr.indexOf(String.fromCharCode(i));
    codexInt[i] = idx;
}

var saturate = 128;

var otherlib=false,
    msg='',
    readytogo=0;
var vidcontainer = document.getElementById('main-nav').appendChild(document.createElement('div'));
    vidcontainer.style.margin = '25px 0px';
    vidcontainer.style.backgroundColor = 'black';
    vidcontainer.style.height = '112px';
    vidcontainer.style.width = '150px';
    vidcontainer.innerHTML = '<img src=\"'+LOADING_ANIMATED_GIF+'\" />';

function toggleProMode() {
    usesCursor = !usesCursor;
    if (usesCursor){
        jQuery('#kinectState')
            .css('backgroundColor', '1f75cc')
            .text('EDIT MODE');
        jQuery('#cursor').show();
    } else {
        jQuery('#kinectState')
            .css('backgroundColor', '#88CC77')
            .text('BROWSE MODE');
        jQuery('#cursor').show();
    }
}

function killZigfuStuff() {
    setTimeout(function() {$$('a[href=http://site.zigfu.com/main/watermark]')[0].style.opacity = 0;}, 300);
    setTimeout(function() {$$('a[href=http://site.zigfu.com/main/watermark]')[0].style.opacity = 0;}, 600);
    setTimeout(function() {$$('a[href=http://site.zigfu.com/main/watermark]')[0].style.opacity = 0;}, 1000);
    console.log('killed parter branding');
}

function runEverything() {
    //LETS GET STARTED.
    var plugin, pluginContainer
    console.log("running everything");
    killZigfuStuff();

    jQuery('#main-nav').append(jQuery('<div id=\"kinectState\" />')
        .css('border-radius', 10)
        .css('height', 25)
        .css('width', 150)
        .css('valign', 'middle')
        .css('text-align', 'center')
        .css('font-size', '18px')
        .css('font-weight', 'bold')
        .css('color', 'white')
        .click(toggleProMode));
    if (usesCursor){
        jQuery('#kinectState')
            .css('backgroundColor', 'blue')
            .text('EDIT MODE');
        jQuery('#cursor').show()
    } else {
        jQuery('#kinectState')
            .css('backgroundColor', '#88CC77')
            .text('BROWSE MODE');
        jQuery('#cursor').hide()
    }

    //setup video
    vidcontainer.innerHTML = '<div id=\"canvasCont\"><div id=\"depthCan\"><canvas style=\"width:100%; height:100%;\" id=\"depth\" width=\"160\" height=\"120\"></canvas></div></div>';
    jQuery('#main-nav').append('<div id=\"waveTell\">WAVE TO GET FOCUS</div>');
    jQuery('#waveTell').css('position', 'relative')
        .css('top', '-112px')
        .css('font-weight', 'bold')
        .css('color', 'white')
        .css('text-align', 'center');
    pluginContainer = document.body.appendChild(document.createElement('div'));
    pluginContainer.id = 'pluginContainer';
    pluginContainer.innerHTML = '<object id=\"ZigPlugin\" type=\"application/x-zig\" width=\"0\" height=\"0\"><param name=\"onload\" value=\"ZigPluginLoaded\" /></object>';
    plugin = document.getElementById("ZigPlugin");

    // start zig

    zig.init(plugin);
    plugin.addEventListener("NewFrame", function(u){drawDM(plugin);}, false);
    plugin.requestStreams(true, true, false);

    // setup cursor!!
    theCursor = zig.controls.Cursor();
    cursorDiv = jQuery('<div>')
                    .css('position', 'fixed')
                    .css('display', 'block')
                    .css('height', cursorWidth + 'px')
                    .css('width', cursorWidth+'px')
                    .css('backgroundColor', 'blue')
                    .css('border-radius', cursorWidth/2)
                    .css('z-index', 65535)
                    .attr('id', 'cursor');
    jQuery('body').append(cursorDiv);

    // add some pop-up shit. super hax
    jQuery('#cursor').append('<div id=\"leftarrow\" class=\"kinectArrow\" style=\"position:absolute; top:-45px; left:-170px;\"><img src=\"https://dl.dropbox.com/s/cmtc0d6cq6ziotu/leftarrow.png?dl=1\" style=\"position: absolute;\" /><div style=\"position: absolute; top:36px; left:18px; color:#fff; text-align:center; font-weight:bold;\">parent folder</div></div><div id=\"uparrow\" class=\"kinectArrow\" style=\"position:absolute; top:-170px; left:-45px;\"><img src=\"https://dl.dropbox.com/s/jz7cqddt2nchewt/arrow.png?dl=1\" style=\"position: absolute;\" /><div style=\"position: absolute; top:36px; left:24px; color:#fff; text-align:center; font-weight:bold;\">Cut</div></div><div id=\"rightarrow\" class=\"kinectArrow\" style=\"position:absolute; top:-45px; left:80px;\"><img src=\"https://dl.dropbox.com/s/32kltg8ooibjmx8/rightarrow.png?dl=1\" style=\"position: absolute;\" /><div style=\"position: absolute; top:40px; left:55px; color:#fff; text-align:center; font-weight:bold;\">Open</div></div><div id=\"downarrow\" class=\"kinectArrow\" style=\"position:absolute; top:80px; left:-45px;\"><img src=\"https://dl.dropbox.com/s/8pfm4whijw18vw8/downarrow.png?dl=1\" style=\"position: absolute;\" /><div style=\"position: absolute; top:36px; left:24px; color:#fff; text-align:center; font-weight:bold;\">Paste</div></div><div id=\"motivator\" class=\"kinectArrow\" style=\"position:absolute; top:-40px; left:-40px; font-weight:bold; font-size:30px; text-align:center;\"> THROW THE FILE! </div>');
    jQuery('.kinectArrow').css('opacity', 0.6).hide();
    jQuery('body').append(jQuery('<div>')
        .css('position', 'fixed')
        .css('height', cursorWidth + 'px')
        .css('z-index', 65536).attr('id', 'fileCursor'));
    jQuery('#fileCursor').hide();
    if (!usesCursor){
        jQuery('#cursor').hide();
    }

    xAvger = simple_moving_averager(avgDepth);
    yAvger = simple_moving_averager(avgDepth);
    isCursorMoving = true;

    dmLimiter = Limiter(50);
    slowScrollLimiter = Limiter(500);
    scrollLimiter = Limiter(150);
    swipeLimiter = Limiter(1500);

    theCursor.addEventListener('click', clickFunc);
    theCursor.addEventListener('move', moveHandler);
    theCursor.addEventListener('push', pushFunc);
    theCursor.addEventListener('release', releaseFunc);

    var swipeDetector = zig.controls.SwipeDetector();
    swipeDetector.addEventListener('swipeup', function(pd) {
        //nothing
        //console.log('SwipeDetector: Swipe Up');f
    });
    swipeDetector.addEventListener('swipedown', function(pd) {
        if (usesCursor && !DropboxActions.is_preview_active()) { return; }
        swipeLimiter.doIfCan(function() {
            console.log('SwipeDetector: Swipe Down');
            if (DropboxActions.is_preview_active()) {
                DropboxActions.close_preview();
            }
        });
    });
    swipeDetector.addEventListener('swipeleft', function(pd) {
        if (usesCursor && !DropboxActions.is_preview_active()) { return; }
        swipeLimiter.doIfCan(function() {
            console.log('SwipeDetector: Swipe Left');
            if (DropboxActions.is_preview_active()) {
                console.log('next preview!');
                DropboxActions.next_preview();
            }
            else {
                console.log('open selected!');
                DropboxActions.open_selected();
            }
        });
    });
    swipeDetector.addEventListener('swiperight', function(pd) {
        if (usesCursor && !DropboxActions.is_preview_active()) { return; }
        swipeLimiter.doIfCan(function() {
            console.log('SwipeDetector: Swipe Right');
            if (DropboxActions.is_preview_active()) {
                DropboxActions.prev_preview();
            }
            else {
                DropboxActions.go_up_directory();
            }
        });
    });
    swipeDetector.addEventListener('swipe', function(dir) {
        //console.log('SwipeDetector: Swipe direction: ' + dir);
    });

    zig.singleUserSession.addListener(swipeDetector);
    zig.singleUserSession.addEventListener('sessionstart', sessionStartFunc);
    zig.singleUserSession.addEventListener('sessionend', sessionEndFunc);
    zig.singleUserSession.addListener(theCursor);
    console.log('everything is loaded');




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
    dmLimiter.doIfCan(function () {
        var dm = plugin.depthMap;
        if (dm.length === 0) return;
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
    });
}

function sessionStartFunc(focusPosition) {
    xAvger = simple_moving_averager(avgDepth);
    yAvger = simple_moving_averager(avgDepth);
    console.log('session start!');
    saturate = 255;
    jQuery('#waveTell').hide();
    jQuery("#cursor").css('backgroundColor', 'blue');
}

function sessionEndFunc() {
    xAvger = stationary_number(jQuery("#cursor").css('left'));
    yAvger = stationary_number(jQuery("#cursor").css('top'));
    isCursorMoving = true;
    saturate = 128;
    console.log('session end!');
    jQuery('#waveTell').show();
    jQuery("#cursor").css('backgroundColor', 'green').css('z-index', 65535);
}

function getX(theCursor){
    var scaler = (window.innerWidth - LEFT_OFFSET);
    var raw_x = Math.max(0, Math.min(scaler, (theCursor.x * scaler * 1.2) - (scaler * 0.1)));
    return raw_x + LEFT_OFFSET - (cursorWidth/2);
}

function getY(theCursor){
    var scaler = (window.innerHeight - (TOP_OFFSET));
    var raw_y = Math.max(0, Math.min(scaler, (theCursor.y * scaler * 1.2) - (scaler * 0.1)));
    return raw_y + TOP_OFFSET - (cursorWidth/2);
}

function leftAction(){
    DropboxActions.go_up_directory();
}

function rightAction(){
    DropboxActions.open_selected();
}

function downAction(){
    DropboxActions.paste_to_selected_folder();
}

function topAction(){
    DropboxActions.store_selected_to_clipboard();
}

function swipeLeftAction(){
    console.log('swipeLeftAction');
}

function swipeRightAction(){
    console.log('swipeRightAction');
}

/*
function lingerify(e){
    var ot = jQuery('#cursor').css('top');
    var ol = jQuery('#cursor').css('left');
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
    ne.animate({opacity: 1}, 1000);
    setTimeout(function(){
        console.log(ot, ol);
        jQuery('#tempElementThing').remove();
    }, 2000);
}
*/
function handlePushedMove(x, y){
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
        if (relative_y > final_threshold){
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
        atLastRelease(null);
        jQuery('#fileCursor').hide();
    }
}

function handleUnpushedMove(x, y, visible_cursor){
    if (visible_cursor){
        jQuery("#cursor").css('left', x + "px");
        jQuery("#cursor").css('top', y + "px");
    }
    cursorOver = jQuery(document.elementFromPoint(x - 3, y - 3)); //scoot over and up so we don't select the cursor
    browseFileParent = cursorOver.closest('.browse-file');

    if (browseFileParent != []) {
        //we're over a file...select it!
        browseObj = BrowseFile.from_elem(browseFileParent[0]);
        if (typeof browseObj == 'undefined') {
            //console.log("sadly unable to get the browsefile object....SADFACE");
        } else {
            BrowseSelection.set_selected_files(browseObj);
        }
        extreme_indexes = BrowseUtil.get_files_in_view();
        if (y >= window.innerHeight - 15) {
            //scrolls us down one
            var rank = BrowseSelection.get_selected_files()[0].sort_rank;
            scrollLimiter.doIfCan(function() {
                Browse.scrollTo(Browse.files[rank + 1].get_div());
                BrowseSelection.set_selected_files(Browse.files[Math.max(Browse.files.length-1, rank+1)]);
            });
        }
        if (y <= TOP_OFFSET + 5) {
            //scrolls us down one
            var rank = BrowseSelection.get_selected_files()[0].sort_rank;
            scrollLimiter.doIfCan(function() {
                Browse.scrollTo(Browse.files[rank - 1].get_div());
                BrowseSelection.set_selected_files(Browse.files[Math.max(0, rank-1)]);
            });
        }
    }
}

function handleFileMove(cur, visible_cursor){
    var sfs = BrowseSelection.get_selected_files();
    var next_index = 0;
    var fast = false;
    if (sfs.length > 0) {
        var selected_file = sfs[0];
        var rank = selected_file.sort_rank;
        if (cur.y < .35) {
            next_index = Math.max(0, rank - 1);
        } else if (cur.y > .65) {
            next_index = Math.min(Browse.files.length, rank + 1);
        } else {
            next_index = rank;
        }
        if (cur.y < .17 || cur.y > .83){
            fast = true;
        }
    }
    if (fast){
        scrollLimiter.doIfCan(function() {
            Browse.scrollTo(Browse.files[next_index].get_div());
            BrowseSelection.set_selected_files(Browse.files[next_index]);
        });
    } else {
        slowScrollLimiter.doIfCan(function() {
            Browse.scrollTo(Browse.files[next_index].get_div());
            BrowseSelection.set_selected_files(Browse.files[next_index]);
        });
    }
}

function moveHandler(cursor) {
    var x = xAvger(getX(cursor));
    var y = yAvger(getY(cursor));
    //console.log('rx ry x y bottom top', Math.floor(getX(theCursor)), Math.floor(getY(theCursor)), Math.floor(x), Math.floor(y), TOP_OFFSET, window.innerHeight);
    if (DropboxActions.is_preview_active()){

    } else {
        if (usesCursor){
            if (isPushed){
                handlePushedMove(x, y);
                return;
            } else {
                handleUnpushedMove(x, y, true);
            }
        } else {
            handleFileMove(cursor, false);
            //handleUnpushedMove(400, y, true);
        }
    }
}

function clickFunc(theCursor) {
    console.log("CLICKETY-CLACK CLACK!");
    var xpos = theCursor.x * window.innerWidth;
    var ypos = theCursor.y * window.innerHeight;
}

function atLastRelease(theCursor){
    if (!usesCursor) return;
    isPushed = false;
    jQuery('.kinectArrow').hide();
    jQuery('#fileCursor').hide();

    console.log('              ...release');
    jQuery('#cursor').css('opacity', 0.5);
    jQuery("#cursor").css('width', cursorWidth);
    jQuery("#cursor").css('height', cursorWidth);
}

function releaseFunc(theCursor) {

}

function pushFunc(theCursor){
    if (!usesCursor || DropboxActions.is_preview_active()) return;
    isPushed = true;

    jQuery('#fileCursor').empty().append(jQuery('#'+BrowseSelection.get_selected_files()[0].get_div().id).find('.icon').clone());
    jQuery('#fileCursor').show();
    jQuery('.kinectArrow').show();
    console.log('dsPUSH');
    jQuery('#cursor').css('opacity', 0.8);
    jQuery("#cursor").css('width', cursorWidth * 1.2);
    jQuery("#cursor").css('height', cursorWidth * 1.2);
    setTimeout(function(){atLastRelease(theCursor)}, 2500);
}

var DropboxActions = {
    clipboard : 'undefined',
    delete_selected : function() {
        FileOps.do_bulk_delete(BrowseSelection.get_selected_files());
    },
    store_selected_to_clipboard : function() {
        clipboard = BrowseSelection.get_selected_files();
        Notify.server_success('Cut ' + BrowseSelection.get_selected_files()[0].fq_path);
    },
    paste_to_selected_folder : function() {
        if (!BrowseSelection.get_selected_files()[0].dir){
            Notify.server_error('cannot paste in not a dir');
            return;
        }
        FileOps.do_bulk_move(clipboard, BrowseSelection.get_selected_files()[0].fq_path);
        Notify.server_success('pasted ' + clipboard[0].fq_path + ' in ' + BrowseSelection.get_selected_files()[0].fq_path);
    },
    open_selected : function() {
        var selection = BrowseSelection.get_selected_files();
        if (1 == selection.length) {
            var file = selection[0];
            if (file.dir) {
                //maaaaaaaaaaaaybe?
                Browse.select_index = 0; // select the first file in the new dir
                Browse.open_folder(file);
            } else if (file.preview_type) {
                BrowseUtil.filepreview_from_selected(file);
                jQuery('#cursor').css('left', '5px').css('top', '5px');
            } else {
                //WTF DO I DO NOW?????
                //not a directory or file preview
                return;
            }
        }
        else {
            console.log("YOU SELECTED MUTLIPLE FILES YOU FUCK");
            BrowseSelection.set_selected_files([]);
        }
    },
    go_up_directory : function() {
        //this will escape gallery view AND go up a directory
        BrowseKeys.advanced_dict.up_dir.onPress();
    },
    next_preview : function() {
        $$('.next')[0].simulate('click');
    },
    prev_preview : function() {
        $$('.prev')[0].simulate('click');
    },
    close_preview : function() {
        $$('.close')[0].simulate('click');
    },
    is_preview_active : function() {
        return FilePreviewModal.shown;
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

//Limits things
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

getScript(ZIGFU_FULL_URL, function() {
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

return DropboxActions;  //this is our only public api
}();
