import React, { useEffect, useState } from 'react';
import { GET_COMICS, GET_COMIC, GET_AMOUNT } from '../queries.js'
import { useQuery } from '@apollo/client'
import {useDispatch, useSelector} from 'react-redux';
import {Link, useParams, useNavigate} from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import RotateLoader from 'react-spinners/RotateLoader'
import Comic_card from './Comic_card.jsx';
import * as actions from '../actions';
import { persistor } from '../store.js';
import Button from '@mui/material/Button';


const Collections = React.memo(() => {

  

    
    const [formData, setFormData] = useState({ name: '' });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      console.log(formData)
    };
  
    const add_collection = () => {
      console.log("from add_collection: " + JSON.stringify(formData))
      if (formData === null || formData.name.trim() === '') {
        alert('Please enter a collection name');
        return;
      }
      dispatch(actions.addCollection(formData.name.trim().toLowerCase()));
      //set newly create collection as current collection
      dispatch(actions.setCollection(formData.name.trim().toLowerCase()))
      setFormData({ ...formData, name: '' }); // Clear the input value
    };
  
    const dispatch = useDispatch();
  
    let collections = useSelector((state) => state.collections);
    let payload = collections; 



    //active collection
    let {currCollection} = useSelector((state) => state.selectors);
    let active_collection = currCollection;
    console.log(`active_collection = ${JSON.stringify(active_collection)}`)

    useEffect(() => {
      console.log("payload updated!")
      console.log(`payload = ${JSON.stringify(payload)}`)
    }, [formData]);
  
    return (
      <div>
        <h1>My Collections</h1>
        {/* create a form with a button to add a collection having a name input */}
        <div className="active_collection">
          <h2>Active Collection: {active_collection ? active_collection : "Currently no Collections Avaliable"}</h2>
        </div>
        <div className="Collections">
          {Object.keys(payload).map((key, index) => (
            <div key={index}>
              <h2>{key}</h2>
              { active_collection != key ?
              ( 
                <>
                  <button className ="dark" onClick={() => dispatch(actions.setCollection(key))}>Set as Active Collection</button> 
                  <br></br>
                  <button className ="dark" onClick={() => dispatch(actions.deleteCollection(key))}>Delete Collection</button>
                </>
              ): (<></>)}
              { active_collection != key ? (
                <>
                  <br></br>
                  <br></br>
                </>
              ): (<></>)} 
              <div className="collection_wrapper">
              {payload[key].map(element => {
                console.log(element)
                return (
                <div key={element.id}>
                <Link to={`/marvel-comics/${element.id}`} target="_blank"> {element.title} </Link>
                <button className ="remove" onClick={() => dispatch(actions.removeComic(key, element.id))}>Give-up</button>
                </div>)
              })}
              </div>
              <br></br>
            </div>
          ))}
        </div>
        <br></br>
        <div className='add'>
          <div className='input-selection'>
            <label>
              Enter Collection Name:
              <br></br>
              <br></br>
              <input
                onChange={(e) => handleChange(e)}
                name='name'
                placeholder='Collection name...'
                value={formData.name || ''} // Use the value from state
              />
            </label>
          </div>
        </div>
        <br></br>
        <button onClick={add_collection}>Add Collection</button>
        <br></br>
        {/* <button onClick={() => persistor.purge()}>Clear Storage</button> */}
        <br></br>
        <br></br>
        <Link to="/marvel-comics/page/1">Go To Comics Page</Link>
      </div>
     
     
    );
  })
  
  export default Collections;
  