import { useState, useEffect } from 'react';
import * as actions from '../actions';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';



function Media_Card({ element }) {
  const [clicked, setClicked] = useState(false); //for debugging purposes
  const dispatch = useDispatch();
  const { currCollection } = useSelector((state) => state.selectors);

  // Separate function for checking if the comic is in the collection
  const inCollection = useSelector((state) =>
    state.collections[currCollection]?.some((item) => item.id === element.id)
  );
 


  useEffect(() => {
    console.log("state change!")
    console.log(`inCollection = ${inCollection}`)
  }, [inCollection, clicked]);
  const handleClick = () => {
    window.open(`/marvel-comics/${element.id}`, "_blank");
  };

  const handleButt = () => {
    setClicked(true);
    if (!inCollection) {
      dispatch(actions.addComic(currCollection, element));
    }
    else{
      dispatch(actions.removeComic(currCollection, element.id));
    }
    setClicked(false);
  };

  

  return (
    <Card key={element.id} sx={{ maxWidth: 300, minWidth: 300 }}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          sx={{ height: 300 }}
          image={element.thumbnail.path ? element.thumbnail.path + "." + element.thumbnail.extension : "/no_image.jpg"}
          title={element.title ? element.title : "No Title"}
          alt={element.title ? element.title : "No Title"}
        />
        </CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {element.title ? element.title : "No Title"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {element.issueNumber ? `Issue #${element.issueNumber}` : "Issue Number Unknown"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {element?.dates[0]?.date ? `Sale Date: ${element.dates[0].date}` : "Sale Date Unknown"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {element?.prices[0]?.price ? `Price: ${element.prices[0].price}` : "Print Price Unknown"}
          </Typography>
        </CardContent>
      <CardActions>
        {currCollection ? (
          
            <Button size="small" onClick={handleButt}>
              {inCollection ? ("Give-up") : ("Collect")}
            </Button>
          
          )
         : (<></>) }
      </CardActions>
    </Card>
  );
}

export default Media_Card;
