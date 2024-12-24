// import React , {Component} from 'react';

// export default class Room extends Component{
//     constructor(props){
//         super(props);
//         this.state={
//             votesToSkip: 2,
//             guestCanPause: false,
//             isHost: false,
//         };
//         this.roomCode = this.props.match.params.roomCode;


//     }
//     render(){
//         return <div>
//             <h2>{this.roomCode}</h2>
//             <p>Votes: {this.state.votesToSkip}</p>
//             <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
//             <p>Is Host: {this.state.isHost.toString()}</p>
//         </div>
//     }
// // }
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Room() {
    const { roomCode } = useParams();  // Using useParams to get roomCode from URL params
    const [state, setState] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
    });

    // Effect hook to fetch room details once component mounts
    useEffect(() => {
        const getRoomDetails = () => {
            fetch('/api/get-room?code=' + roomCode)
                .then((response) => response.json())
                .then((data) => {
                    setState({
                        votesToSkip: data.votes_to_skip,
                        guestCanPause: data.guest_can_pause,
                        isHost: data.is_host,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching room details:", error);
                });
        };

        if (roomCode) {
            getRoomDetails();
        }
    }, [roomCode]);  // Re-run effect if roomCode changes

    return (
        <div>
            <h3>{roomCode}</h3>
            <p>Votes: {state.votesToSkip}</p>
            <p>Guest Can Pause: {state.guestCanPause.toString()}</p>
            <p>Host: {state.isHost.toString()}</p>
        </div>
    );
}

export default Room;

// import React, { Component } from 'react';

// export default class Room extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             votesToSkip: 2,
//             guestCanPause: false,
//             isHost: false,
//         };
//         this.roomCode = this.props.match ? this.props.match.params.roomCode : this.props.params.roomCode;
//         this.getRoomDetails = this.getRoomDetails.bind(this);
//     }

//     componentDidMount() {
//         this.getRoomDetails();
//     }

//     getRoomDetails() {
//         fetch('/api/get-room?code=' + this.roomCode)
//             .then((response) => response.json())
//             .then((data) => {
//                 this.setState({
//                     votesToSkip: data.votes_to_skip,
//                     guestCanPause: data.guest_can_pause,
//                     isHost: data.is_host,
//                 });
//             });
//     }

//     render() {
//         return (
//             <div>
//                 <h3>{this.roomCode}</h3>
//                 <p>Votes: {this.state.votesToSkip}</p>
//                 <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
//                 <p>Host: {this.state.isHost.toString()}</p>
//             </div>
//         );
//     }
// }







