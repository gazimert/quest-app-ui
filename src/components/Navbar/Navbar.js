import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {

    const navigate = useNavigate();

    const onClickLogout = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("refreshKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("userName");
        navigate("/auth")
    }

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{
                                mr: 2
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{
                            flexGrow: 1,
                            textDecoration: "none",
                            textAlign: "left"
                        }}>
                            <Link style={{
                                textDecoration: "none",
                                boxShadow: "none",
                                color: "white"
                            }} to='/'> Home</Link>
                        </Typography>
                        <Typography variant="h6" component="div">
                            {localStorage.getItem("currentUser") == null ? <Link style={{
                                textDecoration: "none",
                                boxShadow: "none",
                                color: "white"
                            }} to={{ pathname: '/auth' }}>Login/Register</Link>
                                :
                                <div>
                                    <IconButton onClick={onClickLogout}><LogoutIcon></LogoutIcon></IconButton>
                                    <Link style={{
                                        textDecoration: "none",
                                        boxShadow: "none",
                                        color: "white"
                                    }} to={{ pathname: '/users/' + localStorage.getItem("currentUser") }}>Profile</Link>
                                </div>}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    )
}

export default Navbar;