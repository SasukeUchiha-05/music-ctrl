import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
  }

  async componentDidMount() {
    fetch("/api/user-in-room").then((response) =>
      response.json().then((data) => {
        this.setState({
          roomCode: data.code,
        });
      })
    );
  }

  renderHomePage() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            House Party
          </Typography>
        </Grid>

        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button
              component={Link}
              to="/join"
              variant="contained"
              color="primary"
            >
              Join a Room
            </Button>
            <Button
              component={Link}
              to="/create"
              variant="contained"
              color="secondary"
            >
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          {/* <Route exact path="/"  element={this.renderHomePage()} /> */}
          <Route
            exact
            path="/"
            element={
              this.state.roomCode ? (
                <Navigate replace to={`/room/${this.state.roomCode}`} />
              ) : (
                this.renderHomePage()
              )
            }
          />
          <Route path="/room/:roomCode" Component={Room} />
        </Routes>
      </Router>
    );
  }
}
