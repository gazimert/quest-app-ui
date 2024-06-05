import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Radio from '@mui/joy/Radio';
import Avatar from '@mui/material/Avatar';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function AvatarComponent(props) {

    const { avatarId, userId, userName } = props;
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = React.useState([1]);
    const [selectedValue, setSelectedValue] = React.useState(avatarId);

    const saveAvatar = () => {
        fetch("/users/" + localStorage.getItem("currentUser"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenKey")
            },
            body: JSON.stringify({
                avatar: selectedValue
            })
        })
            .then(res => res.json())
            .catch((err) => console.log(err))
    }

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        saveAvatar()
    }

    const handleChange = (event) => {
        setSelectedValue(event.target.id);
    };

    return (
        <div>
            <Card sx={{ maxWidth: 345, margin: 5 }}>
                <CardMedia
                    sx={{ height: 300 }}
                    image={`/avatars/avatar${selectedValue}.png`}
                    title="User Avatar"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        User info
                    </Typography>
                </CardContent>
                <CardActions>
                    {localStorage.getItem("currentUser") == userId ?
                        <Button onClick={handleOpen} size="small">Change Avatar</Button> : ""}
                </CardActions>
            </Card>
            <Modal
                sx={{ display: "flex" }}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <List dense sx={{ width: '100%', maxWidth: 200, bgcolor: 'background.paper' }}>
                    {[1, 2, 3, 4, 5, 6].map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value}`;
                        return (
                            <label for={value}>
                                <ListItem
                                    key={value}

                                    secondaryAction={
                                        <Radio
                                            id={value}
                                            checked={selectedValue == value}
                                            onChange={(e) => handleChange(e)}
                                            name="radio-buttons"
                                            slotProps={{ input: { 'aria-label': labelId } }}
                                        />
                                    }
                                    disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemAvatar
                                            sx={{ height: 20, margin: 5 }}>
                                            <Avatar alt={`Avatar n°${value}`}
                                                src={`/avatars/avatar${value}.png`}
                                            />
                                        </ListItemAvatar>
                                    </ListItemButton>
                                </ListItem>
                            </label>


                        );
                    })}
                </List>
            </Modal>
        </div>
    )
}

export default AvatarComponent;