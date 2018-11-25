
const fs = require('fs');

const WordCache = (() => {
    let r = {}
    fs.readFileSync('./kw_incidences.txt')  
      .toString()
      .match(/[^\n]+/g)
      .map(x => x.split(/\s/))
      .forEach(x => {
          r[x[0]] = parseInt(x[1])
      });
    return r
})();

class KeywordBoi {

    static getIncidencesInStr (str) {
        let words = str.toLowerCase().match(/\S+/g).sort();
        let wordNo = words.length; 
        let counts = [];
        let currWord = '';
        let currCount = 0;
        for (let i of words) {
            if (i === currWord) currCount++;
            else {
                if (currCount !== 0) counts.push([currWord,currCount]);
                currWord = i; currCount = 1;
            }
        }
        if (currCount !== 0) counts.push([currWord,currCount]);
        return counts;
    }

    static getIncidenceByWord (word) { 
        return WordCache[word] || 0; 
    }

    static getIncidencesWeighted (str) {
        let incidences = this.getIncidencesInStr(str);
        for (let w of incidences) {
            let weight = this.getIncidenceByWord(w[0]);
            if (weight === 0) w[1] = 0;
            else w[1] /= weight;
        }
        return incidences;
    }

    static getKeywordsFromStr(str) {
        return this.getIncidencesWeighted(str).sort((a,b) => b[1] - a[1]).splice(0,3).map(x => x[0]);
    }

}

//console.log(KeywordBoi.getKeywordsFromStr("hello hi hello hey hello hello hi when i go to the moon i go to the sky sky sky sky sky sky"));