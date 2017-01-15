import React, {Component} from 'react';
import {Panel, PanelHeader, PanelBody} from './panel';

import Map from './map';
import Year from './city/year';

import MainStore from '../stores/main-store';
import CityStore from '../stores/city-store';

class City extends Component {
  constructor(props, context) {
    super(props, context);

    this.urlName = this.props.params.city_url_name;

    this.state = {
      main: MainStore.getState(),
      city: CityStore.getState(this.urlName)
    }

    this.bindedOnChange = this.onChange.bind(this);
  }

  componentWillMount() {
    MainStore.addChangeListener(this.bindedOnChange);
    CityStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    MainStore.removeChangeListener(this.bindedOnChange);
    CityStore.removeChangeListener(this.bindedOnChange);
  }

  componentDidMount() {
    CityStore.load(this.urlName, this.props.location.query);
  }

  onChange() {
    this.setState({
      main: MainStore.getState(),
      city: CityStore.getState(this.urlName)
    });
  }

  onMapLoaded(map) {
    CityStore.setMap(this.urlName, map);
  }

  render() {
    return (
        <div className="o-grid o-panel">
          <Panel display={this.state.main.displayPanel}>
            <PanelHeader>
              <div className="panel-header-title">
                <h3 className="c-heading">{this.state.city.name}</h3>
              </div>
              <Year
                urlName={this.urlName}
                min={(this.state.city.config.years || {}).start}
                max={(this.state.city.config.years || {}).end}
                year={this.state.city.currentYear}
                playing={this.state.city.playing}
              />
            </PanelHeader>
            <PanelBody>
            </PanelBody>
          </Panel>
          <Map
            mapboxAccessToken={this.state.city.config.mapbox_access_token}
            mapboxStyle={this.state.city.config.mapbox_style}
            center={this.state.city.config.coords}
            zoom={this.state.city.config.zoom}
            bearing={this.state.city.config.bearing}
            pitch={this.state.city.config.pitch}
            onLoad={this.onMapLoaded.bind(this)}
          />
        </div>
        );
  }
}

export default City
