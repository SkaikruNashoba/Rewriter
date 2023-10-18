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
            <Box sx={{ width: "100%", marginBottom: 2, textAlign: "center" }}>
                <Typography variant={'h1'} sx={{ fontSize: "20px", marginBottom: 2 }}>
                    Algorithme de cryptage/decryptage de JSON
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                    <Button variant="contained" color="primary" onClick={() => encryptJSON()}>
                        Crypter
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => decryptJSON()}>
                        Décrypter
                    </Button>
                </Box>
            </Box>
            <Grid container columns={26}>
                <Grid item md={6} sx={{ border: "1px solid black", display: "flex", flexDirection: "column", alignItems: "center", marginX: 2 }}>
                    <Typography sx={{ marginY: 1, borderBottom: "1px solid black", width: "100%", textAlign: "center" }}>
                        JSON:
                    </Typography>
                    <TextField
                        multiline
                        fullWidth
                        variant="outlined"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </Grid>
                <Grid item md={6} sx={{ border: "1px solid black", display: "flex", flexDirection: "column", alignItems: "center", marginX: 2 }}>
                    <Box sx={{ borderBottom: "1px solid black", width: "100%", display: "flex", justifyContent: "space-between" }}>
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
                </Grid>
                <Grid item md={6} sx={{ border: "1px solid black", display: "flex", flexDirection: "column", alignItems: "center", marginX: 2 }}>
                    <Typography sx={{ marginY: 1, borderBottom: "1px solid black", width: "100%", textAlign: "center" }}>
                        String:
                    </Typography>
                    <TextField
                        multiline
                        fullWidth
                        variant="outlined"
                        value={cryptedText}
                        onChange={(e) => setCryptedText(e.target.value)}
                    />
                </Grid>
                <Grid item md={6} sx={{ border: "1px solid black", display: "flex", flexDirection: "column", alignItems: "center", marginX: 2 }}>
                    <Box sx={{borderBottom: "1px solid black", width: "100%",display: "flex", justifyContent: "space-between"}}>
                        <Typography sx={{ marginY: 1, marginLeft: "1rem"}}>
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
                </Grid>

                <CustomSnackBar
                    open={snackBarOpen}
                    message={alertMessage}
                    severity={verif === true ? "success" : "error"}
                    onClose={handleSnackBarClose}
                />
            </Grid>
        </>
    )
}

export default AlgoEncryptDecryptJSON;
