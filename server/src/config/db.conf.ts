import { Pool } from "pg";

import dbconf from "../constants/db.js";

export class DBConfig {
  private static instance: DBConfig;
  pool: Pool;
  private constructor() {
    this.pool = new Pool({
      connectionString: dbconf.localhost,
    });
  }
  static init(): DBConfig {
    if (!DBConfig.instance) {
      DBConfig.instance = new DBConfig();
    }
    return DBConfig.instance;
  }
}
