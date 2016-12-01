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
'/api/presenters/search?first_name=James'
```
