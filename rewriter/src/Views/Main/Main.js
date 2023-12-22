import React from 'react';
import { Box, Grid, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import { TabList, TabPanel } from "@mui/lab";
import AlgoRewriter from "../ListAlgo/AlgoRewriter";
import AlgoCheck from '../ListAlgo/AlgoCheck';
// import AlgoConversion from "../ListAlgo/AlgoConversion";
// import AlgoEncryptDecryptJSON from "../ListAlgo/AlgoEncryptDecryptJSON";

const Main = () => {
	const [value, setValue] = React.useState("1");
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<>
			<Grid>
				<Box sx={{ width: "100%", typography: "body1" }}>
					<TabContext value={value}>
						<Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
							<TabList onChange={handleChange}>
								<Tab label="Réécriture d'image" value="1" />
								{/* <Tab label="Conversion de scss" value="2"/>
                                <Tab label="Cryptage/decryptage de json" value="3"/> */}
								<Tab label="Comparaison de texte" value="4" />
							</TabList>
						</Box>
						<TabPanel value="1">
							<AlgoRewriter />
						</TabPanel>
						{/* <TabPanel value="2">
                            <AlgoConversion />
                        </TabPanel>
                        <TabPanel value="3">
                            <AlgoEncryptDecryptJSON />
                        </TabPanel> */}
						<TabPanel value="4">
							<AlgoCheck />
						</TabPanel>
					</TabContext>
				</Box>
			</Grid>
		</>
	)
};

export default Main;
