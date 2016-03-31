local response = http.request {
	url = 'http://api.translink.ca/rttiapi/v1/stops',
	params = {
		apikey = 'gZnhSeFYTiDjRCyeX3Rb',
		lat = request.query.lat,
		long = request.query.long,
		radius = request.query.radius or 500
	},
	headers = {
		['Content-Type'] = 'application/json'
	}
}

if (response.content) then
	return response.content
	
end