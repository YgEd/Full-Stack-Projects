import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useRouter } from 'next/router';

function Book_Card({element}){
    const router = useRouter();
    const handleClick = () => {
        router.push(`/books/${element._id}`)
      };

return(

<Card key={element.id} sx={{ maxWidth: 300, minWidth: 300 }}>
    <CardActionArea onClick={handleClick}>
        <Typography gutterBottom variant="h5" component="div">
            {element.title ? element.title : "No Title"}
        </Typography>
    </CardActionArea>
        <CardContent>
         
          <Typography variant="body2" color="text.secondary">
            {element.author.last_name ? `Author: ${element.author.last_name}` : "Author: Unknown"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {element?.publicationDate ? `Date Published: ${element?.publicationDate}` : "Date Published: Unknown"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {element?.summary ? `${element.summary}` : "No Summary"}
          </Typography>
        </CardContent>
    </Card>


)

}


export default Book_Card