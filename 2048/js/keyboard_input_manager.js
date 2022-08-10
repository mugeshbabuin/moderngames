function KeyboardInputManager() {
  this.events = {};

  const isMobile = /mobile/i.test(navigator.userAgent);
  if (!isMobile) {
    this.eventTouchstart = "mousedown";
    this.eventTouchmove = "mousemove";
    this.eventTouchend = "mouseup";
  } else {
    this.eventTouchstart = "touchstart";
    this.eventTouchmove = "touchmove";
    this.eventTouchend = "touchend";
  }

  this.listen();
}

KeyboardInputManager.prototype.on = function(event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function(event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function(callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function() {
  var self = this;

  var map = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
    75: 0, // Vim up
    76: 1, // Vim right
    74: 2, // Vim down
    72: 3, // Vim left
    87: 0, // W
    68: 1, // D
    83: 2, // S
    65: 3 // A
  };

  // Respond to direction keys
  window.addEventListener("keydown", function(event) {
    var modifiers =
      event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
    var mapped = map[event.which];

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit("move", mapped);
      }
    }

    // R key restarts the game
    if (!modifiers && event.which === 82) {
      self.restart.call(self, event);
    }
  });

  // Respond to button presses
  this.bindButtonPress(".retry-button", this.restart);
  this.bindButtonPress(".restart-button", this.restart);
  this.bindButtonPress(".keep-playing-button", this.keepPlaying);
  // 0: up, 1: right, 2: down, 3: left
  this.bindButtonPress(".button-up", e => {
    e.preventDefault();
    this.emit("move", 0);
  });
  this.bindButtonPress(".button-left", e => {
    e.preventDefault();
    this.emit("move", 3);
  });
  this.bindButtonPress(".button-right", e => {
    e.preventDefault();
    this.emit("move", 1);
  });
  this.bindButtonPress(".button-down", e => {
    e.preventDefault();
    this.emit("move", 2);
  });

  // Respond to swipe events
  var touchStartClientX, touchStartClientY;
  var gameContainer = document.body;
  let hasPendingSwipe = false;

  gameContainer.addEventListener(this.eventTouchstart, function(event) {
    if (
      event.target &&
      event.target.classList &&
      event.target.classList.contains("button")
    ) {
      return;
    }

    if (event.type === "mousedown") {
      event.touches = [
        {
          clientX: event.clientX,
          clientY: event.clientY
        }
      ];
      event.targetTouches = [];
    }

    if (
      (!window.navigator.msPointerEnabled && event.touches.length > 1) ||
      event.targetTouches.length > 1
    ) {
      return; // Ignore if touching with more than 1 finger
    }

    if (window.navigator.msPointerEnabled) {
      touchStartClientX = event.pageX;
      touchStartClientY = event.pageY;
    } else {
      touchStartClientX = event.touches[0].clientX;
      touchStartClientY = event.touches[0].clientY;
    }

    hasPendingSwipe = true;

    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchmove, function(event) {
    event.preventDefault();
  });

  document.body.addEventListener(this.eventTouchend, function(event) {
    if (!hasPendingSwipe) return;

    if (event.type === "mouseup") {
      event.touches = [];
      event.changedTouches = [
        {
          clientX: event.clientX,
          clientY: event.clientY
        }
      ];
      event.targetTouches = [];
    }

    if (
      (!window.navigator.msPointerEnabled && event.touches.length > 0) ||
      event.targetTouches.length > 0
    ) {
      return; // Ignore if still touching with one or more fingers
    }

    var touchEndClientX, touchEndClientY;

    if (window.navigator.msPointerEnabled) {
      touchEndClientX = event.pageX;
      touchEndClientY = event.pageY;
    } else {
      touchEndClientX = event.changedTouches[0].clientX;
      touchEndClientY = event.changedTouches[0].clientY;
    }

    var dx = touchEndClientX - touchStartClientX;
    var absDx = Math.abs(dx);

    var dy = touchEndClientY - touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      // (right : left) : (down : up)
      self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : dy > 0 ? 2 : 0);
    }

    hasPendingSwipe = false;
  });
};

KeyboardInputManager.prototype.restart = function(event) {
  event.preventDefault();
  this.emit("restart");
};

KeyboardInputManager.prototype.keepPlaying = function(event) {
  event.preventDefault();
  this.emit("keepPlaying");
};

KeyboardInputManager.prototype.bindButtonPress = function(selector, fn) {
  var button = document.querySelector(selector);
  button.addEventListener(this.eventTouchstart, fn.bind(this));
  // button.addEventListener(this.eventTouchend, fn.bind(this));
};
