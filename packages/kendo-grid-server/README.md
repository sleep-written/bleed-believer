# @bleed-believer/kendo-grid-server

## Overview

`@bleed-believer/kendo-grid-server` is a server-side package designed to complement `@bleed-believer/kendo-grid-client`. It provides seamless integration with Kendo UI Grids, enabling features such as pagination, filtering, and sorting directly from your server.

## Features

- **TypeORM Integration**: Designed to work effortlessly with TypeORM query builders.
- **Automatic Query Parsing**: Automatically parses query strings from client requests to apply filtering, sorting, and pagination.
- **Efficient Data Retrieval**: Optimizes SQL queries to retrieve only the necessary data.

## Installation

To install the package, run the following command in your terminal:

```bash
npm i --save @bleed-believer/kendo-grid-server
```

## Quick Start

### 1. Import Dependencies

First, import the necessary dependencies in your controller:

```ts
import { KendoUITypeORM } from '@bleed-believer/kendo-grid-server';
```

### 2. Create a Query Builder

Create a TypeORM query builder instance for the data model you are working with:

```ts
const query = Dummy
    .createQueryBuilder('Dummy')
    .select([
        'Dummy.id',
        'Dummy.cod',
        'Dummy.descripc',
    ]);
```

### 3. Instantiate KendoUITypeORM

Create an instance of `KendoUITypeORM` and pass the query builder instance to it:

```ts
const odata = new KendoUITypeORM(query);
```

### 4. Parse Client Request and Fetch Data

Pass the client request to `getMany()` method of `KendoUITypeORM` instance:

```ts
const result = await odata.getMany(this.request);
```

### 5. Send Response

Finally, send the retrieved data as a response:

```ts
this.response.json(result);
```

## Final Notes

This package is specifically designed to work alongside `@bleed-believer/kendo-grid-client`. For a seamless and feature-rich experience, it's crucial to use both packages in conjunction.