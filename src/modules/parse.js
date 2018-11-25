const fs = require("fs");
const DataManager = require("./datamanager.js");

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
		return this.raw.split(/\n\n/g)
	}

	get debate() {
		if (this._debate) return this._debate;
		let debate = this.rawLines.shift();
		let d = debate.split(/\s+/).join("").toLowerCase();
		if (d !== this.rawTitle) console.error(d, this.rawTitle);
		return debate.trim();
	}

	get lines() {
		if (this._lines) return this._lines;
		return this.rawLines.slice(1)
	}

	get date() {
		let date = (new Date(this._date + "T" + this._time + ":00Z")).getTime();
		return date;
	}

	get _time() {
		return this.times[0] || "00:00";
	}

	time(line) {
		let [, h, m] = line.match(/([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-9][0-9])/);
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
		name = name.trim();
		let title = undefined;
		if (constituency && !party) {
			title = constituency
			constituency = null;
		}
		if (this.mps[name]) {
			title = this.mps[name].title;
			party = this.mps[name].party;
			constituency = this.mps[name].constituency;
		} else this.mps[name] = {
			name,
			title,
			party,
			constituency
		}
		this.speakers.push({
			name,
			title,
			party,
			constituency,
			"content": ""
		});
		//console.log(this.speakers);
		return null;
	}

	content(line) {
		if (this.speakers.length === 0) this.speakers.push({
			"content": line + "\n"
		})
		this.speakers[this.speakers.length - 1].content += line + "\n";
	}

	run() {
		for (let l of this.lines) {
			//console.log(l, /([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-9][0-9]/.test(l), /\n/.test(l));
			if (/([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-9][0-9]/.test(l)) this.time(l);
			else if (/\n/.test(l)) {
				let a = l.split(/\n/);
				this.speaker(a[0]);
				this.content(a[1]);
			} else this.content(l);
		};
	}

}

class Format {
	constructor(parse) {
		this.name = parse.debate;
		this.date = parse._date;
		this.time = parse._time,
		this.mps = parse.mps,
		this.times = parse.time,
		this.speakers = parse.speakers,
		this._date = parse.date;
		//console.log(parse.debate, parse._date);
	}
}

const input = "../data/tmp/";
const output = "../debates/"

fs.readdir(input, (err, files) => {
	let data = [], csv = "name,date,time,timestamp";
	//console.log(data);
	if (err) return console.error(err);
	let i = 0;
	for (let f of files) {
		if (!f.endsWith(".txt")) continue;
		let words = f.match(/[^\s]+/g);
		let date = words.pop().replace(".txt", "");
		let d = fs.readFileSync(input + f);
		if (err) throw err;
		//console.log(date, words.join("").toLowerCase());
		let parse = new PrintBoi(d.toString().replace(/\r/g, ""), date, words.join("").toLowerCase());
		parse.run();
		//console.log("lines", text.lines);
		//console.log("times", text.times);
		//console.log(text.lines);
		//console.log("speakers", text.speakers);
		if (parse.date) {
			let format = new Format(parse);
			fs.writeFileSync(output + i + ".json", JSON.stringify(format, null, 4));
			let line = "\"" + i + "\",\"" + format.name + "\",\"" + format.date + "\",\"" + format.time + "\",\"" + format._date + "\"\n";
			console.log(line);
			csv += line;
			i++;
		};
	};
	//data = data.sort((a, b) => b._date - a._date);
	fs.writeFileSync("./index.csv", csv);
	//console.log(data);
	//DataManager.setData(data);
});

module.exports = PrintBoi;