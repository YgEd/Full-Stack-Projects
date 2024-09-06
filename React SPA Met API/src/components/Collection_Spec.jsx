import {useEffect, useState, useCallback} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import './App.css'
import Error from './Error';
import RotateLoader from 'react-spinners/RotateLoader'
import Media_Card from './Media_Card';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import No_image from '/no-image-svgrepo-com.svg';
import ImageViewer from 'react-simple-image-viewer';


function Collection_Spec(){

    const override = {
        display: "block",
        margin: "0 auto",
    };

    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [data, setData] = useState(null);
    const [ready, setReady] = useState(false);
    const nav = useNavigate();
    const { id } = useParams();

    const openImageViewer = useCallback((index) => {
      setCurrentImage(index);
      setIsViewerOpen(true);
    }, []);
  
    const closeImageViewer = () => {
      setCurrentImage(0);
      setIsViewerOpen(false);
    };

    useEffect(() => {

        const getData = async () => {
            try {
                let {data} = await axios.get("https://collectionapi.metmuseum.org/public/collection/v1/objects/" + id)
                setData(data)
                setReady(true);
            } catch (error) {
                console.log(error)
                setReady(true);
            }
            
        }

        getData();

    }, [])

    const handleButton = () => {
        window.open(data.objectURL, "_blank")
    }

    if (id === undefined || !Number.isInteger(parseFloat(id) || parseFloat(id) < 0)){
        // redirect to Error page
        return (
            <div>
                <Error code={400}/>
                <Link to="/">Link to Landing Page</Link>
            </div>
        )
    }else{

        return(
            <div>
                {console.log(data)}
                {ready ? (
                    data === null ? (
                            <Error code={404}/>
                    ) : (
                      <>
                        <Card sx={{ maxWidth: 800, minWidth: 800, minHeight: 600}}>
                          <CardActionArea onClick={() => openImageViewer(0)}>
                            <CardMedia className='card-media'
                              sx={{ height: 400,  objectFit: "contain" }}
                              image={data.primaryImage ? data.primaryImage : No_image}
                              title={data.title ? data.title : "No Title"}
                              alt={data.title ? data.title : "No Title"}
                            />
                          </CardActionArea>
                          {/* <div style={{ height: 140 }}>
                            <img src={No_image}/>
                          </div> */}
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                              {data.title ? data.title : "No Title"}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                              {data.artistDisplayName ? data.artistDisplayName : "Artist Unknown"}
                            </Typography>
                            <Typography variant="body" color="text.secondary">
                              {data.department ? data.department: "Unkown Department"}
                              <br/>
                              {data.period ? data.period: "Unkown Period"}: {data.dated ? data.dated: "Unkown Date"}
                              <br/>
                              </Typography>
                              <br/>
                              <Typography variant="body2" color="text.secondary">
                              Medium: {data.medium ? data.medium: "Unkown Medium"}
                              <br/>
                              Dimensions: {data.dimensions ? data.dimensions: "Unkown Dimensions"}
                              <br/>
                              Country: {data.country ? data.country: "Unkown Country"}
                              <br/>
                              Culture: {data.culture ? data.culture: "Unkown Culture"}
                              <br/>
                              Classification: {data.classification ? data.classification: "Unkown Classification"}
                              <br/>
                              Repository: {data.repository ? data.repository: "Unkown Repository"}
                            </Typography>
                          </CardContent>
                        <CardActions>
                          {data.objectURL ? (<Button size="small" onClick={handleButton}>View on Met Website</Button>): (<></>)}
                          <Button size="small" onClick={() => nav('/collection/page/1')}>Back to Collection Page</Button>
                        </CardActions>
                      </Card>
                      {console.log(data.primaryImage)}
                      {isViewerOpen && (
                        <ImageViewer
                          src={data.primaryImage ? [data.primaryImage] : ['/no_image.jpg']}
                          alt={data.title ? data.title : "No Title"}
                          currentIndex={ currentImage }
                          disableScroll={ false }
                          closeOnClickOutside={ true }
                          onClose={ closeImageViewer }
                        />
                      )}
                    </>
                        
                        
                    )
                ): (
                    <>
                    <RotateLoader
                    cssOverride={override}
                    />
                    </>
                )}
            </div>
        )
    }

}


export default Collection_Spec;