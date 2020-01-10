import { createConnection } from "typeorm";
import { sqlConfig } from "../app.config";

(async () => {
    console.log('connect DB:'+ process.env.DATABASE_NAME);
    await createConnection(sqlConfig);    
})();