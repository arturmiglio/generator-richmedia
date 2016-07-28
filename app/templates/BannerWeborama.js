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
        preloadAssets();
    }

    // --------------------------------------------------------------------------------------
    // preload
    function preloadAssets(){
      preloader = new createjs.LoadQueue(false);
      preloader.setMaxConnections(6);
      loadFirstLoad();
    }
    function loadFirstLoad(){
      var assets = [];
      for (var i = 0; i < firstLoadFiles.length; i++) {
        assets.push( {id:firstLoadFiles[i], src:firstLoadFiles[i]} );
      }
      preloader.on("complete", onFirstLoadComplete, this, true);
      preloader.loadManifest(assets, true);
    }
    function onFirstLoadComplete(){
      console.log('Preloader: first load complete');
      dispatchEvent(new Event("FIRSTLOAD"));
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