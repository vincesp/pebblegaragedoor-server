var triggerActive = true;
var sockets = [];

//Change to your own. Treat this like a password
var secret = '/keepout!/';

var routingMap = {
    trigger: function (request, response) {
        if (triggerActive) {
            var count = 0;
            sockets.forEach(function (wsocket) {
                if (wsocket.connected) {
                    wsocket.sendUTF('trigger');
                    ++count;
                }
            });
            response.end('Sent to ' + count);
        } else {
            response.end('Not activated');
        }
    },
    prune: function (request, response) {
        server.closeAllConnections();
        sockets = [];
        response.end('All pruned.');
    },
    activate: function (request, response) {
        triggerActive = true;
        response.end('Activated.');
    },
    deactivate: function (request, response) {
        triggerActive = false;
        response.end('Deactivated.');
    },
    check: function (request, response) {
        response.end(String(sockets.length));
    }
};

var http = require('http').Server(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);

    if (request.url.substr(0, secret.length) === secret) {
        var command = request.url.substr(secret.length);
        var commandFunction = routingMap[command];
        if (command) {
            response.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            commandFunction(request, response);
            return; ////////////////////////////////////
        }
    }

    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end("Nothing here!\n");
});

var port = process.env.PORT || 5000;

//  Start the app on the specific interface and port.
http.listen(port, function () {
    console.log('%s Node server started on port %d ...',
        new Date(), port);
});

var WebSocketServer = require('websocket').server;
var server = new WebSocketServer({
    httpServer: http,
    autoAcceptConnections: true
});

server.on('connect', function (wsocket) {
    console.log(new Date(), 'wsocket connected:', wsocket.socket.remoteAddress);

    sockets.push(wsocket);

    function remove() {
        sockets.splice(sockets.indexOf(wsocket), 1);
    }

    wsocket.on('message', function (message) {
        console.log('%s Received %s: %s',
                   new Date(), message.type, message.utf8Data);
    });

    wsocket.on('close', function (reasonCode, description) {
        console.log('%s Closed %d %s',
                   new Date(), reasonCode, description);
        remove();
    });

    wsocket.on('error', function (error) {
        console.error('%s Socket error: %s',
                     new Date(), error);
    });
});
