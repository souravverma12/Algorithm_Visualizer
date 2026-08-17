import React, { useEffect, useState } from 'react'
import QueReply from "../Questions/QueReply";
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import { Button } from '@material-ui/core';

import "./Binary.css"

const Tutorial = () => {
    const [page, setPage] = useState(1);
    const [Tutdata, setTutdata] = useState({})
    const totalpage = 3;
    const Next = () => {
        if (page === totalpage) Skip();
        else if (page < totalpage) setPage(page + 1)
    }
    const Previous = () => {
        if (page > 1) setPage(page - 1);
    }
    const Skip = () => {
        document.getElementById("tutorial").style.display = "none";
    }

    useEffect(() => {
        switch (page) {
            case 1:
                setTutdata({
                    h3: 'Welcome to Algorithm Visualizer!',
                    h6: 'This short tutorial will walk you through all of the features of this application.',
                    p: 'If you want to dive right in, feel free to press the "Skip Tutorial" button below. Otherwise, press "Next"!',
                })
                break;
            case 2:
                setTutdata({
                    h3: 'What is a Binary Search algorithm?',
                    h6: 'Binary Search is a searching algorithm used in a sorted array by repeatedly dividing the search interval in half. The idea of binary search is to use the information that the array is sorted and reduce the time complexity to O(Log n).',
                    p: 'If you wanted to deep dive into the concept of binary searching please click the link given bellow!s',
                    link: <Button variant='contained' color='primary'><a href='https://www.youtube.com/watch?v=P3YID7liBug' rel='noreferrer' target="_blank">Watch Video</a></Button>,
                })
                break;
            case 3:
                setTutdata({
                    h3: 'How to use',
                    h6: 'User can enter the size of Array of range(1-100) and generate the array by clicking on "GENERATE RANDOM" button.',
                    p: 'Binary search Algorithm starts the searching when the user click on "START" button after entering search element.',
                    link: <Button variant='contained' color='primary'><a href='https://www.geeksforgeeks.org/binary-search/' rel='noreferrer' target="_blank">See Algorithm</a></Button>,
                })
                break;
            default:
                setTutdata({
                    h3: 'Welcome in AlgoViz Project',
                    h6: "It's a project which demonstaight the working of different algorithms",
                    p: 'All of the algorithms on this application are adapted for a 2D grid, where 90 degree turns have a "cost" of 1 and movements from a node to another have a "cost" of 1.',
                })
        }
    }, [page])

    return (
        <>
            <div id="tutorial">
                <h3>{Tutdata.h3}</h3>
                <h6>{Tutdata.h6}</h6>
                <p>{Tutdata.p}</p>
                <p><b>{Tutdata.link}</b></p>
                <div id="tutorialCounter">{page}/{totalpage}</div>
                <button id="nextButton" className="btn btn-default navbar-btn" type="button" onClick={Next}>{page === totalpage ? 'FINISH' : 'NEXT'}</button>
                <button id="previousButton" className="btn btn-default navbar-btn" type="button" onClick={Previous}>Previous</button>
                <button id="skipButton" className="btn btn-default navbar-btn" type="button" onClick={Skip}>Skip Tutorial</button>
            </div>
        </>
    )
}

export default function BinarySearch() {
    const [Arraysize, setArraysize] = useState();
    const [Searchelement, setSearch] = useState('');
    const [error, seterror] = useState(false);
    const [success, setsuccess] = useState(false);
    const [errormsg, seterrormsg] = useState("");
    const [Randarray, setRandarray] = useState([]);
    const [Result, setResult] = useState(0);
    const [Button, setButton] = useState(false);
    const [low, setLow] = useState(null);
    const [mid, setMid] = useState(null);
    const [high, setHigh] = useState(null);

    useEffect(() => {
        RandomArray();
    }, [])

    const RandomArray = () => {
        if (Arraysize <= 0 || Arraysize > 100) {
            return seterror(true);
        }
        let temp = [];
        for (let i = 0; i < Arraysize; i++) {
            temp.push(Math.floor(Math.random() * 100))
        }
        temp = temp.sort((a, b) => a - b);
        setRandarray(temp);
        setLow(null);
        setMid(null);
        setHigh(null);
    }

    const handleresult = () => {
        seterror(false);
        setsuccess(false);
        seterrormsg('')
        if (!Searchelement) {
            seterrormsg('Please enter search element')
            return seterror(true);
        }
        setButton(true);
        BinarySearchFunc(Randarray, 0, Randarray.length - 1, Number(Searchelement));
    }

    const BinarySearchFunc = (arr, left, right, target) => {
        if (left > right) {
            seterror(true);
            seterrormsg('Sorry, element does not exist');
            setButton(false);
            return;
        }

        const m = Math.floor((left + right) / 2);
        setLow(left);
        setMid(m);
        setHigh(right);
        document.getElementById('input' + m).scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            if (arr[m] === target) {
                setResult(m);
                setsuccess(true);
                setButton(false);
            } else if (arr[m] > target) {
                BinarySearchFunc(arr, left, m - 1, target);
            } else {
                BinarySearchFunc(arr, m + 1, right, target);
            }
        }, 2000);
    }

    const getLabel = (index) => {
        let labels = [];
        if (index === low) labels.push("Low");
        if (index === mid) labels.push("Mid");
        if (index === high) labels.push("High");
        return labels.join(" / ");
    }

    return (
        <div>
            <Tutorial />
            <div className="binarySearch">
                <TextField label="Enter size of Array" id="outlined-size-small" size="small" color="secondary" required
                    
                    error={error}
                    value={Arraysize}
                    type='number'
                    onChange={(e) => setArraysize(Number(e.target.value))}
                />
                <Fab variant="extended" color='secondary' sx={{ ml: 1 }} onClick={RandomArray} disabled={Button}>
                    <AddIcon sx={{ mr: 1 }} />
                    Generate Random
                </Fab>
                <div className="TC">Time Complexity:- O(log n)</div>

                <div className="array_input">
                    {Randarray.map((item, id) => (
                        <div key={id} style={{ textAlign: 'center' }}>
                            <TextField
                                size="small"
                                label={id}
                                id={"input" + id}
                                sx={{ mr: 1, mb: 1 }}
                                color='secondary'
                                value={item}
                                type='number'
                                InputProps={{ readOnly: true }}
                                className={
    id === mid
      ? 'input-mid'
      : id === low || id === high
      ? 'input-low'
      : ''
  }
                            />
                            <div style={{ fontSize: '0.75em', color: 'gray' }}>{getLabel(id)}</div>
                        </div>
                    ))}
                </div>

                <TextField label="Enter search Element" id="outlined-size-small" size="small" color="secondary" required
                    error={error}
                    helperText={errormsg}
                    value={Searchelement}
                    type='number'
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Fab variant="extended" color='success' sx={{ ml: 1 }} onClick={handleresult} disabled={Button}>
                    <AddIcon sx={{ mr: 1 }} />
                    start
                </Fab>

                {error && <Alert severity="error">{errormsg}</Alert>}
                {success && <Alert severity="success">Element is found at index {Result}</Alert>}
            </div>
            <QueReply pagename={"binarysearch"} />
        </div>
    )
}