import 'dotenv/config';

export const config = {
    port: process.env.PORT || 8000,
    mongodb: process.env.MONGO_URI
    || 'mongodb://localhost:27017/mongo',
}