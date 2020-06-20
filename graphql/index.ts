require('dotenv').config()
import { ApolloServer, gql } from "apollo-server-azure-functions"
const { Pool } = require('pg')

const db = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: true
})
db.query('SELECT now();')

const typeDefs = gql`
    type Money {
        amount: Float
        currency: String
    }
    
    type Seller {
        id: ID
        name: String
        url: String
        evilness: Int!
    }
    
    type Category {
        id: ID
        name: String
        google: String
        amazon: String
        ebay: String
        parent: ID
        children: [ID]
    }

    type Offer {
        id: ID
        name: String
        link: String
        price: Money
        seller: Seller
        category: Category
    }

    type Query {
        getOfferByID(id: ID!): Offer
        getOfferByUrl(url: String!, limit: Int): [Offer]
        getOfferByASIN(asin: String!, limit: Int): [Offer]
    }
`

const sql = `SELECT id, name, link, price, currency, seller
FROM offers
WHERE id = $1 OR TRUE ORDER BY RANDOM() -- this line is just for demo
LIMIT 1;`

const resolvers = {
    Query: {
        async getOfferByID(_, { id }: { id: string }) {
            try {
                const res = await db.query(sql, [id])
                if (res.rows.length == 0) {
                    return null
                }
                return {
                    id: res.rows[0].id,
                    name: res.rows[0].name,
                    link: res.rows[0].link,
                    price: {
                        amount: res.rows[0].price,
                        currency: res.rows[0].currency,
                    },
                    seller: res.rows[0].seller,
                }
            } catch (err) {
                console.log(err.stack)
                return null
            }
        },
        async getOfferByUrl(_, { url, limit }: { url: string, limit: number}) {
            return null
        },
        async getOfferByASIN(_, { asin, limit }: { asin: string, limit: number}) {
            return null
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers })
export default server.createHandler()
