import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Container,
    FormControl,
    FormHelperText,
    Card,
    Box,
    Button,
    TextField,
} from "@mui/material";
import {fetchData} from "../../Utils/utils";
import CustomSnackBar from "../../Scripts/CustomSnackBar";

const Edit = () => {
        const [verif, setVerif] = useState(false)
        const user = sessionStorage.getItem("itemSession")
        const userParsed = user ? JSON.parse(user) : ""
        const [login, setLogin] = useState(userParsed.login);
        const [email, setEmail] = useState(userParsed.email);
        const [password, setPwd] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [snackBarOpen, setSnackBarOpen] = useState(false);
        const navigate = useNavigate();

        const handleSnackBarClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }

            setSnackBarOpen(false);
        };
        const handleChangeName = (event) => {
            setLogin(event.target.value);
        };

        const handleChangeEmail = (event) => {
            setEmail(event.target.value);
        };

        const handleChangePassword = (event) => {
            setPwd(event.target.value);
        };

        const handleChangeConfirmPassword = (event) => {
            setConfirmPassword(event.target.value);
        };

        const handleSubmit = async () => {
            const body = JSON.stringify({
                Login: login,
                Email: email,
                Password: password,
                ConfirmPassword: confirmPassword,
            });
            const request = await fetchData(
                "PUT",
                `User/edit/${userParsed.id}`,
                body
            );
            const data = request.data
            if (data.success) {
                setVerif(true)
                const updatedUserData = {
                    id: userParsed['id'],
                    login: login,
                    email: email,
                    admin: userParsed['admin'],
                };
                setSnackBarOpen(true);
                sessionStorage.setItem("itemSession", JSON.stringify(updatedUserData))
                setTimeout(() => {
                    navigate("/Profil")
                }, 1000);
            } else setSnackBarOpen(true);
        }


        return (
            <>
                <Container sx={{width: "40rem"}}>
                    <Card variant="elevation" sx={{width: "100%", marginTop: "3rem"}}>
                        <Box component="div" sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "1rem",
                        }}>
                            <Button sx={{color: "purple"}}>
                                <Link to="/Profil">
                                    Retour
                                </Link>
                            </Button>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <FormControl sx={{margin: "1rem"}}>
                                <TextField label="Nom" type="text" variant="outlined" defaultValue={userParsed.login}
                                           onChange={handleChangeName} placeholder="Votre pseudo"/>
                            </FormControl>
                            <FormControl sx={{margin: "1rem"}}>
                                <TextField label="Email" type="email" variant="outlined" defaultValue={userParsed.email}
                                           onChange={handleChangeEmail} placeholder="Votre email"/>
                            </FormControl>
                            <FormControl sx={{margin: "1rem"}}>
                                <TextField required variant="outlined" label="Mot de passe" type="password"
                                           onChange={handleChangePassword} placeholder="*********"/>
                                <FormHelperText>
                                    Ne donnez jamais votre mot de passe.
                                </FormHelperText>
                            </FormControl>
                            <FormControl sx={{margin: "1rem"}}>
                                <TextField required variant="outlined" label="Confirmer le mot de passe" type="password"
                                           onChange={handleChangeConfirmPassword} placeholder="*********"/>
                                <FormHelperText>
                                    Ne donnez jamais votre mot de passe.
                                </FormHelperText>
                            </FormControl>
                            <Button onClick={handleSubmit} variant="contained" sx={{
                                backgroundColor: "darkgreen",
                                margin: "1rem",
                                "&:hover": {backgroundColor: "green", transform: "scale(1.1)",},
                                transition: "0.5s",
                            }}>
                                Editer mon compte
                            </Button>
                        </Box>
                    </Card>
                    <CustomSnackBar
                        open={snackBarOpen}
                        message={
                            snackBarOpen && verif === true
                                ? "Compte modifié avec succès, vous allez être redirigé."
                                : "Erreur lors de la modification de votre compte. Veuillez vérifier vos informations."
                        }
                        severity={verif === true ? "success" : "error"}
                        onClose={handleSnackBarClose}
                    />
                </Container>
            </>
        );
    }
;

export default Edit;
