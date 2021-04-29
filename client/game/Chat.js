class Chat {
    constructor(sock) {
        this.chat = document.querySelector('.chat');
        this.chatButton = document.querySelector('.chatButton');
        this.socket = sock;
        this.socket.on('chat__message', (response) => {
            this.log(response);
        });
        this.socket.on('game__init', (response) => {
            this.init(response);
        });
    };
};

Chat.prototype.init = function (response) {
    let config = JSON.parse(localStorage.getItem('config'));
    this.chat.innerHTML = `
        <ul id = "events"></ul>
        <div class="controls">
            <div class="chat-wrapper">
                <form id="chat-form">
                    <input id="chat" autocomplete="off" title="chat" />
                    <button id="say">Send</button>
                </form>
            </div>
        </div>
    `;
    this.chat.style.border = '3px solid #333333';
    this.input = document.querySelector('#chat');
    this.parent = document.querySelector('#events');

    this.chat.style.display = (config.chat) ? 'block' : 'none'; 

    this.messages = document.querySelector('#events');
    this.chatButton.innerHTML = 'Chat';

    document.querySelector('.chatButton').addEventListener('click', () => {
        if(config.chat) {
            this.chat.style.display = 'none';
            config.chat = false;
        } else {
            this.chat.style.display = 'block';
            config.chat = true;
            // Scrolling messages to the newest.
            this.messages.scrollTop = this.messages.scrollHeight;
        }
        localStorage.setItem('config', JSON.stringify(config));
    });
    document.querySelector('#chat-form').addEventListener('submit', (e) => {
        this.onChatSubmitted(e);
    });
    this.socket.emit('chat_init');
};

Chat.prototype.onChatSubmitted = function (e) {
    e.preventDefault();
    const text = this.input.value;
    if(text != '') this.socket.emit('chat_message', {
        message: text
    });
    this.input.value = '';
};

Chat.prototype.log = function(msg) {
    const li = document.createElement('li');
    const author = (msg.author) ? `[${msg.author}]` : '';
    li.innerHTML = `<small>${msg.date} ${author}</small> - ${msg.text}`;
    this.parent.appendChild(li);
    this.parent.scrollTop = this.parent.scrollHeight;
}