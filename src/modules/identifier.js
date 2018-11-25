const fs = require("fs");
const DivisionsCSV = fs.readFileSync("../data/out.csv").toString();
const DivisionsArray = DivisionsCSV.split(/\n+/g).map(line => line.split(/,+/g));
const Divisions = DivisionsArray.reduce((acc, curr) => {
	if (!curr[1]) return acc;
	acc[curr[1].trim()] = {
		"division": curr[0].trim(),
		"Ayes": curr[2].trim(),
		"Noes": curr[3].trim()
	};
	return acc;
}, {})
const DebatesRaw = JSON.parse(fs.readFileSync("../data/debates.json").toString());
const Debates = Object.entries(DebatesRaw).map(([k, {name}]) => [name, k]);
console.log(Divisions);
console.log(Debates);
let i = 0;

class Identifier {

	static run () {
		for (let [name, obj] of Object.entries(Divisions)) {
			let f = Debates.filter(([_name, id]) => {
				if (name.toLowerCase().replace(/\w/g, "") === _name.toLowerCase().replace(/\w/g, "")) return true;
				return false;
			})[0];
			if (f) {
				Object.assign(DebatesRaw[f[1]], obj);
				i++;
			}
			else console.log(name);
		}
		console.log(i);
		let str = "";
		for (let ao of Object.values(DebatesRaw)) {
			str += '"' + Object.values(ao).join('","') + '"\n';
		}
		fs.writeFileSync("../data/debates.csv", str);
		fs.writeFileSync("../data/debates.json", JSON.stringify(DebatesRaw, null, 4));
	}

}

Identifier.run();

module.exports = Identifier;