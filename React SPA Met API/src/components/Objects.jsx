import {useEffect, useState} from 'react';
import React from 'react';
import axios from 'axios';
import './App.css'
import RotateLoader from 'react-spinners/RotateLoader'
import Media_Card from './Media_Card';
import Grid from '@mui/material/Grid';

function Objects({info, page, setObjectsReady}){

        const override = {
            display: "block",
            margin: "0 auto",
        };

        const [data, setData] = useState([]);
        const [ready, setReady] = useState(false);

        // ids_length holds the amount of ids we will show on the page
        let ids_length = 50

        let starting_id_index = (page-1)*ids_length

        if (info.total < (page*ids_length) + ids_length){
            ids_length = info.total
        }

        let ending_id_index = starting_id_index + ids_length

        // console.log(starting_id_index)
        // console.log(ending_id_index)

        let id_list = []
        for (let i=starting_id_index; i<ending_id_index; i++){
            id_list.push(info.objectIDs[i])
        }

        //Put these into the object department: {"departments":[{"departmentId":1,"displayName":"American Decorative Arts"},{"departmentId":3,"displayName":"Ancient Near Eastern Art"},{"departmentId":4,"displayName":"Arms and Armor"},{"departmentId":5,"displayName":"Arts of Africa, Oceania, and the Americas"},{"departmentId":6,"displayName":"Asian Art"},{"departmentId":7,"displayName":"The Cloisters"},{"departmentId":8,"displayName":"The Costume Institute"},{"departmentId":9,"displayName":"Drawings and Prints"},{"departmentId":10,"displayName":"Egyptian Art"},{"departmentId":11,"displayName":"European Paintings"},{"departmentId":12,"displayName":"European Sculpture and Decorative Arts"},{"departmentId":13,"displayName":"Greek and Roman Art"},{"departmentId":14,"displayName":"Islamic Art"},{"departmentId":15,"displayName":"The Robert Lehman Collection"},{"departmentId":16,"displayName":"The Libraries"},{"departmentId":17,"displayName":"Medieval Art"},{"departmentId":18,"displayName":"Musical Instruments"},{"departmentId":19,"displayName":"Photographs"},{"departmentId":21,"displayName":"Modern Art"}]}
        //let departments = {"1": "American Decorative Arts", "3": "Ancient Near Eastern Art", "4": "Arms and Armor", "5": "Arts of Africa, Oceania, and the Americas", "6": "Asian Art", "7": "The Cloisters", "8": "The Costume Institute", "9": "Drawings and Prints", "10": "Egyptian Art", "11": "European Paintings", "12": "European Sculpture and Decorative Arts", "13": "Greek and Roman Art", "14": "Islamic Art", "15": "The Robert Lehman Collection", "16": "The Libraries", "17": "Medieval Art", "18": "Musical Instruments", "19": "Photographs", "21": "Modern Art"}

        useEffect(() => {
            setReady(false);
            setData([])

            const getData = async () => {
                try {
                    //go through ids in id_list and get there data
                    for (let element of id_list){
                        let {data} = (await axios.get("https://collectionapi.metmuseum.org/public/collection/v1/objects/" + element)) 
                        setData((prevData) => [...prevData, data])
                    }
                    setReady(true);
                    setObjectsReady(true);
                } catch (error) {
                    console.log(error)
                    setReady(true);
                }
                
            }
    
            getData();
            
    
        }, [page])

    return(
        <div>
            {ready ? (
                <div>
                    {console.log(data.length)}
                    <Grid container spacing={2}>
                        {data.map((element) => {
                            return (
                                
                                <div key={element.objectID}>
                                    <div style={{ padding: '10px' }}>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <Media_Card
                                                element={element}
                                            />
                                        </Grid>
                                    </div>
                                </div>
                            );
                        })}
                    </Grid>
                </div>
            ) : (
                <div>
                    <>
                        <br></br>
                        <br></br>
                        <RotateLoader
                        cssOverride={override}
                        />
                        <br></br>
                    </>
                </div>
            )}
        </div>
    )
}

export default Objects;