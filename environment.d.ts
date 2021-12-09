declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            GUILD_ID: string;
            ENVIRONMENT: "dev" | "prod" | "debug";
            OMDB_API_KEY: string;
            MONGO_URL: string;
        }
    }
}

export {};