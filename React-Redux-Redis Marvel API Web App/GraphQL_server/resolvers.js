import {GraphQLError} from 'graphql';
import {ApolloError} from 'apollo-server';
import md5 from 'blueimp-md5'
import redis from 'redis'
import axios from 'axios';
const client = redis.createClient();
await client.connect().then(() => {console.log("connected to redis")})
import * as helpers from './helpers.js'

const publickey = '122081239c4fee71321ffdffc25d34e5';
const privatekey = '2ba20f44ff9368799b19c86c5c16f7627e5480ee';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const url ='ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
// const url = '&apikey=' + publickey

export const resolvers = {


Query: {
    comics_list: async (parent, args) => {
        const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
        let page = args.page;
       if (!helpers.isNum(page)){
        throw new ApolloError('Invalid Page', 'INVALID', {
            response: { status: 400 },
          });
        }
       let index = (page - 1) * 50;
       let comics = null;
       let limit = 50;

       let target_page = await client.get("comics_list/" + page);
       if (target_page){
            console.log("redis hit")
            return JSON.parse(target_page);
       }
      

        try {
                comics = await axios.get(baseUrl + '?offset=' + index + '&limit=' + limit + '&' +  url);
        } catch (error) {
                console.log(error);
                throw new GraphQLError(error.code + ":" + error.response.status)
        }

    //    console.log(comics.data.data.results);

       if (comics.data.data.results.length == 0){
              throw new ApolloError('Page not found', 'NOT_FOUND', {
                response: { status: 404 },
              });
         }

         //set cache
         try {
            await client.set("comics_list/" + page, JSON.stringify(comics.data.data.results))
         } catch (error) {
            throw new GraphQLError(error.code + ":" + error.response.status)
         }
            

       return comics.data.data.results

    },

    get_comic: async (parent, args) => {
        const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics/';
        let id = args.id;
        let comic = null;
        if (!helpers.isNum(id)){
            console.log(error);
            throw new GraphQLError("Id is invalid");
        }

        //check cache
        let target_comic = await client.get("get_comic/" + id);

        if (target_comic){
            console.log("redis hit")
            return JSON.parse(target_comic);
        }

        console.log("redis miss")

        try {
            comic = await axios.get(baseUrl + id + '?' + url);
        } catch (error) {
            throw new GraphQLError(error.code + ":" + error.response.status)
        }
        // console.log(comic.data.data)

        //set cache
        try {
            await client.set("get_comic/" + id, JSON.stringify(comic.data.data.results[0]))
        } catch (error) {
            throw new GraphQLError(error.code + ":" + error.response.status)
        }

        return comic.data.data.results[0];
    },

    comic_amount: async(parent) => {
        const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
        let amount = null;
        try {
            amount = await axios.get(baseUrl + '?' + url);
        } catch (error) {
            console.log(error);
            throw new GraphQLError(error.code + ":" + error.response.status)
        }
        return amount.data.data.total;
    }



}






}