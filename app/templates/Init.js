// ===================
// ===== INIT.JS =====
// ===================
var app = app || {}; 

var preloader;

var firstLoadFiles = [
	<% if (includeZepto) { %>
	{id:'zepto', src:'https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.6/zepto.min.js'},
	<% } else { %>
	{id:'jquery', src:'https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js'},
	<% } %>
	{id:'bezierplugin', src:'https://s0.2mdn.net/ads/studio/cached_libs/bezierplugin_1.18.5_63e256245274e5e3bff9aaa88a9e1596_min.js'},
  	{id:'cssplugin', src:'https://s0.2mdn.net/ads/studio/cached_libs/cssplugin_1.18.5_6bbddbd910e8bfac4e19220fe52e1af6_min.js'},
  	{id:'easepack', src:'https://s0.2mdn.net/ads/studio/cached_libs/easepack_1.18.5_4405b7326844d606cf693d06af83ddfd_min.js'},
  	{id:'tweenlite', src:'https://s0.2mdn.net/ads/studio/cached_libs/tweenlite_1.18.5_3bb7bb8f4b38ac71b33dad50f1b17f49_min.js'},
  	<% if (includeTimeline) { %>
  	{id:'timelinelite', src:'https://s0.2mdn.net/ads/studio/cached_libs/timelinelite_1.18.5_2fb4c19072a581c3daede85bd891458e_min.js'},
  	<% } %>
  	{id:'main', src:'main.js'}
];

app.Init = (function () {

	window.addEventListener('READY', handleReady, false);
	window.addEventListener('FIRSTLOAD', handleLoaded, false);
	window.addEventListener('load', initLoad);

	function handleReady(e) {
		console.log('READY: ' + e);
	}

	function handleLoaded(e) {
		console.log('FIRSTLOAD: ' + e);
		$('body').addClass('loaded');

		updateImagesSrc();

		app.Animation.initialize();
		app.Animation.start();
	}

	function initLoad() {
		console.log('initLoad');
		app.Banner.initialize();
	}

	function updateImagesSrc(){
		$('img[data-src]').each(function(i, asset){
			var $asset = $(asset);
			$asset.attr('src', $asset.data('src'));
		});
	}

	function preloadAssets(){
		preloader = new createjs.LoadQueue(false);
		preloader.setMaxConnections(6);
		preloader.on('complete', onFirstLoadComplete, this, true);
		preloader.loadManifest(firstLoadFiles, true);
	}

	function onFirstLoadComplete(){
	  	var event = document.createEvent('Event');
        event.initEvent('FIRSTLOAD', false, true); 
        window.dispatchEvent(event);
	}

	// --------------------------------------------------------------------------------------
	// Publicly accessible methods and properties
	return {
		preload:preloadAssets
	}

})();