## Run server

Install rust with https://rustup.rs/.

```bash
git clone https://github.com/actix/actix-web
cd actix-web/examples/juniper
git co v0.4.10
cargo run
```

## Run client

Install node, yarn and then:

`yarn && yarn start`

or to run query from `introspection-query.mjs`:

`yarn && yarn start --custom`.

You should get files `schema.json` and `schema.graphql`.