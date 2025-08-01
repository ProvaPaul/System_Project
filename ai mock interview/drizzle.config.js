/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_nymatcv3J5dT@ep-summer-resonance-a4f1fcji-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
    }
};