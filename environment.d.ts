declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            GUILD_ID: string;
            ENVIRONMENT: "test" | "prod" | "dev";
            OMDB_API_KEY: string;
            MONGO_URL: string;
            MONGO_OPTIONS: string;
        }
    }
}

export {};