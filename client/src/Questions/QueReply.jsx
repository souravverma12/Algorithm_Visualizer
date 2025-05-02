import { Box } from '@material-ui/core';
import React from 'react';
import Questionbox from './questionbox';

export default function QueReply(props) {
    return (
        <Box style={{ 
            backgroundColor: '#d3d3d4', 
            fontFamily: "'PT Serif', serif",
            padding: '8px',
            paddingLeft: "20px",
            margin: '8px'
        }}>
            <Questionbox pagename={props.pagename}/>
        </Box>
    )
}