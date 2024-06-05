import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import Container from '@mui/material/Container';
import Comment from "../Comment/Comment";
import CommentForm from "../Comment/CommentForm";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


function Post(props) {
    const { title, text, userId, userName, postId, likes } = props;
    const [expanded, setExpanded] = useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const isInitialMount = useRef(true);
    const [likeCount, setLikeCount] = useState(likes.length);
    const [likeId, setLikeId] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const [refresh, setRefresh] = useState(false);

    const setCommentRefresh = () => {
        setRefresh(true)
    }

    useEffect(() => {
        console.log(likeId);
    }, [likeId])

    useEffect(() => {
        localStorage.getItem("currentUser") == null ? setIsDisabled(true) : setIsDisabled(false);
    }, [localStorage.getItem("currentUser")])

    const handleExpandClick = () => {
        setExpanded(!expanded);
        refreshComments();
    };

    const handleLike = async () => {
        setIsLiked(!isLiked);
        if (!isLiked) {
            await saveLikes();
            setLikeCount(likeCount + 1);
        } else {
            await deleteLike();
            setLikeCount(likeCount - 1);
        }
    }

    const refreshComments = () => {
        fetch("/comments?postId=" + postId)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setCommentList(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )

        setRefresh(false)
    }

    const saveLikes = async () => {
        await fetch("/likes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenKey")
            },
            body: JSON.stringify({
                postId: postId,
                userId: localStorage.getItem("currentUser")
            })
        })
            .then((res) => res.json())
            .then((response) => {
                console.log({ response: response });
                setLikeId(response["id"])
            })
            .catch((err) => console.log(err));

    }

    const deleteLike = async () => {
        const response = await fetch(`/likes?postId=${postId}&userId=${localStorage.getItem("currentUser")}`, {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("tokenKey")
            }
        });
        const likeData = await response.json();
        console.log(likeData);
        setLikeId(likeData.id);

        console.log(likeId);
        await fetch("/likes/" + likeId, {
            method: "DELETE",
            headers: {
                "Authorization": localStorage.getItem("tokenKey")
            }
        })
            .catch((err) => console.log(err))
    }

    const checkLikes = () => {
        console.log({ likes: likes });
        const likeControl = likes.find((like) => like.userId.toString() === localStorage.getItem("currentUser"));
        console.log("likeControl: " + likeControl);
        if (likeControl != null) {
            setLikeId(likeControl.id);
            setIsLiked(true);
        }
    }

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            refreshComments();
        }
    }, [refresh])

    useEffect(() => { checkLikes() }, [])

    return (
        <div className="postContainer">
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

                    title={title}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>

                    <IconButton disabled={isDisabled} onClick={() => handleLike()} aria-label="add to favorites">
                        <FavoriteIcon style={isLiked ? { color: "red" } : null} />
                    </IconButton>
                    {likeCount}

                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <CommentIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Container fixed>
                            {error ? "error" :
                                isLoaded ? commentList.map(comment => (
                                    <Comment text={comment.text} userId={comment.userId} userName={userName}></Comment>
                                )) : "Loading..."}
                            {isDisabled ? "" :
                                <CommentForm postId={postId} userId={localStorage.getItem("currentUser")} userName={localStorage.getItem(userName)} setCommentRefresh={setCommentRefresh}></CommentForm>}
                        </Container>
                    </CardContent>
                </Collapse>
            </Card>
        </div>
    )
}

export default Post;