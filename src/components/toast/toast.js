import React, { useState, useEffect } from "react";
import './toast.css';

export default function Toast({
	toastDetails
}) {
	
	const [showToast, setShowToast] = useState(false);
	
	useEffect(() => {
		if (toastDetails.title !== '') {
			setShowToast(true);
			
			const interval = setInterval(() => {
				if (toastDetails) {
					setShowToast(false);
				}
			}, 4000);
			
			return () => {
				clearInterval(interval);
			}
		}		
	}, [toastDetails]);
	
	return (
		<div
			className={`
			notification
			${showToast ? "notification--active" : ""}
			${(toastDetails && !toastDetails.isError) ? "notification--green" : ""}
			`}>
			<p className="notification-title">{(toastDetails != null) ? toastDetails.title : ""}</p>
			<p className="notification-message">
				{(toastDetails != null) ? toastDetails.description : ""}
			</p>
		</div>
	);
	
}