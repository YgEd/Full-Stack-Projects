import {useEffect, useState, CSSProperties} from 'react';
import {Link, useParams, useLocation, useSearchParams} from 'react-router-dom';
import axios from 'axios';
import './App.css'
import RotateLoader from 'react-spinners/RotateLoader'
import Objects from './Objects';
import Error from './Error';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

function Search_body({search_in, search, isSearch}){

    const override = {
        display: "block",
        margin: "0 auto",
    };

const [data, setData] = useState(null);
const [ready, setReady] = useState(false);
const [page, setPage] = useState(1);
// const searchParams = useSearchParams("")
const [params, setParams] = useSearchParams()

const location = useLocation()
const base_location = useLocation()

const handleChange = (event, value) => {
    setPage(value);
    console.log(JSON.stringify(location))
    location.pathname = "/collection/page/"
    const newUrl = `${value}?q=${search_in}`;
    window.history.replaceState(null, null, newUrl);
};


useEffect(() => {

    const getData = async () => {
        setPage(1);
        setReady(false);
        let {data} = await axios.get("https://collectionapi.metmuseum.org/public/collection/v1/search?q=" + search_in)
        console.log(data)
        if (data.total == 0){
            setData(data)
            setReady(true);
            return
        }
        data.objectIDs.sort((a, b) => a - b)
        setData(data)
        setReady(true);

    }

    getData();
    handleChange(null, 1)

}, [])


return (
    <>
        
        {ready ? (
        
            data.total == 0 ? (
                <>
                    <br />
                    <h1>No Results Found for '{search_in}'</h1>
                </>
            ) : (
                    // Your JSX code when ready is true
                    <>
                    
                        <Pagination
                            page={page}
                            count={data.total <= 50 ? (1): (Math.floor(data.total/50))}
                            className = "pagination"  
                            color="secondary" 
                            variant='outlined'
                            siblingCount={2} 
                            boundaryCount={1}
                            defaultPage={1}
                            onChange={handleChange}
                        />
                        <br />
                        <br />
                        <Objects info={data} page={page} />
                    </>
                )) : (
                    <>
                        <br />
                        <br />
                        <RotateLoader css={override} />
                        <br />
                    </>
                )}
                </>
            );

    }

        export default Search_body;
