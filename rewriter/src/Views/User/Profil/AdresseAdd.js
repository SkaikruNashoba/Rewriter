import {
    Box, Button,
    Card,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {fetchData} from "../../../Utils/utils";
import {useEffect, useState} from "react";
import Icon from "../../../Assets/icon.png";
import {Link, useNavigate} from "react-router-dom";
import CustomSnackBar from "../../../Scripts/CustomSnackBar";

const AdresseAdd = () => {
    const item = sessionStorage.getItem('itemSession');
    const itemParsed = item ? JSON.parse(item) : '';

    const [data, setData] = useState([]);
    const [adresse, setAdresse] = useState("");
    const [pays, setPays] = useState("");
    const [ville, setVille] = useState("");
    const [postal, setPostal] = useState("");

    const [verif, setVerif] = useState(false)
    const [alertMessage, setAlertMessage] = useState("");
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const navigate = useNavigate();


    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };
    const handleSetAdresse = (event) => {
        setAdresse(event.target.value);
    };
    const handleSetPays = (event) => {
        setPays(event.target.value);
    };
    const handleSetVille = (event) => {
        setVille(event.target.value);
    };
    const handleSetPostal = (event) => {
        setPostal(event.target.value)
    };

    useEffect(() => {
        getPays();
    }, []);

    const getPays = async () => {
        try {
            const response = await fetch(
                "https://i4h3dxfxq1.execute-api.eu-west-3.amazonaws.com/dev/api/countries",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const result = await response.json();
            setData(result.data);
        } catch (error) {
            console.log(error);
            setVerif(false)
            setSnackBarOpen(true);
            setAlertMessage("Erreur lors de la requête !")
        }
    };

    const handleAddAdresse = async () => {
        if (!adresse || !ville || !postal || !pays) {
            setVerif(false)
            setSnackBarOpen(true);
            setAlertMessage("Veuillez remplir tous les champs !")
            return
        }
        const body = JSON.stringify({
            Adresse: adresse,
            Ville: ville,
            Postal: postal,
            Pays: pays,
        })

        const request = await fetchData("POST", `Adresse/add/${itemParsed.idAdresse}`, body)
        const data = request.data
        if (data.success) {
            setVerif(true)
            setSnackBarOpen(true);
            setAlertMessage("Votre adresse a bien été ajouté.")
            setTimeout(() => {
                navigate('/Profil')
            }, 2000)
        } else {
            setVerif(false)
            setSnackBarOpen(true);
            setAlertMessage("Échec de l'ajout de votre adresse, vérifiez les informations renseignées.")
        }
    }

    return (
        <>
            <Container container="true" maxWidth={'sm'}>
                <Card variant="elevation" sx={{width: "100%", marginTop: "3rem"}}>
                    <Box component="div" sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: "1rem",
                    }}>
                        <Typography component="h2">
                            Ajouter une adresse
                        </Typography>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl sx={{margin: "1rem"}}>
                            <TextField required label="Adresse" placeholder="Adresse" value={adresse}
                                       onChange={handleSetAdresse} type="text"/>
                        </FormControl>
                        <FormControl sx={{margin: "1rem"}}>
                            <TextField required label="Ville" placeholder="Ville" value={ville}
                                       onChange={handleSetVille} type="text"/>
                        </FormControl>
                        <FormControl sx={{margin: "1rem"}}>
                            <TextField required label="Code postal" placeholder="Code postal" value={postal}
                                       onChange={handleSetPostal} type="number"/>
                        </FormControl>
                        <FormControl sx={{margin: "1rem"}}>
                            <InputLabel htmlFor="pays-select">Pays</InputLabel>
                            <Select required label="Pays" value={pays} onChange={handleSetPays}>
                                {data?.length > 0 &&
                                    data.map((country) => (
                                        <MenuItem key={country} value={country}>
                                            {country}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <Button onClick={handleAddAdresse} variant="contained" sx={{
                            backgroundColor: "darkgreen",
                            "&:hover": {backgroundColor: "green", transform: "scale(1.1)",},
                            transition: "0.5s",
                        }}>
                            Ajouter
                        </Button>
                    </Box>
                </Card>
                <CustomSnackBar
                    open={snackBarOpen}
                    message={alertMessage}
                    severity={verif === true ? "success" : "error"}
                    onClose={handleSnackBarClose}
                />
            </Container>
        </>
    )
}

export default AdresseAdd