import mongoose, { Mongoose } from "mongoose";


export class MongoClient {
    private static _instance: MongoClient;
    private static _connection: mongoose.Connection;
    private static _url: string;

    private constructor() {
        const mongoUrl = process.env.MONGO_URL;
        MongoClient._url = mongoUrl ? process.env.MONGO_URL : "mongodb://localhost:27017";

        this.connect(MongoClient._url, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    public static getInstance(): MongoClient {
        if (!MongoClient._instance) {
            MongoClient._instance = new MongoClient();
        }
        return MongoClient._instance;
    }

    private async connect(url: string, options: any): Promise<void> {
        mongoose.connect(url, options);
        MongoClient._connection = mongoose.connection;
        MongoClient._connection.on("error", console.error.bind(console, "MongoDB connection error:"));
        MongoClient._connection.once("open", () => {
            console.log("MongoDB connected");
        }
        );
    }
}
