import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useRouter } from 'next/router';

function Author_Card({element}){
    const router = useRouter();
    const handleClick = () => {
        router.push(`/authors/${element._id}`)
      };

return(

<Card key={element.id} sx={{ maxWidth: 300, minWidth: 300 }}>
    <CardActionArea onClick={handleClick}>
        <Typography gutterBottom variant="h5" component="div">
            {(element.first_name && element.last_name) ? `${element.first_name} ${element.last_name}` : "Author Unknown"}
        </Typography>
    </CardActionArea>
        <CardContent>
         
          <Typography variant="body2" color="text.secondary">
            {element.date_of_birth ? `Born: ${element.date_of_birth}` : "Born: Uknown Date"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {(element?.hometownCity && element?.hometownState) ? `From ${element?.hometownCity}, ${element?.hometownState}` : "From Unkown"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {element?.numOfBooks ? `Written ${element.numOfBooks} Books` : "Unknown Amount of Books written"}
          </Typography>
        </CardContent>
    </Card>


)

}


export default Author_Card