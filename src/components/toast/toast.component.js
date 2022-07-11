import React, { useState, useEffect } from "react";
import './toast.css';

export default function Toast({
	errorToast
}) {
	
	const [showToast, setShowToast] = useState(false);
	
	useEffect(() => {
		if (errorToast.title !== '') {
			setShowToast(true);
			
			const interval = setInterval(() => {
				if (errorToast) {
					setShowToast(false);
				}
			}, 4000);
			
			return () => {
				clearInterval(interval);
			}
		}		
	}, [errorToast]);
	
	return (
		<div
			className={`
			notification
			${showToast ? "notification--active" : ""}
			${(errorToast && !errorToast.isError) ? "notification--green" : ""}
			`}>
			<p className="notification-title">{(errorToast != null) ? errorToast.title : ""}</p>
			<p className="notification-message">
				{(errorToast != null) ? errorToast.description : ""}
			</p>
		</div>
	);
	
}