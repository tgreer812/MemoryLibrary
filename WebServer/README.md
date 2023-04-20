# BaseReactNodeTemplate
This template contains the minimum code required to start a react client with a node backend and a mongodb server.
It also contains the backend code for a secure login as well as a generic login page on the frontend.

## Some useful commands for `mongosh`
`show dbs` => shows the available databases

`use 'servername'` => selects the database for interaction\n

`db.attr.find({})` => finds all entries in database with 'attr'\n

`db.attr.deleteMany({})` => deletes all entires in database with 'attr'\n