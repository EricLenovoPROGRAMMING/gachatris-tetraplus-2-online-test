import {polyfill} from "./polyfill.js";
import {Canvas2D} from "./canvas.js";
import { manager} from "./game.js";
class MobileButton {
 constructor(event, img, type, func, px, py, lx, ly, len, height, dragTap) {
  this.portraitX = px;
  this.portraitY = py;
  this.landscapeX = lx;
  this.landscapeY = ly;
  this.sizeX = len;
  this.sizeY = height;
  this.src = img;
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
  
  this.type = type;
  this.func = func;
  this.id = `CONTROL-${event.toUpperCase()}`;
  this.active = true;
  this.isControllerActive = true;
  this.isWholeActive = true;
  this.isNotReplayToShow = true;
  this.dragTap = dragTap ? dragTap : false;
  this.isPressed = false;
  
 };
 fire() {
  this.func();
 }
}

class MobileButtonSystem {
 constructor() {
  this.buttons = {};
  this.isActive = true;
  this.lastTouch = null;
  this.cellSize = 0;
  this.cellSizeX = 0;
  this.cellSizeY = 0;
  this.touchArr = {};
  this.viewportPos = {
   x: 0,
   y: 0
  };
  this.ratio = {
   width: 0,
   height: 0
  };
  this.canvas = new Canvas2D(document.getElementById("TOUCH"), 29, 29, 1);
 }
 toggleControllers() {
  for (let buttons in this.buttons) {
   let btn = this.buttons[buttons];
   if (btn.type == "controller") btn.active = !btn.active;
  }
  this.checkButtons();
 }
 replayToggleControllers(bool) {
  for (let buttons in this.buttons) {
   let btn = this.buttons[buttons];
   if (btn.type == "controller") btn.isNotReplayToShow = bool;
  }
  this.checkButtons();
 }
 enableControllers(bool) {
  for (let buttons in this.buttons) {
   let btn = this.buttons[buttons];
   if (btn.type == "controller") btn.isControllerActive = bool;
  }
  this.checkButtons();
 }
 enableButtons(bool) {
  for (let buttons in this.buttons) {
   let btn = this.buttons[buttons];
   btn.isWholeActive = bool;
  }
  this.checkButtons();
 }

 resize(o, mw, mh, w, h, cs) {
  this.res = {
   w: mw,
   h: mh
  };
  polyfill.style("TOUCH", "width", `${w}px`);
  polyfill.style("TOUCH", "height", `${h}px`);

  this.orientation = o;

  this.viewportPos = {
   x: 0,
   y: 0
  };

  switch (o) {
   case "portrait": {
    this.viewportPos.y = (mh / 4) - (h / 2);
    break;
   }
   case "landscape": {
    this.viewportPos.x = (mw / 2) - (w / 2);
    break;
   }

  }
  this.checkButtons();

 }

 checkButtons() {
  //var a = e => $IH("GTRIS-TOUCH", e),

  for (var e in this.buttons) {
   var o = this.buttons[e];
   //console.log(e)
   var x = ((this.orientation == "landscape" ? o.landscapeX : o.portraitX) / 100) * manager.aspectResolution.w;
   var y = ((this.orientation == "landscape" ? o.landscapeY : o.portraitY) / 100) * manager.aspectResolution.h;
   var screen = Math.max(manager.aspectResolution.w, manager.aspectResolution.h) + Math.max(this.viewportPos.x, this.viewportPos.y);
   var padX = this.orientation === "portrait" ? Math.max((((this.res.w * (16 / 9)) - this.res.h) / 2) / 5148, 0) : 0,
    padY = this.orientation === "portrait" ? (this.res.h - manager.aspectResolution.h) / 2 : 0;
  //async (arg) => var _id = id(o.id);
   polyfill.id(o.id).style = `display:${o.active && o.isWholeActive && o.isControllerActive && o.isNotReplayToShow ? "block" : "none"};opacity:${75}%;background:#938;top:${padY + y - (o.sizeY / 2)}px;left:${padX + x - (o.sizeX / 2)}px;width:${(o.sizeX / 100) * screen}px;height:${(o.sizeY / 100) * screen}px;position:absolute;pointer-events:none`;
   let mx = padX + x - (o.sizeX / 2);
   let my = padY + y - (o.sizeY / 2);
   let mw = (o.sizeX / 100) * screen;
   let mh = (o.sizeX / 100) * screen;
   
   
  }
  //a(iH);
 };
 createButton(event, img, type, func, px, py, lx, ly, len, height) {
  if ((event in this.buttons)) return;
  this.buttons[event] = new MobileButton(event, img, type, func, px, py, lx, ly, len, height);
  polyfill.elem("gtris-mobile-button", button => {
   button.id = this.buttons[event].id;
   /*cacheManager.loadCache(img, (fname) => {
    let s = new Image();
    s.src = fname;
    return s;
   }, "characterimage", _img => {
    button.append(_img.value);
    styleelem(_img.value, "pointer-events", "none");
    styleelem(_img.value, "height", "100%");
    styleelem(_img.value, "width", "100%");
   });*/
   button.style.background = "#8389"
   /*manager.loadImage(this.buttons[event].src).then(y => {
  	button.append(y);
  	y.style.width = "100%";
  	y.style.height = "100%";
  })*/
   polyfill.id("TOUCH").appendChild(button);
  });
  this.checkButtons();
 };
 showHide(bool) {
  this.isActive = bool;
  polyfill.style("TOUCH", "display", bool ? "auto" : "none");
 }
 initiateButtons() {

  var NX = -90,
   NY = -90,
   AY = 6;
  this.createButton("harddrop", "assets/menu/control_mobile/up.png", "controller", (type) => {
   if (type == "touchstart") manager.typeInput("D");
   if (type == "touchend") manager.typeInput("d");
   
   

  }, 19, 67 + AY, 343 * 11, 47, 8.3, 8.3, true);
  this.createButton("softdrop", "assets/menu/control_mobile/down.png", "controller", (type) => {
   if (type == "touchstart") manager.typeInput("C");
   if (type == "touchend") manager.typeInput("c");
   ////console.log(type)
   

  }, 19, 83 + AY, 334 * 11, 74, 8.3, 8.3, true);
  this.createButton("left", "assets/menu/control_mobile/left.png", "controller", (type) => {
   if (type == "touchstart") manager.typeInput("A");
   if (type == "touchend") manager.typeInput("a");
   

  }, 4, 75 + AY, NX, NY, 8.3, 8.3, true);
  this.createButton("right", "assets/menu/control_mobile/right.png", "controller", (type) => {
   if (type == "touchstart") manager.typeInput("B");
   if (type == "touchend") manager.typeInput("b");
   

  }, 34, 75 + AY, NX, NY, 8.3, 8.3, true);

  this.createButton("hold", "assets/menu/control_mobile/x.png", "controller", (type) => {
   if (type == "touchstart") manager.typeInput("E");
   if (type == "touchend") manager.typeInput("e");

  }, 19 + 50, 67 + AY, NX, NY, 8.3, 8.3, true);
  this.createButton("ccw", "assets/menu/control_mobile/b.png", "controller", (type) => {
   if (type == "touchstart") manager.typeInput("F");
   if (type == "touchend") manager.typeInput("f");
   

  }, 19 + 50, 83 + AY, NX, NY, 8.3, 8.3, true);
  this.createButton("c180w", "assets/menu/control_mobile/y.png", "controller", (type) => {
   if (type == "touchstart") manager.typeInput("H");
   if (type == "touchend") manager.typeInput("h");

  }, 4 + 50, 75 + AY, NX, NY, 8.3, 8.3, true);
  this.createButton("cw", "assets/menu/control_mobile/a.png", "controller", (type) => {
   if (type == "touchstart") manager.typeInput("G");
   if (type == "touchend") manager.typeInput("g");
   

  }, 34 + 50, 75 + AY, NX, NY, 8.3, 8.3, true);

  this.createButton("restart", "assets/menu/control_mobile/pause.png", "button", (type) => {
   if (type == "touchstart") {
   //manager.initialize();
   manager.pauseGame();
   }

  }, 9, 1, -10, 6, 5, 5);
  this.createButton("controls", "assets/menu/control_mobile/toggle.png", "button", (type) => {
   if (type == "touchend") this.toggleControllers();
  }, 25, 1, -10, 34, 5, 5);
    this.createButton("skill1", "assets/menu/control_mobile/skill1.png", "controller", (type) => {
  	if (type == "touchstart") manager.typeInput("1N1n");
  }, 45, 1, -10, 34, 5, 5);
  this.createButton("skill3", "assets/menu/control_mobile/skill2.png", "controller", (type) => {
  	if (type == "touchstart") manager.typeInput("2N2n");
  }, 55, 1, -10, 34, 5, 5);
  this.createButton("skill13", "assets/menu/control_mobile/skill3.png", "controller", (type) => {
	if (type == "touchstart") manager.typeInput("3N3n");
}, 65, 1, -10, 34, 5, 5);

  this.checkButtons()
  this.initialize();
  /*if (!window.mobileAndTabletCheck()) {
   this.toggleControllers();


  }*/
 }

 initialize() {
  var event = (e) => {
   if (((e.type == "touchstart") || (e.type == "touchmove") || (e.type == "touchend")) && (this.isActive)) {
   	let isPressed = false;
    let length = e.touches.length;
    if (e.type === "touchstart") this.lastTouch = e.touches[length - 1];
    let existing = {};
    for (var touches = 0; touches < length; touches++) {
     let tX = e.touches[touches].pageX,
      tY = e.touches[touches].pageY;
     let name = e.touches[touches].identifier; //`x${tX}y${tY}`;
     existing[name] = true;
     if (!(name in this.touchArr)) {
      for (var i in this.buttons) {
       var button = this.buttons[i],
        buttonClass = this.buttons[i];
       var buttonOffsetTop = this.buttons[i].x;
       var buttonOffsetLeft = this.buttons[i].y;
       var buttonOffsetHeight = this.buttons[i].width;
       var buttonOffsetWidth = this.buttons[i].height;

       if (
        tX >= buttonOffsetLeft && tX < buttonOffsetWidth + buttonOffsetLeft &&
        tY >= buttonOffsetTop && tY < buttonOffsetHeight + buttonOffsetTop &&
        buttonClass.active && buttonClass.isWholeActive && buttonClass.isControllerActive &&
        buttonClass.isNotReplayToShow
       ) {
        this.touchArr[name] = {
         x: tX,
         y: tY,
         a: {},
        };
        this.touchArr[name].a = buttonClass;
       }
      }

     }
    };

    for (let m in this.touchArr) {
     if (!(m in existing)) {
      if ("a" in this.touchArr[m] && this.touchArr[m].a.isPressed) {
       this.touchArr[m].a.func("touchend");
       this.touchArr[m].a.isPressed = false;
      }
      delete this.touchArr[m];
     } else {
      if ("a" in this.touchArr[m] && !this.touchArr[m].a.isPressed) {
       this.touchArr[m].a.func("touchstart");
       this.touchArr[m].a.isPressed = true;
       isPressed = true;
      }
     }
    }
    
    return isPressed;


    //if (!manager.isReplay) manager.touchesPressed = 0;
    /*for (var touches = 0; touches <= length; touches++) {
    let count = 0;
     var tX = 0;
     var tY = 0;
     if (length !== 0 && e.touches[touches]) {
      tX = e.touches[touches].pageX;
      tY = e.touches[touches].pageY;
     } else {
      tX = this.lastTouch.pageX;
      tY = this.lastTouch.pageY;
     }
     for (var i in this.buttons) {
      var button = id(this.buttons[i].id),
       buttonClass = this.buttons[i];
      var buttonOffsetTop = this.buttons[i].id, "y");
      var buttonOffsetLeft = this.buttons[i].id, "x");
      var buttonOffsetHeight = this.buttons[i].id, "height");
      var buttonOffsetWidth = this.buttons[i].id, "width");
      ////console.log(tX, tY, e.type)
      if (
       tX >= buttonOffsetLeft && tX < buttonOffsetWidth + buttonOffsetLeft &&
       tY >= buttonOffsetTop && tY < buttonOffsetHeight + buttonOffsetTop &&
       buttonClass.active && buttonClass.isWholeActive && buttonClass.isControllerActive &&
       buttonClass.isNotReplayToShow
      ) {
       if (e.type == "touchstart") style(buttonClass.id, "opacity", "100%");
       if (e.type == "touchend") style(buttonClass.id, "opacity", "75%");
       if (((e.type == "touchstart") || e.type == "touchend") || (buttonClass.dragTap && e.type == "touchmove")) {
        if (e.type === "touchstart" && !buttonClass.isPressed) {
         buttonClass.isPressed = true;
         buttonClass.func(e.type);
        }
        
       }
      } else {
       style(buttonClass.id, "opacity", "75%");
        if ( buttonClass.isPressed) {
         buttonClass.isPressed = false;
         buttonClass.func(e.type);
        }
      }
     }
    }/**/
   }
  }
  for (let p of ["start", "end"]) window.addEventListener(`touch${p}`, e => {
  	let t = e.touches[0];
  	let y = event(e);
  	
  	if (p == "start") {


  	}
  	
  }, false);
  
  /*window.addEventListener(`touchmove`, e => {
  	let t = e.touches[0];
  	if (menu.touchArea.isPress) {
  		menu.touchArea.x = t.pageX;
  		menu.touchArea.y = t.pageY
  		
  		let dx = menu.touchArea.x - menu.touchSensitivity.difference.x;
  		let dy = menu.touchArea.y - menu.touchSensitivity.difference.y;
  		
  		if (menu.touchSensitivity.direction == 1 || menu.touchSensitivity.direction == 0) {
  		let l = false;
  		while (dx > menu.touchSensitivity.x) {
  			menu.touchSensitivity.difference.x += menu.touchSensitivity.x;
  			dx -= menu.touchSensitivity.x;
  			menu.moveRight();
  			l = true;
  		}
  		while (dx < -menu.touchSensitivity.x) {
  			menu.touchSensitivity.difference.x -= menu.touchSensitivity.x;
  			dx += menu.touchSensitivity.x;
  			menu.moveLeft();
  			l = true;
  		}
  		if (l) menu.touchSensitivity.direction = 1;
  		}
  		
  		if (menu.touchSensitivity.direction == 2 || menu.touchSensitivity.direction == 0) {
  			let l = false;
  		while (dy > menu.touchSensitivity.y) {
  			menu.touchSensitivity.difference.y += menu.touchSensitivity.y;
  			dy -= menu.touchSensitivity.y;
  			menu.moveUp();
  			l = true;
  		}
  		while (dy < -menu.touchSensitivity.y) {
  			menu.touchSensitivity.difference.y -= menu.touchSensitivity.y;
  			dy += menu.touchSensitivity.y;
  			menu.moveDown();
  			l = true;
  		}
  		if (l) menu.touchSensitivity.direction = 2;
  		}
  	}
  }, false);*/
 }
};

export const touch = new MobileButtonSystem();

