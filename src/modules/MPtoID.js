const fs = require("fs");
const path = "../data/"

class Identifier {

	static name() {		
		const rawMPs = JSON.parse(fs.readFileSync(path + "mps.json"));
		const raw = rawMPs.match(/[^\n]+/g).reduce((acc, curr) => {
			if (!curr) return;
			let [index, name] = curr.toString().match(/[^,]+/g);
			acc[name] = index;
			return acc;
		}, {});
		fs.writeFileSync(path + "mps.json", JSON.stringify(raw, null, 4));
	}

	static surname() {		
		const rawMPs = JSON.parse(fs.readFileSync(path + "mps.json"));
		const raw = rawMPs.match(/[^\n]+/g).reduce((acc, curr) => {
			if (!curr) return;
			let [index, name] = curr.toString().match(/[^,]+/g);
			acc[name] = index;
			return acc;
		}, {});
		fs.writeFileSync(path + "mps.json", JSON.stringify(raw, null, 4));
	}
}

Identifier.surname();

module.exports = Identifier;