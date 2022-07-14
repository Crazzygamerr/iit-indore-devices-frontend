import React from "react";
import './showMoreWrapper.css';

type props = {
	children: (React.ReactNode),
	length: number,
	setLength: (length: number) => void,
	list_length: number,
};

export default function ShowMoreWrapper({
	children,
	length,
	setLength,
	list_length,
}: props) {
	return <div
		style={{
			width: 'fit-content',
		}}>
		{children}
		{!(length >= list_length) &&
			<button
				className="show-more-button"
				onClick={() => setLength(length + 10)}>
				Show more
			</button>
		}
	</div>;
}

