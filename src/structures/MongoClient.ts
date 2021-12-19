import mongoose from "mongoose";
import { connection } from "../db/Connection";


export class MongoClient {
    private static _connection: mongoose.Connection;

    private constructor() {
        MongoClient._connection = connection;
    }

    public static getConnection(): mongoose.Connection {
        if (!MongoClient._connection) {
            MongoClient._connection = connection;
        }
        return MongoClient._connection;
    }
}
