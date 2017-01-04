// =======================
// ===== Banner.JS =======
// =======================
var app = app || {}; 

app.Banner = (function () { 

    // --------------------------------------------------------------------------------------
    // initialize
    function initialize() {
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