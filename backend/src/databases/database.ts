import "reflect-metadata"
import { AppDataSource } from "../config/database.config";

export const intitaliseDatabase = async()=>{
    try {
        await AppDataSource.initialize();
        console.log("Datbaase Connected successfully")
    } catch (error) {
        console.log("Database Connection error: ", error);
        process.exit(1);
    }
}