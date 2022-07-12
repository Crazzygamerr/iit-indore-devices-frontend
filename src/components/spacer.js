import React from 'react';

export const Spacer = (props) => {
	return (
		<div style={{
			width: props.width || "10px",
			height: props.height || "10px",
		}}>
		</div>
	);
}