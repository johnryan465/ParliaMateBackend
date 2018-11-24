const rp = require("request-promise");
const ffmpeg = require("ffmpeg");

class Beat {

	run() {
		let options = {
			"method": "POST",
			"uri": "https://spdra.deloitterisk.cloud/v1/job/workflow/transcription_only",
			"headers": {
				'Content-Type':'application/json',
				"x-spdra-license": "GZEQhdOCI7a0VbikezFdz1WGlfhKZQKy4OrCLgsb",
				"authentication": "Basic enJiaTl3N253eGhtdHZ3NXE5Y2RxcjZsY3NsY2pwMjQzcWRnMng4Y2w4OTJ2OXJwOkR7cjpqaypRSEgtMjpIZGRjNzUpJS19KTFHMF9fXCotIykzX0xoaF9+SFxmTjdQZQ=="
			},
			"body": {
				"correlationId": "1",
				"location": {
					"fileUri": "https://example_url.com/example.mp3", //curren
					"protocol": "https"
				}
			}
		}
	}

}

module.exports = Beat;

console.log({
	"entryId": "1_4td69q0l",
	"duration": 21460,
	"baseUrl": "",
	"flavors": [{
		"url": "https:\/\/uniukp-vh.akamaihd.net\/i\/ukp\/vod\/e5b67de6-b2f5-4e03-98bf-52d40c8af2df\/1_4td69q0l\/e5b67de6-b2f5-4e03-98bf-52d40c8af2df_01_,25,80,120,0.mp4.csmil\/master.m3u8?start=1137"
	}]
})