import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Post from "../Post/Post";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const columns = [
    { id: 'userActivity', label: 'User Activity', minWidth: 170, align: 'left' }
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function PopUp(props) {
    const { isOpen, postId, setIsOpen } = props;
    const [open, setOpen] = React.useState(false);
    const [post, setPost] = useState(null);

    const getPost = async () => {
        try {
            const response = await fetch("/posts/" + postId, {
                method: 'GET',
                headers: {
                    "Authorization": localStorage.getItem("tokenKey")
                }
            });
            const result = await response.json();
            setPost(result);
            console.log({ result: result })
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsOpen(false);
    };

    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

    useEffect(() => {
        getPost()
    }, [postId])

    return (
        post != null ?
            <React.Fragment>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Open full-screen dialog
                </Button>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Close
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Post likes={post.postLikes} postId={post.id} userId={post.userId} userName={post.userName}
                        title={post.title} text={post.text}></Post>
                </Dialog>
            </React.Fragment> : "loading..."
    );
}

function UserActivity(props) {
    const { userId } = props;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rows, setRows] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const handleNotification = (postId) => {
        setSelectedPost(postId);
        setIsOpen(true);
    }

    const getActivity = () => {
        fetch("/users/activity/" + userId, {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("tokenKey")
            }
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setRows(result)
                },
                (error) => {
                    console.log(error);
                    setIsLoaded(false);
                    setError(error);
                }
            )
    }

    useEffect(() => {
        getActivity()
    }, [])

    /*  const handleChangePage = (event, newPage) => {
         setPage(newPage);
     };
 
     const handleChangeRowsPerPage = (event) => {
         setRowsPerPage(+event.target.value);
         setPage(0);
     }; */

    return (
        <div>
            {isOpen ? <PopUp isOpen={isOpen} postId={selectedPost} setIsOpen={setIsOpen}></PopUp> : ""}
            <Paper sx={{ width: '100%', maxWidth: 800, overflow: 'hidden', marginTop: 5, marginLeft: 5 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .map((row) => {
                                    return (
                                        <Button onClick={() => handleNotification(row[1])}>
                                            <TableRow sx={{ margin: 5 }} hover role="checkbox" tabIndex={-1} key={row.code}>
                                                {row[3] + " " + row[0] + " your post"}
                                            </TableRow>
                                        </Button>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}


export default UserActivity