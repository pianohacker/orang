import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../control/actions';
import * as common from './common';

class Item extends Component {
	render() {
		const { dispatch } = this.props;

		return (
			<li className="item">
				<common.EditableText
					onChange={(value) => dispatch(actions.updateItem(this.props.loc_id, this.props.bin_no, this.props.index, {name: value}))}
					text={this.props.name}
				/>
				{" ("}<common.CycleOption
					onChange={(value) => dispatch(actions.updateItem(this.props.loc_id, this.props.bin_no, this.props.index, {size: value}))}
					value={this.props.size || 1}
					choices={_(common.SIZE_NAMES).toPairs().sortBy(([size, text]) => parseInt(size)).value()}
				/>)
				<button title="Delete item" onClick={() => dispatch(actions.deleteItem(this.props.loc_id, this.props.bin_no, this.props.index))}>-</button>
			</li>
		)
	}
}

export default connect()(Item);
