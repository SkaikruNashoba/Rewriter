import { Box, Container, Grid, TextField, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import CustomSnackBar from "../../Scripts/CustomSnackBar";

const AlgoConversion = () => {
    const [scssCode, setScssCode] = useState("");
    const [tailwindCode, setTailwindCode] = useState("");
    const [jsonCode, setJsonCode] = useState("");

    const [verif, setVerif] = useState(false)
    const [alertMessage, setAlertMessage] = useState("");
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };

    const regexScss = [
        //récupère toutes les couleurs sans tiret et avec un #
        /--([a-zA-Z0-9]+): (#[a-zA-Z0-9]+);/gm,

        //récupère toutes les couleurs sans tiret et avec rgba avec opacité à virgule
        /--([a-zA-Z0-9]+): (rgba\([0-9], [0-9], [0-9], [0-9].[0-9]\));/gm,

        //récupère toutes les couleurs sans tiret et avec rgba avec opacité sans virgule
        /--([a-zA-Z0-9]+): (rgba\([0-9], [0-9], [0-9], [0-9]\));/gm,

        //récupère toutes les couleurs sans tiret et avec rgb
        /--([a-zA-Z0-9]+): (rgb\([0-9], [0-9], [0-9]\));/gm,


        //récupère toutes les couleurs avec tiret et avec un #
        /--([a-zA-Z0-9]+-[a-zA-Z0-9]+): (#[a-zA-Z0-9]+);/gm,

        //récupère toutes les couleurs avec un tiret et avec rgba
        /--([a-zA-Z0-9]+-[a-zA-Z0-9]+): (rgba\([0-9], [0-9], [0-9], [0-9].[0-9]\));/gm,

        //récupère toutes les couleurs avec tiret et avec rgba avec opacité sans virgule
        /--([a-zA-Z0-9]+-[a-zA-Z0-9]+): (rgba\([0-9], [0-9], [0-9], [0-9]\));/gm,

        //récupère toutes les couleurs avec un tiret et avec rgb
        /--([a-zA-Z0-9]+-[a-zA-Z0-9]+): (rgb\([0-9], [0-9], [0-9]\));/gm
    ];

    const convertToTailwindAndJSON = () => {
        const colors = {};
        const colorsValue = {};
        regexScss.forEach((regex) => {
            let match;
            while ((match = regex.exec(scssCode)) !== null) {
                const propertyName = match[1];
                const propertyValue = match[2];
                colors[propertyName] = `var(--${propertyName})`;
                colorsValue[propertyName] = {propertyValue}
            }
        });


        const tailwindResult = generateTailwindCode(colors);
        const jsonResult = generateJsonCode(colors, colorsValue)

        setTailwindCode(tailwindResult);
        setJsonCode(jsonResult);
    };

    const generateTailwindCode = (colors) => {
        let tailwindCode = "colors : {\n";
        for (const [key, value] of Object.entries(colors)) {
            if (value !== "var(--undefined)") {
            tailwindCode += `\t${key}: "${value}",\n`;
            }
        }
        tailwindCode += "},\n";
        return tailwindCode;
    };

    const generateJsonCode = (colors, colorsValue) => {
        let jsonCode = "\"color\": {\n\t\"palette\": [\n\t\t";
        for (const [key, value] of Object.entries(colors)) {
            if (value !== "var(--undefined)") {
                jsonCode += "{\n\t\t\t\"name\": \"" + key + "\",\n\t\t\t\"slug\": \"" + key + "\",\n\t\t\t\"color\": \"" + colorsValue[key].propertyValue + "\"\n\t\t},\n\t\t";
            }
        }
        jsonCode +=  "],\n" + "\t\"text\": true\n" + "},\n";
        return jsonCode;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setVerif(true)
            setSnackBarOpen(true);
            setAlertMessage("Texte copié dans le press-papier")
        }).catch((error) => {
            setVerif(true)
            setSnackBarOpen(true);
            setAlertMessage("Une erreur est survenue " + error + "!")
        });
    };

    return (
        <>
            <Box sx={{width: "100%", marginBottom: 2, textAlign: "center" }}>
                <Typography variant={'h1'} sx={{ fontSize: "20px", marginBottom: 2}}>
                    Algorithme de conversion (scss en tailwind et json)
                </Typography>
                <Button variant="contained" color="primary" onClick={() => convertToTailwindAndJSON()}>
                    Convertir
                </Button>
            </Box>
            <Grid container columns={20}>
                <Grid item md={6} sx={{ border: "1px solid black", display: "flex", flexDirection: "column", alignItems: "center", marginX: 2 }}>
                        <Typography sx={{ marginY: 1, borderBottom: "1px solid black", width: "100%", textAlign: "center" }}>
                            Format SCSS :
                        </Typography>
                        <TextField
                            multiline
                            fullWidth
                            variant="outlined"
                            value={scssCode}
                            onChange={(e) => setScssCode(e.target.value)}
                        />
                </Grid>
                <Grid item md={6} sx={{ border: "1px solid black", display: "flex", flexDirection: "column", alignItems: "center", marginX: 2 }}>
                        <Box sx={{borderBottom: "1px solid black", width: "100%",display: "flex", justifyContent: "space-between"}}>
                            <Typography sx={{ marginY: 1, marginLeft: "1rem"}}>
                                Résultat au format TailWind:
                            </Typography>
                            <Button onClick={() => copyToClipboard(tailwindCode)} variant="contained" color="primary">
                                Copier
                            </Button>
                        </Box>
                        <TextField
                            aria-readonly={true}
                            multiline
                            fullWidth
                            variant="outlined"
                            value={tailwindCode}
                        />
                </Grid>
                <Grid item md={6} sx={{ border: "1px solid black", display: "flex", flexDirection: "column", alignItems: "center", marginX: 2 }}>
                        <Box sx={{borderBottom: "1px solid black", width: "100%",display: "flex", justifyContent: "space-between"}}>
                            <Typography sx={{ marginY: 1, marginLeft: "1rem"}}>
                                Résultat au format JSON:
                            </Typography>
                            <Button onClick={() => copyToClipboard(jsonCode)} variant="contained" color="primary">
                                Copier
                            </Button>
                        </Box>
                        <TextField
                            aria-readonly={true}
                            multiline
                            fullWidth
                            value={jsonCode}
                        />
                </Grid>
                <CustomSnackBar
                    open={snackBarOpen}
                    message={alertMessage}
                    severity={verif === true ? "success" : "error"}
                    onClose={handleSnackBarClose}
                />
            </Grid>
        </>
    );
}

export default AlgoConversion;

