import React from 'react';

export default function ConfirmDialog({
	title,
	message,
	setRemoveId,
	handleConfirm,
	confirmText = "Delete",
}) {
	
	return <div className="dialog-backdrop">
		<div className="dialog-container">
			<h5>{title}</h5>
			<p>{message}</p>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
				}}>
				<button
					onClick={() => setRemoveId(null)}>
					Cancel
				</button>
				<button
					onClick={handleConfirm}>
					{confirmText}
				</button>
			</div>
		</div>
	</div>;
	
}