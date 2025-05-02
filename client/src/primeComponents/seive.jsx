import React, { Component } from 'react';
import Cells from "./cells";
import Navbar from "./navbar";
import Menu from "./menu";

class Seive extends Component {
    state = {
        number: 100,
        cells: [],
        isRunning: false,
        speed: 10000 // Start with a very slow speed
    };

    componentDidMount() {
        const cells = getCells(this.state.number);
        this.setState({ cells });
    }

    render() {
        return (
            <div>
                <Navbar/>
                <Menu
                    onChangeSpeed={this.changeSpeed}
                    onChangeValues={this.handleValueIncrease}
                    onVisualize={this.startSeive}
                    onRefresh={this.handleRefresh}
                    isDisabled={this.state.isRunning}
                />
                <Cells num={this.state.number} cells={this.state.cells} />
            </div>
        );
    }

    changeSpeed = (speed) => {
        this.setState({ speed: 20000 - speed * 400 }); // Increase delay for slower animation
    };

    handleValueIncrease = (value) => {
        this.setState({ number: value, cells: getCells(value), isRunning: false });
    };

    handleRefresh = () => {
        this.setState({ cells: getCells(this.state.number), isRunning: false });
    };

    startSeive = async () => {
        this.setState({ isRunning: true });
        const prime = Array(this.state.number + 1).fill(1);
        prime[0] = prime[1] = 0;
        
        let changedCells = this.state.cells;
        let prevCheck = -1;

        for (let i = 2; i <= this.state.number; i++) {
            if (prime[i] === 1) {
                changedCells = getNewCellPrimeToggled(changedCells, i - 1);
                this.setState({ cells: changedCells });
                await sleep(this.state.speed * 2);

                for (let j = i * i; j <= this.state.number; j += i) {
                    if (prevCheck !== -1) {
                        changedCells = getNewCellVisitingToggled(changedCells, prevCheck);
                    }
                    prevCheck = j - 1;
                    changedCells = getNewCellCheckToggled(changedCells, j - 1);
                    changedCells = getNewCellVisitingToggled(changedCells, prevCheck);
                    this.setState({ cells: changedCells });
                    await sleep(this.state.speed * 3);
                    prime[j] = 0;
                }
            }
        }

        changedCells = getNewCellVisitingToggled(changedCells, prevCheck);
        this.setState({ cells: changedCells, isRunning: false });
    };
}

const getNewCellPrimeToggled = (cells, pos) => {
    const newCells = cells.slice();
    newCells[pos] = { ...newCells[pos], isPrime: true };
    return newCells;
};

const getNewCellVisitingToggled = (cells, pos) => {
    const newCells = cells.slice();
    newCells[pos] = { ...newCells[pos], isVisiting: !newCells[pos].isVisiting };
    return newCells;
};

const getNewCellCheckToggled = (cells, pos) => {
    const newCells = cells.slice();
    newCells[pos] = { ...newCells[pos], isChecking: true };
    return newCells;
};

const getCells = (rows) => {
    return Array.from({ length: rows }, (_, i) => createCell(i + 1));
};

const createCell = (val) => ({
    val,
    isChecking: false,
    isVisiting: false,
    isPrime: false
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default Seive;
