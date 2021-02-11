## Story

This is a project that is built only for learning purposes of domain driven design and diving a bit deeper in node without the packages fluff.

***NB :*** This is a WIP and so some bits and pieces are not yet following DDD and Clean architecture or straight up not working 😅.

##  Design and Structure

All libs are built with barebones node from scratch , most are in the `libs` folder . The DB used is a file based db client that can be found in `infrastructure` db folder .

You'll need to create a `.db` folder in the root of the working dir and add all "collections" as subfolders (like tables in a sql like db) `users`, `tokens`, `carts` (naiive I know, not the main focus).

The gist of the structure is it follows Domain Driven Design or DDD  and Clean architecture principles  (as I understood them while learning).
So I focused on making the core and business logic not dependent on the infrastructure used, you're supposed to be able to just switch the barebones server with express or koa and not have to really change much in the business logic.

There's also a nice Trick for Errors handling in node ( notoriously a pain point) which is the `Result` notion.
The Idea there is you only throw an error at the extremities of your flow, things not directly under your app's control like a `db` client error, or external service interaction error.
All of the business logic should put problems it encounters in Results that are either `successes` or `failures` .
This approach allows you to catch potential problems precisely and know where they're coming from and consequently deal better with them, ie. ignore and allow for flow to continue, give back proper response to user or do whatever the nature of the error requires in your logic.