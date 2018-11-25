
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
        console.log(words)
        let wordNo = words.length; 
        let counts = {};
        let currWord = '';
        let currCount = 0;
        for (let i of words) {
            console.log(i)
            if (i === currWord) currCount++;
            else {
                if (currCount !== 0) counts[currWord] = currCount;
                currWord = i; currCount = 1;
            }
        }
        if (currCount !== 0) counts[currWord] = currCount;
        return counts;
    }

    static getIncidenceByWord (word) { 
        return WordCache[word] || 0; 
    }

    static getIncidencesWeighted (str) {
        let incidences = this.getIncidencesInStr(str);
        for (let w of incidences) {
            incidences[w] /= this.getIncidenceByWord(w);
        }
        return incidences;
    }

}

//
console.log(KeywordBoi.getIncidenceByWord("hello"));