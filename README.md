# WDI Conf API
[http://wdiconfapi.herokuapp.com/api](http://wdiconfapi.herokuapp.com/api)

## Technologies used
HTML, CSS, Javascript, NodeJS, Express, pg, Postgres, jwt-simple

Express middleware: bodyparser, cors, ejs, method-override, morgan, passport

## Team
* [jamesmah](https://github.com/jamesmah)
* [kschan1](https://github.com/kschan1)
* [soundtemple](https://github.com/soundtemple)
* [charithperera](https://github.com/charithperera)

## Introduction

Search API built for WDI Conf App

[https://github.com/charithperera/wdiconfapp](https://github.com/charithperera/wdiconfapp)

## Routes

Login page for accessing tables
```
'/'
```

JWT test page
```
'/signin'
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

valid params
```
':column_name' = searches for value equals to. requires entire value to match. valid for all columns
'q' = searches within all string in table for match
'time_from' = all results after and including specified time
'time_to' = all results before and including specified time
'date_from' = all results after and including specified date
'date_to' = all results before and including specified date
'sort' = sort results using one of the valid columns
'order' = sort using 'asc' or 'desc' // Default is 'asc'
':relational_data' = searched for values equals to.
  list of relational data:
  - events: 'presenter_id', 'user_id'
  - presenters: 'event_id'
  - users: 'event_id'
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

find a range of dates or times
```
'/api/events?date_from=20161210&time_from=1000'
'/api/events?date_to=20161215&time_to=1100'
```

user sort and order for sorting using a column
```
'/api/presenters?sort=last_name'
'/api/events?date=20161209&sort=time&order=desc'
```

Able to use queries to search for relational data. E.g.
```
'/api/users?event_id=2'
'/api/events?user_id=2&presenter_id=1'
```

POST, PUT and DELETE requests
```
'api/:table_name' // POST
'api/:table_name/:id' // PUT, DELETE
** Requires JWT authentication
** returns json {success: true/false}
```

## Notes
* SQL queries are parameterised to prevent SQL injection.
* Routes are dynamic, based on tables available in Postgres database
