import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Card(props) {
    return (
        <div className="card">
            <button className="poster" onClick={props.onClick}>
                {props.movieDetails.poster}
            </button>
            Text Here
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
        this.state = {
            left: {
                id: "001",
                title: "Movie 001",
                year: "1970",
                poster: "img001.png",
            },
            right: {
                id: "002",
                title: "Movie 002",
                year: "1971",
                poster: "img002.png",
            },
        };
    }

    getMovieDetails(isLeft){
        if(isLeft){
            return new MovieDetails(
                this.state.left.title,
                this.state.left.year,
                this.state.left.img
            );
        } else {
            return new MovieDetails(
                this.state.right.title,
                this.state.right.year,
                this.state.right.img
            );
        }
    }

    handlePosterClicked(i) {
        let alertString;
        if(i===0)
            alertString = "Left poster clicked with details " + this.getMovieDetails(true);
        else if(i===1)
            alertString = "Right poster clicked with details " + this.getMovieDetails(false);
        else
            alertString = "Error";

        alert(alertString);
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