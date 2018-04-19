import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square is a functional component - consists in only a render method
// instead of extending a component, create a function that takes props and returns what should be rendered
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    /*handleClick(i) {
        // using slice to create a copy of the squares array in the state and not modify the actual array
        const squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            //preventing click on same square or clicks after declaring the winner
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        // updating the state with the new modified copy of the array
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }*/

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: Array(2).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const currentPos = calculatePosition(i);
        if(calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                position: currentPos
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // storing the moves
        const moves = history.map((step, move) => {
           const desc = move ? 'Go to move #' + move : 'Go to game start';
           return (
               <li key={move}>
                   <button onClick={() => this.jumpTo(move)}>{desc}</button>
                   <table>
                       <tr><td>row</td><td>col</td></tr>
                       <tr><td>{step.position[0]}</td><td>{step.position[1]}</td></tr>
                   </table>
               </li>
           )
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O')
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}

                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
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


// helper function to declare a winner
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // checks if the same player matched any of the winning combinations
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// helper function to calculate the position of the current check
function calculatePosition(i) {
    let col, row;
    if (i<3) {
        row = 1;
        col = i+1;//(i + 3 - 2)
    } else if (i>=3 && i<6) {
        row = 2;
        col = i-2; //(i + 3 - 5)
    } else if(i>=6 && i<9) {
        row = 3;
        col = i-5;//(i + 3 - 8)
    }
    return [row, col];
}