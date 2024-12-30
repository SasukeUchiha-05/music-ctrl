import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link , useNavigate } from "react-router-dom";

function withNavigate(Component) {
    return function WithNavigateWrapper(props) {
      const navigate = useNavigate();
      return <Component {...props} navigate={navigate} />;
    };
  }

class RoomJoinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: "",
      error: "",
    };
    this.handelTextFieldChange = this.handelTextFieldChange.bind(this);
    this.roomButtonPressed = this.roomButtonPressed.bind(this);
  }

  render() {
    return (
      <Grid container spacing={1} align="center">
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            Join a Room
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={this.state.error}
            label="Code"
            placeholder="Enter a Room Code"
            value={this.state.roomCode}
            helperText={this.state.error}
            variant="outlined"
            onChange={this.handelTextFieldChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={this.roomButtonPressed}
          >
            Enter Room
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="secondary" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  handelTextFieldChange(e) {
    this.setState({
      roomCode: e.target.value,
    });
  }

  roomButtonPressed() {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            code: this.state.roomCode,
        }),
        };
    fetch('/api/join-room',requestOptions).then((response) => {
        if (response.ok) {
            this.props.navigate(`/room/${this.state.roomCode}`);
        } else {
            this.setState({ error: "Room not found." });
        }
    }).catch((error) => {
        console.error("Error joining room:", error);
    });  
  }
}

export default withNavigate(RoomJoinPage);
