const API_URL = "https://www.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1"

const getApi = (tags, cb) => {
    let url = API_URL
    if(tags) {
        url += `&tags=${tags}`
    }
    fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
            'Accept': 'application/json'
		}
	})
    .then((response) => response.json())
    .then((responseJson) => {
        cb && cb(responseJson)
    })
    .catch((error) => {
        cb && cb(null)  
    })
}

export {
    getApi
}