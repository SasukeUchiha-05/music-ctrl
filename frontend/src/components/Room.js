import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material"; // Updated MUI import
import CreateRoomPage from "./CreateRoomPage";

function Room({ leaveRoomCallback }) {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Function to fetch room details
    const getRoomDetails = () => {
        fetch("/api/get-room?code=" + roomCode)
            .then((response) => {
                if (!response.ok) {
                    leaveRoomCallback();
                    navigate("/");
                    return null;
                }
                return response.json();
            })
            .then((data) => {
                if (data) {
                    setVotesToSkip(data.votes_to_skip);
                    setGuestCanPause(data.guest_can_pause);
                    setIsHost(data.is_host);
                }
            })
            .catch((error) => console.error("Error fetching room details:", error));
    };

    // Fetch room details when component mounts
    useEffect(() => {
        if (roomCode) {
            getRoomDetails();
        }
    }, [roomCode]);

    const leaveButtonPressed = () => {
        fetch("/api/leave-room", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }).then(() => {
            leaveRoomCallback();
            navigate("/");
        }).catch((error) => console.error("Error leaving room:", error));
    };

    const renderSettings = () => (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage
                    update={true}
                    votesToSkip={votesToSkip}
                    guestCanPause={guestCanPause}
                    roomCode={roomCode}
                    updateCallback={getRoomDetails} // Ensure updated details refresh immediately
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={() => setShowSettings(false)}>
                    Close
                </Button>
            </Grid>
        </Grid>
    );

    if (showSettings) {
        return renderSettings();
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes: {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {isHost.toString()}
                </Typography>
            </Grid>
            {isHost && (
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" onClick={() => setShowSettings(true)}>
                        Settings
                    </Button>
                </Grid>
            )}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );
}

export default Room;
