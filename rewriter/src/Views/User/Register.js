import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Icon from "../../Assets/icon.png";
import {Link} from "react-router-dom";
import {
    Container,
    FormControl,
    InputLabel,
    FormHelperText,
    Card,
    Typography,
    Box,
    Button,
    TextField,
    Avatar,
    Select,
    MenuItem,
} from "@mui/material";
import {fetchData} from "../../Utils/utils";
import CustomSnackBar from "../../Scripts/CustomSnackBar";

const Register = () => {

    const [data, setData] = useState([]);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");

    const [adresse, setAdresse] = useState("");
    const [pays, setPays] = useState("");
    const [ville, setVille] = useState("");
    const [postal, setPostal] = useState("");

    const [pwdConfirm, setPwdConfirm] = useState("");
    const navigate = useNavigate();

    const [verif, setVerif] = useState(false)
    const [alertMessage, setAlertMessage] = useState("");
    const [snackBarOpen, setSnackBarOpen] = useState(false);
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
    const handleSetName = (event) => {
        setName(event.target.value);
    };
    const handleSetEmail = (event) => {
        setEmail(event.target.value);
    };
    const handleSetPwd = (event) => {
        setPwd(event.target.value);
    };
    const handleSetPwdConfirm = (event) => {
        setPwdConfirm(event.target.value);
    };

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
        }
    };

    useEffect(() => {
        getPays();
    }, []);

    const handleRegister = async () => {
        const body = JSON.stringify({
            Login: name,
            Email: email,
            Password: pwd,
            ConfirmPassword: pwdConfirm,
            Adresse: adresse ? adresse : "",
            Pays: pays,
            Ville: ville,
            Postal: postal
        });

        const request = await fetchData("POST", "Function/register", body);
        const data = request.data;
        if (data.success) {
            setVerif(true)
            setSnackBarOpen(true);
            setAlertMessage("Votre compte à bien été enregistré vous allez être redirigé.")
            setTimeout(() => {
                navigate("/Login");
                setVerif(false)
            }, 1000);
        } else {
            setVerif(false)
            setSnackBarOpen(true);
            setAlertMessage("Échec de l'enregistrement de votre compte, vérifiez les informations renseignées.")
        }
    };

    return (
        <>
            <Container container="true" maxWidth={'sm'}>
                <Card variant="elevation" sx={{width: "100%", marginTop: "3rem"}}>
                    <Box component="div" sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem",
                    }}>
                        <Typography component="h2">
                            S'enregistrer
                        </Typography>
                        <Avatar src={Icon}/>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl sx={{margin: "1rem"}}>
                            <TextField required autoFocus label="Nom" onChange={handleSetName} value={name}
                                       placeholder="Nom" type="text"/>
                        </FormControl>
                        <FormControl sx={{margin: "1rem"}}>
                            <TextField required label="Email" placeholder="Email" value={email}
                                       onChange={handleSetEmail} type="email"/>
                        </FormControl>
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
                                {data && data.length > 0 &&
                                    data.map((country) => (
                                        <MenuItem key={country} value={country}>
                                            {country}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{margin: "1rem"}}>
                            <TextField required label="Mot de passe" onChange={handleSetPwd} value={pwd}
                                       placeholder="********" type="password"/>
                            <FormHelperText>
                                Ne donnez jamais votre mot de passe.
                            </FormHelperText>
                        </FormControl>
                        <FormControl sx={{margin: "1rem"}}>
                            <TextField required label="Confirmer le mot de passe" onChange={handleSetPwdConfirm}
                                       value={pwdConfirm} placeholder="********" type="password"/>
                            <FormHelperText>
                                Ne donnez jamais votre mot de passe.
                            </FormHelperText>
                        </FormControl>
                        <Button onClick={handleRegister} variant="contained" sx={{
                            backgroundColor: "darkgreen",
                            "&:hover": {backgroundColor: "green", transform: "scale(1.1)",},
                            transition: "0.5s",
                        }}>
                            S'enregistrer
                        </Button>
                        <Typography component="span" sx={{padding: "1rem"}}>
                            Vous avez déjà un compte ?
                            <Link to={"/Login"} className="text-purple">
                                {" "}
                                Connectez-vous ici !
                            </Link>
                        </Typography>
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
};

export default Register;
