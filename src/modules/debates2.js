const fs = require("fs");/*
const DebatesCSV = fs.readFileSync("../data/debates.csv").toString();
const DebatesArray = DebatesCSV.split(/\n+/g).map(line => line.split(/,+/g));
const Debates = DebatesArray.reduce((acc, curr) => {
	acc[curr[0].trim()] = {
		"Noes": curr.pop(),
		"Ayes": curr.pop(),
		"division": curr.pop(),
	};
	return acc;
}, {})*/
const DebatesRaw = JSON.parse(fs.readFileSync("../data/debates.json").toString());
/*
for (let [id, obj] of Object.entries(Debates)) {
	console.log(id);
	if (obj.division !== "" && typeof DebatesRaw[id] === "object") Object.assign(DebatesRaw[id], obj);
}*/

for (let k of Object.keys(DebatesRaw)) {
	DebatesRaw[k].timestamp = DebatesRaw[k].timestamp;// / 1000;
}

fs.writeFileSync("../data/debates.json", JSON.stringify(DebatesRaw, null, 4));

let str = "";
let arr = Object.values(DebatesRaw)
for (let ao of arr) {
	ao.length = Math.min(9, ao.length);
	str += '"' + Object.values(ao).join('","') + '"\n';
}
fs.writeFileSync("../data/debates.csv", str);
//fs.writeFileSync("../data/debates.json", JSON.stringify(DebatesRaw, null, 4));