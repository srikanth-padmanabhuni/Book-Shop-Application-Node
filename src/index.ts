import { createConnection } from 'typeorm';
import { User } from './entities/User';
import { Subscription } from './entities/Subscription';
import { Book } from './entities/Book';

import express from "express"
import morgan from "morgan";
import path from "path";

import { userRoutes } from './routes/user-routes';
import { bookRoutes } from './routes/book-routes';
import { subscriptionRoutes } from './routes/subscription-routes';

const app = express();

const connectToDb = async () => {
    try {
        const connection = await createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "$Sri@Krishna_143$",
            database: "NodeTraining",
            entities: [User, Subscription, Book],
            synchronize: true
        })
        console.log("Connected to DB successfully !!!");

        addMiddleWares();
        addRoutes();
        startServer();
        
    } catch(error) {
        console.log(error);
        throw new Error("Unable to connect to DB");
    }
}

const startServer = () => {
    app.listen(8080, () => {
        console.log("App server running on port 8080");
    })
}

const addMiddleWares = () => {
    app.use(express.json());
    app.use(morgan(function (tokens, req, res) {
        return [
          '[' + new Date().toLocaleString() + ']',
          '[' + path.basename(__filename) + ']',
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens.res(req, res, 'content-length'),
          '-',
          tokens['response-time'](req, res), 'ms',
        ].join(' ');
      }));
}

const addRoutes = () => {
    app.use('/user', userRoutes);
    app.use('/book', bookRoutes);
    app.use('/subscription', subscriptionRoutes);
}

connectToDb();