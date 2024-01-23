import * as React from 'react';
import Alert from '@mui/material/Alert';

export default function AlertMUI(props) {
    return (
        <div className='flex justify-center w-[100%] fixed bottom-[2em] z-10'>
            <Alert severity={props.status} style={{
                width: "fit-content",
                fontSize: "1em",
                margin: "0 1em"
            }}>
                {props.text}
            </Alert>
        </div>
    );
}