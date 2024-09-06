export const typeDefs = `#graphql
  type Query {
    comics_list(page: Int!): [Comic],
    get_comic(id: String!): Comic
    comic_amount: Int
  }
  
  type Img {
    path: String,
    extension: String
  }
  
  type SaleDate {
    type: String,
    date: String
  }

  type Price {
    type: String,
    price: Float
  }
  

  type Comic {
    id: String,
    title: String,
    issueNumber: Float,
    description: String,
    isbn: String,
    pageCount: Int,
    thumbnail: Img,
    dates: [SaleDate],
    prices: [Price]
  }`