import {Link} from "react-router-dom";
import {
    AppBar, Avatar, Grid, Toolbar,
} from "@mui/material";
import Icon from '../../Assets/icon.png';

const Header = () => {

    return (
        <>
            <AppBar position="relative"
                    sx={{backgroundColor: "white", color: "black", display: "grid", marginBottom: 2}}>
                <Toolbar sx={{paddingLeft: "0px", paddingRight: "0px"}}>
                    <Grid container>
                        <Grid item
                              sx={{display: "flex", alignItems: "center", justifyContent: "flex-start",}}>
                            <Link to={"/"}>
                                <Avatar src={Icon}/>
                            </Link>
                        </Grid>

                    </Grid>
                </Toolbar>
            </AppBar>
        </>
    );
};
export default Header;
