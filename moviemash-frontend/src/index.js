import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './index.css';

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
            mode: "Random",
        };
        this.getMovies();
    }

    handleChangeModeClicked(){
        if(this.state.mode === "Random"){
            this.setState({
                mode: "King of the Hill"
            });
        } else if(this.state.mode === "King of the Hill"){
            this.setState({
                mode: "Random"
            });
        } else {
            console.log("ERROR: onChangeModeClicked");
        }
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

    // getDefaultMovies(){
    //     return {
    //         left: {
    //             id: "001",
    //             title: "Movie 001",
    //             year: "1970",
    //             poster: poster01,
    //         },
    //         right: {
    //             id: "002",
    //             title: "Movie 002",
    //             year: "1971",
    //             poster: poster02,
    //         }
    //     };
    // }

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
                <br/>
                Mode: {this.state.mode} <br />
                <button onClick={() => this.handleChangeModeClicked()}>Change Mode</button>
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

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);