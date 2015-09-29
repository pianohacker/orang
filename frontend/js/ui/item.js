import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../control/actions';
import * as common from './common';

class Item extends Component {
	render() {
		const { dispatch } = this.props;

		return (
			<li>
				<common.EditableText onChange={(value) => dispatch(actions.updateItem(this.props.loc_id, this.props.bin_no, this.props.index, {name: value}))} text={this.props.name} />
				<button onClick={() => dispatch(actions.deleteItem(this.props.loc_id, this.props.bin_no, this.props.index))}>Delete Item</button>
			</li>
		)
	}
}

export default connect()(Item);
