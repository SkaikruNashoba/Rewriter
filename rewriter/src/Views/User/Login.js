import {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import Icon from '../../Assets/icon.png'
import {Link} from "react-router-dom";
import {
    Container,
    FormControl,
    FormHelperText,
    Card,
    Typography,
    Box,
    Button,
    TextField,
    Avatar,
} from "@mui/material";
import {fetchData, fetchDataNoLocal} from "../../Utils/utils";
import {GlobalContext} from "../../Hooks/GlobalContext";
import CustomSnackBar from "../../Scripts/CustomSnackBar";

const Login = () => {
    let {setUserData, setIsConnected, isConnected} = useContext(GlobalContext);
    const [email, setEmail] = useState("");
    const [pwd, setPassword] = useState("");
    const [pressedKeys, setPressedKeys] = useState(new Set());
    const navigate = useNavigate();
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const handleSetEmail = (event) => {
        setEmail(event.target.value);
    };
    const handleSetPassword = (event) => {
        setPassword(event.target.value);
    };
    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBarOpen(false);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            setPressedKeys((prev) => new Set(prev).add(event.key));
        };

        const handleKeyUp = (event) => {
            const updatedKeys = new Set(pressedKeys);
            updatedKeys.delete(event.key);
            setPressedKeys(updatedKeys);
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [pressedKeys]);

    useEffect(() => {
        if (pressedKeys.has("a") && pressedKeys.has("d") && pressedKeys.has("m") && pressedKeys.has("i") && pressedKeys.has("n")) {
            navigate("/Login/Admin");
        }
    }, [pressedKeys]);

    const handleGetConnexion = async () => {
        if (email === "" || pwd === "") {
            setSnackBarOpen(true);
            return;
        }

        const body = JSON.stringify({
            Email: email,
            Password: pwd,
        });
        const request = await fetchDataNoLocal("PUT", "Function/login", body);
        const data = request.data
        if (data.success) {
            const updatedUserData = {
                id: data.user.id,
                login: data.user.Login,
                email: data.user.Email,
                admin: data.user.Admin,
                Adresses: data.user.Adresses,
                idAdresse: data.user.idAdresse
            };
            setIsConnected(true);
            setSnackBarOpen(true);
            setTimeout(() => {
                sessionStorage.setItem("itemSession", JSON.stringify(updatedUserData));
                setUserData(updatedUserData);
                navigate("/")
            }, 2000);
        } else setSnackBarOpen(true);
    };


    return (<>
        <Container container="true" sx={{width: "30rem"}}>
            <Card variant="elevation" sx={{width: "100%", marginTop: "3rem"}}>
                <Box component="div"
                     sx={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem",}}>
                    <Typography component="h2">
                        Se connecter
                    </Typography>
                    <Avatar src={Icon}/>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column"}}>
                    <FormControl sx={{margin: "1rem"}}>
                        <TextField required variant="outlined" label="Email" autoFocus type="email" placeholder="Email"
                                   value={email} onChange={handleSetEmail}/>
                    </FormControl>
                    <FormControl sx={{margin: "1rem"}}>
                        <TextField required variant="outlined" label="Mot de passe" type="password"
                                   placeholder="**********" value={pwd} onChange={handleSetPassword}/>
                        <FormHelperText>
                            Ne donnez jamais votre mot de passe.
                        </FormHelperText>
                    </FormControl>
                    <Button onClick={handleGetConnexion} variant="contained"
                            sx={{
                                backgroundColor: "darkviolet",
                                "&:hover": {backgroundColor: "purple", transform: "scale(1.1)",},
                                transition: "0.5s",
                            }}
                    >
                        Se connecter
                    </Button>
                    <Typography component="span" sx={{padding: "1rem"}}>
                        Vous n'êtes pas encore membre ?
                        <Link to={"/Register"} style={{color: "purple"}}>
                            {" "}Inscrivez-vous ici !
                        </Link>{" "}
                    </Typography>
                </Box>
            </Card>
            <CustomSnackBar
                open={snackBarOpen}
                message={
                    snackBarOpen && isConnected
                        ? "Votre connexion à été effectuée avec succès, vous allez être redirigé."
                        : "Erreur de connexion. Veuillez vérifier vos informations."
                }
                severity={isConnected ? "success" : "error"}
                onClose={handleSnackBarClose}
            />
        </Container>
    </>);
};

export default Login;
