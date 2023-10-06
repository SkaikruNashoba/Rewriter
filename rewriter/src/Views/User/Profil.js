import React, {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Grid, Tab} from "@mui/material";
import CustomSnackBar from "../../Scripts/CustomSnackBar";
import {GlobalContext} from "../../Hooks/GlobalContext";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import DetailProfil from "./Profil/DetailProfil";
import AdresseAdd from "./Profil/AdresseAdd";

const Profil = () => {
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [verif, setVerif] = useState(false)
    const [alertMessage, setAlertMessage] = useState("");

    const item = sessionStorage.getItem("itemSession");
    const navigate = useNavigate();

    const [value, setValue] = React.useState("1");

    useEffect(() => {
        if (item === null || item === undefined) {
            navigate('/')
        }
    }, [item]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };

    return (
        <Grid container sx={{justifyContent: 'space-around', marginTop: 2}}>
            <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
                <Box sx={{width: "100%", typography: "body1"}}>
                    <TabContext value={value}>
                        <Box sx={{borderBottom: "1px solid", borderColor: "divider"}}>
                            <TabList onChange={handleChange}>
                                <Tab label="Détails du profil" value="1"/>
                                <Tab label="Ajouter une adresse" value="2"/>
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <DetailProfil/>
                        </TabPanel>
                        <TabPanel value="2">
                            <AdresseAdd/>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Grid>
            <CustomSnackBar
                open={snackBarOpen}
                message={alertMessage}
                severity={verif === true ? "success" : "error"}
                onClose={handleSnackBarClose}
            />
        </Grid>
    );
};

export default Profil;

