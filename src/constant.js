export const mapCenter = [38.6780, -121.1761]

export const venues = [
  {
    id: "4be72f1ecf200f473d63153c",
    name: "Hacienda Del Rio Restaurant & Cantina",
    address: "702 Sutter St, Folsom, CA 95630",
    location: { lat: 38.67792887716596, lng: -121.17685934985349 }
  },
  {
    id: "4b132ceaf964a5201f9523e3",
    name: "T2 Yan Chinese Restaurant",
    address: "1010 Riley St, Folsom, CA 95630",
    location: { lat: 38.670369442528376, lng: -121.16855007104678 }
  },
  {
    id: "5a98c571db1d812223f6a75c",
    name: "El Pueblo Mexican Restaurant",
    address: "6608 Folsom Auburn Rd #1, Folsom, CA 95630",
    location: { lat: 38.6859823, lng: -121.1793607, }
  },
  {
    id: "4b882b25f964a5208fe431e3",
    name: "The Original Mel's Diner",
    address: "13399 Folsom Blvd, Folsom, CA 95630",
    location: { lat: 38.65600005462554, lng: -121.18247019390388 }
  },
  {
    id: "4b5bd080f964a520b71729e3",
    name: "Tokyo Sushi",
    address: "1002-3 Riley St, Folsom, CA 95630",
    location: { lat: 38.67081250648152, lng: -121.17001067230224 }
  }
]

export const popupSkeletonTemplate = (data) => {
}

export const popupTemplate = (data) => {
  let photo = data.photos.groups[1].items[0]
  let photoUrl = ''
  if (photo) {
    photoUrl = `${photo.prefix}150x150${photo.suffix}`
  }
  else {
    photoUrl = 'http://via.placeholder.com/200x200'
  }
  return `
    <div class="popup-content">
      <h2><a target="_blank" href="${data.canonicalUrl}">${data.name}</a></h2>
      <ul>
        <li>${data.location.formattedAddress[0]}</li>
        <li>${data.location.formattedAddress[1]}</li>
        <li>${data.categories.map(i => i.shortName).join(', ')} • ${Array(data.price.tier+1).join('$')}</li>
        <li><img class="restaurant-photo" src="${photoUrl}" alt="${data.name} photo"></li>
      </ul>
    </div>
  `
}
