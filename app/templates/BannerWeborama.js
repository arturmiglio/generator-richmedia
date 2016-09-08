// =============================
// ===== BannerWeborama.JS =====
// =============================
var app = app || {}; 

var firstLoadFiles = [
    //"file1.jpg",
    //"file2.jpg"
];

app.Banner = (function () { 

    // --------------------------------------------------------------------------------------
    // initialize
    function initialize() {
        dispatchEvent(new Event("READY"));

        screenad.setAlignment('banner', 'banner');
        screenad.setSize("<%= bannerWidth %>", "<%= bannerHeight %>");
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