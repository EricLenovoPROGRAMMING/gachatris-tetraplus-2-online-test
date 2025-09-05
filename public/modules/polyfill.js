export const polyfill = {
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