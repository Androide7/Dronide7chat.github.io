const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let users = [];

wss.on('connection', (ws) => {
    console.log('Nuevo usuario conectado');

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'join') {
            users.push({ username: data.username, ws });
            broadcast({ type: 'users', users: users.map(u => u.username) });
        } else if (data.type === 'message') {
            broadcast({
                type: 'message',
                username: data.username,
                text: data.text,
                color: data.color,
                style: data.style,
            });
        }
    });

    ws.on('close', () => {
        users = users.filter(user => user.ws !== ws);
        broadcast({ type: 'users', users: users.map(u => u.username) });
    });
});

function broadcast(data) {
    users.forEach(user => {
        user.ws.send(JSON.stringify(data));
    });
}
