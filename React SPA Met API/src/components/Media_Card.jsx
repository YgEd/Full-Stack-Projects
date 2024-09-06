import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

function Media_Card({element}) {

    const handleClick = () => {
      //link to specific collection page in another tab
      window.open(`/collection/${element.objectID}`, "_blank");
        
    }


    return (
      <Card sx={{ maxWidth: 300, minWidth: 300}}>
        <CardActionArea onClick={handleClick}>
          <CardMedia
            sx={{ height: 300 }}
            image={element.primaryImage ? element.primaryImage : "/no_image.jpg"}
            title={element.title ? element.title : "No Title"}
            alt={element.title ? element.title : "No Title"}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {element.title ? element.title : "No Title"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {element.artistDisplayName ? element.artistDisplayName : "Artist Unknown"}
            </Typography>
          </CardContent>
        </CardActionArea>
        {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
      </Card>
    );
  }

  export default Media_Card