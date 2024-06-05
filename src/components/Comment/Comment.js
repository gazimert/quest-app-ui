import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';


function Comment(props) {
    const { text, userId, userName } = props;
    const theme = useTheme();

    return (
        <CardContent sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "center"
        }}>
            <OutlinedInput
                disabled
                id="outlined-adornment-amount"
                multiline
                inputProps={{ maxLength: 250 }}
                fullWidth
                value={text}
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
                                {userName.charAt(0).toUpperCase()}
                            </Avatar>
                        </Link>
                    </InputAdornment>
                }
                style={{ color: "black", backgroundColor: "white" }}
            >

            </OutlinedInput>
        </CardContent>
    )
}

export default Comment;