const fs = require("fs");

class PrintBoi {

	constructor(raw, date, title) {
		this.raw = raw;
		this._date = date;
		this.times = [];
		this.speakers = [];
		this.rawTitle = title;
	}

	get rawLines() {
		if (this._rawLines) return this._rawLines;
		return this.raw.match(/\n\n/g)
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

	get syntax() {
		if (this._syntax) return this._syntax;
		let syntax = this.lines.map(line => {
			if (/([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-9][0-9]/.test(line)) return this.time(line)
			if (/\n/.test(line)) {
				let a = this.line.split(/\n/);
				this.speaker(a[0]);
				return this.content(line);
			}
			return this.content(line);
		});
		for (let i = 0; i < syntax.length; i++) {
			if (syntax[i] === null || syntax[i] === undefined) {
				syntax.splice(i, 1);
				i--;
			}
		}
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
		let name = line.match(/([\w\s\-.]+|Hon. Members)(?:\s+\((\w\s,)\)\s+\((\w)))?$/);
		let content = "";
		this.speakers.push({name, title, party, content})
		return null;
	}

}

const path = "../data/";

fs.readdir(path, (err, files) => {
	if (err) return console.error(err);
	for (let f of files) {
		if (!f.endsWith(".txt")) continue;
		let words = f.split(/\s+/g);
		let date = words.pop();
		let event = require(path + f + ".txt");
		new PrintBoi(event, date, words.join("").toLowerCase());
	});
});
console.log(PrintBoi);

module.exports = PrintBoi;