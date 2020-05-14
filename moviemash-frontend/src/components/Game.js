import React from 'react';
import axios from 'axios';


import 'bootstrap/dist/css/bootstrap.css';
import '../index.css';


const SUBMIT_PATH = "api/submitWinner.php";
const GET_PATH = "api/getNewMatch.php";

function Card(props) {
    return (
        <div className="card">
            <img src={props.movieDetails.img} className="poster" onClick={props.onPosterClicked} alt={props.movieDetails.title} />
            <h3>{props.movieDetails.title}</h3>
        </div>
    );
}

class CardBoard extends React.Component {

    renderPosterCard(i) {
        return (
            <Card
                movieDetails={this.props.movieDetails[i]}
                onPosterClicked={() => this.props.onPosterClicked(i)}
            />
        );
    }

    render() {
        return (
            <div className="card-board">
                {this.renderPosterCard(0)}
                {this.renderPosterCard(1)}
            </div>
        );
    }
}

function ButtonBoard(props) {
    return (
        <div className="button-board">
            <button onClick={() => props.onNotSeenClicked(0)}>I've not seen this one</button>
            <button onClick={() => props.onNotSeenClicked(1)}>I've not seen both</button>
            <button onClick={() => props.onNotSeenClicked(2)}>I've not seen this one</button>
        </div>
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
        this.getMovies();
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
            <div className="game">
                <h1>Which is better?</h1>
                <CardBoard
                    movieDetails={[this.getMovieDetails(true), this.getMovieDetails(false)]}
                    onPosterClicked={(i) => this.handlePosterClicked(i)}
                />
                <ButtonBoard
                    movieDetails={[this.getMovieDetails(true), this.getMovieDetails(false)]}
                    onNotSeenClicked={(i) => this.handleNotSeenClicked(i)}
                />
            </div>
        );
    }
}

class MovieDetails {
    constructor(t, i) {
        this.title = t;
        this.img = i;
    }
}

export default Game;