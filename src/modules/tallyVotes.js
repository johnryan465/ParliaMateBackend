
const fs = require('fs');

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

        let str = this.everyFourth(fs.readFileSync(name + '.csv').toString());
        return this.tallyVotes(this.getRows(str).splice(1).map(this.rowToObj))

    }

}

console.log(TallyVoteBoi.fromCSV('Commons 21-11-2018 Division No 264'))