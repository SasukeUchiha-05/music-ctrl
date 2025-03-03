import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material"; // Updated MUI import
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room({ leaveRoomCallback }) {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [song, setSong] = useState(null);

    // Fetch room details
    const getRoomDetails = () => {
        fetch(`/api/get-room?code=${roomCode}`)
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
                    if (data.is_host) {
                        authenticateSpotify();
                    }
                }
            })
            .catch((error) => console.error("Error fetching room details:", error));
    };

    // Spotify authentication
    const authenticateSpotify = () => {
        fetch("/spotify/is-authenticated")
            .then((response) => response.json())
            .then((data) => {
                setSpotifyAuthenticated(data.status);
                if (!data.status) {
                    fetch("/spotify/get-auth-url")
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                }
            })
            .catch((error) => console.error("Error authenticating Spotify:", error));
    };

    // Fetch currently playing song
    const getCurrentSong = () => {
        fetch("/spotify/current-song")
            .then((response) => response.ok ? response.json() : {})
            .then((data) => {
                setSong(data);
                console.log("Current Song:", data);
            })
            .catch((error) => console.error("Error fetching current song:", error));
    };

    // Leave room
    const leaveButtonPressed = () => {
        fetch("/api/leave-room", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }).then(() => {
            leaveRoomCallback();
            navigate("/");
        }).catch((error) => console.error("Error leaving room:", error));
    };

    // Fetch room details & start song fetch interval
    useEffect(() => {
        if (roomCode) {
            getRoomDetails();
        }
        
        // Fetch song every second
        const interval = setInterval(getCurrentSong, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [roomCode]);

    // Render settings
    const renderSettings = () => (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage
                    update={true}
                    votesToSkip={votesToSkip}
                    guestCanPause={guestCanPause}
                    roomCode={roomCode}
                    updateCallback={getRoomDetails}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={() => setShowSettings(false)}>
                    Close
                </Button>
            </Grid>
        </Grid>
    );

    // If settings are open, render settings page
    if (showSettings) {
        return renderSettings();
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4">Code: {roomCode}</Typography>
            </Grid>
            {song && <MusicPlayer {...song} />}
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
