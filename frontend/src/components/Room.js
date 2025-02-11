import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';

function Room({ leaveRoomCallback }) {
    const { roomCode } = useParams(); // Extract roomCode from URL params
    const navigate = useNavigate(); // Use navigate for navigation
    const [state, setState] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
    });

    // Fetch room details when component mounts
    useEffect(() => {
        const getRoomDetails = () => {
            fetch('/api/get-room?code=' + roomCode)
                .then((response) => {
                    if (!response.ok) {
                        leaveRoomCallback();
                        navigate('/');
                        return null;
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data) {
                        setState({
                            votesToSkip: data.votes_to_skip,
                            guestCanPause: data.guest_can_pause,
                            isHost: data.is_host,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching room details:', error);
                });
        };

        if (roomCode) {
            getRoomDetails();
        }
    }, [roomCode, leaveRoomCallback, navigate]);

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('/api/leave-room', requestOptions)
            .then((_response) => {
                leaveRoomCallback();
                navigate('/');
            })
            .catch((error) => console.error('Error leaving room:', error));
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes: {state.votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {state.guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {state.isHost.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={leaveButtonPressed}
                >
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );
}

export default Room;
