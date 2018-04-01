import fs from 'fs';
import path from 'path';
import fetch from 'isomorphic-fetch';
import { buildClientSchema, introspectionQuery, printSchema } from 'graphql/utilities';
import expose from './expose.js';
const {__dirname} = expose;
import { introspectionQuery as customIntrospectionQuery } from './introspection-query.mjs';

const custom = process.argv[2] === '--custom';

(async () => {
  try {
    const result = await fetch('http://127.0.0.1:8080/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custom
          ? { query: customIntrospectionQuery, variables: { includeDeprecated: true } }
          : { query: introspectionQuery }
        ),
    });

    if (result.errors) {
      console.error(
        'ERROR introspecting schema: ',
        JSON.stringify(result.errors, null, 2)
      );
    } else {
      var json = await result.json();
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
}
})()
