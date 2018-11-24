const fs = require("fs");

class PrintBoi {

	constructor(raw, date, title) {
		this.raw = raw;
		this._date = date;
		this.times = [];
		this.speakers = [];
		this.mps = {};
		this.rawTitle = title;
	}

	get rawLines() {
		if (this._rawLines) return this._rawLines;
		return this.raw.split(/\r\n\r\n/g)
	}

	get debate() {
		if (this._debate) return this._debate;
		let debate = this.rawLines.shift();
		let d = debate.split(/\s+/).join("").toLowerCase();
		if (d !== this.rawTitle) console.error(d, this.rawTitle);
		return debate;
	}

	get lines() {
		if (this._lines) return this._lines;
		return this.rawLines.splice(1)
	}

	get date() {
		return new Date(this._date);
	}

	time(line) {
		let [h, m] = line.match(/(?:[0-1][0-9]|2[0-3]):([0-5][0-9]):([0-9][0-9])/);
		this.times.push(h + ":" + m);
		return null;
	}

	speaker(line) {
		let parts = line.match(/([\w\s\-.]+|Hon\. Members)(?:\s*\(([\w\s\,]+)\)\s+\(([\w\/\-]+))?/);
		if (!parts) {
			console.error(line);
			return null;
		};
		let [, name, constituency, party] = parts;
		if (constituency && !party) {
			title = constituency
			constituency = null;
		}
		if (name && constiuency) this.mps[name] = {name, title, party, constituency}
		else {
			title = this.mps[name].title;
			party = this.mps[name].party;
			consitutency = this.mps[name].constituency;
		}
		this.speakers.push({name, title, party, constituency, "content": ""})
		return null;
	}

	content(line) {
		this.speakers[this.speakers.length - 1] += line + "\n";
	}

	run() {
		for (let l of this.lines) {
			if (/([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-9][0-9]/.test(l)) return this.time(l)
			if (/\r\n/.test(l)) {
				let a = l.split(/\r\n/);
				console.log(a);
				this.speaker(a[0]);
				return this.content(a[1]);
			}
			return this.content(l);
		};
	}

}

const path = "../data/";

fs.readdir(path, (err, files) => {
	if (err) return console.error(err);
	for (let f of files) {
		if (!f.endsWith(".txt")) continue;
		let words = f.match(/[^\s]+/g);
		let date = words.pop();
		fs.readFile(path + f, (err, data) => {
			if (err) throw err;
			//console.log(date, words.join("").toLowerCase());
			let text = new PrintBoi(data.toString(), date, words.join("").toLowerCase());
			text.run();
			//console.log(text.lines);
			console.log(text.speakers);
		  });
		return;
	};
});

module.exports = PrintBoi;