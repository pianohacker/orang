import _ from 'lodash';
import React, { Component } from 'react';

export const SIZE_NAMES = {1: 'S', 4: 'M', 9: 'L', 16: 'X'};

export class CycleOption extends Component {
	onClick( e, pos ) {
		this.props.onChange( this.props.choices[ ( pos + 1 ) % this.props.choices.length ][ 0 ] );
		e.preventDefault();
	}

	render() {
		let pos = _.findIndex( this.props.choices, ( [ size, text ] ) => ( size == this.props.value ) );

		return (
			<button
				className="cyclable"
				onClick={( e ) => this.onClick( e, pos )}>
				{this.props.choices[ pos ][ 1 ]}
			</button>
		)
	}
}

export class EditableText extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			editing: false,
		};

		this.inputRef = React.createRef();
	}

	onKeyDown( e ) {
		switch ( e.keyCode ) {
			case 13: // Enter
				this.props.onChange( e.target.value );

				// fallthrough
			case 27: // Escape
				this.setState( {editing: false} );
				e.preventDefault();
		}
	}

	onClick() {
		this.setState( {editing: true} );
	}

	render() {
		return (
			this.state.editing
				? <input ref={this.inputRef} defaultValue={this.props.text} onKeyDown={( e ) => this.onKeyDown( e )} />
				: <span className="editable" onClick={() => this.onClick()}>{this.props.text}</span>
		)
	}

	componentDidUpdate() {
		let input = this.inputRef.current;
		if ( !input ) return; // Not editing

		input.focus();

		// Move cursor to end of input
		input.setSelectionRange( this.props.text.length, this.props.text.length );
	}
}
