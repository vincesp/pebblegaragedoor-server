# Garage door opener for your Pebble watch

This is the [Heroku](https://www.heroku.com) server for your garage door opener.

Before installing, make sure you pick a better secret:

```javascript
//Change to your own. Treat this like a password
var secret = '/keepout!/';
```

The garage door connects to this instance through a websocket.

## URL interface

| URL | Description |
| --- | --- | 
| ``/check`` | Check for connected sockets. Returns the number of connected sockets |
| ``/trigger`` | Open/close garage door | 
| ``/activate`` | Activates the trigger | 
| ``/deactivate`` | Deactivates the trigger (e.g. for maintenance) | 
| ``/prune`` | Disconnects all sockets |
