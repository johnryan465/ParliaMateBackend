const fs = require("fs");
const DebatesRaw = JSON.parse(fs.readFileSync("../data/debates.json").toString());
const Debates = Object.entries(DebatesRaw).filter(([, k]) => k.division).reduce((acc, [v, k]) => {
	acc[k.division] = v;
	return acc;
}, {});

console.log(Debates);

class Accumulator {

	constructor (raw, division) {
		this.raw = raw;
		this.division = division;
	}

	get line () {
		if (this._line) return this._line;
		return '"' + this.index + '","' + this.ID + '","' + this.vote + '"\n';
	}

	get split () {
		if (this._split) return this._split;
		return this.raw.split(/\,+/g)
	}

	get ID () {
		if (this._ID) return this._ID;
		return this.split.shift();
	}

	get index () {
		if (this._index) return this._index;
		return Debates[this.division];
	}

	get vote () {
		if (this._vote) return this._vote;
		let vote = this.split.pop().trim();
		if (vote === "Aye") return true;
		if (vote === "No") return false;
		console.error(vote);
		return null;
	}

}

fs.readdir("../data/Votes/", (err, files) => {
	if (err) return console.error(err);
	let str = "";
	for (let f of files) {
		if (!f.endsWith(".csv")) continue;
		let arr = f.match(/Division No ([0-9]{1,4})\.csv/);
		if (arr === null) console.error(f);
		let division = arr[1];
		let data = fs.readFileSync("../data/Votes/" + f).toString();
		for (let d of data.split(/\n+/g).slice(1)) {
			let acc = new Accumulator(d, division);
			if (acc.index) {
				console.log(acc.line);
				str += acc.line;
			}
		}
    };
    fs.writeFileSync("../data/votes.csv", str);
})