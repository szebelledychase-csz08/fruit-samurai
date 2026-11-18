/* ~~~~~~~~ APPLAB-LITE ~~~~~~~~
   A tiny stand-in for the App Lab commands that code.js uses, so the game
   runs in any normal web browser without App Lab.
   Load this file BEFORE code.js. You shouldn't need to edit it.
*/

// ----- elements and screens -----

function _el(id) {
  var el = document.getElementById(id);
  if (!el) {
    console.warn('App Lab element not found: "' + id + '"');
  }
  return el;
}

function setScreen(screenId) {
  var screens = document.querySelectorAll(".screen");
  for (var i = 0; i < screens.length; i++) {
    screens[i].style.display = (screens[i].id == screenId) ? "block" : "none";
  }
}

function showElement(id) {
  var el = _el(id);
  if (el) { el.style.visibility = "visible"; }
}

function hideElement(id) {
  var el = _el(id);
  if (el) { el.style.visibility = "hidden"; }
}

function setPosition(id, x, y, width, height) {
  var el = _el(id);
  if (!el) { return; }
  el.style.left = x + "px";
  el.style.top = y + "px";
  if (width !== undefined) { el.style.width = width + "px"; }
  if (height !== undefined) { el.style.height = height + "px"; }
}

function setText(id, text) {
  var el = _el(id);
  if (el) { el.textContent = text; }
}

function setProperty(id, property, value) {
  var el = _el(id);
  if (!el) { return; }
  if (property == "x") { el.style.left = value + "px"; }
  else if (property == "y") { el.style.top = value + "px"; }
  else if (property == "width") { el.style.width = value + "px"; }
  else if (property == "height") { el.style.height = value + "px"; }
  else if (property == "text") { el.textContent = value; }
  else if (property == "font-size") { el.style.fontSize = value + "px"; }
  else if (property == "text-color") { el.style.color = value; }
  else if (property == "background-color") { el.style.backgroundColor = value; }
  else if (property == "hidden") { el.style.visibility = value ? "hidden" : "visible"; }
  else if (property == "image") {
    if (el.tagName == "IMG") { el.src = value; }
    else { el.style.backgroundImage = 'url("' + value + '")'; }
  }
  else { console.warn('setProperty: "' + property + '" is not supported here'); }
}

// ----- events -----

function onEvent(id, type, callback) {
  var el = _el(id);
  if (!el) { return; }
  el.addEventListener(type, function (event) {
    callback(event);
  });
}

// On phones and tablets there is no "mouseover", so a finger swiping
// across an element sends one to it, just like the mouse does.
(function () {
  var lastTouched = null;
  document.addEventListener("touchmove", function (event) {
    var touch = event.touches[0];
    var under = document.elementFromPoint(touch.clientX, touch.clientY);
    if (under && under !== lastTouched) {
      lastTouched = under;
      under.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    }
    event.preventDefault(); // stops the page from scrolling while you swipe
  }, { passive: false });
  document.addEventListener("touchend", function () { lastTouched = null; });
})();

// ----- timers -----

var _loopIds = [];

function timedLoop(ms, callback) {
  var id = setInterval(callback, ms);
  _loopIds.push(id);
  return id;
}

function stopTimedLoop(id) {
  if (id === undefined) { // no id = stop every timed loop
    for (var i = 0; i < _loopIds.length; i++) { clearInterval(_loopIds[i]); }
    _loopIds = [];
  } else {
    clearInterval(id);
    _loopIds = _loopIds.filter(function (x) { return x !== id; });
  }
}

// ----- random numbers -----

function randomNumber(min, max) { // whole number from min to max, both included
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----- sounds -----

var _playing = {};       // sound url -> list of Audio objects playing it
var _waitingForTap = []; // sounds the browser blocked until the player clicks

function playSound(url, loop) {
  var audio = new Audio(url);
  audio.loop = !!loop;
  if (!_playing[url]) { _playing[url] = []; }
  _playing[url].push(audio);
  audio.addEventListener("ended", function () {
    _playing[url] = (_playing[url] || []).filter(function (a) { return a !== audio; });
  });
  var promise = audio.play();
  if (promise && promise.catch) {
    promise.catch(function () {
      // Browsers block sound until the first click or key press, so try again then
      _waitingForTap.push(audio);
    });
  }
}

function stopSound(url) {
  if (url === undefined) {
    for (var key in _playing) { stopSound(key); }
    return;
  }
  var list = _playing[url] || [];
  for (var i = 0; i < list.length; i++) {
    list[i].pause();
    list[i].currentTime = 0;
    list[i]._stopped = true;
  }
  _playing[url] = [];
}

function _playBlockedSounds() {
  var waiting = _waitingForTap;
  _waitingForTap = [];
  for (var i = 0; i < waiting.length; i++) {
    if (!waiting[i]._stopped) { waiting[i].play().catch(function () {}); }
  }
}
document.addEventListener("pointerdown", _playBlockedSounds, true);
document.addEventListener("keydown", _playBlockedSounds, true);
