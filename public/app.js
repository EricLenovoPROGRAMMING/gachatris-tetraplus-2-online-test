
function jsonTransmit(type, owner, data) {
	return JSON.stringify({
		type: type,
		data: data,
		owner: owner || "unregistered"
	});
}

function base64ToBlob(base64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

//FD: server.js
const socket = new WebSocket("ws://" + location.host);
let fetch;
let fetchRequests = {};
socket.addEventListener("open", () => {
    socket.send("open");
	fetch = (url, mime) => {
		return new Promise((res, rej) => {
			let id = Math.random() * Number.MAX_SAFE_INTEGER;
			socket.send(jsonTransmit(
				"DATA_FS_GET",
				null,
				{
					url: url,
					id: id,
					mime: mime || "application/octet-stream"
				},
			));
			fetchRequests[id] = (rest) => {
				res(rest)
			}
		});
	};
});

socket.addEventListener("message", (res) => {
	let json = JSON.parse(res.data)
	if (json.type == "DATA_FS_GET") {
		let dat = base64ToBlob(json.data, json.mime);
		//let nam = json.name;
		fetchRequests[json.id](dat);
	}
})



//FD: polyfill.js
 const polyfill = {
	id: (w) => document.getElementById(w),
	elem: function(tag, func) {
		let a = document.createElement(tag);
		func(a);
	},
	grid: function(x, y, val) {
		let a = [];
		for (let e = 0; e < x; e++) {
			a.push([]);
			for (var f = 0; f < y; f++) {
				a[e].push(val);
			}
		}
		return a;
	},
	
	style: function(element, prop, a) {
		document.getElementById(element).style[prop] = a;
	},
	RAFHandler: class {
		constructor(fps, func) {
			this.actualFrames = 0;
			this.isRunning = false;
			this.fps = fps;
			this.prevTime = 0;
			this.run = func;

			this.speed = 1;
			this.c = 0;
			this.delta = 0;

			this.confirmIsAsync = false;
		}

		#asyncRun(t) {

			if (!this.isRunning) return;
			else {
				let difference = t - this.prevTime;
				let h = ~~(difference / (1000 / this.fps));
				this.prevTime = t;
				do {
					this.c += this.speed;
					while (this.c >= 1) {
						try {
							this.run();
						} catch (e) {
							console.error(e, e.stack);
						}
						this.c--;
					}
					h--;

				} while (h > 0 && !this.confirmIsAsync);
			}

			window.requestAnimationFrame((time) => {
				this.#asyncRun(time);
			});

		}

		start() {
			if (!this.isRunning) {

				this.isRunning = true;
				this.#asyncRun(performance.now());
			};
		}

		stop() {
			if (this.isRunning) {

				this.isRunning = false;

			}
		}

		replaceRun(func) {
			this.run = func;
		}
	},
	ParkMillerPRNG: class {
		constructor() {
			this.seed = 1;
		}
		next() {
			return this.gen() / 2147483647;
		}
		gen() {
			return (this.seed = (this.seed * 16807) % 2147483647);
		}
	},
 NumberChangeFunc: class {
 constructor(a, func) {
  this.a = a;
  this.last = a;
  this.func = (m, arg) => {
   func(m, arg);
  };
  
 }
 add(num, arg) {
  this.a += num;
  if (this.a !== this.last) {
   this.last = this.a;
   this.func(this.a, arg);
  }
 }
 assign(val, arg) {
  if (val !== this.a) {
   this.a = val;
   this.last = this.a;
   this.func(this.a, arg);
  }
 }
 execute(arg) {
  this.func(this.a, arg);
 }
 getNumber () {
  return this.a;
 }
}

};

//FD: canvas.js
class Canvas2D {
	constructor(canvas, width, height) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.canvas.width = width;
		this.canvas.height = height;
	}
	drawImage(img,sx,sy,sw,sh,x,y,w,h,rot) {
		let a = this.ctx;
		sx = sx !== null ? sx : 0;
		sy = sy !== null ? sy : 0;
		
		sw = sw !== null ? sw : img.width;
		sh = sh !== null ? sh : img.height;
		a.save();
		a.translate(x + w / 2, y + h / 2);
		a.rotate((Math.PI / 2) * (rot / 360));
		a.drawImage(img,
			sx,
			sy,
			sw,
			sh, -w / 2, -h / 2, w, h);
		a.restore();
	}
	
	clear() {
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
	}
	drawRect(x,y,w,h,color) {
		let a = this.ctx;
		a.fillStyle = color;
		a.fillRect(x,y,w,h);
	}
	drawPolygon(points, x,y,w,h,c, style, rot) {
		let a = this.ctx;
		let rotX = Math.sin(rot), rotY = Math.cos(rot);
		a.beginPath();
		a.moveTo((x+points[0][0]*c), (y+points[0][1]*c));
		
		for (let g = 1; g < points.length; g++)
		{
			a.lineTo((x+points[g][0]*c), (y+points[g][1]*c));
		}
		
		a.fillStyle = style;
		a.closePath();
		a.fill();
	}
	drawText(string, x, y, font, style) {
		let a = this.ctx;
		a.fillStyle = style;
		a.font = font;
		a.fillText(string, x, y);
	}
	
	async toBlob() {
		let ep = new OffscreenCanvas(this.canvas.width, this.canvas.height)
		let p = ep.getContext("2d");
		p.drawImage(this.canvas, 0, 0);
		let a = await ep.convertToBlob();
		//let a = new Blob([g]);
		console.log(a)
		let url = URL.createObjectURL(a);
		
		let download = document.createElement("a");
		download.setAttribute("download", "e" + Date.now() + "NEWGTRIS.png");
		download.setAttribute("href", url);
		download.click();
	}
}

//FD: audio_master.js
const audioMaster = new class {
	constructor() {
		this.ctx = new (window.AudioContext || window.webkitAudioContext)({
			latencyHint: "interactive"
		});
		this.gain = this.ctx.createGain();
		this.gain.connect(this.ctx.destination);
		this.gain.gain.value = 1;
		//this.ctx.resume();
		this.buffers = {};
		this.globalCounter = 0; //for audio IDs
		this.playbacks = {};
	}
	
	Audio = class {
		constructor(parent, parameters) {
			this.parameters = parameters;
			this.parent = parent;
			this.gain = this.parent.ctx.createGain();
			this.gain.connect(this.parent.gain);
			this.buffer = null;
			this.duration = 0;
			this.seekTime = 0;
			this.isReady = false;
			this.isPlaying = false;
			this.playbacks = [];
			this.listeners = {};
		}
	 load() {
			return new Promise(async res => {
				if (!this.parameters.src) {
					return;
				}
			if (this.parameters.src in this.parent.buffers) {
				this.buffer = this.parent.buffers[this.parameters.src];
			} else {
				let array = (await fetch(this.parameters.src));
				if (array.status === 404) {
					res()
					return
				}
				//let s = await array.blob();
				
				
				let ab = await array.arrayBuffer();
				//console.log(this.parameters.src, ab)
				let buffer = await this.parent.ctx.decodeAudioData(ab);
				this.buffer = buffer;
				this.parent.buffers[this.parameters.src] = buffer;
			}
			this.duration = this.buffer.duration;
			this.isReady = true;
			res()
			});
		}
		/**
		 * loads a source that already has a Blob property
 		*/
		async loadSync(callback) {
			
		if (!this.parameters.arrayBuffer) return;
		//console.log(this.parameters.arrayBuffer)
			let buffer = await this.parent.ctx.decodeAudioData(this.parameters.arrayBuffer);
		
			this.buffer = buffer;
			this.parent.buffers[this.parameters.src] = buffer;
			this.duration = this.buffer.duration;
			this.isReady = true;
			callback();
		}
		volume(value) {
			this.gain.gain.value = value;
		}
		/**
		 * plays a buffer
		 * @returns Object {
		 	source: source,
			gain: gain.gain,
			pan:pan.pan,
			rate: source.playbackRate
		 }
 		*/
		play(parameters) {
			parameters = parameters || {};
			let now = this.parent.ctx.currentTime;
			if (!this.isReady) return;
			let source = this.parent.ctx.createBufferSource();
			let pan = this.parent.ctx.createPanner();
			pan.connect(this.gain);
			source.connect(pan);
			source.buffer = this.buffer;
			pan.value = ("pan" in parameters) ? parameters?.pan : 0;
			source.loop = this.parameters.loop;
			source.playbackRate.value = parameters?.rate || 1;
			source.start(("when" in parameters) ? parameters?.when : (now + (("delay" in parameters) ? parameters?.delay : 0)), parameters?.seek || void 0, parameters?.duration || void 0);
			let id = this.parent.globalCounter;
			this.parent.globalCounter++;
			this.playbacks.push(id);
			this.isPlaying = true;
			let h = {
				id: id,
				source: source,
				gain: this.gain,
				pan:pan.pan,
				rate: source.playbackRate
			}
			this.parent.playbacks[id] = h;
			source.addEventListener("ended", () => {
				delete this.parent.playbacks[id];
				this.playbacks.shift();
				if (this.playbacks.length == 0) this.isPlaying = false;
				//console.log("end")
			});
			return h;
		}
		stop() {
			let now = this.parent.ctx.currentTime;
			for (let f of this.playbacks) {
				this.parent.playbacks[f].source.stop(now);
			}
		}
		rate(value) {
			for (let f of this.playbacks) {
				this.parent.playbacks[f].source.playbackRate.value = value !== void 0 ? value : 1;
			}
		}
		unload() {
			
		}
		checkPlaying() {
			let a = this.isPlaying;
			return a;
		}
		once(event, func) {
			
		}
	}
	
	createAudio(p) {
		let a = new this.Audio(this, p);
		return a;
	}
	getPlaybackById(id) {
		if (id in this.playbacks) return this.playbacks[id];
		return null;
	}
	suspendResume(sr) {
		if (sr) {
			this.ctx.suspend();
		} else {
			this.ctx.resume();
		}
	}
	
}();

addEventListener("click", () => {
	if (audioMaster.ctx.state === "suspended") audioMaster.ctx.resume();
}, {
	once: true,
});
addEventListener("keydown", () => {
	if (audioMaster.ctx.state === "suspended") audioMaster.ctx.resume();
}, {
	once: true,
});

//FD: game.js
class Manager {
	constructor() {
		this.cellSize = 20;
		let csize = this.cellSize;
		this.canvas = new Canvas2D(document.getElementById("MAIN"), csize * 50*(16/9), csize * 50, csize);
		this.skin = new Canvas2D(new OffscreenCanvas(2 * 20 * 4, 2 * 20 * 12), 2 * 20 * 4, 2 * 20 * 12);
		this.images = {};
		this.players = {};
		this.activePlayer = 0;
		this.pressStr = "";
		this.loop = new polyfill.RAFHandler(60, () => {
			this.gameLoop();
		});
		this.canvas.canvas.style.width = `${csize*1*(16/9)}px`;
		this.canvas.canvas.style.height = `${csize*1}px`;
		
		this.resolution = {
			w: 1280,
			h: 720
		};
		this.aspectResolution = {
			w: 1289,
			h: 720
		};
		this.portrait = {
			x: 720,
			y: 1289
		}
		this.landscape = {
			x: 720,
			y: 1289
		};
		this.aspectRatio = 16 / 9;
		this.orientation = null;
	}
	async init() {
		try {
			//console.log(this);

			let player = new Player(0);
			this.players[0] = player;
			const skin = this.loadImage("./images/skin.png");

			skin.onload = () => {
				this.skin.drawImage(skin, 0, 0, null, null, 0, 0, 2 * 20 * 4, 2 * 20 * 12, 0);
			};

			this.images.bg = this.loadImage("./images/bg.png");
			Sound.load("default");


			this.images.bg.onload = () => this.startGame();
			
			touch.initiateButtons();
			touch.enableButtons(true);
			//touch.initialize();
		} catch (e) {
			console.log(e.stack);
		}

	}
	
	resize() {
		this.resolution.w = Math.max(document.documentElement.clientWidth, window.innerWidth, 1);
		this.resolution.h = Math.max(document.documentElement.clientHeight, window.innerHeight, 1);

		polyfill.style("CORE", "width", `${this.resolution.w}px`);
		polyfill.style("CORE", "height", `${this.resolution.h}px`);

		let screenWidth = this.resolution.w,
			screenHeight = this.resolution.h;
		let ratioWidth = screenWidth,
			ratioHeight = screenHeight;
		let aspectRatio = this.aspectRatio;
		this.landscape.x = this.portrait.x = screenWidth;
		this.landscape.y = this.portrait.y = screenHeight;
		if (screenWidth <= screenHeight) {
			this.orientation = "portrait";
			ratioHeight = (Math.floor(Math.min(screenWidth * aspectRatio, screenHeight)));
			if (screenWidth * aspectRatio >= screenHeight) {
				ratioWidth = screenWidth - (((screenWidth * aspectRatio) - screenHeight) / 2);
			}
			this.portrait.y = ratioHeight;
			this.portrait.x = ratioWidth;
			this.landscape.x = ratioWidth;
			this.landscape.y = Math.floor(ratioWidth / aspectRatio);
		} else {
			this.orientation = "landscape";
			ratioWidth = (Math.floor(screenHeight * aspectRatio));
			this.landscape.y = ratioHeight;
			this.landscape.x = ratioWidth;
			this.portrait.x = ratioHeight
			this.portrait.y = Math.floor(ratioHeight / aspectRatio);
		}
		
		this.aspectResolution.w = ratioWidth;
		this.aspectResolution.h = ratioHeight;
		
		let aspectRatioResolution = Math.max(ratioWidth, ratioHeight);
		let uhd = 0.8;
		let cellSize = (aspectRatioResolution / 50);
		polyfill.style("TOUCH", "width", `${this.landscape.x}px`);
		polyfill.style("TOUCH", "height", `${this.landscape.y}px`);
		polyfill.style("MAIN", "width", `${this.landscape.x}px`);
		polyfill.style("MAIN", "height", `${this.landscape.y}px`);
		touch.resize(this.orientation, this.resolution.w, this.resolution.h, ratioWidth, ratioHeight, this.cellSize)
	}

	startGame() {
		let player = this.players[0];
		player.reset();
		player.updateBody();
		player.repositionCenter(this.cellSize * 25, this.cellSize * 21);
		player.adjustSize(50 * this.cellSize, 42 * this.cellSize);



		player.seeds.preview.seed = Math.random() * 2147483647;


		player.previewInitialize();
		player.spawnPiece(player.previewNextBag());
		
		manager.resize();
		this.loop.start();
	}

	gameLoop() {

		this.canvas.clear();
		this.canvas.drawRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height, "#323")
		this.updateInput();
		this.players[0].playerUpdate();
		//console.log(this.players[0].piece.y);
		this.pressStr = "";
		this.canvas.drawText(`Gachatris by EricLenovo`, 10, 32, "30px arial", '#0dd');
	}
	loadImage(src) {
		let a = new Image();
		a.src = src;
		return a;
	}
	load(url, type, args, fetchOptions) {
		return new Promise(async (res) =>
		{
			let a = await fetch(url, fetchOptions);
			let m = await a[type](args);
			console.log(url, m)
			res(m);
		});
	}
	typeInput(inp) {
		this.pressStr += inp;
	}

	updateInput() {
		manager.players[0].pressStr = this.pressStr;
	}
}
const manager = new Manager();
window.addEventListener("beforeunload", () => {
	
});

window.addEventListener("resize", () => {
	manager.resize();
});

//FD: keyboard.js
const keyboard = new class {
	constructor() {
		this.bindsDefault = {
				left: "arrowleft",
				right: "arrowright",
				softdrop: "arrowdown",
				harddrop: "v",
				hold: "f",
				cw: "arrowup",
				ccw: "d",
				/*blockcw: 88,
				blockccw: 90,
				/*blockcw: 88,
				blockccw: 90,/**/
				c180w: "shift"
			
		};

		this.binds = {

		};

		for (let aa in this.bindsDefault) {
			
				this.binds[aa] = {};
				for (let ab of this.bindsDefault[aa].split('||')) {
					this.binds[aa][ab] = 1;
			}
		}
		this.lastKeys = {};


		////console.log(this.binds)
		this.flags = {
			left: {
				up: "a",
				down: "A"
			},
			right: {
				up: "b",
				down: "B"
			},
			softdrop: {
				up: "c",
				down: "C"
			},
			harddrop: {
				up: "d",
				down: "D"
			},
			hold: {
				up: "e",
				down: "E"
			},
			ccw: {
				up: "f",
				down: "F"
			},
			cw: {
				up: "g",
				down: "G"
			},
			c180w: {
				up: "h",
				down: "H"
			},
		};
	}
	keyFlag(code, type) {
		if (code) {

			for (let r = Object.keys(this.flags)[0], f = 0, g = Object.keys(this.flags).length; f < g; f++, r = Object.keys(this.flags)[f]) {
				
					if (code in this.binds[r]) {

						if (this.binds?.[r]) {
							return this.flags[r][["down", "up"][type]];
						}
					
					}
			}
		}
		return "";
	}

	listen(evt) {
		let key = evt.key.toLowerCase();
		if ([" ", "arrowleft", "arrowright", "arrowup", "arrowdown"].indexOf(key) !== -1)
			evt.preventDefault();

		if (!(key in this.lastKeys)) {
			this.lastKeys[key] = evt.type;
		} else if (this.lastKeys[key] !== evt.type) {
			this.lastKeys[key] = evt.type;
		} else return;
		
		if (key == "f1" && evt.type == "keydown") {
			manager.canvas.toBlob();
		}
		
		if (key == "r" && evt.type == "keydown") {
	manager.startGame();
		}
				
			
			let player = manager.players[manager.activePlayer];
			var flag = this.keyFlag(key, {
				keydown: 0,
				keyup: 1
			} [evt.type], player.activeType);
			////console.log(evt.key, flag)
			manager.typeInput(flag);

		 
	}

}();

//FD: sound.js
const Sound = new class {
 constructor() {
  this.sounds = {};
  this.isReady = true;
  this.soundNames = {};
  this.volume = 100;
  this.bytes = 0;
 }
 load(filename) {
  /*return new Promise((res=> {
  	res();
  }))*/
  let direct = `sounds/${filename}/init.json`;
  this.isReady = false;
  return new Promise(async (res, rej) => {
   if (direct in this.soundNames) {
    res();
    this.isReady = true;
    return;
   }
   let loaded = 0;
   let loadLength = 0;
   let a = JSON.parse(await manager.load(direct, "text"));
   this.soundNames[direct] = a;
   console.log(a)
   let storage = {};
   let sounds = [];
   let soundInits = {};
   //for (let o in a.)
   
   for (let b in a.init) {
    let mref = a.init[b];
    let reference = a.sources[mref.src];
    sounds.push({
     name: b,
     src: `./sounds/${filename}/${reference}`,
     loop: mref.loop
    });
    loadLength++;
    ////console.log(reference);
    //storage[b] = await load(`/sounds/${filename}/${reference}`, "blob");
   }
   
      
   for (let b of sounds) {
    //let reference = sounds[b];
    //this.bytes += storage[reference.src].size;
    /*memoryManager.syncLoad(b.src, "blob", (aa) => {
    	let blob = URL.createObjectURL(aa);
    	this.sounds[b.name] = new MainHowler.Howl({
    		src: blob,
    		format: "ogg",
    		loop: b.loop,
    		preload: false
    	});
    	
    	this.sounds[b.name].load();
    	this.sounds[b.name].once("load", () => {
    		URL.revokeObjectURL(blob);
    	});
    	
    	
    	loaded++;
    	if (loaded >= loadLength) {
    		this.isReady = true;
    		this.volumeSet(this.volume);
    		//console.log(this.bytes / (1024*1024))
    		res();
    	}
    });
    /**/
    this.sounds[b.name] = audioMaster.createAudio({
     src: b.src,
     loop: b.loop,
    });
    let so = this.sounds[b.name];
    console.log(b)
    so.load().then(sh => {
     loaded++;
     if (loaded >= loadLength) {
      this.isReady = true;
      this.volumeSet(this.volume);
      //console.log(this.bytes / (1024*1024))
      console.log("3")
      res();
     }
    });
    /**/
    
   }
   
   
   
   
   
   
  });
 }
 
 stop(str) {
  if (str in this.sounds) {
   this.sounds[str].stop();
   
  }
 }
 
 getSound(str) {
  return this.sounds[str] || new GTRISNoSoundObject();
 }
 
 play(str) {
  let id = 0;
  if (str in this.sounds) {
   //this.sounds[str].stop();
   //console.log(this.sounds[str]._sounds.length)
   id = (this.sounds[str].play());
   
  }
  return id;
 }
 
 rate(str, value) {
  if (str in this.sounds) {
   //this.sounds[str].stop();
   
   this.sounds[str].rate(value !== void 0 ? value : 1);
   ////console.log(this.sounds[str])
  }
 }
 
 volumeSet(value) {
  this.volume = value;
  for (let str in this.sounds) {
   //this.sounds[str].stop();
   
   this.sounds[str].volume(value / 100);
   ////console.log(this.sounds[str])
  }
 }
}();

class GTRISSoundObject {
 constructor(obj) {
  this.doc = document.createElement("audio");
  this._volume = obj.volume || 0;
  this._loop = obj.loop || false;
  this._src = obj.src || "";
  this.doc.src = this._src;
  this.doc.volume = this._volume;
  this.doc.loop = this._loop;
  if (obj.preload) this.doc.load();
 }
 load() {
  this.doc.load();
 }
 play(seek) {
  this.doc.currentTime = seek || 0;
  this.doc.play()
   .catch(e => {
    console.error(`GTRISSoundObject object with the source destination "${this._src}" cannot play a non-existent sound file.`);
   });
 };
 stop() {
  this.doc.pause();
 }
 once(evt, func) {
  this.doc.addEventListener(evt, func, { once: true });
 }
 volume(v) {
  this._volume = v;
  this.doc.volume = v;
 }
 rate(e) {}
 stereo() {
  
 }
}
class GTRISNoSoundObject {
 constructor(obj) {
  this.doc = 0;
  this._volume = obj.volume || 0;
  this._loop = obj.loop || false;
  this._src = obj.src || "";
  this.doc.src = this._src;
  this.doc.volume = this._volume;
  this.doc.loop = this._loop;
 }
 load() {
  
 }
 play(seek) {
  
 };
 stop() {
  
 }
 once(evt, func) {
  
 }
 volume(v) {
  
 }
 rate(e) {}
 stereo() {
  
 }
}

//FD: player.js
const PIECE = JSON.parse(
	`[{ "index": 0, "x": 3, "y": 0, "matrix": [[[2, 0, 0], [2, 2, 0], [0, 2, 0]], [[0, 0, 0], [0, 2, 2], [2, 2, 0]], [[0, 2, 0], [0, 2, 2], [0, 0, 2]], [[0, 2, 2], [2, 2, 0], [0, 0, 0]]], "kickTable": { "right": [[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "left": [[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "double": [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [0, -1], [3, 0], [-3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1], [-1, 2], [0, -1], [0, -2], [-1, -1], [-1, -2], [1, 0], [0, 3], [0, -3], [0, 0]], [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [1, 0], [2, 0], [1, -1], [2, -1], [0, 1], [-3, 0], [3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [0, -1], [0, -2], [1, -1], [1, -2], [-1, 0], [0, 3], [0, -3], [0, 0]]] }, "spinDetection": { "highX": [[2, 0], [2, 1], [0, 2], [0, 1]], "highY": [[0, 1], [2, 0], [2, 1], [0, 2]], "lowX": [[-1, 3], [2, 1], [3, -1], [0, 1]], "lowY": [[0, 1], [-1, 3], [2, 1], [3, -1]] } }, { "index": 1, "x": 3, "y": 0, "matrix": [[[0, 3, 0], [0, 3, 0], [3, 3, 0]], [[0, 0, 0], [3, 3, 3], [0, 0, 3]], [[0, 3, 3], [0, 3, 0], [0, 3, 0]], [[3, 0, 0], [3, 3, 3], [0, 0, 0]]], "kickTable": { "right": [[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "left": [[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "double": [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [0, -1], [3, 0], [-3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1], [-1, 2], [0, -1], [0, -2], [-1, -1], [-1, -2], [1, 0], [0, 3], [0, -3], [0, 0]], [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [1, 0], [2, 0], [1, -1], [2, -1], [0, 1], [-3, 0], [3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [0, -1], [0, -2], [1, -1], [1, -2], [-1, 0], [0, 3], [0, -3], [0, 0]]] }, "spinDetection": { "highX": [[1, 0], [2, 2], [1, 2], [0, 0]], "highY": [[0, 0], [1, 0], [2, 2], [1, 2]], "lowX": [[2, 0], [0, 0], [0, 2], [2, 2]], "lowY": [[2, 2], [2, 0], [0, 0], [0, 3]] } }, { "index": 2, "x": 4, "y": 0, "matrix": [[[4, 4], [4, 4]], [[4, 4], [4, 4]], [[4, 4], [4, 4]], [[4, 4], [4, 4]]], "kickTable": { "right": [[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2], [0, 3], [-1, 3], [0, 0]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2], [0, -3], [1, -3], [0, 0]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2], [0, 3], [1, 3], [0, 0]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2], [0, 3], [-1, -3], [0, 0]]], "left": [[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2], [0, 3], [1, 3], [0, 0]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2], [0, -3], [1, -3], [0, 0]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2], [0, 3], [-1, 3], [0, 0]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2], [0, 3], [-1, -3], [0, 0]]], "double": [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [0, -1], [3, 0], [-3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1], [-1, 2], [0, -1], [0, -2], [-1, -1], [-1, -2], [1, 0], [0, 3], [0, -3], [0, 0]], [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [1, 0], [2, 0], [1, -1], [2, -1], [0, 1], [-3, 0], [3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [0, -1], [0, -2], [1, -1], [1, -2], [-1, 0], [0, 3], [0, -3], [0, 0]]] }, "spinDetection": { "highX": [[0, 1], [2, 2], [1, 0], [-1, -1]], "highY": [[-1, -1], [0, 1], [2, 2], [1, 0]], "lowX": [[1, 0], [-1, -1], [0, 1], [2, 2]], "lowY": [[2, 2], [1, 0], [-1, -1], [0, 1]] } }, { "index": 3, "x": 3, "y": 0, "matrix": [[[0, 5, 0], [5, 5, 0], [5, 0, 0]], [[0, 0, 0], [5, 5, 0], [0, 5, 5]], [[0, 0, 5], [0, 5, 5], [0, 5, 0]], [[5, 5, 0], [0, 5, 5], [0, 0, 0]]], "kickTable": { "right": [[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "left": [[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "double": [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [0, -1], [3, 0], [-3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1], [-1, 2], [0, -1], [0, -2], [-1, -1], [-1, -2], [1, 0], [0, 3], [0, -3], [0, 0]], [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [1, 0], [2, 0], [1, -1], [2, -1], [0, 1], [-3, 0], [3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [0, -1], [0, -2], [1, -1], [1, -2], [-1, 0], [0, 3], [0, -3], [0, 0]]] }, "spinDetection": { "highX": [[0, 2], [1, 2], [2, 0], [1, 0]], "highY": [[0, 1], [2, 0], [2, 1], [0, 2]], "lowX": [[0, -1], [1, 2], [-1, 3], [1, 0]], "lowY": [[0, 1], [-1, 3], [2, 1], [3, -1]] } }, { "index": 4, "x": 3, "y": 0, "matrix": [[[0, 6, 0, 0], [0, 6, 0, 0], [0, 6, 0, 0], [0, 6, 0, 0]], [[0, 0, 0, 0], [0, 0, 0, 0], [6, 6, 6, 6], [0, 0, 0, 0]], [[0, 0, 6, 0], [0, 0, 6, 0], [0, 0, 6, 0], [0, 0, 6, 0]], [[0, 0, 0, 0], [6, 6, 6, 6], [0, 0, 0, 0], [0, 0, 0, 0]]], "kickTable": { "right": [[[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]], [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]], [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]], [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]]], "left": [[[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]], [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]], [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]], [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]]], "double": [[[0, 0], [-1, 0], [-2, 0], [1, 0], [2, 0], [0, 1], [0, 0]], [[0, 0], [0, 1], [0, 2], [0, -1], [0, -2], [-1, 0], [0, 0]], [[0, 0], [1, 0], [2, 0], [-1, 0], [-2, 0], [0, -1], [0, 0]], [[0, 0], [0, 1], [0, 2], [0, -1], [0, -2], [1, 0], [0, 0]]] }, "spinDetection": { "highX": [[1, 2, 2, 1], [1, 3, 1, 3], [1, 2, 2, 1], [0, 2, 0, 2]], "highY": [[0, 2, 0, 2], [1, 2, 2, 1], [1, 3, 1, 3], [1, 2, 2, 1]], "lowX": [[-1, 4, -1, 4], [2, 2, 2, 2], [-1, 4, -1, 4], [1, 1, 1, 1]], "lowY": [[1, 1, 1, 1], [-1, 4, -1, 4], [2, 2, 2, 2], [-1, 4, -1, 4]] } }, { "index": 5, "x": 3, "y": 0, "matrix": [[[7, 7, 0], [0, 7, 0], [0, 7, 0]], [[0, 0, 0], [7, 7, 7], [7, 0, 0]], [[0, 7, 0], [0, 7, 0], [0, 7, 7]], [[0, 0, 7], [7, 7, 7], [0, 0, 0]]], "kickTable": { "right": [[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "left": [[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "double": [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [0, -1], [3, 0], [-3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1], [-1, 2], [0, -1], [0, -2], [-1, -1], [-1, -2], [1, 0], [0, 3], [0, -3], [0, 0]], [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [1, 0], [2, 0], [1, -1], [2, -1], [0, 1], [-3, 0], [3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [0, -1], [0, -2], [1, -1], [1, -2], [-1, 0], [0, 3], [0, -3], [0, 0]]] }, "spinDetection": { "highX": [[1, 2], [2, 2], [1, 0], [0, 0]], "highY": [[0, 0], [1, 2], [2, 2], [1, 0]], "lowX": [[0, 2], [0, 0], [2, 0], [2, 2]], "lowY": [[2, 2], [0, 2], [0, 0], [2, 0]] } }, { "index": 6, "x": 3, "y": 0, "matrix": [[[0, 8, 0], [8, 8, 0], [0, 8, 0]], [[0, 0, 0], [8, 8, 8], [0, 8, 0]], [[0, 8, 0], [0, 8, 8], [0, 8, 0]], [[0, 8, 0], [8, 8, 8], [0, 0, 0]]], "kickTable": { "right": [[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "left": [[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "double": [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [0, -1], [3, 0], [-3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1], [-1, 2], [0, -1], [0, -2], [-1, -1], [-1, -2], [1, 0], [0, 3], [0, -3], [0, 0]], [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [1, 0], [2, 0], [1, -1], [2, -1], [0, 1], [-3, 0], [3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [0, -1], [0, -2], [1, -1], [1, -2], [-1, 0], [0, 3], [0, -3], [0, 0]]] }, "spinDetection": { "highX": [[0, 2], [2, 2], [0, 2], [0, 0]], "highY": [[0, 0], [0, 2], [2, 2], [0, 2]], "lowX": [[0, 2], [0, 0], [0, 2], [2, 2]], "lowY": [[2, 2], [0, 2], [0, 0], [0, 2]] } }]`
);

 const Player = class {
	constructor(player, n) {
		this.player = player;
		let regex = /PNUMBER/gm;
		
		this.soundActive = true;
		
		this.piece = {
			x: 0,
			y: 0,
			rot: 0,
			template: PIECE,
			activeArr: [
				[0, 0, 0, 0]
			],
			active: 0,
			hold: 1,
			isAir: false,
			moved: false,
			dirty: false,
			held: false,
			enable: false,
			rotated: false,
			isHardDrop: false,
			spin: {
				spin: 0,
				mini: 0,
				x1y2: 0,
			},
			kickTable: null,
			kickDistance: {
				x: 0,
				y: 0
			},
			spinTable: null,
		};
		
		this.clear = {
			linesReady: [],
		};
		
		this.b2b = -1;
		this.b2bType = "surge";
		this.surgeAttack = 0;
		this.combo = -1;
		this.garbage = [];
		this.messiness = 0;
		this.garbageDelay = 30;
		this.canAttack = true;
		
		this.pos = {
			start: {
				x: 0,
				y: 0
			},
			center: {
				x: 0,
				y: 0
			},
			rot: {
				deg: 0,
				x: Math.sin(0),
				y: Math.sin(0)
			}
		};
		
		this.statistics = {
			
		};
		for (let k = 0; k <= 5; k++) {
			if (k > 0) this.statistics[`line${k}`] = 0;
			if (k < 4) {
				this.statistics[`spin${k}`] = 0;
				this.statistics[`mini${k}`] = 0;
			}
		}
		this.statistics.pc = 0;
		this.statistics.pieces = 0;
		this.statistics.attack = 0;
		
		
		this.size = {
			w: 50,
			h: 42,
			c: 0.78
		};
		
		this.poly = {
			body: [],
			next: [],
			hold: [],
			next_queue: []
		};
		
		this.POSITIONS = {
			nw: 5,
			nh: 4,
			pfw: 10,
			pfh: 20.0,
			brdw: 6,
			brdh: 1,
		};
		
		this.preview = {
			bag: [0, 1, 2, 3, 4, 5, 6],
			queue: [],
			count: 5
		};
		
		this.settings = {
			das: 5,
			arr: 0,
			gravity: 1 / 60,
			lock: 30,
			sft: 200 * 64 / 64,
			dcd: 4,
		};
		
		this.handling = {
			das: 0,
			arr: 0,
			xFirst: 0,
			dcd: 0
		};
		
		this.dasCancellation = new polyfill.NumberChangeFunc(0, (c) => {
			//this.handling.das = 0;
			this.handling.dcd = 0;
			//console.log(c);
		});
		
		this.lock = {
			move: 15,
			rot: 15,
			delay: 30,
			delayMax: 30
		}
		this.stack = [];
		this.fixedStack = [];
		this.fieldSize = {
			w: 10,
			h: 20,
			vh: 20,
			hh: 0
		};
		this.cellSize = 20;
		this.fieldCellSize = 20;
		this.pressStr = "";
		this.lastPressStr = "";
		this.flagPresses = {
			left: false,
			right: false,
			harddrop: false,
			softdrop: false,
			cw: false,
			ccw: false,
			hold: false,
			c180w: false
		};
		
		this.lastFlagPresses = {};
		for (let a in this.flagPresses) this.lastFlagPresses[a] = false;
		this.fixed = {};
		
		this.seeds = {
			field: new polyfill.ParkMillerPRNG(),
			preview: new polyfill.ParkMillerPRNG(),
		};
		
		
		
		
		
		this.visibleFieldBufferHeight = 0;
		this.visibleFieldHeight = 0;
		
	}
	
	updateBody() {
		let k1 = 0;
		let k0 = 0;
		let m1 = 0
		let m0 = 0;
		let previews = this.preview.count;
		if (previews > 1) {
			k1 = 3.5 + ((previews - 2) * 3);
			k0 = 4 + ((previews - 2) * 3);
			m1 = 3 + ((previews - 2) * 3);
			m0 = 3.5 + ((previews - 2) * 3);
		}
		
		let tetr_body = [
			[0, 0],
			[15, 0],
			[15, 40],
			[35, 40],
			[35, 0],
			[50, 0],
			[50, 5],
			[47, 8],
			[46, 8],
			
			[46, 8 + k1],
			[45.5, 8 + k0],
			[38, 8 + k0],
			
			
			[38, 8],
			[38, 42],
			[12, 42],
			[12, 8],
			[3, 8],
			[0, 5]
		];
		let hold_placeholder = [
			[1, 1],
			[11, 1],
			[11, 7],
			[4, 7],
			[1, 4],
		];
		
		let next_placeholder = [
			[49, 1],
			[39, 1],
			[39, 7],
			[46, 7],
			[49, 4]
		];
		
		let nextqueue_placeholder = [];
		if (m0 + m1 > 1) {
			nextqueue_placeholder = [
				[39, 8],
				[45.5, 8],
				[45.5, 8 + m1],
				[45, 8 + m0],
				[39, 8 + m0]
			]
		}
		
		this.poly.body = tetr_body;
		this.poly.next = next_placeholder;
		this.poly.hold = hold_placeholder;
		this.poly.next_queue = nextqueue_placeholder;
	}
	
	playSound(str) {
		//if (this.soundActive) 
		Sound.play(str);
	}
	
	affixIDName(name) {
		return `P${this.player}-${name}`;
	}
	
	editIH(name, value) {
		ihelem(this.getAsset(name), value);
	}
	
	getAsset(_id) {
		if (_id in this.htmlElements) return this.htmlElements[this.affixIDName(_id)];
		return id(this.affixIDName(_id));
	}
	
	setStyle(name, prop, val) {
		styleelem(this.getAsset(name), prop, val);
	}
	
	storeElementsToMemory() {
		this.htmlElements = {};
		this.htmlElements[this.affixIDName("AREA")] = id(`P${this.player}-AREA`);
		for (let y of id(`P${this.player}-AREA`).getElementsByTagName("*")) {
			let { id } = y;
			this.htmlElements[id] = y;
		}
		
		for (let canvas in this.canvasTemplate) {
			this.canvasses[canvas] = this.getAsset(`${this.canvasTemplate[canvas]}-CANVAS`);
			this.canvasCtx[canvas] = this.canvasses[canvas].getContext("2d");
		}
		
		this.clearText.tspin.initialize(this.canvasCtx.tspin);
	}
	
	setCanvasSize(c, w, h) {
		this.canvasses[c].width = w;
		this.canvasses[c].height = h;
	}
	
	drawCharacterBg(n) {
		this.canvasClear("character");
		this.canvasCtx.character.drawImage(this.character.canvas, (n || 0) * 300, 0, 300, 612, 0, 0, this.fieldSize.w * this.cellSize, (this.fieldSize.vh + this.visibleFieldHeight) * this.cellSize);
	}
	
	drawRect(canvasX, canvasY, x, y, row, column, sx, sy) {
		let CELL_SIZE = this.size.c * manager.cellSize;
		let sizeX = sx !== void 0 ? sx : 1,
			sizeY = sy !== void 0 ? sy : 1;
		x = x * (CELL_SIZE * sizeX);
		x = ~~x;
		y = y * (CELL_SIZE * sizeY);
		manager.canvas.drawImage(
			manager.skin.canvas,
			40 * column,
			40 * row,
			40,
			40,
			x + (this.pos.rot.x * CELL_SIZE) + canvasX,
			y + (this.pos.rot.y * -CELL_SIZE) + canvasY,
			CELL_SIZE * sizeX,
			CELL_SIZE * sizeY,
			this.pos.rot.deg
		)
	}
	
	drawMatrixMain(matrix, canvX, canvY, cx, cy, color, row, sizeX, sizeY) {
		var len = matrix.length,
			wid = matrix[0].length
		for (var x = 0; x < len; x++) {
			for (var y = 0; y < wid; y++) {
				if (matrix[x][y]) this.drawRect(
					canvX,
					canvY,
					x + cx,
					y + cy,
					color !== void 0 ? color : matrix[x][y] || 1,
					row,
					sizeX,
					sizeY
				);
			}
		}
	}
	
	drawArray(ctx, matrix, cx, cy, color, row) {
		//let CELL_SIZE = this.cellSize;
		let CELL_SIZE = this.size.c * manager.cellSize;
		
		switch (ctx) {
			case "stack":
				this.drawMatrixMain(matrix, this.pos.start.x + CELL_SIZE * (9 + this.POSITIONS.brdw), this.pos.start.y + this.POSITIONS.brdh, cx, cy, color, row, 2, 2);
				break;
			case "piece":
				this.drawMatrixMain(matrix, this.pos.start.x + CELL_SIZE * (-1 + (5 * 2) + this.POSITIONS.brdw), this.pos.start.y + this.POSITIONS.brdh, cx, cy, color, row, 2, 2);
				break;
			case "hold":
				this.drawMatrixMain(matrix, this.pos.start.x + CELL_SIZE * 1.5, CELL_SIZE * this.POSITIONS.brdh + this.pos.start.y, cx, cy, color, row, 2, 2);
				break;
			case "next":
				this.drawMatrixMain(matrix, this.pos.start.x + CELL_SIZE * ((16 + this.POSITIONS.nw * 2) + this.POSITIONS.brdw * 2), CELL_SIZE * this.POSITIONS.brdh + this.pos.start.y, cx, cy, color, row, 2, 2);
				break;
			case "nextQueue":
				this.drawMatrixMain(matrix, this.pos.start.x + CELL_SIZE * ((17.5 + this.POSITIONS.nw * 2) + this.POSITIONS.brdw * 2), (CELL_SIZE * (5.75 + (this.POSITIONS.brdh * 2))) + (CELL_SIZE / 2) + this.pos.start.y, cx, cy, color, row, 1, 1);
				break;
		}
	}
	canvasClear(ctx) {
		
	}
	
	reset() {
		this.piece.x = 0;
		this.piece.y = -295;
		this.piece.hold = void 0;
		this.piece.rot = 0;
		this.surgeAttack = 0;
		this.piece.active = null;
		this.piece.activeArr = [
			[]
		];
		this.piece.isAir = false;
		this.piece.moved = true;
		this.piece.dirty = false;
		this.piece.held = false;
		this.piece.rotated = false;
		this.piece.enable = false;
		this.piece.isHardDrop = false;
		this.piece.spin.spin = 0;
		this.piece.spin.mini = 0;
		this.b2b = -1;
		this.combo = -1;
		this.garbage = [];
		this.previewInitialize();
		
		for (let m in this.statistics) {
			this.statistics[m] = 0;
		}
		
		this.lock = {
			move: 15,
			rot: 15,
			delay: 30,
		};
		this.clear.linesReady = [];
		this.fieldSize.w = 10;
		this.fieldSize.hh = 20;
		this.fieldSize.vh = 20;
		this.fieldSize.h = this.fieldSize.vh + this.fieldSize.hh;
		this.stack = polyfill.grid(this.fieldSize.w, this.fieldSize.h);
		
		//////console.log(this.stackb)
		this.flagPresses = {
			left: false,
			right: false,
			harddrop: false,
			softdrop: false,
			cw: false,
			ccw: false,
			c180w: false,
			hold: false
		};
		
		this.lastFlagPresses = {};
		for (let a in this.flagPresses) this.lastFlagPresses[a] = false;
		this.handling = {
			das: 0,
			arr: 0,
			xFirst: 0,
		};
		
		this.pressStr = "";
		this.lastPressStr = "";
		this.updateBody();
		
	}
	
	drawStack() {
		//this.canvasClear("stack");
		this.drawArray("stack", this.stack, 0, -1 * (this.fieldSize.hh - this.visibleFieldBufferHeight), void 0, 0);
	}
	
	drawActivePiece() {
		this.canvasClear("piece");
		this.drawArray("piece", this.piece.activeArr, this.piece.x, ~~(this.piece.y) - (this.fieldSize.hh - this.visibleFieldBufferHeight), void 0, 0);
		this.drawArray("piece", this.piece.activeArr, this.piece.x, ~~(this.piece.y) + this.checkDrop(40) - (this.fieldSize.hh - this.visibleFieldBufferHeight), void 0, 3);
		if (this.piece.spin.spin) {
			let b = 0;
			if (this.lock.delay % 8 < 2) {
				b = 1;
			} else if (this.lock.delay % 8 < 6) {
				b = 2;
			}
			this.drawArray("piece", this.piece.activeArr, this.piece.x, ~~(this.piece.y) - (this.fieldSize.hh - this.visibleFieldBufferHeight), void 0, b);
		}
		if (this.piece.spin.mini) {
			let b = 0;
			if (this.lock.delay % 8 < 4) {
				b = 1;
			}
			this.drawArray("piece", this.piece.activeArr, this.piece.x, ~~(this.piece.y) - (this.fieldSize.hh - this.visibleFieldBufferHeight), void 0, b);
		}
	}
	
	testGridSpace(x, y) {
		if (x < 0 || x >= this.fieldSize.w) {
			return true;
		}
		if (y < this.fieldSize.h) {
			if (typeof this.stack[x][y] !== "undefined" && this.stack[x][y] !== 0) {
				return true;
			}
			return false;
		}
		return true;
	}
	
	checkValid(arr, cx, cy) {
		let px = cx + this.piece.x;
		let py = ~~(cy + this.piece.y)
		for (let x = 0; x < arr.length; x++) {
			for (let y = 0; y < arr[x].length; y++) {
				if (arr[x][y] && this.testGridSpace(x + px, y + py)) return false;
			}
		}
		return true;
	}
	
	checkDrop(dis) {
		let a = 0;
		while (this.checkValid(this.piece.activeArr, 0, a) && dis >= a) {
			a++;
		}
		////console.log(a)
		return a - 1;
	}
	
	spawnPiece(index) {
		if (this.canSpawnPiece(index)) {
			this.piece.spin.spin = 0;
			this.piece.spin.mini = 0;
			this.piece.y += this.checkDrop(1);
			let temp = this.piece.template;
			this.checkManipulatedPiece();
			
			
		} // else this.checkLose();
	}
	
	canSpawnPiece(index) {
		let temp = this.piece.template;
		this.piece.active = index;
		this.piece.rot = 0;
		this.piece.activeArr = temp[index].matrix[0];
		this.piece.x = temp[index].x + Math.min((this.fieldSize.w - 5), ~~((this.fieldSize.w - 10) / 2));
		this.piece.y = this.fieldSize.hh - 2;
		this.lock.delay = 30;
		this.lock.rot = 15;
		this.lock.move = 15;
		this.piece.kickTable = temp[index].kickTable;
		this.piece.spin.spin = false;
		this.piece.spin.mini = false;
		this.piece.rotated = false;
		this.piece.isAir = false;
		this.piece.moved = false;
		this.piece.dirty = true;
		this.piece.enable = true;
		this.piece.spinTable = temp[index].spinDetection;
		if (!this.checkValid(this.piece.activeArr, 0, 0)) return false;
		return true;
	}
	
	previewGenerateBag() {
		let pieceList = [];
		this.preview.bag.forEach(function(a) { pieceList.push(a) });
		for (var i = 0; i < pieceList.length - 1; i++) {
			var temp = pieceList[i];
			var rand = ~~((pieceList.length - i) * this.seeds.preview.next()) + i;
			pieceList[i] = pieceList[rand];
			pieceList[rand] = temp;
		};
		return pieceList;
	}
	
	previewInitialize() {
		this.preview.queue = [];
		this.preview.queue.push.apply(this.preview.queue, this.previewGenerateBag());
		
		//this.previewDraw();
	}
	
	previewNextBag() {
		let next = this.preview.queue.shift();
		this.preview.queue.push(...this.previewGenerateBag());
		//this.previewDraw();
		return next;
	}
	
	hold() {
		if (this.piece.enable) {
			let temp = this.piece.hold;
			if (!this.piece.held) {
				this.piece.held = true;
				if (this.piece.hold == void 0) {
					this.piece.hold = this.piece.active;
					this.spawnPiece(this.previewNextBag());
					this.playSound("hold_first");
				} else {
					this.piece.hold = this.piece.active;
					this.playSound("hold");
					this.spawnPiece(temp);
				}
			}
			this.holdDraw();
		}
	}
	
	holdDraw() {
		//this.canvasClear('hold');
		if (this.piece.hold === void 0) return;
		let m = this.piece.hold;
		let piece = this.piece.template[m];
		if (m === 2) {
			this.drawArray(
				"hold",
				piece.matrix[0],
				piece.x - 2.5,
				piece.y + 0.5,
				void 0,
				0
			);
		}
		else if (m === 4) {
			this.drawArray(
				"hold",
				piece.matrix[0],
				piece.x - 2.5,
				piece.y,
				void 0,
				0
			);
		}
		else {
			this.drawArray(
				"hold",
				piece.matrix[0],
				piece.x - 2,
				piece.y + 0.5,
				void 0,
				0
			);
			
		}
		
	}
	
	previewDraw() {
		this.canvasClear('next');
		this.canvasClear('nextQueue');
		for (let i = 0; i < this.preview.count; i++) {
			if (this.preview.queue.length <= i) break
			let m = this.preview.queue[i];
			let piece = this.piece.template[m];
			//console.log(piece)
			if (i == 0) {
				if (m === 2) {
					this.drawArray(
						"next",
						piece.matrix[0],
						piece.x - 2.5,
						piece.y + 0.5,
						void 0,
						0
					);
				}
				else if (m === 4) {
					this.drawArray(
						"next",
						piece.matrix[0],
						piece.x - 2.25,
						piece.y,
						void 0,
						0
					);
				}
				else {
					this.drawArray(
						"next",
						piece.matrix[0],
						piece.x - 2,
						piece.y + 0.5,
						void 0,
						0
					);
					
				}
			} else {
				if (m === 2) {
					this.drawArray(
						"nextQueue",
						piece.matrix[0],
						piece.x - 2.5,
						(piece.y + 0.5) + ((i - 1) * 3),
						void 0,
						0
					);
				}
				else if (m === 4) {
					this.drawArray(
						"nextQueue",
						piece.matrix[0],
						piece.x - 2.5,
						(piece.y) + ((i - 1) * 3),
						void 0,
						0
					);
				}
				else {
					this.drawArray(
						"nextQueue",
						piece.matrix[0],
						piece.x - 2,
						(piece.y + 0.5) + ((i - 1) * 3),
						void 0,
						0
					);
				}
			}
		}
	}
	
	checkManipulatedPiece() {
		if (!this.piece.enable) return false;
		let air = this.checkValid(this.piece.activeArr, 0, 1);
		
		if (air) {
			if (!this.piece.isAir) {
				this.piece.isAir = true;
			}
		} else {
			if (this.piece.isAir) {
				this.piece.isAir = false;
				if (!this.piece.isHardDrop) {
					this.playSound("lock");
				}
			}
		}
		
		
		if (this.piece.isAir) {
			this.lock.delay = this.settings.lock;
			this.piece.moved = true;
		} else {
			if (this.lock.delay <= 0 || this.lock.move <= 0 || this.lock.rot <= 0) {
				this.piece.y = ~~this.piece.y;
				this.piece.held = false;
				if (!this.piece.isHardDrop) {
					this.playSound("lock");
				}
				this.piece.isHardDrop = false;
				this.detectSpin(!this.piece.moved);
				this.addPieceStack(this.piece.activeArr);
				if (this.piece.enable) this.spawnPiece(this.previewNextBag());
			}
		}
	}
	
	updatePiece() {
		if (!this.piece.enable) return;
		let gravity = this.settings.gravity;
		if (this.piece.isAir) {
			if (gravity < 1) {
				this.piece.y += gravity;
			} else if (gravity == 1) {
				this.piece.y += this.checkDrop(1);
			} else if (gravity > 1) {
				this.piece.y += this.checkDrop(gravity);
			}
			this.lock.delay = this.settings.lock;
			this.checkManipulatedPiece();
		}
		if (!this.piece.isAir) {
			this.piece.y = ~~this.piece.y;
			this.lock.delay--;
			this.checkManipulatedPiece();
		}
		//this.moveX(1 * (((manager.frames % 50) < 10) ? 1 : -1));
		//this.rotatePiece(1);/**/
		//this.drawActivePiece();
	}
	
	rotatePiece(direction) {
		if (!this.piece.enable) return;
		let temp = this.piece.template[this.piece.active].matrix;
		let pos = ((this.piece.rot % 4) + 4) % 4;
		let nPos = (((this.piece.rot + direction) % 4) + 4) % 4;
		let rotate = temp[nPos];
		var dirType = "right";
		switch (direction) {
			case 1:
				dirType = "right";
				break;
			case -1:
				dirType = "left";
				break;
			case 2:
				dirType = "double";
				break;
		}
		
		for (let i = 0, len = this.piece.kickTable[dirType][nPos].length; i < len; i++) {
			if (this.checkValid(
					rotate,
					this.piece.kickTable[dirType][pos][i][0],
					this.piece.kickTable[dirType][pos][i][1]
				)) {
				this.playSound("rotate");
				let kickX = this.piece.kickTable[dirType][pos][i][0],
					kickY = this.piece.kickTable[dirType][pos][i][1];
				this.piece.x += kickX;
				this.piece.y += kickY;
				this.piece.kickDistance.x = kickX;
				this.piece.kickDistance.y = kickY;
				this.piece.rot = nPos;
				this.piece.activeArr = rotate;
				this.lock.delay = this.settings.lock;
				if (!this.checkValid(this.piece.activeArr, 0, 1)) {
					this.lock.rot--;
				}
				this.piece.moved = false;
				this.piece.rotated = true;
				
				this.checkManipulatedPiece();
				
				this.detectSpin(!this.piece.moved && this.piece.rotated);
				if (this.piece.spin.spin) {
					this.playSound("prespin");
				}
				if (this.piece.spin.mini) {
					this.playSound("prespinmini");
				}
				
				
				break;
			}
		}
	}
	
	detectSpin(isMoveAir) {
		let spin = 0;
		let mini = 0;
		let x1y2 = 0;
		let check = 0;
		let posX = this.piece.x;
		let posY = ~~(this.piece.y);
		let rot = this.piece.rot;
		let a = this.piece.spinTable;
		let allMini = true;
		let isImmobile = true;
		//if (allMini && this.piece.active == 6) minimumValidChecks = 0;
		if (isMoveAir) {
			if (allMini && this.piece.active === 4 && false) {
				for (let x = 0, len1 = a.highX[rot].length; x < len1; x++) {
					if (this.testGridSpace(posX + a.highX[rot][x], posY + a.highY[rot][x])) {
						spin++;
						check++;
					}
				}
				for (let x = 0, len1 = a.lowX[rot].length; x < len1; x++) {
					if (this.testGridSpace(posX + a.lowX[rot][x], posY + a.lowY[rot][x])) {
						mini++;
						check++;
					}
				}
			} else
			if (this.piece.active == 6) {
				for (let x = 0, len1 = a.highX[rot].length; x < len1; x++) {
					if (this.testGridSpace(posX + a.highX[rot][x], posY + a.highY[rot][x])) {
						spin++;
						check++;
					}
				}
				for (let x = 0, len1 = a.lowX[rot].length; x < len1; x++) {
					if (this.testGridSpace(posX + a.lowX[rot][x], posY + a.lowY[rot][x])) {
						mini++;
						check++;
					}
				}
				
				
			}
			if (this.piece.kickDistance.y >= 2 && (this.piece.kickDistance.x >= 1 || this.piece.kickDistance.x <= -1)) {
				x1y2++;
			}
		}
		let c = [[0,1],[1,0],[0,-1],[-1,0]];
		for (let g of c) {
		 if (this.checkValid(this.piece.activeArr, g[0], g[1])) {
		  isImmobile = false;
		  break;
		 }
		}
		
		this.piece.spin.spin = 0;
		this.piece.spin.mini = 0;
		this.piece.spin.x1y2 = 0;
		
		if (check >= 3 || (allMini && isImmobile)) {
			if (x1y2 > 0) {
				this.piece.spin.spin = 1;
			} else {
				if (spin > 1) {
					this.piece.spin.spin = 1;
				} else {
					this.piece.spin.mini = 1;
				}
				
			}
		}
		
		
	}
	
	moveX(shift) {
		if (this.checkValid(this.piece.activeArr, shift, 0)) {
			this.piece.x += shift;
			if (!this.checkValid(this.piece.activeArr, 0, 1)) {
				this.lock.move--;
			}
			this.lock.delay = this.settings.lock;
			this.piece.moved = true;
			this.piece.rotated = false;
			this.playSound("move");
			this.checkManipulatedPiece();
		}
	}
	
	shiftDelay() {
		if (this.flagPresses.right && this.handling.xFirst === 0) {
			this.handling.xFirst = 1;
		}
		if (this.flagPresses.left && this.handling.xFirst === 0) {
			this.handling.xFirst = -1;
		}
		
		if (this.handling.xFirst !== 0) {
			if (this.flagPresses.right && !this.flagPresses.left) {
				this.handling.xFirst = 1;
			} else if (this.flagPresses.left && !this.flagPresses.right) {
				this.handling.xFirst = -1;
			}
		}
		if (!this.flagPresses.right && !this.flagPresses.left && this.handling.xFirst !== 0) {
			this.handling.xFirst = 0;
		}
		
		
		{
			let x = 0;
			if (this.flagPresses.right) x |= 0b10;
			
			if (this.flagPresses.left) x |= 0b01;
			
			this.dasCancellation.assign(x);
		}
		//console.log(this.handling.dcd)
		
		if (this.flagPresses.left || this.flagPresses.right) {
			this.handling.das++;
			this.handling.dcd++;
			if (this.handling.das == this.settings.das + 1) this.handling.dcd = this.settings.dcd + 1;
			if (this.handling.das > this.settings.das && this.handling.dcd > this.settings.dcd) {
				this.handling.arr++;
				
				for (let i = 0; i < this.fieldSize.w; i++) {
					let dir = 0;
					if (this.handling.xFirst === 1) {
						if (this.flagPresses.left) {
							dir = -1;
						} else {
							dir = 1;
						}
					}
					if (this.handling.xFirst === -1) {
						if (this.flagPresses.right) {
							dir = 1;
						} else {
							dir = -1;
						}
					}
					if (dir !== 0) this.moveX(dir);
					if (this.settings.arr > 0 || this.handling.dcd < this.settings.dcd) break;
				}
				if (this.handling.arr > this.settings.arr) this.handling.arr = 1;
				
			}
		}
	}
	
	hardDrop() {
		if (this.piece.enable) {
			let distance = this.checkDrop(this.fieldSize.h);
			this.piece.y += distance;
			if (distance > 0) {
				this.piece.moved = true;
				this.piece.rotated = false;
			}
			this.lock.delay = -1;
			this.piece.isHardDrop = true;
			this.playSound("harddrop");
			this.checkManipulatedPiece();
		}
	}
	
	softDrop() {
		if (this.piece.enable) {
			
			if (this.piece.isAir) {
				let gravity = this.settings.sft;
				let initial = Math.floor(this.piece.y);
				if (gravity < 1) {
					this.piece.y += gravity;
				} else if (gravity == 1) {
					this.piece.y += this.checkDrop(1);
				} else if (gravity > 1) {
					this.piece.y += this.checkDrop(gravity);
				}
				let final = Math.floor(this.piece.y);
				if (initial !== final) {
					this.piece.moved = true;
					//console.log(initial - final)
				}
				this.checkManipulatedPiece();
			}
			//this.lock.delay = -1;
		}
	}
	addPieceStack(arr) {
		let lines = 0;
		let valid = false;
		for (let x = 0; x < arr.length; x++) {
			for (let y = 0; y < arr[x].length; y++) {
				if (arr[x][y]) {
					let px = x + this.piece.x;
					let py = ~~(y + this.piece.y);
					this.stack[px][py] = arr[x][y];
					if (py >= this.fieldSize.hh) {
						
						valid = true;
					}
				}
			}
		}
		
		if (!valid) {
			// this.checkLose();
		}
		
		for (let y = 0; y < this.fieldSize.h; y++) {
			let count = 0;
			for (let x = 0; x < this.fieldSize.w; x++) {
				if (this.testGridSpace(x, y)) count++;
			}
			if (count >= this.fieldSize.w) {
				this.clear.linesReady.push(y);
				lines++;
			}
		}
		if (lines == 0) {
			this.combo = -1;
			if (this.piece.spin.spin) {
				this.playSound("tspin0");
			}
			if (this.piece.spin.mini) {
				this.playSound("mini0");
			}
			this.raiseGarbage();
		}
		this.clearLine();
		//this.drawStack();
	}
	
	
	
	clearLine() {
		let lines = 0;
		let isPC = true;
		for (let m = 0, h = this.clear.linesReady.length; m < h; m++) {
			let y = this.clear.linesReady.shift();
			lines++;
			for (let full = y; full >= 1; full--) {
				for (let x = 0; x < this.fieldSize.w; x++) {
					this.stack[x][full] = this.stack[x][full - 1];
				};
			};
		}
		if (lines > 0) {
			this.combo++;
			if (this.piece.spin.spin) {
				this.b2b++;
				if (lines == 2) this.statistics.tspin2++;
				{
					console.log("t-spin");
					this.playSound(`tspin${Math.min(lines, 4)}${this.b2b > 0 ? "E" : ""}`);
					
				}
			} else if (this.piece.spin.mini) {
				this.b2b++;
				
				{
					console.log("t-spin MINI");
					this.playSound(`mini${Math.min(lines, 4)}${this.b2b > 0 ? "E" : ""}`);
					
				}
			} else if (lines > 3) {
				this.b2b++;
				this.playSound(`line${Math.min(lines, 4)}${this.b2b > 0 ? "E" : ""}`);
			} else {
				this.b2b = -1;
				if (this.surgeAttack) {
				 this.surgeAttack = 0;
				 this.playSound("surge_end");
				}
				this.playSound(`line${Math.min(lines, 4)}`);
			}
			if (this.b2b > 0) {
				let isSound = true;
				if (this.b2bType === "surge") {
					if (this.b2b > 3) {
						this.surgeAttack++;
						if (this.surgeAttack > 0) {
							isSound = false;
							this.playSound("surge");
							if (this.surgeAttack == 1) {
								this.playSound("surge_start");
							}
						}
					}
					if (isSound) this.playSound("b2b");
				}
				
			}
			
			//this.engageCleartext("b2b", this.b2b > 0, translate("b2b", [this.b2b]));
			/*if (this.piece.active !== 6) {
				this.engageCleartext("line", true, translate(`line${lines}`));
				if (this.piece.spin.spin) {
					let letter = ["z", "l", "o", "s", "i", "j", "t"][this.piece.active];
					this.engageCleartext("spin", true, translate(`${letter}spin`));
				}
			}/**/
			
			for (let y = 1; y < this.fieldSize.h; y++) {
				for (let x = 0; x < this.fieldSize.w; x++) {
					if (this.testGridSpace(x, y)) isPC = false;
					else this.stack[x][y] = 0;
				}
			}
			if (isPC) {
				this.playSound(`bravo${~~(Math.random() * 4) + 1}`)
			}
			
		}
		
	}
	
	
	
	addGarbage(count) {
		let i = count;
		let n = ~~(this.seeds.field.next() * this.fieldSize.w);
		let n2 = n;
		while (i > 0) {
			let rand = this.seeds.field.next();
			if (rand < this.messiness) {
				while (n == n2) n = ~~(this.seeds.field.next() * this.fieldSize.w);
				n2 = n;
			}
			this.garbage.push({
				row: n2,
				frames: this.garbageDelay + manager.frames,
				player: this.player
			});
			i--;
		}
	}
	
	raiseGarbage() {
		let a = this.garbage.filter(m => m.frames <= manager.frames),
			len = a.length;
		
		while (len > 0) {
			let r = a.shift();
			this.garbage.shift();
			for (var x = 0; x < this.fieldSize.w; x++) {
				for (var y = 0; y < this.fieldSize.h; y++) {
					this.stack[x][y] = this.stack[x][y + 1];
				}
			}
			for (var x = 0; x < this.fieldSize.w; x++) {
				this.stack[x][this.fieldSize.h - 1] = 9;
			}
			this.stack[r.row][this.fieldSize.h - 1] = 0;
			
			len--;
		}
	}
	
	setFixed(a, s, p) {
		this.fixed.stack = s;
		this.fixed.preview = p;
		this.fixed.presses = a;
		
		this.startSim();
	}
	
	startSim() {
		this.reset();
		
		this.stack = JSON.parse(JSON.stringify(this.fixed.stack));
		this.pressStr = this.fixed.presses; //JSON.parse(JSON.stringify(this.fixed.presses));
		this.preview.queue.length = 0;; //JSON.parse(JSON.stringify(this.fixed.preview));
		
		for (let s = 0; s < 39; s++) {
			for (let h of this.fixed.preview) this.preview.queue.push(h);
		}
		//	this.previewDraw();
		//	//console.log(this.preview.queue)
		this.spawnPiece(this.previewNextBag());
		this.playerUpdate();
	}
	
	
	playerUpdate() {
		//do {
		
		//mainCtx.drawImage(REQUIRED_ASSETS.sapphirus, 0, 0, 300, 600, (CELL_SIZE * this.POSITIONS.nw) + (this.POSITIONS.brdw), (this.POSITIONS.brdh), CELL_SIZE * this.POSITIONS.pfw, CELL_SIZE * this.POSITIONS.pfh);
		for (let i = 0; i < this.pressStr.length; i++) {
			//if (!this.piece.enable) continue;
			let input = this.pressStr[i];
			switch (input) {
				case "A": {
					this.flagPresses.left = true;
					this.moveX(-1);
					break;
				}
				case "a": {
					this.flagPresses.left = false;
					break;
				}
				case "B": {
					this.flagPresses.right = true;
					this.moveX(1);
					break;
				}
				case "b": {
					this.flagPresses.right = false;
					break;
				}
				case "C": {
					this.flagPresses.softdrop = true;
					this.softDrop();
					break;
				}
				case "c": {
					this.flagPresses.softdrop = false;
					break;
				}
				case "D": {
					this.flagPresses.harddrop = true;
					this.hardDrop();
					break;
				}
				case "d": {
					this.flagPresses.harddrop = false;
					break;
				}
				
				case "E": {
					this.flagPresses.hold = true;
					this.hold();
					break;
				}
				case "e": {
					this.flagPresses.hold = false;
					break;
				}
				case "F": {
					this.flagPresses.ccw = true;
					this.rotatePiece(-1);
					break;
				}
				case "f": {
					this.flagPresses.ccw = false;
					break;
				}
				case "G": {
					this.flagPresses.cw = true;
					this.rotatePiece(1);
					break;
				}
				case "g": {
					this.flagPresses.cw = false;
					break;
				}
				case "H": {
					this.flagPresses.c180w = true;
					this.rotatePiece(2);
					break;
				}
				case "h": {
					this.flagPresses.c180w = false;
					break;
				}
			}
			
			
		}
		
		if (!this.flagPresses.left && !this.flagPresses.right) {
			this.handling.arr = 0;
			this.handling.das = 0;
			this.handling.dcd = 0;
		}
		this.shiftDelay();
		
		if (this.flagPresses.softdrop && this.lastFlagPresses.softdrop) {
			this.softDrop();
		}
		
		
		if (this.pressStr !== this.lastPressStr) this.lastPressStr = this.pressStr;
		
		for (let g in this.flagPresses) {
			if (this.flagPresses[g] !== this.lastFlagPresses[g]) this.lastFlagPresses[g] = this.flagPresses[g];
		}
		
		this.updatePiece();
		
		
		this.pressStr = "";
		
		//  if (this.pressStr)
		this.draw();
		
		// } while (true);
	}
	
	adjustSize(width, height) {
		this.size.w = width;
		this.size.h = height;
		this.updateSizeAndPos();
	}
	
	repositionCenter(x, y) {
		this.pos.center.x = x;
		this.pos.center.y = y;
		this.updateSizeAndPos();
	}
	
	updateSizeAndPos() {
		this.pos.start.x = this.pos.center.x - (this.size.w * (this.size.c) / 2);
		this.pos.start.y = this.pos.center.y - (this.size.h * (this.size.c) / 2);
	}
	
	rotatePlayer(deg) {
		this.pos.rot.deg = deg % 360;
		this.pos.rot.x = Math.sin(deg);
		this.pos.rot.y = Math.cos(deg);
	}
	draw() {
		manager.canvas.drawPolygon(this.poly.body, this.pos.start.x, this.pos.start.y, this.size.w, this.size.h, (this.size.c * this.cellSize), "#999", this.pos.rot.deg);
		manager.canvas.drawPolygon(this.poly.hold, this.pos.start.x, this.pos.start.y, this.size.w, this.size.h, (this.size.c * this.cellSize), "#000", this.pos.rot.deg);
		manager.canvas.drawPolygon(this.poly.next, this.pos.start.x, this.pos.start.y, this.size.w, this.size.h, (this.size.c * this.cellSize), "#000", this.pos.rot.deg);
		manager.canvas.drawPolygon(this.poly.next_queue, this.pos.start.x, this.pos.start.y, this.size.w, this.size.h, (this.size.c * this.cellSize), "#000", this.pos.rot.deg);
		manager.canvas.drawImage(manager.images.bg, null, null, null, null, this.pos.start.x + (this.size.c * 2 * manager.cellSize * (this.POSITIONS.brdw + 1.5)), this.pos.start.y, this.size.c * manager.cellSize * 10 * 2, this.size.c * manager.cellSize * 20 * 2, this.pos.rot.deg)
		
		this.drawActivePiece();
		this.previewDraw();
		this.holdDraw();
		this.drawStack();
		//if (this.statistics.tspin2 > 0) this.repositionCenter(manager.canvas.canvas.width / 2 + Math.random() * this.statistics.tspin2, manager.canvas.canvas.height / 2 + Math.random() * this.statistics.tspin2)
		//manager.canvas.drawText(`${this.handling.das} ${this.handling.dcd}`, 80, 32, "30px arial", '#0dd')
	}
	
};







window.addEventListener("DOMContentLoaded",() => {
	manager.init();
	for (let a of ["keydown", "keyup"]) window.addEventListener(a, (evt) => {
		keyboard.listen(evt)
	});                                                            
});