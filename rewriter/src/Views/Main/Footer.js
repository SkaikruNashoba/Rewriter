
const Footer = () => {
	return (
		<>
			<div
				style={{
					width: "100%",
					position: "fixed",
					bottom: 0,
					left: 0,
					height: "20px",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					fontSize: "11px",
					paddingLeft: "10px",
					paddingRight: "10px",
				}}
			>
				<span>
					version 1.0.0
				</span>
				<span style={{ paddingRight: 20 }}>
					<a href="https://github.com/SkaikruNashoba" target="_blank">Skaikru Nashoba</a> - Tous droits réservés - 2023
				</span>
			</div>
		</>
	)
}
export default Footer