import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag'
import { createClient } from 'redis'
const client = createClient();
await client.connect().then(() => {console.log("connected to redis")})
import {GraphQLError} from 'graphql';
import * as help from '../../helpers.js';
import {v4 as uuid} from 'uuid'; //for generating _id's

import {
  books as bookCollection,
  authors as authorCollection,
} from '../../../config/mongoCollections.mjs';





const typeDefs = gql`
type Query {
  getTotal: Int,
  totalAuthors: Int,
  authors(from: Int, to: Int): [Author],
  books(from: Int, to: Int): [Book],
  getAuthorById(_id: String!): Author,
  getBookById(_id: String!): Book,
  booksByGenre(genre: String!): [Book],
  booksByPriceRange(min: Float!, max: Float!): [Book],
  searchAuthorsByName(searchTerm: String!): [Author]
}


type Book {
  _id: String,
  title: String,
  genres: [String],
  publicationDate: String,
  publisher: String,
  summary: String,
  isbn: String,
  language: String,
  pageCount: Int,
  price: Float,
  format: [String],
  author: Author #We will need a resolver for this one!
}

type Author {
  _id: String,
  first_name: String,
  last_name: String,
  date_of_birth: String,
  hometownCity: String,
  hometownState: String,
  numOfBooks: Int #We will need a resolver for this one! This is a computed field that will count the number of books the author has written (see lecture code for numOfEmployees on the employer type)
  books(limit: Int): [Book]  #We will need a resolver for this one! the limit param is optional, if it's supplied, you will limit the results to the number supplied, if no limit parameter is supplied, then you return all the books for that author
}

type Mutation {
  addAuthor(first_name: String!, 
      last_name: String!, 
      date_of_birth: String!, 
      hometownCity: String!, 
      hometownState: String!
  ): Author

  editAuthor(_id: String!, 
      first_name: String, 
      last_name: String, 
      date_of_birth: String, 
      hometownCity: String, 
      hometownState: String
  ): Author

  removeAuthor(_id: String!): Author

  addBook(title: String!, 
      genres: [String!]!, 
      publicationDate: String!, 
      publisher: String!, 
      summary: String!, 
      isbn: String!, 
      language: String!, 
      pageCount: Int!, 
      price: Float!, 
      format: [String!]!, 
      authorId: String!
  ): Book

  editBook(_id: String!, 
      title: String, 
      genres: [String], 
      publicationDate: String, 
      publisher: String, 
      summary: String, 
      isbn: String, 
      language: String, 
      pageCount: Int, 
      price: Float, 
      format: [String], 
      authorId: String
  ): Book

  removeBook(_id: String!): Book
}
`;

const resolvers = {

  Author: {
      numOfBooks: async (parentValue) => {
          //console.log(`parent value in author: ${JSON.stringify(parentValue)}`)
          const books = await bookCollection();
          const numOfBooks = await books.countDocuments({authorId: parentValue._id});
          return numOfBooks;
      },
      books: async (parentValue, args) => {
          //console.log(`parent value in author: ${JSON.stringify(parentValue)}`)
          const books = await bookCollection();
          if (args.limit != undefined) {
              //console.log("limit was defined")z
              if (!help.isNum(args.limit) || args.limit <= 0){
                  //console.log("limit was invalid")
                  throw new GraphQLError(`Error: invalid limit`, {
                      extensions: {code: 'BAD_USER_INPUT'}
                  });
              } 
  
              let retbooks = await books.find({authorId: parentValue._id}).limit(args.limit).toArray()
              return retbooks
          } else {
              let retbooks = await books.find({authorId: parentValue._id}).toArray()
              return retbooks
          }
      }
  
  },
  
  Book: {
      author: async (parentValue) => {
          //console.log(`author id in Book: ${parentValue.authorId}`)
          const authors = await authorCollection();
          let target_auth = await authors.findOne({_id: parentValue.authorId});
          return target_auth
      }
  },
  
  Query: {

      getTotal: async() => {
        try {
          const books = await bookCollection();
          const total = await books.countDocuments();
          return total
        } catch (error) {
          console.error(error)
        }
      },

      totalAuthors: async() => {
        try {
          const authors = await authorCollection();
          const total = await authors.countDocuments();
          return total
        } catch (error) {
          console.error(error)
        }
      },
      authors: async(obj, args, context, info) => {
          const authors = await authorCollection();
          let limit = null;
          //check if limit argument was passed in
          try {
              if (info.fieldNodes[0].selectionSet.selections[7].arguments[0].name.value){
                  limit = info.fieldNodes[0].selectionSet.selections[7].arguments[0].value.value
                  if (limit <= 0 || !help.isNum(limit)){
                      throw new GraphQLError(`Error: invalid limit`, {
                          extensions: {code: 'BAD_USER_INPUT'}
                      });
                  }
                  
              }   
          } catch (error) {
              console.log("no limit parameter")
          }
          
  
          if (args.from && args.to){
              let from = args.from
              let to = args.to
              let limit = to - from;
              let target = await client.get("allauthors/" + from)
              if (target){
                  console.log("target was in cache")
                  target = JSON.parse(target)
                  return target
              } else{
                  console.log("target was not in cache, fetching from db")
                  const allauthors = await authors.find({}).skip(from).limit(limit).toArray();
                  if (!allauthors) throw new GraphQLError(`Internal Server Error: no Authors`, {
                      extensions: {code: 'INTERNAL_SERVER_ERROR'}
                  });
                  await client.set("allauthors/" + from, JSON.stringify(allauthors))
                  await client.expire("allauthors/" + from, 3600)
                  return allauthors;
              }
                  
          }else {
          let target = await client.get("allauthors/")
          if (target){
              console.log("target was in cache")
              target = JSON.parse(target)
              return target
  
          } else{
              console.log("target was not in cache, fetching from db")
              const allAuthors = await authors.find({}).toArray();
              if (!allAuthors) throw new GraphQLError(`Internal Server Error: no Authors`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
              });
  
              await client.set("allauthors/", JSON.stringify(allAuthors))
              await client.expire("allauthors/", 3600)
              return allAuthors;
             
          }
      }
          
      },
  
      books: async(obj, args, context, info) => {
          const books = await bookCollection();
          let from;
          let to;
          console.log("from books " + JSON.stringify(args))
          if (args.from && args.to){
            from = args.from
            to = args.to
            let limit = to - from;

          let target = await client.get("allbooks/" + from)
          if (target){
              console.log("target was in cache")
              target = JSON.parse(target)
              return target
          }else{
              const allBooks = await books.find({}).skip(from).limit(limit).toArray();
              if (!allBooks) throw new GraphQLError(`Internal Server Error: no Books`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
              });
              await client.set("allbooks/" + from, JSON.stringify(allBooks))
              await client.expire("allbooks/" + from, 3600)
              return allBooks;
          }
          }
        
  
          let target = await client.get("allbooks/")
          if (target){
              console.log("target was in cache")
              target = JSON.parse(target)
              return target
          }else{
              const allBooks = await books.find({}).toArray();
              if (!allBooks) throw new GraphQLError(`Internal Server Error: no Books`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
              });
              await client.set("allbooks/", JSON.stringify(allBooks))
              await client.expire("allbooks/", 3600)
              return allBooks;
          }
        
      },
  
      getAuthorById: async(_, args) => {
          const authors = await authorCollection();
  
          args._id = help.strPrep(args._id);
          if (!args._id) throw new GraphQLError(`Error: invalid id`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
          let target = await client.get("author/" + args._id)
          if (target){
              console.log("target was in cache")
              target = JSON.parse(target)
              return target
          }else{
              const author = await authors.findOne({_id: args._id});
              if (!author) throw new GraphQLError(`Error: no Author with id ${args._id}`, {
                  extensions: {code: 'NOT_FOUND'}
              });
              await client.set("author/" + args._id, JSON.stringify(author))
              await client.expire("author/" + args._id, 3600)
              return author;
          }
      },
  
      getBookById: async(_, args) => {
          const books = await bookCollection();
          
          args._id = help.strPrep(args._id);
          if (!args._id) throw new GraphQLError(`Error: invalid id`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
          let target = await client.get("book/" + args._id)
          if (target){
              console.log("target was in cache")
              target = JSON.parse(target)
              return target
          }
          else{
              const book = await books.findOne({_id: args._id});
              if (!book) throw new GraphQLError(`Error: no Book with id ${args._id}`, {
                  extensions: {code: 'NOT_FOUND'}
              });
              await client.set("book/" + args._id, JSON.stringify(book))
              await client.expire("book/" + args._id, 3600)
              return book;
          }
      },
  
      //genres are in an array, so we need to use $in
      booksByGenre: async(_, args) => {
          const books = await bookCollection();
          if (!args.genre || typeof(args.genre) !== "string") throw new GraphQLError(`Error: invalid genre`, {
              extensions: {code: 'BAD_USER_INPUT'}
              });
          let gen = args.genre.trim()
          console.log(`genre: ${gen}`)
  
          let target = await client.get("genre/" + gen.toLowerCase())
          
          if (target){
              console.log("target was in cache")
              target = JSON.parse(target)
              return target
          }
          else {
              console.log("target was no5vin cache, fetching from db")
              //get books that have genre in genres array (case insensitive)
              const booksByGenre = await books.find({genres: {$in: [new RegExp('^' + gen + '$', "i")]}}).toArray();
              if (!booksByGenre) throw new GraphQLError(`Error: no Books with genre ${args.genre}`, {
                  extensions: {code: 'NOT_FOUND'}
              });
  
              await client.set("genre/" + gen.toLowerCase(), JSON.stringify(booksByGenre))
              await client.expire("genre/" + gen.toLowerCase(), 3600)
              return booksByGenre;
          }
      },
  
      booksByPriceRange: async(_, args) => {
          const books = await bookCollection();
          if (typeof(args.min) !== "number" || args.min < 0 || typeof(args.max) !== "number" || args.max < 0){ 
              console.log("no")
              throw new GraphQLError(`Error: invalid price range`, {
              extensions: {code: 'BAD_USER_INPUT'}
            });
          }
  
          if (args.min >= args.max) {
               throw new GraphQLError(`Error: invalid price range`, {
              extensions: {code: 'BAD_USER_INPUT'}
            });
          }
  
          let target = await client.get("price/" + args.min + "/" + args.max)
  
          if (target){
              console.log("target was in cache")
              target = JSON.parse(target)
              return target
          }
          else{
              const booksByPriceRange = await books.find({price: {$gte: args.min, $lte: args.max}}).toArray();
              if (!booksByPriceRange) throw new GraphQLError(`Error: no Books with price between ${args.min} and ${args.max}`, {
                  extensions: {code: 'NOT_FOUND'}
              });
  
              await client.set("price/" + args.min + "/" + args.max, JSON.stringify(booksByPriceRange))
              await client.expire("price/" + args.min + "/" + args.max, 3600)
              return booksByPriceRange;
          }
      },
  
      searchAuthorsByName: async(_, args) => {
          const authors = await authorCollection();
          args.searchTerm = help.strPrep(args.searchTerm);
          if (!args.searchTerm) throw new GraphQLError(`Error: invalid search term`, {
              extensions: {code: 'BAD_USER_INPUT'}
              });
  
  
          let target = await client.get("search/" + args.searchTerm.toLowerCase())
          if (target){
              console.log("target was in cache")
              target = JSON.parse(target)
              return target
          }
          else {
              console.log("target was not in cache, fetching from db")
          const searchAuthorsByName = await authors.find({$or: [{first_name: new RegExp(args.searchTerm, "i")}, {last_name: new RegExp(args.searchTerm, "i")}]}).toArray();
          if (searchAuthorsByName.length == 0) throw new GraphQLError(`Error: no Authors with name ${args.searchTerm}`, {
              extensions: {code: 'NOT_FOUND'}
            });
  
              await client.set("search/" + args.searchTerm.toLowerCase(), JSON.stringify(searchAuthorsByName))
              await client.expire("search/" + args.searchTerm.toLowerCase(), 3600)
              return searchAuthorsByName;
          }
      }
  
  
  
  },
  
  Mutation: {
      addAuthor: async(_, args) => {
          const authors = await authorCollection();
          // console.log(`args: ${JSON.stringify(args)}`)
          // console.log(`args.first_name: ${help.strPrep(args.first_name)}`)
          //input validate
          let first_name = args.first_name.trim()
          let last_name = args.last_name.trim()
          let date = help.strPrep(args.date_of_birth);
          let hometownCity = help.strPrep(args.hometownCity);
          let hometownState = help.strPrep(args.hometownState);
  
          if (!hometownCity || !hometownState){
              throw new GraphQLError(`Error: invalid input`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          }
  
          if (!help.isAlpha(first_name) || !help.isAlpha(last_name)) throw new GraphQLError(`Error: invalid input`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
          
          if (!help.isValidDate(date)){
              throw new GraphQLError(`Error: invalid date`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          }
  
          const states = [
              "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
              "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
              "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
          ]
  
          if (!states.includes(hometownState.toUpperCase())) throw new GraphQLError(`Error: invalid state`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
          
          
          const newAuthor = {
              _id: uuid(),
              first_name,
              last_name,
              date_of_birth: date,
              hometownCity,
              hometownState: hometownState.toUpperCase(),
              books: []
          };
  
          const insertInfo = await authors.insertOne(newAuthor);
          if (insertInfo.insertedCount === 0) throw new GraphQLError(`Internal Server Error: could not add Author`, {
              extensions: {code: 'BAD_USER_INPUT'}
            });
          const author = await authors.findOne({_id: insertInfo.insertedId});
  
          await client.set("author/" + author._id, JSON.stringify(author))
          await client.expire("author/" + author._id, 3600)
  
          //check if authors in the cache
          let target = await client.get("allauthors/")
          if (target){
              const allAuthors = await authors.find({}).toArray();
              if (!allAuthors) throw new GraphQLError(`Internal Server Error: no Authors`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
              });
  
              await client.set("allauthors/", JSON.stringify(allAuthors))
              await client.expire("allauthors/", 3600)
          }
  
          return author;
      },
  
      editAuthor: async(_, args) => {
          const authors = await authorCollection();
          //check if author exists
            //check if author exists
          let auth_id = help.strPrep(args._id);
          if (!(auth_id.trim())) throw new GraphQLError(`Error: invalid id`, { extensions: {code: 'BAD_USER_INPUT'}});
          const author = await authors.findOne({_id: auth_id});
            if (!author) throw new GraphQLError(`Error: no Author with id ${auth_id}`, {
                extensions: {code: 'NOT_FOUND'}
            });
  
          let first_name = author.first_name;
          let last_name = author.last_name;
          let date = author.date_of_birth;
          let hometownCity = author.hometownCity;
          let hometownState = author.hometownState;
  
          if (!auth_id) throw new GraphQLError(`Error: invalid id`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
  
          //input validate
          if (args.first_name){
              //if first_name is different clear search/ cache
              if (args.first_name.trim().toLowerCase() != author.first_name.trim().toLowerCase()){
                  if (await client.get("search/" + author.first_name.toLowerCase().trim())){
                      await client.del("search/" + author.first_name.toLowerCase().trim())
                  }
              }
              first_name = args.first_name.trim()
              if (!first_name || !help.isAlpha(first_name)) throw new GraphQLError(`Error: invalid input`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          }
          if (args.last_name){
              //if last_name is different clear search/ cache
              if (args.last_name.trim().toLowerCase() != author.last_name.trim().toLowerCase()){
                  if (await client.get("search/" + author.last_name.toLowerCase().trim())){
                      await client.del("search/" + author.last_name.toLowerCase().trim())
                  }
              }
              last_name = args.last_name.trim()
              if (!last_name || !help.isAlpha(last_name)) throw new GraphQLError(`Error: invalid input`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          }
  
          if (args.date_of_birth){
              date = help.strPrep(args.date_of_birth);
              if (!date || !help.isValidDate(date)){
                  throw new GraphQLError(`Error: invalid date`, {
                      extensions: {code: 'BAD_USER_INPUT'}
                  });
              }
          }
          if (args.hometownCity){
              hometownCity = help.strPrep(args.hometownCity);
              if (!hometownCity){
                  throw new GraphQLError(`Error: invalid input`, {
                      extensions: {code: 'BAD_USER_INPUT'}
                  });
              }
  
          }
          if (args.hometownState){
              hometownState = help.strPrep(args.hometownState).toUpperCase();
  
              const states = [
                  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
                  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
                  "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
              ]
  
              if (!states.includes(hometownState.toUpperCase())) throw new GraphQLError(`Error: invalid state`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          }
  
          
          //create edit object
          const editObj = {
              first_name,
              last_name,
              date_of_birth: date,
              hometownCity,
              hometownState: hometownState.toUpperCase()
          };
          
  
          const updateInfo = await authors.updateOne({_id: auth_id}, {$set: editObj});
  
          const updatedAuthor = await authors.findOne({_id: auth_id});
  
          await client.set("author/" + updatedAuthor._id, JSON.stringify(updatedAuthor))
          await client.expire("author/" + updatedAuthor._id, 3600)
  
          //check if authors in the cache
          let target = await client.get("allauthors/")
          if (target){
              const allAuthors = await authors.find({}).toArray();
              if (!allAuthors) throw new GraphQLError(`Internal Server Error: no Authors`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
              });
  
              await client.set("allauthors/", JSON.stringify(allAuthors))
              await client.expire("allauthors/", 3600)
          }
  
          if (await client.get("search/" + author.first_name.toLowerCase())){
              await client.set("search/" + author.first_name.toLowerCase(), JSON.stringify(updatedAuthor))
              await client.expire("search/" + author.first_name.toLowerCase(), 3600)
          }
  
          if (await client.get("search/" + author.last_name.toLowerCase())){
              await client.set("search/" + author.last_name.toLowerCase(),JSON.stringify(author.last_name.toLowerCase()))
              await client.expire("search/" + author.last_name.toLowerCase(), 3600)
          }
  
          return updatedAuthor;
      },
  
      removeAuthor: async(_, args) => {
          const authors = await authorCollection();
          const books = await bookCollection();
  
          let auth_id = help.strPrep(args._id);
          if (!auth_id) throw new GraphQLError(`Error: invalid id`, { extensions: {code: 'BAD_USER_INPUT'}});
  
          //check if author exiss
          const author = await authors.findOne({_id: auth_id});
          if (!author) throw new GraphQLError(`Error: no Author with id ${auth_id}`, {
              extensions: {code: 'NOT_FOUND'}
          });
  
          let bookcollection = author.books;
  
          //check if books are in cache
          for (let i=0 ;i < bookcollection.length; i++){
              let target = await client.get("book/" + bookcollection[i])
              if (target){
                  console.log("target was in cache")
                  await client.del("book/" + bookcollection[i])
              }
          }
  
          //remove all books with authorId
          const removeBooks = await books.deleteMany({authorId: auth_id});
  
          //remove author
          const removeInfo = await authors.deleteOne({_id: auth_id});
          if (removeInfo.deletedCount === 0) throw new GraphQLError(`Error: no Author with id ${auth_id}`, {
              extensions: {code: 'NOT_FOUND'}
            });
  
          await client.del("author/" + auth_id)
  
          //check if authors in the cache
          let target = await client.get("allauthors/")
          if (target){
              const allAuthors = await authors.find({}).toArray();
              if (!allAuthors) throw new GraphQLError(`Internal Server Error: no Authors`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
              });
  
              await client.set("allauthors/", JSON.stringify(allAuthors))
              await client.expire("allauthors/", 3600)
          }
  
          if (await client.get("search/" + author.first_name.toLowerCase())){
              await client.del("search/" + author.first_name.toLowerCase())
          }
  
          if (await client.get("search/" + author.last_name.toLowerCase())){
              await client.del("search/" + author.last_name.toLowerCase())
          }
  
          if (await client.get("allbooks/")){
              await client.del("allbooks/")
          }
          author.books = bookcollection;
  
          return author;
  
      },
  
      addBook: async(_, args) => {
          const books = await bookCollection();
          const authors = await authorCollection();
  
          //input validate
          let title = help.strPrep(args.title);
          let genres = args.genres;
          let publicationDate = help.strPrep(args.publicationDate);
          let publisher = help.strPrep(args.publisher);
          let summary = help.strPrep(args.summary);
          let isbn = help.strPrep(args.isbn);
          let language = help.strPrep(args.language);
          let pageCount = args.pageCount;
          let price = args.price;
          let format = args.format;
          let authorId = help.strPrep(args.authorId);
  
          if (!title || !genres || !publicationDate || !publisher || !summary || !isbn || !language || !pageCount || !price || !format || !authorId) throw new GraphQLError(`Error: invalid input`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
  
          console.log(`test if genres is an array: ${Array.isArray(genres)}`)
          if (!genres || !Array.isArray(genres) || !help.isValidStrs(genres)) throw new GraphQLError(`Error: invalid input`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
  
          if (!help.isValidDate(publicationDate)) throw new GraphQLError(`Error: invalid date`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
  
          if (!help.isValid_isbn(isbn)) throw new GraphQLError(`Error: invalid isbn`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
  
          if (!help.isAlpha(language)) throw new GraphQLError(`Error: invalid language`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
  
          if (!help.isNum(pageCount) || pageCount < 1) throw new GraphQLError(`Error: invalid pageCount`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
  
          if (typeof(price) !== "number" || price <= 0) throw new GraphQLError(`Error: invalid price`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
  
          if (!format || !Array.isArray(format) || !help.isValidStrs(format)) throw new GraphQLError(`Error: invalid format`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
  
          //check if author exists
          let author = await authors.findOne({_id: authorId});
          if (!author) throw new GraphQLError(`Error: no Author with id ${authorId}`, {
              extensions: {code: 'NOT_FOUND'}
          });
  
          //test if books publish date is after authors birthdate
          let authDate = author.date_of_birth.split("/")
          let bookDate = publicationDate.split("/")
          if (bookDate[2] < authDate[2]){
              throw new GraphQLError(`Error: date must be after author's DOB`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          } else if (bookDate[2] == authDate[2]){
              if (bookDate[0] < authDate[0]){
                  throw new GraphQLError(`Error: date must be after author's DOB`, {
                      extensions: {code: 'BAD_USER_INPUT'}
                  });
              } else if (bookDate[0] == authDate[0]){
                  if (bookDate[1] <= authDate[1]){
                      throw new GraphQLError(`Error: date must be after author's DOB`, {
                          extensions: {code: 'BAD_USER_INPUT'}
                      });
                  }
              }
          }
  
          const newBook = {
              _id: uuid(),
              title,
              genres,
              publicationDate,
              publisher,
              summary,
              isbn,
              language,
              pageCount,
              price,
              format,
              authorId
          };
  
          const bookInfo = await books.insertOne(newBook);
          if (bookInfo.insertedCount === 0) throw new GraphQLError(`Internal Server Error: could not add Book`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
  
          //add book to authors books array
          const insertInfo = await authors.updateOne({_id: authorId}, {$push: {books: bookInfo.insertedId}});
          if (insertInfo.modifiedCount === 0) throw new GraphQLError(`Internal Server Error: could not add Book to Author`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
  
          author = await authors.findOne({_id: authorId});
  
          const book = await books.findOne({_id: bookInfo.insertedId});
          await client.set("book/" + book._id, JSON.stringify(book))
          await client.expire("book/" + book._id, 3600)
  
          //update author cache
          await client.set("author/" + authorId, JSON.stringify(author))
          await client.expire("author/" + authorId, 3600)
  
          //check if authors in the cache
          let target = await client.get("allauthors/")
          if (target){
              const allAuthors = await authors.find({}).toArray();
              if (!allAuthors) throw new GraphQLError(`Internal Server Error: no Authors`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
              });
  
              await client.set("allauthors/", JSON.stringify(allAuthors))
              await client.expire("allauthors/", 3600)
          }
  
          return book;
  
      },
  
      editBook: async(_, args) => {
  
          const books = await bookCollection();
          const authors = await authorCollection();
  
          
  
          let book_id = help.strPrep(args._id)
  
          if (!book_id) throw new GraphQLError(`Error: invalid id`, {
              extensions: {code: 'BAD_USER_INPUT'}
          });
  
          //check if book exists
          const book = await books.findOne({_id: book_id})
          if (!book) throw new GraphQLError(`Error: no Book with id ${book_id}`, {
              extensions: {code: 'NOT_FOUND'}
          });
  
          let title = book.title;
          let genres = book.genres;
          let publicationDate = book.publicationDate;
          let publisher = book.publisher;
          let summary = book.summary;
          let isbn = book.isbn;
          let language = book.language;
          let pageCount = book.pageCount;
          let price = book.price;
          let format = book.format;
          let authorId = book.authorId;
          let notdiff = 0;
          let parms = 0;
  
          //input validate
          if (args.title){
              parms++;
              if (title.toLowerCase().trim() === args.title.toLowerCase().trim() ){
                  notdiff++;
              }
              title = help.strPrep(args.title);
              if (!title) throw new GraphQLError(`Error: invalid input`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          }
          if (args.genres){
              parms++;
              console.log(`genres is ${JSON.stringify(genres)}`)
              console.log(`args.genres is ${JSON.stringify(args.genres)}`)
              if (JSON.stringify(genres).toLowerCase().trim() === JSON.stringify(args.genres).toLowerCase().trim() ){
                  notdiff++;
              }
              genres = args.genres;
              if (!genres || !Array.isArray(genres) || !help.isValidStrs(genres)) throw new GraphQLError(`Error: invalid input`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          }
          if (args.publicationDate){
              parms++;
              if (publicationDate.toLowerCase().trim() === args.publicationDate.toLowerCase().trim() ){
                  notdiff++;
              }
              publicationDate = help.strPrep(args.publicationDate);
              if (!publicationDate || !help.isValidDate(publicationDate)){
                  throw new GraphQLError(`Error: invalid date`, {
                      extensions: {code: 'BAD_USER_INPUT'}
                  });
              }
          }
          if (args.publisher){
              parms++;
              if (publisher.toLowerCase().trim() === args.publisher.toLowerCase().trim() ){
                  notdiff++;
              }
              publisher = help.strPrep(args.publisher);
              if (!publisher){
                  throw new GraphQLError(`Error: invalid input`, {
                      extensions: {code: 'BAD_USER_INPUT'}
                  });
              }
  
          }
          if (args.summary){
              parms++
              if (summary.toLowerCase().trim() === args.summary.toLowerCase().trim() ){
                  notdiff++;
              }
              summary = help.strPrep(args.summary);
              if (!summary){
                  throw new GraphQLError(`Error: invalid input`, {
                      extensions: {code: 'BAD_USER_INPUT'}
                  });
              }
          }
          if (args.isbn){
              parms++
              if (isbn.toLowerCase().trim() === args.isbn.toLowerCase().trim() ){
                  notdiff++;
              }
              isbn = help.strPrep(args.isbn);
              if (!isbn || !help.isValid_isbn(isbn)) throw new GraphQLError(`Error: invalid input`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          }
          if (args.language){
              parms++
              if (language.toLowerCase().trim() === args.language.toLowerCase().trim() ){
                  notdiff++;
              }
              language = help.strPrep(args.language);
              if (!language || !help.isAlpha(language)) throw new GraphQLError(`Error: invalid input`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          }
          if (args.pageCount){
              parms++
              if (pageCount === args.pageCount ){
                  notdiff++;
              }
              pageCount = args.pageCount;
              if (!help.isNum(pageCount) || pageCount < 1) throw new GraphQLError(`Error: invalid pageCount`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
  
          }
  
          if (args.price){
              parms++
              if (price === args.price ){
                  notdiff++;
              }
              price = args.price;
              if (!price || typeof(price) !== "number" || price <= 0) throw new GraphQLError('Error: invalid price', {
                  extensions: {code: 'BAD_USER_INPUT'}
              })
          }
  
          if (args.format){
              parms++
              if (JSON.stringify(format).toLowerCase().trim() === JSON.stringify(args.format).toLowerCase().trim() ){
                  notdiff++;
              }
              format = args.format;
              if (!format || !Array.isArray(format) || !help.isValidStrs(format)) throw new GraphQLError(`Error: invalid format`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          }
  
          
          //get old author
          let author_target = await authors.findOne({_id: book.authorId});
          if (args.authorId){
              parms++
              if (authorId.toLowerCase().trim() === args.authorId.toLowerCase().trim() ){
                  notdiff++;
              }
              console.log("args.authorId is " + args.authorId)
              authorId = help.strPrep(args.authorId);
              //check if author exists
              author_target = await authors.findOne({_id: authorId});
              if (!author_target){
                  throw new GraphQLError(`Error: invalid input`, {
                      extensions: {code: 'BAD_USER_INPUT'}
                  });
              }
          }
  
          console.log(`parms is ${parms}`)
          console.log(`notdiff is ${notdiff}`)
          if (parms <= notdiff){
              throw new GraphQLError(`Error: no new edits`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          }
  
          //create edit object
          let editObj = {
              title,
              genres,
              publicationDate,
              publisher,
              summary,
              isbn,
              language,
              pageCount,
              price,
              format,
              authorId
          };
  
          //check if book's publish date is after authors birthdate
          let authDate = author_target.date_of_birth.split("/")
          let bookDate = publicationDate.split("/")
          if (bookDate[2] < authDate[2]){
              throw new GraphQLError(`Error: date must be after author's DOB`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          } else if (bookDate[2] == authDate[2]){
              if (bookDate[0] < authDate[0]){
                  throw new GraphQLError(`Error: date must be after author's DOB`, {
                      extensions: {code: 'BAD_USER_INPUT'}
                  });
              } else if (bookDate[0] == authDate[0]){
                  if (bookDate[1] <= authDate[1]){
                      throw new GraphQLError(`Error: date must be after author's DOB`, {
                          extensions: {code: 'BAD_USER_INPUT'}
                      });
                  }
              }
          }
  
  
          //if new author is different than the old author update their book arrays
          let old_auth = await authors.findOne({_id: book.authorId});
          console.log(`old_auth is ${old_auth._id}`)
          console.log(`author_target is ${author_target._id}`)
          if (old_auth._id != author_target._id){
              console.log("new author is different")
              //new author is different
              
              //remove book from old authors books
              old_auth.books = old_auth.books.filter((id) => id != book_id);
              //add book to new authors books
              author_target.books.push(book_id);
  
              //update authors
              const updateold = await authors.updateOne({_id: old_auth._id}, {$pull: {books: book_id}});
              if (updateold.modifiedCount === 0) throw new GraphQLError(`Internal Server Error: could not edit Book, no new edits`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
              });
  
              const updatenew = await authors.updateOne({_id: author_target._id}, {$push: {books: book_id}});
              if (updatenew.modifiedCount === 0) throw new GraphQLError(`Internal Server Error: could not edit Book, no new edits`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
              });
  
              old_auth = await authors.findOne({_id: old_auth._id});
              author_target = await authors.findOne({_id: author_target._id});
  
              //update old and new author caches
              if (await client.get("author/" + old_auth._id)){
                  await client.set("author/" + old_auth._id, JSON.stringify(old_auth))
                  await client.expire("author/" + old_auth._id, 3600)
              }
  
              if (await client.get("author/" + author_target._id)){
                  await client.set("author/" + author_target._id, JSON.stringify(author_target))
                  await client.expire("author/" + author_target._id, 3600)
              }
  
              if (await client.get("search/" + old_auth.first_name.toLowerCase())){
                  await client.set("search/" + old_auth.first_name.toLowerCase(), JSON.stringify(searchAuthorsByName))
                  await client.expire("search/" + old_auth.first_name.toLowerCase(), 3600)
              }
  
              if (await client.get("search/" + author_target.first_name.toLowerCase())){
                  await client.set("search/" + author_target.first_name.toLowerCase(), JSON.stringify(searchAuthorsByName))
                  await client.expire("search/" + author_target.first_name.toLowerCase(), 3600)
              }
  
              if (await client.get("search/" + old_auth.last_name.toLowerCase())){
                  await client.set("search/" + old_auth.last_name.toLowerCase(), JSON.stringify(searchAuthorsByName))
                  await client.expire("search/" + old_auth.last_name.toLowerCase(), 3600)
              }
  
              if (await client.get("search/" + author_target.last_name.toLowerCase())){
                  await client.set("search/" + author_target.last_name.toLowerCase(), JSON.stringify(searchAuthorsByName))
                  await client.expire("search/" + author_target.last_name.toLowerCase(), 3600)
              }
                        
  
          }
  
          //update book
          const updateInfo = await books.updateOne({_id: book_id}, {$set: editObj});
          if (updateInfo.modifiedCount === 0) throw new GraphQLError(`Internal Server Error: could not edit Book, no new edits`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
  
          const updatedbook = await books.findOne({_id: book_id});
  
          if (await client.get("allbooks/")){
              await client.del("allbooks/")
          }
          await client.set("book/" + updatedbook._id, JSON.stringify(updatedbook))
          await client.expire("book/" + updatedbook._id, 3600)
          return updatedbook;
  
      },
  
      removeBook: async(_, args) => {
          const books = await bookCollection();
          const authors = await authorCollection();
  
          let book_id = help.strPrep(args._id)
          if (!book_id){
              throw new GraphQLError(`Error: invalid id`, {
                  extensions: {code: 'BAD_USER_INPUT'}
              });
          }
  
          //get target book
          const book = await books.findOne({_id: book_id})
          if (!book) throw new GraphQLError(`Error: no Book with id ${book_id}`, {
              extensions: {code: 'NOT_FOUND'}
          });
  
          //remove from authors books array
          console.log(JSON.stringify(book))
          const updateInfo = await authors.updateOne({_id: book.authorId}, {$pull: {books: book_id}});
          console.log(JSON.stringify(updateInfo))
          if (updateInfo.modifiedCount === 0) throw new GraphQLError(`Internal Server Error: could not remove Book`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
  
          const removeInfo = await books.deleteOne({_id: book_id});
          if (removeInfo.deletedCount === 0) throw new GraphQLError(`Error: no Book with id ${args._id}`, {
              extensions: {code: 'NOT_FOUND'}
            });
  
          await client.del("book/" + book_id)
          //udpate author cache
          let target = client.get("author/" + book.authorId)
          if (target){
              let auth = await authors.findOne({_id: book.authorId})
              await client.set("author/" + book.authorId, JSON.stringify(auth))
              await client.expire("author/" + book.authorId, 3600)
          }
  
          
            return book;
      }
  
  
  
  }
  
  
  
  };

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
    context: ({ req }) => ({
      headers: {
        ...req.headers,
      },
    }),
    
  });


export default startServerAndCreateNextHandler(apolloServer);


