import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


function Auth() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSent, setIsSent] = useState(false);
    const navigate = useNavigate();

    const handleUsername = (value) => {
        setUsername(value);
    }

    const handlePassword = (value) => {
        setPassword(value);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsSent(false);
    };

    const sendRequest = (path) => {
        fetch("/auth/" + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: username,
                password: password
            })
        })
            .then((res) => res.json())
            .then((result) => {
                localStorage.setItem("tokenKey", result.message);
                localStorage.setItem("currentUser", result.userId);
                localStorage.setItem("userName", username);
                navigate("/")
            })

            .catch((err) => console.log(err))
    }

    const handleButton = (path) => {
        sendRequest(path);
        setUsername("");
        setPassword("");
        if (path === "register")
            setIsSent(true);
        navigate("/auth");
    }

    return (
        <div>
            <Snackbar open={isSent} autoHideDuration={2400} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    You Succesfuly Registered
                </Alert>
            </Snackbar>
            <FormControl>
                <InputLabel>Username</InputLabel>
                <Input onChange={(input) => handleUsername(input.target.value)}></Input>
                <InputLabel sx={{ top: 80 }}>Password</InputLabel>
                <Input sx={{ top: 40 }}
                    onChange={(input) => handlePassword(input.target.value)}></Input>
                <Button variant="contained" sx={{
                    marginTop: 10,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white'
                }}
                    onClick={() => handleButton("register")}>Register</Button>
                <FormHelperText sx={{ margin: 3 }}>Are you already registered?</FormHelperText>
                <Button variant="contained" sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white'
                }}
                    onClick={() => handleButton("login")}>Login</Button>
            </FormControl>
        </div>
    )
}

export default Auth;