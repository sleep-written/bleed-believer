# What's the problem?

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


## Before to write code

To explain the usage of this library, __we will implement this library in the example exposed above through the whole documentation.__ Before to write any line of code, we need to define the resources to expose through the API. Using the example of above:
- User.
- Quotation.
- Contract.

Both `Quotation` and `Contract` are two kind of documents, so we will group these 2 resources in a same route: `"/documents"`. Finally, our routing structure would be like this:
```bash
# The root path
/
├── /user
│   ├── [POST]      -> /login
│   ├── [GET]       -> /logout
│   ├── [GET]       -> /:id     # To get an user by id
│   └── [PATCH]     -> /        # To modify an user
│   
└── /documents
    ├── /quotation
    │   ├── [GET]   -> /:id     # To get a quotation by id
    │   └── [POST]  -> /        # To save changes in the quotation
    │   
    └── /contract
        ├── [GET]   -> /:id     # To get a contract by id
        └── [POST]  -> /        # To save changes in the contract
```