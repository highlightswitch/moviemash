import React from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";

const GET_PATH = "api/getLeaderboard.php";

function TableEntry(props) {
    return (
        <tr>
            <td>{props.index}</td>
            <td><img src={props.entry.poster_path} className="poster-icon" alt={props.entry.title} /></td>
            <td>{props.entry.title}</td>
            <td>{props.entry.elo_score}</td>
        </tr>
    );
}

class Leaderboard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            entries: [],
        }
    }

    updateTopMovies(){
        axios
            .post(GET_PATH, this.state)
            .then(result => {
                //TODO: handle error
                this.setState({
                    entries: result.data
                });
            }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <div>
            <h1>Top Movies</h1>
                <div>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Poster</th>
                            <th>Title</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.entries.map(
                            (value, index) => {
                                return <TableEntry key={value.tmdb_id} index={index} entry={value}/>
                            })
                        }
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.updateTopMovies();
    }
}

export default Leaderboard;