import { manager } from "./game.js";

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

export default audioMaster;

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