import React, { Component } from 'react'
import escapeRegExp from 'escape-string-regexp'
import SlidingPanel from './SlidingPanel'
import * as RestaurantAPI from './RestaurantAPI'

import L from 'leaflet';
import 'leaflet.smooth_marker_bouncing/leaflet.smoothmarkerbouncing'; // must be imported after leaflet because SMB is an immediately invoke function on L in scope
import marker1x from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { mapCenter, venues, popupTemplate } from './constant'

class Map extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleRestaurantPopup = this.handleRestaurantPopup.bind(this)
    this.handleTogglePanel = this.handleTogglePanel.bind(this)
  }

  // each location inside locations has a marker attached to it.  We create a filteredlocations state to preserve the markers.
  // We handle hidding the markers and react handles hiding the list
  state = {
    locations: venues,
    filteredlocations: venues,
    query: '',
    hidePanel: false
  }

  componentDidMount() {
    this.initMap();
   
    // for bounds
    let markerArray = []

    this.fixLeaftletCssBug()

    // Add markers
    this.state.locations.forEach(loc => {
      let self = this; // use self variable to call handleMarkerClick.  self=Map
      let marker = L.marker(loc.location, { title: loc.name}).addTo(this.map)
      marker.addEventListener('click', function() {
        self.handleRestaurantPopup(this, loc.id, loc.name) //this is marker
      })
      loc.marker = marker
      markerArray.push(loc.location)
    })
    this.setState({filteredlocations: this.state.locations})

    // Add animation settings
    L.Marker.setBouncingOptions({bounceHeight: 60, bounceSpeed: 54})

    // fit markers to bounds
    if (markerArray.length>0) {
      //var group = new L.featureGroup(markerArray)
      //map.fitBounds(group.getBounds())
      let bounds = L.latLngBounds(markerArray)
      this.map.fitBounds(bounds, { padding: [50, 50] })
    }
  }

  handleFilterChange(e) {
    let query = e.target.value
    this.setState({query})

    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      let matchedList = [],
          unmatchedList = []
      this.state.locations.forEach(loc => {
        if (match.test(loc.name)) {
          matchedList.push(loc)
        } else {
          unmatchedList.push(loc)
        }
      })

      this.hideMarkers(unmatchedList)
      this.showMarkers(matchedList)
      this.setState({filteredlocations: matchedList})
    }
    else {
      this.state.locations.forEach(loc => {
        if (loc.marker._icon.classList.contains('hide'))
          loc.marker._icon.classList.remove('hide')
      })
      this.setState({filteredlocations: this.state.locations})
    }
  }

  // This calls the RestaurantAPI.  If failed, it does a catch and displays an error image instead
  handleRestaurantPopup(resMarker, id, name) {
    // if popup doesn't exist or popup isn't open
    if (!resMarker.getPopup() || !resMarker.getPopup().isOpen()) {
      RestaurantAPI.get(id).then(res => {
        resMarker.bindPopup(popupTemplate(res))
      }).catch(() => {
        resMarker.bindPopup(`<div class="popup-content"><h2>Check your internet!</h2><img src="error.svg" alt="Restaurant Detail Loading Error"></div>`)
      }).then(() => {
        resMarker.openPopup()
        if (!resMarker.isBouncing()) {
          L.Marker.stopAllBouncingMarkers()
          resMarker.bounce()
        }
      })
    }
  }

  handleTogglePanel() {
    const currState = this.state.hidePanel;
    this.setState({ hidePanel: !currState });
  }

  initMap() {   
    this.map = L.map('map').setView(mapCenter, 13)

    let layer = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      errorTileUrl: 'error.svg',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).once('tileerror', (error) => {
      alert('Connection Error!')
    })

    layer.addTo(this.map)

    // map will overwrite the tabindex set in the render so we need to do this
    this.mapRef.current.setAttribute('tabindex', '-1');

    // Mapbox
    // this.map = L.map('map').setView(mapCenter, 13);
    // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //   maxZoom: 18,
    //   id: 'mapbox.streets',
    //   accessToken: 'add your access token here'
    // }).addTo(this.map);
  }

  hideMarkers(markers) {
    markers.forEach(loc => {
      let m = loc.marker
      if (m.getPopup() && m.getPopup().isOpen()) {
        m.closePopup()
      }
      if (m.isBouncing()) {
        m.stopBouncing()
      }
      if (!m._icon.classList.contains('hide')) {
        m._icon.classList.add('hide')
        m._shadow.classList.add('hide')
      }
    })
  }

  showMarkers(markers) {
    markers.forEach(loc => {
      let m = loc.marker
      if (m._icon.classList.contains('hide')) {
        m._icon.classList.remove('hide')
        m._shadow.classList.remove('hide')
     }
    })    
  }

  // Fix a bug from leaflet.css and webpack css-loader
  // From https://github.com/PaulLeCam/react-leaflet/issues/255
  fixLeaftletCssBug() {    
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: marker2x,
        iconUrl: marker1x,
        shadowUrl: markerShadow
    });
  }

  render() {
    return (
      <div id="container" className="container">
        <SlidingPanel
          locations={this.state.filteredlocations}
          locationClick={this.handleRestaurantPopup}
          query={this.state.query}
          hide={this.state.hidePanel}
          onFilterChange={this.handleFilterChange}
          />
          <div
            id="control-panel"
            className={"control-panel" + (this.state.hidePanel? ' move-left' : '')}
            aria-label="Panel Control"
            tabIndex="0"
            onClick={this.handleTogglePanel}
            onKeyPress={this.handleTogglePanel}
          >{this.state.hidePanel? '⯈' : '⯇'}</div>
        <div
          id="map"
          role="application"
          tabIndex="-1"
          ref={this.mapRef}
        ></div>
      </div>
    )
  }
}

export default Map;
