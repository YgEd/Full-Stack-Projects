import { useEffect, useState } from 'react';
import Edit from '../componenets/Edit'

export default function Home() {
  const [data, setData] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
      <Edit />
      <p>edit button</p>
      </div>
      
      <h1 className='font-bold'>Landing Site</h1>
      
    </div>
  );
}
