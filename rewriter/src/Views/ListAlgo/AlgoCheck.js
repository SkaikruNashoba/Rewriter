import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useState } from "react";
import React from 'react';
import { diffChars } from 'diff';

const AlgoCheck = () => {
	const [text1, setText1] = useState("");
	const [text2, setText2] = useState("");
	const [result, setResult] = useState("");
	const [differences, setDifferences] = useState([]);

	const rtrimText = (text) => {
		return text.replace(/\s+/g, '');
	}

	const handleChange1 = (event) => {
		setText1(event.target.value);
	};

	const handleChange2 = (event) => {
		setText2(event.target.value);
	};

	const handleCheck = () => {
		if (rtrimText(text1) === rtrimText(text2)) {
			setResult("Les textes sont identiques");
			setDifferences([]);
		} else {
			setResult("Les textes sont différents");
			const diffResult = diffChars(text1, text2);
			setDifferences(diffResult);
		}
	};

	return (
		<>
			<Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", flexDirection: "column", marginBottom: 4 }}>
				<Button variant="contained" color="primary" onClick={() => handleCheck()} sx={{ marginY: 5 }}>Check</Button>
				<Grid container sx={{ marginY: 3 }}>
					<Grid item xs={12} sm={12} md={12} lg={6} xl={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
						<Box sx={{ display: "flex", flexDirection: "column" }}>
							<Typography variant="h3" sx={{ textAlign: "center" }}>Texte 1</Typography>
							<textarea style={{ width: '500px', height: '200px' }} value={text1} onChange={handleChange1} />
						</Box>
					</Grid>
					<Grid item xs={12} sm={12} md={12} lg={6} xl={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
						<Box sx={{ display: "flex", flexDirection: "column" }}>
							<Typography variant="h3" sx={{ textAlign: "center" }}>Texte 2</Typography>
							<textarea style={{ width: '500px', height: '200px' }} value={text2} onChange={handleChange2} />
						</Box>
					</Grid>
				</Grid>
			</Container>
			<Container maxWidth="md">
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<Typography variant="h5" sx={{ marginY: 1 }}>Résultat: <b style={{ color: result === "Les textes sont identiques" ? "green" : "red" }}>{result}</b></Typography>

					{differences.length > 0 && (
						<>
							<Typography variant="h5">Différences</Typography>
							<Typography variant="h6" sx={{ wordBreak: "break-word" }}>
								{differences.map((part, index) => {
									return <span key={index} style={{ color: part.added ? 'red' : part.removed ? 'red' : 'grey', wordBreak: "break-word" }}>{part.value}</span>;
								})}
							</Typography>
						</>
					)}
				</Box>
			</Container>
		</>
	)
}

export default AlgoCheck