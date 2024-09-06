import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import * as actions from '../actions';
import { GET_COMIC } from '../queries.js'
import { useQuery } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import RotateLoader from 'react-spinners/RotateLoader.js';

function Comic() {
    const nav = useNavigate();
    const { id } = useParams(); // Use the useParams hook directly here
    const [element, setElement] = useState(null);
    const [ready, setReady] = useState(false);

    const override = {
        display: "block",
        margin: "0 auto",
    };

    const dispatch = useDispatch();
    const { currCollection } = useSelector((state) => state.selectors);
  
    // Separate function for checking if the comic is in the collection
    const inCollection = useSelector((state) =>
      state.collections[currCollection]?.some((item) => item.id === id)
    );
   
  
    const handleButt = () => {
      if (!inCollection) {
        dispatch(actions.addComic(currCollection, element));
      }
      else{
        dispatch(actions.removeComic(currCollection, element.id));
      }
    };

    let { loading, error, data } = useQuery(GET_COMIC, { variables: { "id": id }, fetchPolicy: 'cache-and-network' });

    useEffect(() => {
        setReady(false);
        if (data) {
            console.log("cookies ready!")
            console.log(data)
            setElement(data.get_comic);
            setReady(true);
        }
    }, [data, id, inCollection]); // Include 'id' as a dependency

    if (loading || !element || !ready) {
        return (
            <div>
                <br></br>
                <br></br>
                <RotateLoader
                    cssOverride={override}
                />
                <br></br>
            </div>
        )
    } else {
        console.log("loading everything")
        //console.log(`element = ${JSON.stringify(element)}`)
        console.log(`element.thumbnail = ${JSON.stringify(element.thumbnail)}`)
        console.log(`element.thumbnail.path = ${JSON.stringify(element.thumbnail.path)}`)
        console.log(`element.thumbnail.extension = ${JSON.stringify(element.thumbnail.extension)}`)
        console.log(`element.title = ${JSON.stringify(element.title)}`)
        console.log(`element.issueNumber = ${JSON.stringify(element.issueNumber)}`)
        console.log(`element.description = ${JSON.stringify(element.description)}`)
        console.log(`element.isbn = ${element.isbn}`)
        console.log(`element.pageCount = ${element.pageCount}`)
        return (
            <>
            <Card sx={{ maxWidth: 300, minWidth: 300, minHeight: 600}}>
                <CardActionArea >
                    <CardMedia
                        sx={{ height: 300 }}
                        image={element?.thumbnail?.path ? element.thumbnail.path + "." + element.thumbnail.extension : "/no_image.jpg"}
                        title={element.title ? element.title : "No Title"}
                        alt={element.title ? element.title : "No Title"}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {element.title ? element.title : "No Title"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {element.issueNumber ? `Issue #${element.issueNumber}` : "Issue Number Unknown"}
                        </Typography>
                        <br/>
                        <Typography variant="body2" color="text.secondary">
                            {element.description ? element.description : "Description Unknown"}
                        </Typography>
                        <br/>
                        <Typography variant="body2" color="text.secondary">
                            {element.isbn ? `ISBN: ${element.isbn}` : "ISBN Unknown"}
                        </Typography>
                        <br/>
                        <Typography variant="body2" color="text.secondary">
                            {element.pageCount ? `Page Count: ${element.pageCount}` : "Page Count Unknown"}
                        </Typography>
                        <br/>
                        <Typography variant="body2" color="text.secondary">
                            {element?.dates[0]?.date ? `Sale Date: ${element.dates[0].date}` : "Sale Date Unknown"}
                        </Typography>
                        <br/>
                        <Typography variant="body2" color="text.secondary">
                            {element?.prices[0]?.price ? `Price: ${element.prices[0].price}` : "Print Price Unknown"}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {currCollection ? (
                    
                        <Button size="small" onClick={handleButt}>
                        {inCollection ? ("Give-up") : ("Collect")}
                        </Button>
                    
                    )
                    : (<></>) }
                </CardActions>
            </Card>
            <br/>
            <Link to="/marvel-comics/page/1"><button>Back to Comics Page</button></Link>
            </>
        );
    }
}

export default Comic;
