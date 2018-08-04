import React, { Component } from 'react';

class SlidingPanel extends Component {
  render() {
    return (
      <div id="sliding-panel"
        className={"sliding-panel" + (this.props.hide? ' hidden' : '' )}
      >
        <h1>Filter List</h1>
        <input
          aria-label="Filter Restaurant"
          role="search"
          className="search-input"
          type="text"
          placeholder="Filter List"
          value={this.props.query}
          onChange={this.props.onFilterChange}
        />
        <ul tabIndex="0" role="menu" aria-label="Restaurant List">
          {this.props.locations.map(loc => 
            <li
              tabIndex="0"
              role="menuitem"
              key={loc.id}
              onKeyPress={() => this.props.locationClick(loc.marker, loc.id, loc.name)}
              onClick={() => this.props.locationClick(loc.marker, loc.id, loc.name)}
            >{loc.name}</li>
          )}
        </ul>
      </div>    
    )
  }
}

export default SlidingPanel
