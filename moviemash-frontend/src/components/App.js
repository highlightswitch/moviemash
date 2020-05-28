import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import '../index.css';

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import Game from "./Game";
import Leaderboard from "./Leaderboard";

function Bar(props) {
    return (
        <div>
            <Navbar bg="light" expand="lg">
                <h2>MovieMash</h2>
            </Navbar>
            <Nav variant="tabs" justify defaultActiveKey="game" onSelect={(key) => props.onTabSelected(key)}>
                <Nav.Item>
                    <Nav.Link eventKey="game">Game</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="leaderboard">Leaderboard</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

function ContentPane(props) {
    if(props.tab === "game"){
        return <Game/>;
    } else if(props.tab === "leaderboard"){
        return <Leaderboard/>;
    } else {
        //TODO handle error
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: "game",
        };
    }

    handleTabSelected(key){
        this.setState({tab: key});
    }

    render() {
        return (
            <div id="app">
                <Bar onTabSelected={(key) => this.handleTabSelected(key)} />
                <ContentPane tab={this.state.tab} />
            </div>
        )
    }

}

export default App;