import Item from './item';
import React, { Component } from 'react';

class Bin extends Component {
	render() {
		return (
			<div className="bin">
				<ul>
					{this.props.items.map((item) => { return <Item {...item} /> })}
				</ul>
			</div>
		);
	}
}

class Location extends Component {
	render() {
		return (
			<div className="location">
				{this.props.name}
				{this.props.bins.map((bin, i) => { return <Bin key={i} items={bin} /> })}
			</div>
		);
	}
}

export default class Locations extends Component {
	render() {
		return (
			<div id="locations">
				{this.props.locations.map((loc) => { return <Location key={loc.id} {...loc} /> })}
			</div>
		);
	}
}
