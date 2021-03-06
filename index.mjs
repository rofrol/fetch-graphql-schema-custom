import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { buildClientSchema, printSchema } from 'graphql/utilities';

import expose from './expose';
const {__dirname} = expose;

const custom = process.argv[2] === '--custom';

(async () => {
  try {
    const { introspectionQuery: query } = await import(custom ? './introspection-query' : 'graphql/utilities');

    const result = await fetch('http://127.0.0.1:8080/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custom
          ? { query, variables: { includeDeprecated: true } }
          : { query }
        ),
    });

    if (result.errors) {
      throw new SchemaQueryError(JSON.stringify(result.errors, null, 2));
    } else {
      const json = await result.json();
      fs.writeFileSync(
        path.join(__dirname, './schema.json'),
        JSON.stringify(json, null, 2)
      );
      fs.writeFileSync(
        path.join(__dirname, './schema.graphql'),
        printSchema(buildClientSchema(json.data))
      );
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})()
