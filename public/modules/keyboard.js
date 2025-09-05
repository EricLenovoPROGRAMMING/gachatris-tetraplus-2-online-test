import { manager } from "./game.js";

export const keyboard = new class {
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