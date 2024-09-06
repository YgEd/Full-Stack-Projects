import React from 'react';
import {Link} from 'react-router-dom';


function Error({code}){

    return(
        <div>
            <h1>{code} Error</h1>
            <br></br>
            <br></br>
        </div>

    )
}

export default Error;