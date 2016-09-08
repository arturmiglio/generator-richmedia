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

        customDispatchEvent('READY');
        app.Init.preload();
    }

    // --------------------------------------------------------------------------------------
    // Publicly accessible methods and properties
    return { 
        initialize:initialize    
    }
})();