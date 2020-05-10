import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './index.css';

const SUBMIT_PATH = "api/submitWinner.php";
const GET_PATH = "api/getNewMatch.php";

function Card(props) {
    return (
        <div className="card">
            <img src={props.movieDetails.img} className="poster" onClick={props.onClick} alt={props.movieDetails.title} />
            {props.movieDetails.title} ({props.movieDetails.year})
        </div>
    );
}

class Board extends React.Component {

    renderPosterCard(i) {
        return (
            <Card
                movieDetails={this.props.movieDetails[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div className="board">
                {this.renderPosterCard(0)}
                {this.renderPosterCard(1)}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {ready: false};
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

    getMovieDetails(isLeft){
        if(this.state.ready) {
            if (isLeft) {
                return new MovieDetails(
                    this.state.left.title,
                    this.state.left.year,
                    this.state.left.poster
                );
            } else {
                return new MovieDetails(
                    this.state.right.title,
                    this.state.right.year,
                    this.state.right.poster
                );
            }
        } else {
            //TODO: Get a better loading thing
            return new MovieDetails( "Loading...", "", null);
        }
    }

    handlePosterClicked(i) {
        if(i===0) {
            this.setState(
                {
                    winningId: this.state.left.id,
                    losingId: this.state.right.id,
                },
                this.submitWinner
            );
        } else if(i===1) {
            this.setState(
                {
                    winningId: this.state.right.id,
                    losingId: this.state.left.id,
                },
                this.submitWinner
            );
        } else {
            console.log("ERROR: handlePosterClicked");
        }

        this.getMovies();
    }

    submitWinner(){
        axios
            .post(SUBMIT_PATH, this.state)
            .then(result => {
                //TODO: handle error
                this.setState({
                        winningId: -1,
                        losingId: -1,
                    });
            }).catch(error => {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="game">
                <h1>Which is better?</h1>
                <Board
                    movieDetails={[this.getMovieDetails(true), this.getMovieDetails(false)]}
                    onClick={(i) => this.handlePosterClicked(i)}
                />
            </div>
        );
    }
}

class MovieDetails {
    constructor(t, y, i) {
        this.title = t;
        this.year = y;
        this.img = i;
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);