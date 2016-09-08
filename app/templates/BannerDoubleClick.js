// ==================================
// ===== BannerDoubleClick.JS =======
// ==================================
var app = app || {};

var isEnablerMode = true;

var creative = {};


app.Banner = (function() {
    /**
     * Window onload handler.
     */
    function initialize() {
        setupDom();

        if (Enabler.isInitialized()) {
            init();
        } else {
            Enabler.addEventListener(
                studio.events.StudioEvent.INIT,
                init
            );
        }
    }

    /**
     * Initializes the ad components
     */
    function setupDom() {
        creative.dom = {};
        creative.dom.mainContainer = document.getElementById('banner');
        creative.dom.exit = document.getElementById('button-exit');
    }

    /**
     * Ad initialisation.
     */
    function init() {

        addListeners();

        // Polite loading
        if (Enabler.isVisible()) {
            show();
        } else {
            Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, show);
        }

        dispatchEvent('READY');

        app.Init.preload();
    }

    /**
     * Adds appropriate listeners at initialization time
     */
    function addListeners() {
        creative.dom.exit.addEventListener('click', exitClickHandler);
        creative.dom.mainContainer.addEventListener('click', exitClickHandler);
    }

    /**
     *  Shows the ad.
     */
    function show() {
        creative.dom.exit.style.display = 'block';
    }

    /**
     *  Exit click handler.
     */
    function exitClickHandler() {
        Enabler.exit('Background Exit');
    }// --------------------------------------------------------------------------------------

    return {
        initialize: initialize
    }
})();