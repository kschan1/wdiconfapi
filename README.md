# WDI Conf API
[http://wdiconfapi.herokuapp.com/api](http://wdiconfapi.herokuapp.com/api)

## Technologies used
HTML, CSS, Javascript, NodeJS, Express, Passport, jwt, pg, Postgres

Express middleware: bodyparser, cors, ejs, method-override, morgan

## Team
* [soundtemple](https://github.com/soundtemple)
* [charithperera](https://github.com/charithperera)
* [jamesmah](https://github.com/jamesmah)
* [kschan1](https://github.com/kschan1)

## Introduction

API built for WDI Conf App

[https://github.com/charithperera/wdiconfapp](https://github.com/charithperera/wdiconfapp)

## Routes

HTML pages for accessing tables
```
'/all'
```

API routes:
```
'/api'
'/api/events'
'/api/events/:id'
'/api/presenters'
'/api/presenters/:id'
'/api/users'
'/api/users/:id'
'/api/venues'
'/api/venues/:id'
```
Relational tables:
```
'/api/events_presenters'
'/api/events_presenters/:id'
'/api/events_users'
'/api/events_users/:id'
```

api routes and index pages have search params available. Search for any of the fields. E.g.
```
'/api/events?id=2'
'/users?first_name=chaz'
```
q is a query that will return rows which strings consists the key word

```
'/api/presenters&q=ka'
'/api/events?date=20161210&q=ruby'
```
Able to use queries to search for relational data. E.g.

```
'/api/users?event_id=2'
'/api/events?user_id=2&presenter_id=1'
```
## Notes
* SQL queries are parameterised to prevent SQL injection.
* Routes are dynamic, based on tables available in Postgres database
