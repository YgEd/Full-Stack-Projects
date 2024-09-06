// queries.js

import { gql } from '@apollo/client';

const GET_COMICS = gql`
  query GetComics($page: Int!) {
    comics_list (page: $page) {
      id
      title
      issueNumber
      description
      isbn
      pageCount
      thumbnail {
        path
        extension
      }
      dates {
        type
        date
      }
      prices {
        type
        price
      }
    }
  }
`;

const GET_COMIC = gql`
  query GetComic($id: String!) {
    get_comic(id: $id) {
      id
      title
      issueNumber
      description
      isbn
      pageCount
      thumbnail {
        path
        extension
      }
      dates {
        type
        date
      }
      prices {
        type
        price
      }
    }
  }
`;

const GET_AMOUNT = gql`
  query {
    comic_amount
  }`;

export { GET_COMICS, GET_COMIC, GET_AMOUNT };
