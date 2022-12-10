import React from "react";
import { matchSearch } from "../../Utils/utilities";
import './showMoreWrapper.css';

type props = {
	condition?: (item: any) => any[],
	columns?: any[],
	list: any[],
	initial_length: number,
	builder: (item: any, index: number) => React.ReactNode,
};

export default function ShowMoreWrapper({
	condition,
	columns = [],
	list,
	initial_length = 5,
	builder,
}: props) {	
	const [length, setLength] = React.useState(initial_length);
	const [search, setSearch] = React.useState('');
	
	if (!list.length || list.length === 0) return null
	
	// check if any of the strings in the condition array is in the search string
	const checkCondition = (condition: string[], search: string) => {
		if (condition.length === 0) return true;
		for (let i = 0; i < condition.length; i++) {
			if (matchSearch(condition[i], search)) return true;
		}
		return false;
	}
	
	if (columns.length > 0)
		return <div style={{ width: 'fit-content' }}>
			{condition &&
				<input
					type="text"
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder="Search"
					style={{
						maxWidth: '500px',
					}}
				/>
			}
			<table className="show-more-table">
				<thead>
					<tr>
						{columns.map((column, index) => <th key={index}>{column}</th>)}
					</tr>
				</thead>
				<tbody>
					{builder
						? list.slice(0, length).map((item, index) => {
							if (checkCondition(condition ? condition(item) : [], search)) {
								return builder(item, index);
							}
							return null;
						})
						: <></>}
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

