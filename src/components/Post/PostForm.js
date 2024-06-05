import React, { useState } from "react";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


function PostForm(props) {
    const { userId, userName, refreshPosts } = props;
    const [text, setText] = useState("")
    const [title, setTitle] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);
    const [error, setError] = useState(null);

    const savePost = async () => {
        await fetch("/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenKey")
            },
            body: JSON.stringify({
                title: title,
                userId: userId,
                text: text,
            }),
        })
            .then((res) => res.json())
            .catch((err) => console.log("error"));
    };

    const handleSubmit = async () => {
        await savePost();
        setIsSent(true);
        setTitle("");
        setText("");
        refreshPosts();
    }

    const handleTitle = (value) => {
        setTitle(value);
        setIsSent(false);
    }

    const handleText = (value) => {
        setText(value);
        setIsSent(false);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsSent(false);
    };

    return (
        <div className="postContainer">
            <Snackbar open={isSent} autoHideDuration={2400} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Your post is sent!
                </Alert>
            </Snackbar>
            <Card sx={{
                width: 800,
                textAlign: "left",
                margin: 2
            }}>
                <CardHeader
                    avatar={
                        <Link style={{
                            textDecoration: "none",
                            boxShadow: "none",
                            color: "white"
                        }} to={{ pathname: '/users/' + userId }} f>

                            <Avatar sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }} aria-label="recipe">
                                {userName.charAt(0).toUpperCase()}
                            </Avatar>
                        </Link>
                    }

                    title={<OutlinedInput
                        id="outlined-adornment-amount"
                        multiline
                        placeholder="Title"
                        inputProps={{ maxLength: 50 }}
                        fullWidth
                        value={title}
                        onChange={(input) => handleTitle(input.target.value)}>
                    </OutlinedInput>}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            multiline
                            placeholder="Text"
                            inputProps={{ maxLength: 250 }}
                            fullWidth
                            value={text}
                            onChange={(input) => handleText(input.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Button variant="contained"
                                        style={{
                                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                            color: 'white'
                                        }}
                                        onClick={handleSubmit}>
                                        POST
                                    </Button>
                                </InputAdornment>
                            }>
                        </OutlinedInput>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default PostForm;