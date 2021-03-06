// ===================================
// ===== BannerFlashtalking.JS =======
// ===================================
var app = app || {}; 

app.Banner = (function () {

    var button; 

    // --------------------------------------------------------------------------------------
    function initialize() {
        button = myFT.$("#button-exit");
        myFT.applyClickTag(button, 1);

        var event = document.createEvent('Event');
        event.initEvent('READY', false, true); 
        window.dispatchEvent(event);

        app.Init.preload();
    }

    // --------------------------------------------------------------------------------------
    // Publicly accessible methods and properties
    return { 
        initialize:initialize    
    }
})();