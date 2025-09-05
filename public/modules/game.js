import { Canvas2D } from "./canvas.js";
import { Player } from "./player.js";
import { polyfill } from "./polyfill.js";
import {touch} from "./touch.js";
import Sound from "./sound.js";
export const manager = new class {
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
}();

window.addEventListener("beforeunload", () => {
	
});

window.addEventListener("resize", () => {
	manager.resize();
});

