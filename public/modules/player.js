import { manager } from "./game.js";
import { polyfill } from "./polyfill.js";

import Sound from "./sound.js";

const PIECE = JSON.parse(
	`[{ "index": 0, "x": 3, "y": 0, "matrix": [[[2, 0, 0], [2, 2, 0], [0, 2, 0]], [[0, 0, 0], [0, 2, 2], [2, 2, 0]], [[0, 2, 0], [0, 2, 2], [0, 0, 2]], [[0, 2, 2], [2, 2, 0], [0, 0, 0]]], "kickTable": { "right": [[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "left": [[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "double": [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [0, -1], [3, 0], [-3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1], [-1, 2], [0, -1], [0, -2], [-1, -1], [-1, -2], [1, 0], [0, 3], [0, -3], [0, 0]], [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [1, 0], [2, 0], [1, -1], [2, -1], [0, 1], [-3, 0], [3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [0, -1], [0, -2], [1, -1], [1, -2], [-1, 0], [0, 3], [0, -3], [0, 0]]] }, "spinDetection": { "highX": [[2, 0], [2, 1], [0, 2], [0, 1]], "highY": [[0, 1], [2, 0], [2, 1], [0, 2]], "lowX": [[-1, 3], [2, 1], [3, -1], [0, 1]], "lowY": [[0, 1], [-1, 3], [2, 1], [3, -1]] } }, { "index": 1, "x": 3, "y": 0, "matrix": [[[0, 3, 0], [0, 3, 0], [3, 3, 0]], [[0, 0, 0], [3, 3, 3], [0, 0, 3]], [[0, 3, 3], [0, 3, 0], [0, 3, 0]], [[3, 0, 0], [3, 3, 3], [0, 0, 0]]], "kickTable": { "right": [[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "left": [[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "double": [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [0, -1], [3, 0], [-3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1], [-1, 2], [0, -1], [0, -2], [-1, -1], [-1, -2], [1, 0], [0, 3], [0, -3], [0, 0]], [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [1, 0], [2, 0], [1, -1], [2, -1], [0, 1], [-3, 0], [3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [0, -1], [0, -2], [1, -1], [1, -2], [-1, 0], [0, 3], [0, -3], [0, 0]]] }, "spinDetection": { "highX": [[1, 0], [2, 2], [1, 2], [0, 0]], "highY": [[0, 0], [1, 0], [2, 2], [1, 2]], "lowX": [[2, 0], [0, 0], [0, 2], [2, 2]], "lowY": [[2, 2], [2, 0], [0, 0], [0, 3]] } }, { "index": 2, "x": 4, "y": 0, "matrix": [[[4, 4], [4, 4]], [[4, 4], [4, 4]], [[4, 4], [4, 4]], [[4, 4], [4, 4]]], "kickTable": { "right": [[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2], [0, 3], [-1, 3], [0, 0]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2], [0, -3], [1, -3], [0, 0]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2], [0, 3], [1, 3], [0, 0]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2], [0, 3], [-1, -3], [0, 0]]], "left": [[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2], [0, 3], [1, 3], [0, 0]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2], [0, -3], [1, -3], [0, 0]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2], [0, 3], [-1, 3], [0, 0]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2], [0, 3], [-1, -3], [0, 0]]], "double": [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [0, -1], [3, 0], [-3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1], [-1, 2], [0, -1], [0, -2], [-1, -1], [-1, -2], [1, 0], [0, 3], [0, -3], [0, 0]], [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [1, 0], [2, 0], [1, -1], [2, -1], [0, 1], [-3, 0], [3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [0, -1], [0, -2], [1, -1], [1, -2], [-1, 0], [0, 3], [0, -3], [0, 0]]] }, "spinDetection": { "highX": [[0, 1], [2, 2], [1, 0], [-1, -1]], "highY": [[-1, -1], [0, 1], [2, 2], [1, 0]], "lowX": [[1, 0], [-1, -1], [0, 1], [2, 2]], "lowY": [[2, 2], [1, 0], [-1, -1], [0, 1]] } }, { "index": 3, "x": 3, "y": 0, "matrix": [[[0, 5, 0], [5, 5, 0], [5, 0, 0]], [[0, 0, 0], [5, 5, 0], [0, 5, 5]], [[0, 0, 5], [0, 5, 5], [0, 5, 0]], [[5, 5, 0], [0, 5, 5], [0, 0, 0]]], "kickTable": { "right": [[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "left": [[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "double": [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [0, -1], [3, 0], [-3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1], [-1, 2], [0, -1], [0, -2], [-1, -1], [-1, -2], [1, 0], [0, 3], [0, -3], [0, 0]], [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [1, 0], [2, 0], [1, -1], [2, -1], [0, 1], [-3, 0], [3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [0, -1], [0, -2], [1, -1], [1, -2], [-1, 0], [0, 3], [0, -3], [0, 0]]] }, "spinDetection": { "highX": [[0, 2], [1, 2], [2, 0], [1, 0]], "highY": [[0, 1], [2, 0], [2, 1], [0, 2]], "lowX": [[0, -1], [1, 2], [-1, 3], [1, 0]], "lowY": [[0, 1], [-1, 3], [2, 1], [3, -1]] } }, { "index": 4, "x": 3, "y": 0, "matrix": [[[0, 6, 0, 0], [0, 6, 0, 0], [0, 6, 0, 0], [0, 6, 0, 0]], [[0, 0, 0, 0], [0, 0, 0, 0], [6, 6, 6, 6], [0, 0, 0, 0]], [[0, 0, 6, 0], [0, 0, 6, 0], [0, 0, 6, 0], [0, 0, 6, 0]], [[0, 0, 0, 0], [6, 6, 6, 6], [0, 0, 0, 0], [0, 0, 0, 0]]], "kickTable": { "right": [[[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]], [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]], [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]], [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]]], "left": [[[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]], [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]], [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]], [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]]], "double": [[[0, 0], [-1, 0], [-2, 0], [1, 0], [2, 0], [0, 1], [0, 0]], [[0, 0], [0, 1], [0, 2], [0, -1], [0, -2], [-1, 0], [0, 0]], [[0, 0], [1, 0], [2, 0], [-1, 0], [-2, 0], [0, -1], [0, 0]], [[0, 0], [0, 1], [0, 2], [0, -1], [0, -2], [1, 0], [0, 0]]] }, "spinDetection": { "highX": [[1, 2, 2, 1], [1, 3, 1, 3], [1, 2, 2, 1], [0, 2, 0, 2]], "highY": [[0, 2, 0, 2], [1, 2, 2, 1], [1, 3, 1, 3], [1, 2, 2, 1]], "lowX": [[-1, 4, -1, 4], [2, 2, 2, 2], [-1, 4, -1, 4], [1, 1, 1, 1]], "lowY": [[1, 1, 1, 1], [-1, 4, -1, 4], [2, 2, 2, 2], [-1, 4, -1, 4]] } }, { "index": 5, "x": 3, "y": 0, "matrix": [[[7, 7, 0], [0, 7, 0], [0, 7, 0]], [[0, 0, 0], [7, 7, 7], [7, 0, 0]], [[0, 7, 0], [0, 7, 0], [0, 7, 7]], [[0, 0, 7], [7, 7, 7], [0, 0, 0]]], "kickTable": { "right": [[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "left": [[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "double": [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [0, -1], [3, 0], [-3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1], [-1, 2], [0, -1], [0, -2], [-1, -1], [-1, -2], [1, 0], [0, 3], [0, -3], [0, 0]], [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [1, 0], [2, 0], [1, -1], [2, -1], [0, 1], [-3, 0], [3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [0, -1], [0, -2], [1, -1], [1, -2], [-1, 0], [0, 3], [0, -3], [0, 0]]] }, "spinDetection": { "highX": [[1, 2], [2, 2], [1, 0], [0, 0]], "highY": [[0, 0], [1, 2], [2, 2], [1, 0]], "lowX": [[0, 2], [0, 0], [2, 0], [2, 2]], "lowY": [[2, 2], [0, 2], [0, 0], [2, 0]] } }, { "index": 6, "x": 3, "y": 0, "matrix": [[[0, 8, 0], [8, 8, 0], [0, 8, 0]], [[0, 0, 0], [8, 8, 8], [0, 8, 0]], [[0, 8, 0], [0, 8, 8], [0, 8, 0]], [[0, 8, 0], [8, 8, 8], [0, 0, 0]]], "kickTable": { "right": [[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "left": [[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]], "double": [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [0, -1], [3, 0], [-3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [-1, 1], [-1, 2], [0, -1], [0, -2], [-1, -1], [-1, -2], [1, 0], [0, 3], [0, -3], [0, 0]], [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [1, 0], [2, 0], [1, -1], [2, -1], [0, 1], [-3, 0], [3, 0], [0, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [0, -1], [0, -2], [1, -1], [1, -2], [-1, 0], [0, 3], [0, -3], [0, 0]]] }, "spinDetection": { "highX": [[0, 2], [2, 2], [0, 2], [0, 0]], "highY": [[0, 0], [0, 2], [2, 2], [0, 2]], "lowX": [[0, 2], [0, 0], [0, 2], [2, 2]], "lowY": [[2, 2], [0, 2], [0, 0], [0, 2]] } }]`
);

export const Player = class {
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