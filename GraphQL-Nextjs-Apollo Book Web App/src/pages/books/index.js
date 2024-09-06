import { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import RotateLoader from 'react-spinners/RotateLoader'
import { useRouter } from 'next/router';

import Book from '../../componenets/Book'

export default function Books() {
  const [data, setData] = useState(null);
  const [ready, setReady] = useState(false);
  const [total, setTotal] = useState(0)

  const amountPerPage = 20;

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: total,
    from: 0,
    to: amountPerPage,
  })
  
//   const router = useRouter();
//   const { query } = router;
//   let searchTerm = query.page || '1';

//   const [page, setPage] = useState(parseInt(searchTerm));

  const override = {
    display: "block",
    margin: "0 auto",
};

 

  useEffect(() => {
    setReady(false)
    console.log("use effect hit")
    console.log("pagination state = " + JSON.stringify(pagination))
    const getTotal = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `
                    query {
                      getTotal
                    }
                  `,
                })
            })

            const totalCountResult = await response.json();
            console.log("getTotal " + JSON.stringify(totalCountResult))
            let totalCount = totalCountResult.data.getTotal;
            totalCount = Math.ceil(totalCount/amountPerPage)
            console.log("totalCount " + totalCount)
            // setPagination({...pagination, totalPages: totalCount})
            setTotal(totalCount)
        } catch (error) {
            console.error(error)
        }
    }

    const getData = async () => {
      try {

        const response = await fetch('http://localhost:3000/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            query getBooks($from: Int, $to: Int){
              books(from: $from, to: $to) {
                _id
                title
                publicationDate
                author {
                    last_name
                }
              }
            }
          `,
          variables: {
            from: pagination.from+1, 
            to: pagination.to,
          },
        })
      });
        const result = await response.json()
        console.log("from = ", pagination.from)
        console.log("to = ", pagination.to)
        console.log(result.data.books.length)
        setData(result.data.books)
        setPagination({...pagination, count: result.data.books.length})
        setReady(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getTotal()
    getData();
    setReady(true)
  }, [pagination.from, pagination.to, total]);

  const handlePageChange = (event, value) => {
    const from = (value - 1) * amountPerPage;
    const to = from + amountPerPage;
    setPagination({...pagination,
        currentPage: value,
        from: from,
        to: to,})
  };

  return (
    <div>
      <h1 className='font-bold'>Book Collection</h1>
      <br></br>
      <br></br>
      {ready ? (
      <div>
      <Pagination 
        count={total}
        page={pagination.currentPage}
        className="pagination"
        color="secondary"
        variant="outlined"
        siblingCount={2}
        boundaryCount={1}
        onChange={handlePageChange}
        
    />
    <br></br>
    <br></br>
    <Book books={data}/>
    </div>                    
                        
                        
                        ): (
      <div>
         <RotateLoader cssOverride={override}/>
      </div>
      )}
      
    </div>
  );
}
