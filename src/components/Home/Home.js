import React, { useState, useEffect } from "react";
import Post from "../Post/Post";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import PostForm from "../Post/PostForm";

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    /* const refreshPosts = async () => {
        await fetch("/posts")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setPostList(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    } */

    const refreshPosts = async () => {
        try {
            const response = await fetch("/posts", {
                method: 'GET',
            });
            const result = await response.json();
            console.log({ result: result })
            setIsLoaded(true);
            setPostList(result);
        } catch (error) {
            setIsLoaded(true);
            setError(error);
        }
    }

    useEffect(() => {
        refreshPosts();
    }, [])

    if (error) {
        return <div> Error </div>
    }
    else if (!isLoaded) {
        return <div> Loading... </div>
    }
    else {
        return (

            <React.Fragment>
                <CssBaseline />
                <div fixed style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f0f5ff"
                }}>
                    {localStorage.getItem("currentUser") == null ? "" :
                        <PostForm userId={localStorage.getItem("currentUser")} userName={localStorage.getItem("userName")} refreshPosts={refreshPosts} />}
                    {postList.map(post => (
                        <Post likes={post.postLikes} postId={post.id} userId={post.userId} userName={post.userName}
                            title={post.title} text={post.text}></Post>
                    ))}
                </div>
            </React.Fragment>


        )
    }
}

export default Home;