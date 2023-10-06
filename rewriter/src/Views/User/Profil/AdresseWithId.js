import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Box, Button, Card, Container, TextField} from "@mui/material";
import {fetchData} from "../../../Utils/utils";
import CustomSnackBar from "../../../Scripts/CustomSnackBar";

const AdresseWithId = () => {
        const id = useParams();
        const [data, setData] = useState([]);
        const [adresse, setAdresse] = useState("");
        const [ville, setVille] = useState("");
        const [postal, setPostal] = useState("");
        const [pays, setPays] = useState("");
        const [idAdresse, setIdAdresse] = useState('');
        const navigate = useNavigate();
        const dataUser = JSON.parse(sessionStorage.getItem('itemSession'));
        const [verif, setVerif] = useState(false)
        const [alertMessage, setAlertMessage] = useState("");
        const [snackBarOpen, setSnackBarOpen] = useState(false);


        const handleChangeAdresse = (event) => {
            setAdresse(event.target.value);
        };
        const handleChangeVille = (event) => {
            setVille(event.target.value);
        };
        const handleChangePostal = (event) => {
            setPostal(event.target.value);
        };
        const handleChangePays = (event) => {
            setPays(event.target.value);
        };
        const handleSnackBarClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            setSnackBarOpen(false);
        };

        useEffect(() => {
            handleGetAdresseWithId()
        }, [])

        const handleGetAdresseWithId = async () => {
            const request = await fetchData("GET", `Adresse/unique/${id.id}`);
            const data = request.data;
            if (data.success) {
                const adresseData = data.adresse;
                setAdresse(adresseData.Adresse);
                setVille(adresseData.Ville);
                setPostal(adresseData.Postal);
                setPays(adresseData.Pays);
                setIdAdresse(adresseData.idAdresse);
            }
        }


        const handleSubmit = async () => {
            const body = JSON.stringify({
                Ville: ville,
                Postal: postal,
                Pays: pays,
                Adresse: adresse,
                idAdresse: idAdresse,
            });

            const request = await fetchData("PUT", `Adresse/edit/${id.id}`, body);
            const data = request.data;
            if (data.success) {
                const updatedDataUser = {
                    ...dataUser,
                    Adresses: dataUser.Adresses.map((address) => {
                        if (address.idAdresse === idAdresse) {
                            return {
                                ...address,
                                Adresse: adresse,
                                Ville: ville,
                                Postal: postal,
                                Pays: pays,
                            };
                        }
                        return address;
                    }),
                };

                sessionStorage.setItem("itemSession", JSON.stringify(updatedDataUser));

                setData(data.success);
                setVerif(true);
                setSnackBarOpen(true);
                setAlertMessage("Modification réussie, vous allez être redirigé");

                setTimeout(() => {
                    navigate("/Profil")
                }, 2000);
            } else {
                setVerif(false);
                setSnackBarOpen(true);
                setAlertMessage(
                    "Échec de la modification de l'adresse, vous devez modifier une information pour valider la modification."
                );
            }
        };


        return (
            <>
                <Container maxWidth={'sm'}>
                    <Card elevation={5} sx={{padding: 5, marginTop: 3}}>
                        <Box sx={{display: "flex", justifyContent: "space-between"}} className="display-f justify-sb">
                            <Button variant={"contained"} sx={{
                                color: "black",
                                backgroundColor: "red",
                                transition: "0.2s",
                                "&:hover": {
                                    backgroundColor: "darkred",
                                    color: "white",
                                    transform: "scale(1.1)",
                                    transition: "0.2s"
                                }
                            }}>
                                <Link to="/Profil" className="noDeco color-bk">
                                    Retour
                                </Link>
                            </Button>
                        </Box>
                        <TextField
                            required
                            sx={{marginTop: 5, width: "100%"}}
                            type="text"
                            value={adresse}
                            onChange={handleChangeAdresse}
                            label="Adresse"
                        />
                        <TextField
                            required
                            sx={{marginTop: 5, width: "100%"}}
                            type="text"
                            value={ville}
                            onChange={handleChangeVille}
                            label="Ville"
                        />
                        <TextField
                            required
                            sx={{marginTop: 5, width: "100%"}}
                            type="text"
                            value={postal}
                            onChange={handleChangePostal}
                            label="Code postal"
                        />
                        <TextField
                            required
                            sx={{marginTop: 5, width: "100%"}}
                            type="text"
                            value={pays}
                            onChange={handleChangePays}
                            label="Pays"
                        />

                        <Box sx={{display: "flex", justifyContent: "flex-end", marginTop: 2}}>
                            <Button variant={"contained"}
                                    onClick={handleSubmit}
                                    sx={{
                                        color: "white",
                                        backgroundColor: "green",
                                        transition: "0.2s",
                                        "&:hover": {
                                            backgroundColor: "darkgreen",
                                            color: "white",
                                            transform: "scale(1.1)",
                                            transition: "0.2s"
                                        }
                                    }}>
                                Modifier l'adresse
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
        );
    }
;

export default AdresseWithId;
