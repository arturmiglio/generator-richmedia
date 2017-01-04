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

        document.getElementById('button-exit').addEventListener('click', handleExit, false);

        app.Init.preload();
    }

    // --------------------------------------------------------------------------------------
    function handleExit(e) {
        console.log("clicked");
    }

    // --------------------------------------------------------------------------------------
    // Publicly accessible methods and properties
    return { 
        initialize:initialize    
    }
    
})();