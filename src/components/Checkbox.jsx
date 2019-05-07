import React, { Component } from 'react';

export default class CheckBox extends Component{
	render(){
		const classes = ['checkbox'];
		classes.push(this.props.checked ? 'checked' : 'unchecked');
		return (
			<div className={classes.join(' ')}
				onClick={this.props.onClick}>
				<input 	style={{ display: 'none' }} 
					type="checkbox" />
				<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				version="1.1"
				>
				<rect
					className="square"
				/>
				<path
					className="tick"
					d="M6,6 v8 h16"
					strokeWidth={this.props.tickSize}
					fill="none"
					transform="rotate(-45, 12, 12)"
				/>
				</svg>
				<div></div>
			</div>
		)
	}
}