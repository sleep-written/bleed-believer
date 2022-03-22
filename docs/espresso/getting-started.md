# Getting started

In most simple [express.js](https://www.npmjs.com/package/express) examples, normally you found code like this:
```ts
import express from 'express';

const app = express();
app.post('/user/login', (req, res) => {
    // An endpoint to login.
});

app.get('/user/logout', (req, res) => {
    // An endpoint to logout.
});

app.get('/user/:id', (req, res) => {
    // An endpoint to get an user by id.
});

app.patch('/user', (req, res) => {
    // An endpoint to edit the user data.
});

app.get('/documents/quotation/:id', (req, res) => {
    // An endpoint to get a quotation by id
});

app.post('/documents/quotation', (req, res) => {
    // An endpoint to save changes in a quotation
});

app.get('/documents/quotation/:id', (req, res) => {
    // An endpoint to get a quotation by id
});

app.post('/documents/quotation', (req, res) => {
    // An endpoint to save changes in a quotation
});

app.listen(8080, () => {
    console.clear();
    console.log('API Rest is ready!');
});
```
For small projects, this method of endpoint declaration would be fine. But in cases when the application grows, declaring all endpoints in a single file could be transformed in a authentic pain to maintain and scale.

For that reason this package was created. Now you can declare your routes inside of classes as methods inside of them. And create complex routings for every part of your API.

<br />

## Before to write code

To explain the usage of this library, __we will implement it in the example exposed above through the whole documentation.__ Before to write any line of code, we need to define the resources to expose through the API. Using the example of above, our resources are:
- User.
- Quotation.
- Contract.

Both `Quotation` and `Contract` are two kind of documents, so we will group these 2 resources in a same route: `"/Documents"`. Finally, our routing structure would be like this:
```bash
# The root path
/
├── /User
│   ├── [POST]      -> /Login   # Login into the API
│   ├── [GET]       -> /Logout  # Logout from the API
│   ├── [GET]       -> /:id     # To get an user by id
│   └── [PATCH]     -> /        # To modify an user
│   
└── /Documents
    ├── /Quotation
    │   ├── [GET]   -> /:id     # To get a quotation by id
    │   └── [POST]  -> /        # To save changes in the quotation
    │   
    └── /Contract
        ├── [GET]   -> /:id     # To get a contract by id
        └── [POST]  -> /        # To save changes in the contract
```

<br />

## Folder structure

Using this routing structure (assuming that our app only deploys an API Rest), your working directory could be like this:
```bash
# Application root directory
cwd
│   
│   # Source code directory
├── src
│   │   
│   │   # Folder for "/" route (that is the root url)
│   ├── controllers
│   │   │   
│   │   │   # Folder for "/documents" route
│   │   ├── documents
│   │   │   │   
│   │   │   ├── contract.controller.ts
│   │   │   ├── quotation.controller.ts
│   │   │   │   
│   │   │   │   # Routing for the 2 document controllers
│   │   │   └── documents.routing.ts
│   │   │   
│   │   ├── user.controller.ts
│   │   │   
│   │   │   # Routing for all the app
│   │   └── api.routing.ts
│   │   
│   │   # The file that creates the express.js app
│   └── index.ts
│   
│   # App configuration files
├── package-lock.json
├── package.json
└── tsconfig.json
```
