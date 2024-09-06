import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import './App.css'
import Met from '/met.svg'
import {useSpring, animated} from 'react-spring'
import Met_gif from '/met.gif'

function Landing(){

    const [flip, setFlip] = useState(false)
    const props = useSpring({
        from: {opacity: 0},
        to: {opacity: 1},
        config: {duration: 1000}
    })

    useEffect(() => {
        setFlip(true)
    },[])

    const containerStyle = {
        background: `url('/met.gif')`, // Replace with the path to your GIF
        backgroundSize: 'cover', // You can adjust this as needed
        color: 'white', // Text color
        padding: '20px', // Add padding to make the text more readable
      };

    return(
        <div>
             <div style={containerStyle}>
             <animated.div style={props}>
                <img src={Met} className="App-logo" alt="logo" />
            </animated.div>
            </div>
            
            <br></br>
            <h2>This website allows you to see the Met's Collection like never before!</h2>
            <h3>Click the link below to see the Met's Collection</h3>
            <br></br>
            <Link to="/collection/page/1">Link to Met Collection</Link>
        </div>
    )
}

export default Landing;