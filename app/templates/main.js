// ===================
// ===== MAIN.JS =====
// ===================
var app = app || {}; 

// set this variable to TRUE if the Prealoader is going to be used
var usingPreloader = false;

this.addEventListener('READY', handleReady, false);
this.addEventListener('FIRSTLOAD', handleLoaded, false);
app.Animation.initialize();
app.Banner.initialize();
if (!usingPreloader) app.Animation.start();

function handleReady(e) {
	console.log("READY: " + e);
}
function handleLoaded(e) {
	console.log("FIRSTLOAD: " + e);
	if (usingPreloader) app.Animation.start();
}