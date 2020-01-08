import { createConnection } from "typeorm";
import { sqlConfig_test } from "../app.config";

(async () => {
    console.log('connect DB');
    await createConnection(sqlConfig_test);
})();