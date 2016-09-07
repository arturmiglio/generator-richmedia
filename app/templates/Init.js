// ===================
// ===== INIT.JS =====
// ===================
var app = app || {}; 

// set this variable to TRUE if the Prealoader is going to be used
var usingPreloader = true;

this.addEventListener('READY', handleReady, false);
this.addEventListener('FIRSTLOAD', handleLoaded, false);

function handleReady(e) {
	console.log('READY: ' + e);
}

function handleLoaded(e) {
	console.log('FIRSTLOAD: ' + e);
	$('body').addClass('loaded');

	updateImagesSrc();

	if (!window.isDemo) {
		app.Animation.initialize();
		app.Game.initialize();

		app.Animation.start();
	}
}

function initLoad() {
	console.log('initLoad');
	app.Banner.initialize();
}

function updateImagesSrc(){
	$('img[data-src], video[data-src]').each(function(i, asset){
		var $asset = $(asset);
		$asset.attr('src', $asset.data('src'));
	});
}

var firstLoadFiles = [
	'https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js',
	'https://s0.2mdn.net/ads/studio/cached_libs/bezierplugin_1.18.5_63e256245274e5e3bff9aaa88a9e1596_min.js',
  	'https://s0.2mdn.net/ads/studio/cached_libs/cssplugin_1.18.5_6bbddbd910e8bfac4e19220fe52e1af6_min.js',
  	'https://s0.2mdn.net/ads/studio/cached_libs/easepack_1.18.5_4405b7326844d606cf693d06af83ddfd_min.js',
  	'https://s0.2mdn.net/ads/studio/cached_libs/tweenlite_1.18.5_3bb7bb8f4b38ac71b33dad50f1b17f49_min.js',
  	<% if (includeTimeline) { %>
  	'https://s0.2mdn.net/ads/studio/cached_libs/timelinelite_1.18.5_2fb4c19072a581c3daede85bd891458e_min.js',
  	<% } %>
  	'main.js',

  	// images

];

window.addEventListener('load', initLoad);