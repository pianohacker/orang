import React, { Component } from 'react';

export class EditableText extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false
		};
	}

	onKeyDown(e) {
		if (e.keyCode == 13) {
			this.setState({editing: false});
			this.props.onChange(e.target.value);
			e.preventDefault();
		}
	}

	onClick() {
		this.setState({editing: true});
	}

	render() {
		return (
			this.state.editing
			? <input ref="input" defaultValue={this.props.text} onKeyDown={(e) => this.onKeyDown(e)} />
			: <span className="editable" onClick={() => this.onClick()}>{this.props.text}</span>
		)
	}

	componentDidUpdate() {
		var input = React.findDOMNode(this.refs.input);
		input.focus();
	}
}
