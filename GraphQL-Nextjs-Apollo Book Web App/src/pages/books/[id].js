




import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Edit from '../../componenets/Edit'

function Book_by_Id(){
    const router = useRouter();
    const { id } = router.query;
    const [element, setData] = useState(null)
    const [ready, setReady] = useState(false)
    const [book_id, setId] = useState(id)
    const [formData, setFormData] = useState({});

    

    console.log(id)
    console.log("is type id string " + (typeof id == "string"))

useEffect(() => {
    setReady(false)
    setId(id)
    console.log("from use Effect book_id = " + id)
    const getData = async () => {
        if (id){
        try {
            const response = await fetch('http://localhost:3000/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `
                    query getBook($_id: String!){
                        getBookById(_id: $_id){
                            _id
                            title
                            genres
                            publicationDate
                            publisher
                            summary
                            isbn
                            language
                            pageCount
                            price
                            format
                            author{
                                first_name
                                last_name
                            }
                        }
                    }
                  `,
                  variables: {
                    _id: id
                  },
                })
            })
            const result = await response.json()
            console.log(JSON.stringify(result))
            setData(result.data?.getBookById)
            setFormData(element)
            console.log(element)
            setReady(true)
        } catch (error) {
            console.log(error)
        }
    }
    }   
    getData()
},[id])

    
    console.log(element)
    const handleChange = (e) => {
      console.log(formData)
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic error checking to ensure none of the required fields are empty
        const requiredFields = ['title', 'genres', 'authorId'];
        const hasEmptyFields = requiredFields.some(field => !formData[field]);
      
        console.log(typeof formData.genres)
        if (typeof formData.genres =="string"){
            // Convert genres from a string to an array
            const updatedGenres = formData.genres.split(',').map(str => str.trim());
            setFormData(prevData => ({ ...prevData, genres: updatedGenres }));

        }

        if (typeof formData.format =="string"){
             // Convert format from a string to an array
             const updatedFormat = formData.format.split(',').map(str => str.trim());
             setFormData(prevData => ({ ...prevData, format: updatedFormat }));
        }
      
        if (hasEmptyFields) {
          alert('Please fill in all required fields.');
          return;
        }
      
        // Assuming onSubmit is a function passed as a prop to handle the form submission
        console.log(formData);
      };

    

return(

<div>
    

    {(ready && element && formData) && (
        <div className='flex flex-col h-screen items-center justify-center'>
        <Card key={element.id} sx={{ maxWidth: 300, minWidth: 300 }}>
    
            <Typography gutterBottom variant="h5" component="div">
                {element.title ? element.title : "No Title"}
            </Typography>
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
        <br></br>
        <div className='btn hover:text-blue-500"'>

        <Link href="/books">
            Back to Book Collection
        </Link>
        </div>

        <div className="container mx-auto mt-8">
        <Edit />
      
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title:
          <input
            type="text"
            name="title"
            value={formData?.title}
            onChange={handleChange}
            className="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Genres:
          <input
            type="text"
            name="genres"
            value={formData?.genres.toString()}
            onChange={handleChange}
            className="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Publication Date:
          <input
            type="text"
            name="publicationDate"
            value={formData?.publicationDate}
            onChange={handleChange}
            className="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Publisher:
          <input
            type="text"
            name="publisher"
            value={formData?.publisher}
            onChange={handleChange}
            className="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Summary:
          <textarea
            name="summary"
            value={formData?.summary}
            onChange={handleChange}
            className="form-textarea mt-1 block w-full border rounded-md shadow-sm"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          ISBN:
          <input
            type="text"
            name="isbn"
            value={formData?.isbn}
            onChange={handleChange}
            className="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Language:
          <input
            type="text"
            name="language"
            value={formData?.language}
            onChange={handleChange}
            className="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Page Count:
          <input
            type="number"
            name="pageCount"
            value={formData?.pageCount}
            onChange={handleChange}
            className="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Price:
          <input
            type="number"
            name="price"
            value={formData?.price}
            onChange={handleChange}
            className="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Format:
          <input
            type="text"
            name="format"
            value={formData?.format.toString()}
            onChange={handleChange}
            className="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Author ID:
          <input
            type="text"
            name="authorId"
            value={formData?.authorId}
            onChange={handleChange}
            className="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </div>
    </form>
    </div>
    
      </div>
      
      )}
</div>

)

}


export default Book_by_Id