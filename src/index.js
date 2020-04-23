import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Poster(props) {
    return (
        <button className="poster" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderPoster(i) {
        return (
            <Poster
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                {this.renderPoster(1)}
                {this.renderPoster(2)}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleClick(i) {

    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={Array(2).fill(null)}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);