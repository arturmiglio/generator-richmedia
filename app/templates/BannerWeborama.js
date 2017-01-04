// =============================
// ===== BannerWeborama.JS =====
// =============================
var app = app || {}; 

app.Banner = (function () { 

    // --------------------------------------------------------------------------------------
    // initialize
    function initialize() {
        var event = document.createEvent('Event');
        event.initEvent('READY', false, true); 
        window.dispatchEvent(event);

        screenad.setAlignment('banner', 'banner');
        screenad.setSize('<%= bannerWidth %>', '<%= bannerHeight %>');
        screenad.setSticky(true);
        screenad.setZIndex(1);
        screenad.setOffset(0, 0)
        screenad.position();

        document.getElementById('button-exit').addEventListener('click', handleExit, false);

        app.Init.preload();
    }

    // --------------------------------------------------------------------------------------
    function handleExit(e) {
        screenad.click();
        console.log('>> button-exit clicked: screenad default click event');
    }

    // --------------------------------------------------------------------------------------
    // Publicly accessible methods and properties
    return { 
        initialize:initialize    
    }
    
})();