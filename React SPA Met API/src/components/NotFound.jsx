import React from 'react';
import {Link} from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>The page you're looking for does not exist.</p>
      <br></br>
                <br></br>
                <br></br>
                <Link to="/">Link to Landing Page</Link>
    </div>
  );
};

export default NotFound;