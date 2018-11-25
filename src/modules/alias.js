const fs = require("fs");
const path = "../data/";
//let k = 0;
const Mapper = Object.values(JSON.parse(fs.readFileSync(path + "mps.json")));
const speeches = JSON.parse(fs.readFileSync(path + "speeches.json"));
const _Map = {
	"Mr Speaker":  {
		"index": "17",
		"name": "John Bercow",
		"constituency": "Buckingham",
		"gender": "Male",
		"surname": "Bercow",
		"forename": "John",
		"home page > uri": "http://www.johnbercow.co.uk",
		"party": "Speaker",
		"twitter": ""
	},
	"The Prime Minister": {
		"index": "8",
		"name": "Mrs Theresa May",
		"constituency": "Maidenhead",
		"gender": "Female",
		"surname": "May",
		"forename": "Theresa",
		"home page > uri": "http://www.tmay.co.uk",
		"party": "Conservative",
		"twitter": "https://twitter.com/theresa_may"
	}
}

class Alias {

	static run() {
		let string = "\"index,\"debate,\"name,\"content\",\"order\",\"speaker\"\n";
		for (let i in speeches) {
			if (!speeches[i].content.trim()) {
				delete speeches[i];
				continue;
			};
			if (!speeches[i].name) continue; /*
			let f = _Map[speeches[i].name] ? _Map[speeches[i].name] : Mapper.filter((entry) => {
				//console.log(entry.name, speeches[i].name);
				if (speeches[i].name.includes(entry.name)) return true;
				if (speeches[i].name.includes(entry.surname)) {
					if (/^mr\s/i.test(speeches[i].name) && entry.gender === "Male") return true;
					else if (/^(?:mrs|ms)\s/i.test(speeches[i].name) && entry.gender === "Female") return true;
					else if (/^dr\s/i.test(speeches[i].name)) return true;
				};
				return false;
			})[0]; /*
			if (f) {
				console.log(speeches[i].name, f.name, f.index);
				speeches[i].speaker = f.index;
				k++;
			};*/
			string += "\"" + speeches[i].index + "\",\"" + speeches[i].debate + "\",\"" + speeches[i].name + "\",\"" + speeches[i].content.replace('"', "'").replace(/\n/g, "\\n") + "\",\"" + speeches[i].order + "\",\"" + speeches[i].speaker + "\"\n";
			console.log(speeches[i].name, speeches[i].name, speeches[i].index);
		}
		fs.writeFileSync(path + "speeches.csv", string);
		//fs.writeFileSync(path + "speeches.json", JSON.stringify(speeches, null, 4))
	}
}

Alias.run();
module.exports = Alias;