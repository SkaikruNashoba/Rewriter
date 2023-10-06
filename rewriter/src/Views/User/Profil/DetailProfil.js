import {Alert, Box, Button, Card, Container, Divider, Grid, Typography} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import React, {useContext, useEffect, useState} from "react";
import {fetchDataNoLocal} from "../../../Utils/utils";
import {GlobalContext} from "../../../Hooks/GlobalContext";
import {useNavigate} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";

const DetailProfil = () => {
    let {userData} = useContext(GlobalContext);
    const [userName, setUserLogin] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userAdresses, setUserAdresses] = useState([]);
    const [userIdAdresse, setUserIdAdresse] = useState('');
    const [multiAdresse, setMultiAdresse] = useState([]);

    const [displayMessageModifUser, setDisplayMessageModifUser] = useState(null);
    const [showUserButtons, setShowUserButtons] = useState(false);
    const [showUserButtonsValidation, setShowUserButtonsValidation] = useState(false);

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [verif, setVerif] = useState(false)
    const [alertMessage, setAlertMessage] = useState("");

    const item = sessionStorage.getItem("itemSession");
    const adresseParsed = item ? JSON.parse(item) : ''
    const navigate = useNavigate();

    const [value, setValue] = React.useState("1");

    const getAdresse = async () => {
        const request = await fetchDataNoLocal("GET", `Adresse/${adresseParsed.idAdresse}`)
        const data = request.data
        if (data.success) {
            const adresseData = data.adresses.adresse;
            setMultiAdresse(adresseData.Adresses)
        }
    }
    useEffect(() => {
        getAdresse()
    }, [])

    useEffect(() => {
        if (item !== null) {
            const SessionValues = JSON.parse(item);
            setUserLogin(SessionValues["login"]);
            setUserEmail(SessionValues["email"]);
            setUserAdresses(SessionValues["Adresses"]);
            setUserIdAdresse(SessionValues["idAdresse"]);
        }
    }, [item]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const showButtonUser = () => {
        setShowUserButtons(!showUserButtons);
    };

    const handleEditUser = () => {
        setVerif(true)
        setSnackBarOpen(true)
        setAlertMessage("Votre allez être redirigé pour modifier vos informations.")
        setTimeout(() => {
            navigate("/Edit");
        }, 1000);
    };

    const handleDeleteUser = async () => {
        const idSession = JSON.parse(item);
        const request = await fetchDataNoLocal("PUT", `User/suspend/${idSession["id"]}`)
        const data = request.data
        if (data.success) {
            setVerif(true)
            setSnackBarOpen(true);
            setAlertMessage("Votre compte à bien été suspendu, vous allez être redirigé.")
            setTimeout(() => {
                sessionStorage.clear()
                localStorage.clear()
                navigate('/')
            }, 1000)
        } else {
            setVerif(false)
            setSnackBarOpen(true);
            setAlertMessage("Échec de la modification de vos informations, vérifiez les informations renseignées.")
        }
    };

    const handleDeleteAdresse = async (id) => {
        const request = await fetchDataNoLocal("DELETE", `Adresse/${id}`)
        const data = request.data
        if (data.success) {
            setTimeout(() => {
            setVerif(true)
            setSnackBarOpen(true);
            setAlertMessage("Adresse supprimée avec succès.")
                getAdresse()
            }, 1000)
        } else {
            setVerif(false)
            setSnackBarOpen(true);
            setAlertMessage("Erreur lors de la suppression de l'adresse.")
        }
    }

    const handleMoveEditAdresse = (id) => {
        navigate(`/Edit/Adresse/${id}`)
    }

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };

    const handleDeleteUserOption = () => {
        setShowUserButtonsValidation(!showUserButtonsValidation);
    };

    return (
        <>
            <Grid container maxWidth={'xl'} columns={14} justifyContent={'space-between'}>
                <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
                    <Card elevation={5} sx={{padding: 2}}>
                        <Box sx={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                            <Typography component="h1" sx={{fontSize: "22px", fontWeight: "bold"}}>
                                Profil :
                            </Typography>
                            <SettingsIcon variant="contained" id="btnoptionUser" className="btn"
                                          onClick={showButtonUser}/>
                        </Box>
                        <Grid container sx={{
                            paddingTop: "1rem",
                            paddingBottom: "1rem",
                            display: "flex",
                            justifyContent: "space-around",
                        }}>
                            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                <Box sx={{display: "flex", flexDirection: "column",}}>
                                    <Box component="span" sx={{paddingTop: "1rem"}}>
                                        Pseudo :
                                    </Box>
                                    <Box component="span" sx={{paddingTop: "1rem"}}>
                                        Email :
                                    </Box>
                                    <Box component="span" sx={{paddingTop: "1rem"}}>
                                        Adresse principale :
                                    </Box>
                                    <Box component="span" sx={{paddingTop: "1rem"}}>
                                        Pays :
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                <Box sx={{display: "flex", flexDirection: "column",}}>
                                    <Box component="span" sx={{paddingTop: "1rem"}}>
                                        {userName}
                                    </Box>
                                    <Box component="span" sx={{paddingTop: "1rem"}}>
                                        {userEmail}
                                    </Box>
                                    {userAdresses?.length > 0 ? (
                                        <Box sx={{display: "flex", flexDirection: "column"}}>
                                            <Box component="span" sx={{paddingTop: "1rem"}}>
                                                {userAdresses[0].Adresse} {userAdresses[0].Ville} {userAdresses[0].Postal}
                                            </Box>
                                            <Box component="span" sx={{paddingTop: "1rem"}}>
                                                {userAdresses[0].Pays}
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Box component="span" sx={{paddingTop: "1rem"}}>
                                            Aucune information renseignée
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                        {showUserButtons && (
                            <Container>
                                <Divider/>
                                {displayMessageModifUser}
                                <Box sx={{
                                    paddingTop: "1rem",
                                    paddingBottom: "1rem",
                                    display: "flex",
                                    justifyContent: "space-around",
                                }}>
                                    <Button variant="contained"
                                            sx={{
                                                backgroundColor: "green",
                                                color: "white",
                                                "&:hover": {backgroundColor: "darkgreen"},
                                            }}
                                            onClick={handleEditUser}>
                                        Modifier le profil
                                    </Button>
                                    <Button variant="contained"
                                            sx={{
                                                backgroundColor: "red",
                                                color: "black",
                                                "&:hover": {backgroundColor: "darkred"},
                                            }}
                                            onClick={handleDeleteUserOption}>
                                        Suspendre le compte
                                    </Button>
                                </Box>
                                {showUserButtonsValidation && (
                                    <Container>
                                        <Divider/>
                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            padding: "1rem",
                                        }}>
                                            <Alert severity="warning" variant="standard"
                                                   sx={{display: "flex", justifyContent: "center"}}>
                                                Suspendre mon compte ? <br/>
                                                Cette action est définitive êtes-vous sûr de vouloir
                                                suspendre votre compte ?
                                            </Alert>
                                        </Box>
                                        <Divider/>
                                        <Box
                                            sx={{
                                                paddingTop: "1rem",
                                                display: "flex",
                                                justifyContent: "space-around",
                                            }}>
                                            <Button variant="contained" sx={{
                                                backgroundColor: "green",
                                                color: "white",
                                                "&:hover": {backgroundColor: "darkgreen"},
                                            }} onClick={handleDeleteUser}
                                            >
                                                Oui
                                            </Button>
                                            <Button variant="contained" sx={{
                                                backgroundColor: "red",
                                                color: "black",
                                                "&:hover": {backgroundColor: "darkred"},
                                            }} onClick={handleDeleteUserOption}
                                            >
                                                Non
                                            </Button>
                                        </Box>
                                    </Container>
                                )}
                            </Container>
                        )}
                    </Card>
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                    <Box sx={{textAlign: "center", margin: 1}}>Listes de vos adresses</Box>
                    <Box>
                        {multiAdresse && multiAdresse.map((data, index) => (
                            <Card elevation={4} key={index} sx={{marginBottom: 1}}>
                                {data ? (
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: 1
                                    }}>
                                        <Box>
                                            Adresse
                                            n° {index + 1}:
                                            <br/>
                                            {data.Adresse}, {data.Ville} {data.Postal}, {data.Pays}
                                        </Box>
                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "flex-end",
                                            alignItems: "center"
                                        }}>
                                            <Button sx={{
                                                color: "white",
                                                backgroundColor: "darkgreen",
                                                "&:hover": {backgroundColor: "green"}
                                            }}
                                                    onClick={() => handleMoveEditAdresse(data.idAdresse)}>
                                                <EditNoteIcon/>
                                            </Button>
                                            {index === 0 || index === data.Adresse ? (
                                                <Button sx={{
                                                    marginTop: 1,
                                                    color: "white",
                                                    backgroundColor: "gray",
                                                    cursor: "not-allowed"
                                                }} disabled>
                                                    <DeleteIcon/>
                                                </Button>
                                            ) : (
                                                <Button sx={{
                                                    marginTop: 1,
                                                    color: "white",
                                                    backgroundColor: "darkred",
                                                    "&:hover": {backgroundColor: "red"}
                                                }}
                                                        onClick={() => handleDeleteAdresse(data.idAdresse)}
                                                >
                                                    <DeleteIcon/>
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box>Aucune adresse trouvée</Box>
                                )}
                            </Card>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default DetailProfil
