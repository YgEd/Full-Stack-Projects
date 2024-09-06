import React, { useEffect } from 'react';
import { GET_COMICS, GET_COMIC } from '../queries.js'
import { useQuery } from '@apollo/client'
import {useDispatch} from 'react-redux';
import * as actions from '../actions';
import RotateLoader from 'react-spinners/RotateLoader'
import Media_Card from './Media_Card';
import Grid from '@mui/material/Grid';

function Comic_card({page}){


    const override = {
        display: "block",
        margin: "0 auto",
    };
    

    let {loading, error, data} = useQuery(GET_COMICS, {variables: {"page": parseInt(page)}, fetchPolicy: 'cache-and-network'})
    
    if (loading) {
        return(
        <div>
                    <br></br>
                    <br></br>
                    <RotateLoader
                    cssOverride={override}
                    />
                    <br></br>
                </div>
        )
    }
    
    

    if (!data){
      data = {data: 'no data'}
      console.log('error', error)
    }
    else{
        console.log('data', data)
        let {comics} = data
        console.log('comics', comics)
    }



    return(

        <Grid container spacing={2} justifyContent="center">
            {data.comics_list.map((comic, index) => (
                <Grid item key={index}>
                    <Media_Card element={comic}/>
                </Grid>))}
        </Grid>
    )



}

export default Comic_card;