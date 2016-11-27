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
    personalNum = false;

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

    gid("btn").addEventListener('click', sendClaim);
});

function sendClaim(){
    send('claim');
}

function sendGot(){
    send('got');
    window.location.href = 'https://github.com/lgg/get-pizza-burger';
}

function registerSocket() {
    send('register');

    //Check if we have successfully registered
    socket.on('info', function (data) {
        amount = data.queue;
        update(amount);
    });

    socket.on('newclaim', function (data) {
        if (!before) {
            amount = data.queue;
            update(amount);
        }
    });

    socket.on('you are', function (data) {
        personalNum = data.num;
        before = amount - 1;
        update(before);
        hide('btn');
        hide('sub');
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
    var time = Math.round(amount / 4);
    gid('time_div').textContent = time;
    if(time < 1 && personalNum){
        addClass(gid('up'), 'up_text');
        addClass(gid('btn'), 'white_btn');
        gid('btn').textContent = "I got my burger";
        hide('sub');
        hide('times_info');
        hide('title');

        gid("btn").removeEventListener('click', sendClaim);
        gid("btn").addEventListener('click', sendGot);
    }
}

function hide(id){
    addClass(gid(id), 'none');
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