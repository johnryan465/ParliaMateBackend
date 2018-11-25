const fs = require("fs");
const Raw = require("../data/response.json");
const Results = Raw.results[0].workerResult.audiofile_features.transcriptions.merged_timed;
const Timings = Raw.results[0].workerResult.audiofile_features.transcriptions.diarization;

let Output = {};
let i = 0;
for (let t of Timings) {
    while (Results[i].time_to < t.time_to) {
		if (!Output[t.value]) Output[t.value] = "";
		Output[t.value] += (/[\s\w]+$/.test(Results[i].value) && /^[\w\s]+/.test(Results[i].value ) ? " " : "") + Results[i].value;
    	i++;
    } 
}

fs.writeFileSync("../data/live.csv", Object.values(Output).join("\n"));