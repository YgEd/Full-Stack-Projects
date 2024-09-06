import React, { useEffect, useState } from 'react';
import { GET_COMICS, GET_COMIC, GET_AMOUNT } from '../queries.js'
import { useQuery } from '@apollo/client'
import {useDispatch, useSelector} from 'react-redux';
import {Link, useParams, useNavigate} from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import RotateLoader from 'react-spinners/RotateLoader'
import Comic_card from './Comic_card.jsx';
import * as actions from '../actions';

function Comics_list(){

    const nav = useNavigate();
    const [page, setPage] = useState(parseInt(useParams().pagenum));
    const [bad, setErr] = useState(false);
    const [cap, setCap] = useState(null);
    const [ready, setReady] = useState(false);
    const [code, setCode] = useState(null);

    console.log(`page = ${page}`)
    console.log(`useParams() = ${JSON.stringify(useParams())}`)


    const override = {
        display: "block",
        margin: "0 auto",
    };


    const handleChange = (event, value) => {
        setPage(value);
        nav(`/marvel-comics/page/${value}`);
      };
    
      let { loading, error, data } = useQuery(GET_AMOUNT, { fetchPolicy: 'cache-and-network' });
    
      const err = () => {
        setErr(true);
      };

      useEffect(() => {
        setReady(false);
        if (data) {
          console.log(data.comic_amount)
          setCap(data.comic_amount);
          if (cap){
          console.log(`cap = ${cap} and data.comic_amount = ${data.comic_amount}` )
          if (page === undefined || isNaN(page) || !Number.isInteger(page) || page < 1 ) {
            // redirect to Error page
            console.log('bad page number');
            err();
            setCode(400)
          }
          if (page > Math.ceil(cap/50)){
            console.log('bad page number');
            err();
            setCode(404)
          }
          setReady(true);
        }
        }
      }, [data, page, cap]); // Add 'page' as a dependency
    
      let {currCollection} = useSelector((state) => state.selectors);
    

    if (loading || !ready) {
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
    }else {

        if (bad){
            console.log("error")
            return (
            <div>
                <h1>{code} Error</h1>
                <br></br>
                <br></br>
                <Link to="/">Link to Landing Page</Link>
            </div>
            )
        }

        console.log("proceeding with render")
    
        return(
            
            <>
                <h1>Marvel Comic Collection</h1>
                    <>
                    <h2>Selected Collection: {currCollection}</h2>
                    <Link to="/marvel-comics/collections">Link to Collections</Link>
                    <br></br>
                    <br></br>
                    <Pagination 
                            page={page}
                            count={Math.ceil(cap/50)}
                            className = "pagination"  
                            color="secondary" 
                            variant='outlined'
                            siblingCount={2} 
                            boundaryCount={1}
                            defaultPage={1}
                            onChange={handleChange}
                            
                        />
                        <br></br>
                        <br></br>
                        <Comic_card page={page}/>
                        <br></br>
                        <br></br>
                    </>
            
                    
            </>

        )
    }
}


export default Comics_list;