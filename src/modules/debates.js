const fs = require("fs");

let dates = {};

class PrintBoi {

	constructor(raw, date, title) {
		this.raw = raw;
		this.date = date;
		this.times = [];
		this.speakers = [];
		this.mps = {};
		this.rawTitle = title;
		if (dates[this.date] !== undefined) ++dates[this.date];
		else dates[this.date] = 0;
		this.order = dates[this.date];
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

	get timestamp() {
		let date = (new Date(this.date + "T" + this._time + ":00Z")).getTime();
		return date;
	}

	get _time() {
		return this.times[0] || "00:00";
	}
/*
	get order () {
		if (this._order) return this._order;
		if (dates[this._date] !== undefined) return ++dates[this._date];
		else return dates[this._date] = 0;
	}*/

	get index () {
		return this.date + "-" + this.order;
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

class Debates {
	constructor(parse) {
		if (!Array.isArray(dates[parse.date])) dates[parse.date] = [];
		dates[parse.date].push(parse.debate);
		let order = dates[parse.date].length;
		this.index = parse.date + "-" + order;
		this.name = parse.debate;
		this.date = parse.date;
		this.time = parse._time;
		this.timestamp = parse.timestamp;
		this.order = parse.order;
		//console.log(parse.debate, parse._date);

	}
}


class MPs {
	constructor(parse) {
		this.index = parse.index;
		this.mps = parse.mps;
	}
}

class Speeches {
	constructor(parse, i) {		
		this.index = parse.index + "-" + i;
		this.debate = parse.index;
		this.name = parse.speakers[i].name;
		this.party = parse.speakers[i].party;
		this.title = parse.speakers[i].title;
		this.constituency = parse.speakers[i].consitutency;
		this.content = parse.speakers[i].content;
		this.order = parse.order;
		//console.log(parse.debate, parse._date);
	}
}

const input = "../data/Bills/";
const output = ["debates", "speeches", "speakers"];
let str = "";
fs.readdir(input, (err, files) => {
	format = {};
	format.debates = {}, format.speeches = {}, format.speakers = {}, csv = "name,date,time,timestamp";
	//console.log(data);
	if (err) return console.error(err);
	let arr = [];
	for (let f of files) {
		if (!f.endsWith(".txt")) continue;
		let words = f.match(/[^\s]+/g);
		let date = words.pop().replace(".txt", "");
		let d = fs.readFileSync(input + f);
		if (err) throw err;
		//console.log(date, words.join("").toLowerCase());
		let parse = new PrintBoi(d.toString().replace(/\r/g, ""), date, words.join("").toLowerCase());
		parse.run();
		arr.push(parse);
	};
	arr = arr.sort((a, b) => a.timestamp - b.timestamp);
	for (let parse of arr) {
		//console.log(new Date(parse.date).valueOf())
		if (!isNaN(new Date(parse.date).valueOf() === "number")) {
			console.log('index', parse.index, 'time', parse._time, 'debate', parse.debate, 'date', parse.timestamp);
			let d = new Debates(parse);
			str += '"' + Object.values(d).join('","') + '"\n';
			format.debates[parse.index] = d;
			//format.speakers[parse.index] = new MPs(parse);
			//for (let i = 0; i < parse.speakers.length; i++) {
			//	format.speeches[parse.index + "-" + i] = new Speeches(parse, i)
			//}
		};
	};
	//data = data.sort((a, b) => b._date - a._date); 
	fs.writeFileSync("../data/debates.csv", str);
	fs.writeFileSync("../data/debates.json", JSON.stringify(format.debates, null, 4));
	/*
	for (let o of output) {
		fs.writeFileSync("../data/" + o + ".json", JSON.stringify(format[o], null, 4));
	}*/
	//console.log(data);
	//DataManager.setData(data);
});

module.exports = PrintBoi;