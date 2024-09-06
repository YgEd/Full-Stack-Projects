import React, { useEffect } from 'react';
import { GET_COMICS, GET_COMIC } from '../queries.js'
import { useQuery } from '@apollo/client'
import {useDispatch} from 'react-redux';
import * as actions from '../actions';
import Marvel_SVG from '../assets/marvel.svg';
import { Link } from 'react-router-dom';

function Landing() {



  return (
    <>
      <img src={Marvel_SVG} alt="marvel logo"/>
      <h1>Marvel Collection API</h1>
      <br></br>
      <br></br>
      <Link to="/marvel-comics/page/1">View Comics</Link>
      <br></br>
      <Link to="/collections">View Collections</Link>
     
    </>
  );
}

export default Landing; 

