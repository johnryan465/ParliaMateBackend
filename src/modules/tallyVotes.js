
const fs = require('fs');
const input = "../data/Votes/";

class TallyVoteBoi {

    static getRows(str) {
        return str.split(/\n/g);
    } 

    static rowToObj(str) {
        let cols = str.split(/\,/g);
        return {
            mnisid: cols[0],
            listas: cols[1],
            party: cols[2],
            vote: (typeof cols[3] === "string" ? cols[3].replace(/\r/g, '') : undefined)
        }
    }

    static tallyVotes(objs) {
        let r = {};
        for (let i = 0; i < objs.length; i++) {
            if (r[objs[i].vote] === undefined) r[objs[i].vote] = 1
            else r[objs[i].vote]++
        }
        return r;
    }

    static everyFourth(str) {
        let r = "";
        for (let i = 0; i < str.length; i++) if (i%4 === 0) r += str[i]
        return r;
    }

    static fromCSV(name) {
        let raw = fs.readFileSync(input + name).toString();
        let str = raw //this.everyFourth(raw);
        //console.log(str);
        return this.tallyVotes(this.getRows(str).splice(1).map(this.rowToObj))

    }

}

fs.readdir(input, (err, files) => {
	if (err) return console.error(err);
	let str = "", out;
	for (let f of files) {
        if (!f.endsWith(".csv")) continue;
        let arr = f.match(/Division No ([0-9]{1,4})\.csv/);
        if (arr === null) console.error(f);
        str = arr[1];
        let obj = Object.values(TallyVoteBoi.fromCSV(f)).slice(0, 2);
        console.log(obj);
        out += str + ',"' + obj[0] + '","' + obj[1] + '"\n'
    };
    console.log(out);
    fs.writeFileSync("../data/votes.csv", out);
});