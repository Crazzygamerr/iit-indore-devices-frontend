import React from "react";
import './showMoreWrapper.css';

type props = {
	isTable?: boolean,
	columns?: any[],
	list: any[],
	initial_length?: number,
	builder?: (item: any, index: number) => React.ReactNode,
};

export default function ShowMoreWrapper({
	isTable = false,
	columns = [],
	list,
	initial_length = 5,
	builder,
}: props) {
	const [length, setLength] = React.useState(initial_length);
	if (!list.length || list.length === 0) return null
	
	if (isTable)
		return <div style={{ width: 'fit-content' }}>
			<table className="show-more-table">
				<thead>
					<tr>
						{columns.map((column, index) => <th key={index}>{column}</th>)}
					</tr>
				</thead>
				<tbody>
					{builder ? list.slice(0, length).map(builder) : <></>}
					{!(length >= list.length) &&
						<tr>
							<td colSpan={columns.length}>
								<button
									className="show-more-button"
									onClick={() => setLength(length + 10)}>
									Show more
								</button>
							</td>
						</tr>
					}
				</tbody>
			</table>
		</div>;
	
	return <div style={{ width: 'fit-content' }}>
		{builder ? list.slice(0, length).map(builder) : <></>}
		{!(length >= list.length) &&
			<button
				className="show-more-button"
				onClick={() => setLength(length + 10)}>
				Show more 
			</button>
		}
	</div>;
}

