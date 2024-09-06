import React from 'react';
import Grid from '@mui/material/Grid';
import Author_Card from './Author_Card'

function Authors({authors}){

    return(
        <>
        {authors ? (
            <>
                <Grid container spacing={2} justifyContent="center">
                {authors.map((author, index) => (
                    <Grid item key={index}>
                        <Author_Card element={author}/>
                    </Grid>
                ))}
                    
             </Grid>
           </>
        ): (<h1>Loading</h1>)}
        </>
        
    )



}

export default Authors;

