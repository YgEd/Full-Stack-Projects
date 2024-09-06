import React from 'react';
import Grid from '@mui/material/Grid';
import Book_Card from './Book_Card'

function Book({books}){

    return(
        <>
        {books ? (
            <>
                <Grid container spacing={2} justifyContent="center">
                {books.map((book, index) => (
                    <Grid item key={book._id}>
                        <Book_Card element={book}/>
                    </Grid>
                ))}
                    
             </Grid>
           </>
        ): (<h1>Loading</h1>)}
        </>
        
    )



}

export default Book;

