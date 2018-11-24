import os
import requests
import json
import time
from uuid import uuid4

license = 'GZEQhdOCI7a0VbikezFdz1WGlfhKZQKy4OrCLgsb'
authentication = 'Basic enJiaTl3N253eGhtdHZ3NXE5Y2RxcjZsY3NsY2pwMjQzcWRnMng4Y2w4OTJ2OXJwOkR7cjpqaypRSEgtMjpIZGRjNzUpJS19KTFHMF9fXCotIykzX0xoaF9+SFxmTjdQZQ=='

headers = {
   'Content-Type':'application/json',
   'x-spdra-license':license,
   'x-spdra-authentication':authentication
}

https_url = 'http://www.voiptroubleshooter.com/open_speech/american/OSR_us_000_0010_8k.wav'

def get_upload_destination():
	wflurl =  'https://spdra.deloitterisk.cloud/v1/upload-destination'
	resp = requests.post(wflurl, headers=headers)
	return resp.json()

def upload_file(filepath, url):
	file_size = os.path.getsize(filepath)
	with open(filepath, "rb") as f:
		data = f.read()
	headers = {
		'Content-Length': str(file_size),
	}
	resp = requests.put(url, data=data, headers=headers)
	return resp.status_code

def init_transcription(fileUri=https_url, protocol="https"):	
	wflurl =  'https://spdra.deloitterisk.cloud/v1/job/workflow/transcription_only/'
	payload = {'correlationId': str(uuid4()),'location': {'fileUri': fileUri,'protocol': protocol}}
	data = json.dumps(payload)
	resp = requests.post(wflurl, data=data, headers=headers)
	return resp.json()

def upload_file_and_init_transcription(filepath):
	resp_urls = get_upload_destination()
	uploadUri = resp_urls['uploadUri']
	processingUri = resp_urls['processingUri']

	resp_upload = upload_file(filepath=filepath, url=uploadUri)
	assert resp_upload == 200

	return init_transcription(fileUri=processingUri, protocol="spdra")

def poll_transcription(jobID):
	url =  'https://spdra.deloitterisk.cloud/v1/job/'+jobID
	resp = requests.get(url, headers=headers)
	return resp.json()

if __name__ == "__main__":
	jobId = upload_file_and_init_transcription('/Users/rman/Documents/BEAT/audio/voice_recognition/OSR_us_000_0040_8k.wav')['jobId']
	time.sleep(2)
	result = poll_transcription(jobId)
	while result == {'statusCode': 202, 'message': 'Job not yet finished, try again later.'}:
		result = poll_transcription(jobId)
		print(result)
		time.sleep(30)