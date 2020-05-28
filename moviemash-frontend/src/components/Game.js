import React from 'react';
import axios from 'axios';


import 'bootstrap/dist/css/bootstrap.css';
import '../index.css';

import {
    Card,
    Button,
    Container,
    Row,
    Col
} from "react-bootstrap";


const SUBMIT_PATH = "api/submitWinner.php";
const GET_PATH = "api/getNewMatch.php";

function MovieCard(props) {
    return (
        <a onClick={props.onPosterClicked}>
            <Card id={props.id}>
                <Card.Img
                    style={{
                        aspectRatio: 3/2,
                        // flex: 1,
                        // flexDirection: 'row',
                        width: '100%',
                        // maxHeight: '40%'
                    }}
                    className="cardImg"
                    variant="top"
                    src={props.movieDetails.img}
                />
                <Card.Body>
                    <Card.Title>{props.movieDetails.title}</Card.Title>
                    <Card.Text>
                        This is a temporary description of the movie. Maybe also include
                    </Card.Text>
                </Card.Body>
            </Card>
        </a>
    );
}

class CardBoard extends React.Component {

    renderPosterCard(i) {
        return (
            <MovieCard
                id={"card" + i}
                movieDetails={this.props.movieDetails[i]}
                onPosterClicked={() => this.props.onPosterClicked(i)}
                style={{
                    height: '40%'
                }}
            />
        );
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        {this.renderPosterCard(0)}
                    </Col>
                    <Col>
                        {this.renderPosterCard(1)}
                    </Col>
                </Row>
            </Container>
        );
    }
}

function ButtonBoard(props) {
    return (
        <Container className="button-board">
            <Row>
                <Col>
                    <Button id="button0" onClick={() => props.onNotSeenClicked(0)}>I've not seen this one</Button>
                </Col>
                <Col>
                    <Button id="button1" onClick={() => props.onNotSeenClicked(1)}>I've not seen both</Button>
                </Col>
                <Col>
                    <Button id="button2" onClick={() => props.onNotSeenClicked(2)}>I've not seen this one</Button>
                </Col>
            </Row>
        </Container>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            notSeenLeft: false,
            notSeenRight: false,
        };
    }

    getMovies(){
        axios
            .post(GET_PATH, this.state)
            .then(result => {

                //TODO: handle errors with result

                let left = result.data.left;
                let right = result.data.right;

                this.setState({
                    left: left,
                    right: right,
                    ready: true,
                });

            }).catch(error => {
            console.log(error);
        });
    }

    //TODO: Decode special chars in titles (eg apostrophe)
    getMovieDetails(isLeft){
        if(this.state.ready) {
            if (isLeft) {
                return new MovieDetails(
                    this.state.left.title,
                    this.state.left.poster_path
                );
            } else {
                return new MovieDetails(
                    this.state.right.title,
                    this.state.right.poster_path
                );
            }
        } else {
            //TODO: Get a better loading thing
            return new MovieDetails( "Loading...",  null);
        }
    }

    handlePosterClicked(i) {
        if(i===0) {
            this.setState(
                {
                    winningId: this.state.left.tmdb_id,
                    losingId: this.state.right.tmdb_id,
                },
                this.submitWinner
            );
        } else if(i===1) {
            this.setState(
                {
                    winningId: this.state.right.tmdb_id,
                    losingId: this.state.left.tmdb_id,
                },
                this.submitWinner
            );
        } else {
            console.log("ERROR: handlePosterClicked");
        }
    }

    handleNotSeenClicked(i) {
        if(i===0) {
            this.setState(
                {
                    notSeenLeft: true,
                    notSeenRight: false,
                },
                this.submitWinner
            );
        } else if(i===1) {
            this.setState(
                {
                    notSeenLeft: true,
                    notSeenRight: true,
                },
                this.submitWinner
            );
        } else if(i===2) {
            this.setState(
                {
                    notSeenLeft: false,
                    notSeenRight: true,
                },
                this.submitWinner
            );
        } else {
            console.log("ERROR: handleNotSeenClicked");
        }
    }

    submitWinner(){
        axios
            .post(SUBMIT_PATH, this.state)
            .then(result => {
                this.getMovies();
                //TODO: handle error
                this.setState({
                    winningId: -1,
                    losingId: -1,
                    notSeenLeft: false,
                    notSeenRight: false,
                });
            }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <Container>
                {/*<h1>Which is better?</h1>*/}
                <Row>
                    <CardBoard
                        movieDetails={[this.getMovieDetails(true), this.getMovieDetails(false)]}
                        onPosterClicked={(i) => this.handlePosterClicked(i)}
                    />
                </Row>
                <Row>
                <ButtonBoard
                    movieDetails={[this.getMovieDetails(true), this.getMovieDetails(false)]}
                    onNotSeenClicked={(i) => this.handleNotSeenClicked(i)}
                />
                </Row>
            </Container>
        );
    }

    componentDidMount() {
        this.getMovies();
    }
}

class MovieDetails {
    constructor(t, i) {
        this.title = t;
        this.img = i;
    }
}

export default Game;