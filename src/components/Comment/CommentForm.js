import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { RefreshToken } from "../../services/HttpService";
import { useNavigate } from 'react-router-dom';


function CommentForm(props) {
    const { userId, userName, postId, setCommentRefresh } = props;
    const theme = useTheme();
    const [text, setText] = useState("");
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("refreshKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("userName");
        navigate("/auth")
    }

    const saveComment = () => {
        fetch("/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenKey")
            },
            body: JSON.stringify({
                postId: postId,
                userId: userId,
                text: text
            })
        })
            .then((res) => {
                if (!res.ok) {
                    RefreshToken()
                        .then((res) => {
                            if (!res.ok) {
                                logout();
                            }
                            else {
                                res.json();
                            }
                        })
                        .then((result) => {
                            if (result != undefined) {
                                localStorage.setItem("tokenKey", result.accessToken);
                                saveComment();
                                setCommentRefresh();
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
                else
                    res.json()
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleSubmit = () => {
        saveComment();
        setText("");
        setCommentRefresh();
    }

    const handleChange = (value) => {
        setText(value);
    }

    return (
        <CardContent sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "center"
        }}>
            <OutlinedInput
                id="outlined-adornment-amount"
                multiline
                inputProps={{ maxLength: 250 }}
                fullWidth
                onChange={(i) => handleChange(i.target.value)}
                startAdornment={
                    <InputAdornment position="start">
                        <Link to={{ pathname: '/users/' + userId }} style={{
                            textDecoration: "none",
                            boxShadow: "none",
                            color: "white"
                        }}>
                            <Avatar aria-label="recipe" sx={{
                                width: theme.spacing(4),
                                height: theme.spacing(4)
                            }}>
                                {/* userName.charAt(0).toUpperCase() */}
                            </Avatar>
                        </Link>
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position="end">
                        <Button variant="contained"
                            style={{
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                color: 'white'
                            }}
                            onClick={handleSubmit}>
                            Comment
                        </Button>
                    </InputAdornment>
                }
                value={text}
                style={{ color: "black", backgroundColor: "white" }}
            >

            </OutlinedInput>
        </CardContent>
    )
}

export default CommentForm;