import React, {useEffect, useState} from 'react';
import {Box, Grid, Tab} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import CustomSnackBar from "../../Scripts/CustomSnackBar";
import {TabList, TabPanel} from "@mui/lab";
import AlgoRewriter from "../ListAlgo/AlgoRewriter";
import AlgoConversion from "../ListAlgo/AlgoConversion";

const Main = () => {
    const [verif, setVerif] = useState(false)
    const [alertMessage, setAlertMessage] = useState("");
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [value, setValue] = React.useState("1");
    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

   return(
       <>
            <Grid>
                <Box sx={{width: "100%", typography: "body1"}}>
                    <TabContext value={value}>
                        <Box sx={{borderBottom: "1px solid", borderColor: "divider"}}>
                            <TabList onChange={handleChange}>
                                <Tab label="Algorithme de réécriture d'image" value="1"/>
                                <Tab label="Algorithme de conversion de scss -> tailwind -> json" value="2"/>
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <AlgoRewriter/>
                        </TabPanel>
                        <TabPanel value="2">
                            <AlgoConversion/>
                        </TabPanel>
                    </TabContext>
                </Box>
                <CustomSnackBar
                    open={snackBarOpen}
                    message={alertMessage}
                    severity={verif === true ? "success" : "error"}
                    onClose={handleSnackBarClose}
                />
            </Grid>
       </>
   )
};

export default Main;
