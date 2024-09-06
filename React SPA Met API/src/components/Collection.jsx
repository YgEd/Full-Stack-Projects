import {useEffect, useState, CSSProperties} from 'react';
import {Link, useParams, useSearchParams, useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import './App.css'
import RotateLoader from 'react-spinners/RotateLoader'
import Objects from './Objects';
import Error from './Error';
import Search from './Search';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Search_body from './Search_body';
import Media_Card from './Media_Card';

function Collection(){
    
    const nav = useNavigate();
    const [data, setData] = useState(null);
    const [ready, setReady] = useState(false);
    const [search, isSearch] = useState(false);
    const [search_in, setSearch] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [department, setDepartment] = useState("");
    const [objecstReady, setObjectsReady] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const [location, setLocation] = useState(useLocation());

    console.log(`location = ${JSON.stringify(location)}`)

    // used to set page error if no objects are found for a page
    let raw_page = useParams().page;
    const [page, setPage] = useState(parseInt(useParams().page));

    if (raw_page === undefined || !/^[0-9]+$/.test(raw_page) || !Number.isInteger(parseFloat(raw_page) || parseFloat(raw_page) < 1)){
        // redirect to Error page
        return (
            <div>
                <Error code={400}/>
                <br></br>
                <br></br>
                <Link to="/">Link to Landing Page</Link>
            </div>
        )
    }


    const handleChange = (event, value) => {
        setPage(value);
        console.log(`department from handlechange = ${department}`)
        if (department != ""){
            if (searchParam !=""){
                window.history.replaceState(null, null, `/collection/page/${value}?departmentIds=${department}&q=${searchParam}`);
            }else{
                window.history.replaceState(null, null, `/Collection/page/${value}?departmentIds=${department}`);
            }
        }else if(searchParam !=""){
            window.history.replaceState(null, null, `/collection/page/${value}?q=${searchParam}`);
        }else{
            nav(`/collection/page/${value}`)
        }
    };

    const override = {
            display: "block",
            margin: "0 auto",
        };



    useEffect(() => {
        isSearch(false);
        setReady(false);
        console.log(`page = ${page}`)
        const getData = async () => {
            try {

                const params = {};
                    searchParams.forEach((value, key) => {
                    params[key] = value;
                });

                console.log(`params = ${JSON.stringify(params)}`)
                console.log(`params = ${params.departmentIds}`)

                let URL =  "https://collectionapi.metmuseum.org/public/collection/v1/objects"
                if (params.departmentIds){
                    if (params.departmentIds.trim().length == 0 || parseInt(params.departmentIds) < 1 || parseInt(params.departmentIds) > 21 || parseInt(params.departmentIds) == NaN || parseInt(params.departmentIds) == 2 || parseInt(params.departmentIds) == 20){
                        // if (params.q && params.q.trim().length > 0){
                        //     setSearchParam(params.q)
                        //     URL =  "https://collectionapi.metmuseum.org/public/collection/v1/search?q=" + params.q
                        // }else{
                        //     setDepartment("")
                        //     URL =  "https://collectionapi.metmuseum.org/public/collection/v1/objects"
                        // }
                        URL = null
                    }
                    else{
                        setDepartment(params.departmentIds)
                        console.log(`department!`)
                        if (params.q && params.q.trim().length > 0){
                            setSearchParam(params.q)
                            URL =  "https://collectionapi.metmuseum.org/public/collection/v1/search?deparmentIds=" + params.departmentIds + "&q=" + params.q
                        }else{
                            URL =  "https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=" + params.departmentIds
                        }
                    }
                }else if(params.q && params.q.trim().length > 0){
                    setSearchParam(params.q)
                    URL =  "https://collectionapi.metmuseum.org/public/collection/v1/search?q=" + params.q
                }else{
                    URL =  "https://collectionapi.metmuseum.org/public/collection/v1/objects"
                }

                console.log(`URL = ${URL}`)
                //console.log(`department = ${department}`)
                let met_data = await axios.get(URL)
                //sort data by objectID
                met_data.data.objectIDs.sort((a, b) => a - b)
                setData(met_data)
                setReady(true);
            } catch (error) {
                console.log(error)
                setReady(true);
            }
            
        }
        getData();

    }, [])


    return(

            <div>
                <h1>Welcome To the Met Collection</h1>
                <br></br>
                
                {ready ? (!data || data.data.total < page * 50 ? (
                            <Error code={404}/>
                            ) : (
                                    <>
                                        <Search search_in={search_in} setSearch={setSearch} isSearch={isSearch} page={page} location={location}/>
                                            <br></br>
                                            <br></br>
                                        
                                        
                                        {!search ? (
                                                        <>
                                                        <Pagination 
                                                                page={page}
                                                                count={data.data.total <= 50 ? (1):(Math.floor(data.data.total/50))}
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
                                                            <Objects info={data.data} page={page} setObjectsReady={setObjectsReady}/>
                                                            <br></br>
                                                            <br></br>
                                                        </>
                                                    ): (
                                                        <Search_body search_in={search_in} search={search} isSearch={isSearch}/>
                                                    )
                                        }
                                    </>
                                )
                           
                        ): (
                                <>
                                    <br></br>
                                    <br></br>
                                    <RotateLoader
                                    cssOverride={override}
                                    />
                                    <br></br>
                                </>
                            )
                        }
                <br></br>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to Top</button>
                <br></br>
                <br></br>
                <Link to="/">Link to Landing Page</Link>
        </div>
            )
    }

export default Collection;