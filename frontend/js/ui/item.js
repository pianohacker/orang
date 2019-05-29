import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../control/actions';
import * as common from './common';

class Item extends Component {
	render() {
		const { dispatch } = this.props;

		const updated = moment( this.props.timeUpdated, moment.ISO_8601 );
		const highlight = moment().diff( updated, 'seconds' ) < 5;

		return (
			<li className={'item' + ( highlight ? ' highlight' : '' )}>
				{'('}<common.CycleOption
					fixedWidth="1em"
					onChange={( value ) => dispatch( actions.updateItem( this.props.id, {size: value} ) )}
					value={this.props.size || 1}
					choices={_( common.SIZE_NAMES ).toPairs().sortBy( ( [ size, _text ] ) => parseInt( size ) ).value()}
				/>{') '}
				<common.EditableText
					onChange={( value ) => dispatch( actions.updateItem( this.props.id, {name: value} ) )}
					text={this.props.name}
				/>
				<button
					title="Delete item"
					onClick={() => dispatch( actions.deleteItem( this.props.bin_id, this.props.id ) )}
				>
					-
				</button>
			</li>
		)
	}
}

export default connect()( Item );
