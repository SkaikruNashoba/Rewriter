import {Link, useLocation} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import React, {useContext, useState} from "react";
import ProfilePic from "../../Assets/header_img/profile_pic.png";
import DisconnectPic from "../../Assets/header_img/logout.png";
import InscriptionPic from "../../Assets/header_img/inscription.png";
import ConnectPic from "../../Assets/header_img/user_connect.png";
import {
    AppBar, Avatar, Box, Grid, Toolbar,
} from "@mui/material";
import Icon from '../../Assets/icon.png';
import {GlobalContext} from "../../Hooks/GlobalContext";
import CustomSnackBar from "../../Scripts/CustomSnackBar";

const Header = () => {
    let { setIsConnected, isConnected} = useContext(GlobalContext);
    const session = sessionStorage.getItem("itemSession");
    const sessionParsed = session ? JSON.parse(session) : "";
    const navigate = useNavigate();
    const location = useLocation();
    const [verif, setVerif] = useState(false)
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };

    const handleKillConnexion = () => {
        setVerif(true)
        setSnackBarOpen(true)
        setTimeout(() => {
            setIsConnected(false)
            sessionStorage.clear();
            localStorage.clear()
            if (location.pathname === "/") {
                navigate(0);
            } else {
                navigate("/");
            }
        }, 2000)
    };

    return (<>
        <AppBar position="relative" sx={{backgroundColor: "white", color: "black", display: "grid", marginBottom: 2}}>
            <Toolbar sx={{paddingLeft: "0px", paddingRight: "0px"}}>
                <Grid container>
                    <Grid item md={6} sm={3}
                          sx={{display: "flex", alignItems: "center", justifyContent: "flex-start",}}>
                        <Link to={"/"}>
                            <Avatar src={Icon}/>
                        </Link>
                    </Grid>
                    {isConnected || sessionParsed ? (
                        <Grid item md={6} sm={6} sx={{display: "flex", width: "100%", justifyContent: "flex-end"}}>
                            <Box sx={{display: "flex", alignItems: "center", marginRight: "1rem"}}>
                                <Link to={"/Profil"} style={{display: "flex", flexDirection: "column", alignItems: 'center', textDecoration: "none", color: "black"}}>
                                    <img style={{width: "3rem"}} src={ProfilePic} alt="profil"/>
                                    <Box component="span">
                                        Profil
                                    </Box>
                                </Link>
                            </Box>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                marginRight: "1rem",
                                cursor: "pointer"
                            }}
                                 onClick={handleKillConnexion}>
                                <img style={{width: "50px"}} src={DisconnectPic} alt="déconnexion"/>
                                <Box component="span">
                                    Déconnexion
                                </Box>
                            </Box>
                        </Grid>
                    ) : (
                        <Grid item md={6} sm={6} sx={{display: "flex", width: "100%", justifyContent: "flex-end",}}>
                            <Box sx={{display: "flex", alignItems: "center", marginRight: "1rem",}}>
                                <Link to={"/Login"} style={{display: "flex", flexDirection: "column", alignItems: 'center', textDecoration: "none", color: "black"}}>
                                    <img style={{width: "50px"}} src={ConnectPic} alt="connexion"/>
                                    <Box component="span">Se connecter</Box>
                                </Link>
                            </Box>
                            <Box sx={{display: "flex", alignItems: "center", marginRight: "1rem",}}>
                                <Link to={"/Register"} style={{display: "flex", flexDirection: "column", alignItems: 'center', textDecoration: "none", color: "black"}}>
                                    <img style={{width: "50px"}} src={InscriptionPic} alt="inscription"/>
                                    <Box component="span">S'enregistrer</Box>
                                </Link>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Toolbar>
            <CustomSnackBar
                open={snackBarOpen}
                message={
                    snackBarOpen && verif === true
                        ? "Déconnexion en cours ..."
                        : "Erreur lors de la déconnexion. (si le problème persiste, contacter un administrateur."
                }
                severity={verif === true ? "success" : "error"}
                onClose={handleSnackBarClose}
            />
        </AppBar>
    </>)
        ;
};
export default Header;
