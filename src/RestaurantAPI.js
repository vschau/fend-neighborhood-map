const api = 'https://api.foursquare.com/v2/venues'
const clientId = 'add your Foursquare clientId here'
const clientSecret = 'add your Foursquare clientSecret here'
const v = '20180718'

const headers = {
  'Accept': 'application/json'
}

export const get = (id) => {
  let url = `${api}/${id}?client_id=${clientId}&client_secret=${clientSecret}&v=${v}`
  return fetch(url, { headers })
    .then(res => res.json())
    .then(data => data.response.venue)
}

export const getAll = (latlng) => {
  let url = `${api}/search?ll=${latlng[0]},${latlng[1]}&limit=5&client_id=${clientId}&client_secret=${clientSecret}&v=${v}&query=restaurant`
  return fetch(url, { headers })
    .then(res => res.json())
    .then(data => data.response.venues)
}
