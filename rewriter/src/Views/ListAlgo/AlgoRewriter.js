import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Box, Divider, Grid, Typography, Button } from "@mui/material";

const AlgoRewriter = () => {
	const [imageURL, setImageURL] = useState('');
	const [extractedText, setExtractedText] = useState('');

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onload = () => {
			const imageDataUrl = reader.result;
			setImageURL(imageDataUrl);
			extractTextFromImage(imageDataUrl);
		};
		reader.readAsDataURL(file);
	};

	const extractTextFromImage = (imageDataUrl) => {
		Tesseract.recognize(
			imageDataUrl,
			'eng',
			{ logger: (info) => console.log(info) }
		)
			.then(({ data: { text } }) => {
				console.log(typeof text);
				console.log(text);
				setExtractedText(text);
			})
			.catch((error) => console.error(error));
	};

	const handleCopyText = () => {
		navigator.clipboard.writeText(extractedText);
	};

	return (
		<>
			<div>
				<Typography variant={"h5"} sx={{ textAlign: "center" }}>
					Extraction de texte à partir d'une image
				</Typography>
				<Divider sx={{ marginY: 2 }} />
				<Grid container column={12} sx={{ display: 'flex', justifyContent: 'space-between', marginY: 2 }}>
					<Grid item xs={12} sm={12} md={12} lg={6} xl={5} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
						/>
						{imageURL && <img src={imageURL} alt="Uploaded" />}
					</Grid>
					<Grid item xs={12} sm={12} md={12} lg={6} xl={7}>
						{extractedText && (
							<Box sx={{ marginY: 2, width: "100%" }}>
								<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
									<Typography variant={'h5'}>Texte extrait :</Typography>
									<Button onClick={handleCopyText} variant="contained" color="primary">
										Copier le texte
									</Button>
								</Box>
								<Divider sx={{ marginY: 2 }} />
								<Typography sx={{ overflowX: 'auto', maxWidth: '100%' }}>{extractedText}</Typography>
							</Box>
						)}
					</Grid>
				</Grid>
			</div>
		</>
	);
}

export default AlgoRewriter;
