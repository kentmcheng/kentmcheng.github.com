-- GET STOPS ==> nextbus.webscript.io/stops?lat=[value]&long=[value]

if (request.query.lat) and (request.query.long) then

	local response = http.request {
		url = 'http://api.translink.ca/rttiapi/v1/stops',
		params = {
			apikey = 'gZnhSeFYTiDjRCyeX3Rb',
			lat = request.query.lat,
			long = request.query.long,
			radius = request.query.radius or 300
		},
		headers = {
			['Content-Type'] = 'application/json'
		}
	}
	
	if (response.content) then
	
		local content = json.parse(response.content)
		local results = {}
		
		if (content["Code"]) then
			results['Error'] = content
		else
			results['Stops'] = content
		end
		
		return json.stringify(results)
				
	end

end

-- GET STOP ==> nextbus.webscript.io/stop?stopNo=[value]

if (request.query.stopNo) then

	local response = http.request {
		url = 'http://api.translink.ca/rttiapi/v1/stops/' .. request.query.stopNo .. '/estimates',
		params = {
			apikey = 'gZnhSeFYTiDjRCyeX3Rb',
			count = 3,
			timeframe = 120,
		},
		headers = {
			['Content-Type'] = 'application/json'
		}
	}

	if (response.content) then
		
		local content = json.parse(response.content)
		local results = {}
		
		if (content["Code"]) then
			results['Error'] = content
		else
			results['Buses'] = content
		end
		
		return json.stringify(results)
			
	end

end