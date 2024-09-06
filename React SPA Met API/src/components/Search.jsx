import {useEffect, useState, CSSProperties} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import './App.css'
import RotateLoader from 'react-spinners/RotateLoader'
import Objects from './Objects';
import Error from './Error';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

function Search({search_in, setSearch, isSearch, page, location}){

    const override = {
        display: "block",
        margin: "0 auto",
    };

    const nav = useNavigate();

    const handleChange = (event) => {
        isSearch(false)
        nav(`${location.pathname}${location.search}`)
        setSearch(event.target.value);
    }

    const handleSubmit = async (event) => {
        if (search_in === ""){
            return nav(`/collection/page/1`) 
        }
        isSearch(true);
        event.preventDefault();
        console.log(`search_in = ${search_in}`)
    }

    // useEffect(() => {
    //     console.log(`search_in = ${search_in}`)
    // },[search_in])

    return(
        <>
            <form className="searching" onSubmit={handleSubmit}>
                <input className="searching" type="text"
                placeholder="Search Met Collection"
                onChange={handleChange}
                value={search_in} />
                {/* <br></br>
                <br></br> */}
                <button type="submit">Search</button>
            </form>

            

        
        </>
    )
}

export default Search;