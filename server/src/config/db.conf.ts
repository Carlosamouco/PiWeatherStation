"use strict";

import { Pool } from 'pg';
import * as Promise from 'bluebird';

import dbconf from '../constants/db';

export class DBConfig {
    private static instance: DBConfig;
    pool: Pool;
    private constructor() {
      this.pool = new Pool({
        connectionString: dbconf.localhost,
      })
    }
    static init():DBConfig {
      if (!DBConfig.instance) {
        DBConfig.instance = new DBConfig();
      }
      return DBConfig.instance;
    }
};
