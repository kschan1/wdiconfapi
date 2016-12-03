# WDI Conf API

API for WDI Conf app

# Routes

```
'/admin'
'/api/events'
'/api/events/:id'
'/api/presenters'
'/api/presenters/:id'
'/api/users'
'/api/users/:id'
'/api/venues'
'/api/venues/:id'
```

api routes without /:id has search params available. Search for any of the fields. E.g.
```
'/api/events?id=2'
'/api/events?date=20161210&q=ruby'
// q is a query that will return rows which strings consists the key word
```
