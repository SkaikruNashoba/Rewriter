import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import CustomSnackBar from "../../Scripts/CustomSnackBar";
import React, { useState } from "react";

const AlgoEncryptDecryptJSON = () => {
	const [text, setText] = useState("");
	const [cryptedText, setCryptedText] = useState("");
	const [encryptJsonvalue, setEncryptJson] = useState("");
	const [decryptJsonvalue, setDecryptJson] = useState("");

	const [verif, setVerif] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [snackBarOpen, setSnackBarOpen] = useState(false);

	const handleSnackBarClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackBarOpen(false);
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const fileContent = e.target.result;
				setText(fileContent);
			};
			reader.readAsText(file);
		}
	};

	const encryptJSON = () => {
		try {
			const encryptedText = btoa(text);
			setEncryptJson(encryptedText);
		} catch (error) {
			setAlertMessage("Erreur lors du cryptage.");
			setVerif(false);
			setSnackBarOpen(true);
		}
	};

	const decryptJSON = () => {
		try {
			const decryptedText = atob(cryptedText);
			setDecryptJson(decryptedText);
		} catch (error) {
			setAlertMessage("Erreur lors du décryptage.");
			setVerif(false);
			setSnackBarOpen(true);
		}
	};

	const copyToClipboard = (text) => {
		const el = document.createElement('textarea');
		el.value = text;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);

		setAlertMessage("Copié dans le presse-papier.");
		setVerif(true);
		setSnackBarOpen(true);
	};

	return (
		<>
			<Box sx={{ width: "100%", marginBottom: 2, textAlign: "center" }}>
				<Typography variant={'h1'} sx={{ fontSize: "20px", marginBottom: 2 }}>
					Algorithme de cryptage/decryptage de JSON
				</Typography>
			</Box>
			<Grid container>
				<Grid item xs={6} sm={6} md={12} lg={12} xl={12}
					sx={{ border: "1px solid black", display: "flex", flexDirection: "column", alignItems: "center", marginX: 2 }}>
					<Box sx={{ borderBottom: "1px solid black", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
						<Typography sx={{ marginY: 1, borderBottom: "1px solid black", width: "100%", textAlign: "center" }}>
							JSON:
						</Typography>
						<Button variant="contained" color="primary" onClick={() => encryptJSON()}>
							Crypter
						</Button>
						<input type="file" accept=".json" onChange={handleFileChange} />
						<TextField
							multiline
							fullWidth
							variant="outlined"
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
					</Box>
					<Box>
						<Box sx={{ borderBottom: "1px solid black", display: "flex", justifyContent: "space-between" }}>
							<Typography sx={{ marginY: 1, marginLeft: "1rem" }}>
								Résultat au format string:
							</Typography>
							<Button variant="contained" color="primary" onClick={() => copyToClipboard(encryptJsonvalue)}>
								Copier
							</Button>
						</Box>
						<TextField
							aria-readonly={true}
							multiline
							fullWidth
							variant="outlined"
							value={encryptJsonvalue}
						/>
					</Box>
				</Grid>
				<Grid item xs={6} sm={6} md={12} lg={12} xl={12}
					sx={{ border: "1px solid black", display: "flex", flexDirection: "column", alignItems: "center", marginX: 2 }}>
					<Box sx={{ borderBottom: "1px solid black", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
						<Button variant="contained" color="primary" onClick={() => decryptJSON()}>
							Décrypter
						</Button>
						<Typography sx={{ marginY: 1, borderBottom: "1px solid black", textAlign: "center" }}>
							String:
						</Typography>
						<TextField
							multiline
							fullWidth
							variant="outlined"
							value={cryptedText}
							onChange={(e) => setCryptedText(e.target.value)}
						/>
					</Box>
					<Box>
						<Box sx={{ borderBottom: "1px solid black", display: "flex", justifyContent: "space-between" }}>
							<Typography sx={{ marginY: 1, marginLeft: "1rem" }}>
								Résultat au format JSON:
							</Typography>
							<Button variant="contained" color="primary" onClick={() => copyToClipboard(decryptJsonvalue)}>
								Copier
							</Button>
						</Box>
						<TextField
							aria-readonly={true}
							multiline
							fullWidth
							variant="outlined"
							value={decryptJsonvalue}
						/>
					</Box>
				</Grid>
				<CustomSnackBar
					open={snackBarOpen}
					message={alertMessage}
					severity={verif === true ? "success" : "error"}
					onClose={handleSnackBarClose}
				/>
			</Grid >
		</>
	)
}

export default AlgoEncryptDecryptJSON;
