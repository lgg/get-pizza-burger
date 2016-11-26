var socket_host = window.location.origin;
var socket_args = {
    transports: ['websocket'],
    upgrade: false,
    cookie: false
};
var socket = io(socket_host, socket_args); //Socket io listener
window.Promise = window.Promise || window.ES6Promise.Promise; //fix for promises


var amount = 0,
    before = false,
    personalNum = null;

/**
 * Socket.io emit
 * @param type - type of message
 * @param val - value of message
 */
function send(type, val) {
    socket.emit(type, val);
}

document.addEventListener('DOMContentLoaded', function () {
    registerSocket();

    gid("btn").addEventListener('click', function () {
        send('claim');
    });
});

function registerSocket() {
    send('register');

    //Check if we have successfully registered
    socket.on('info', function (data) {
        amount = data.queue;
        update(amount);
    });

    socket.on('newclaim', function (data) {
        amount = data.queue;
        update(amount);
    });

    socket.on('you are', function (data) {
        personalNum = data.num;
        before = amount - 1;
        addClass(gid('btn'), 'none');
        addClass(gid('sub'), 'none');
        socket.off('newclaim');
    });

    socket.on('got', function (data) {
        if (before) {
            before--;
            update(before);
        } else {
            amount = data.queue;
            update(amount);
        }
    });
}

function update(amount) {
    gid('amount_div').textContent = amount;
    gid('time_div').textContent = Math.round(amount / 4);
}

function gid(id) {
    return document.getElementById(id);
}

function addClass(el, className){
    if (el.classList)
        el.classList.add(className);
    else
        el.className += ' ' + className;
}