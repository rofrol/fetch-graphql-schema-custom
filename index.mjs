import fs from 'fs';
import path from 'path';
import fetch from 'isomorphic-fetch';
// import { buildClientSchema, introspectionQuery, printSchema } from 'graphql/utilities';
import { buildClientSchema, printSchema } from 'graphql/utilities';
import expose from './expose.js';
const {__dirname} = expose;
import { introspectionQuery } from './introspection-query.mjs';

(async () => {
  try {
    var result = await fetch('http://127.0.0.1:8080/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: introspectionQuery,
          variables: { includeDeprecated: true },
        }),
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
