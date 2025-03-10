import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

// show typing 
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 5000);
}
// end show typing 

//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const exitsTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            const bodyChat = document.querySelector(".chat .inner-body");

            if (!exitsTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;

                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);

            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    });
}
//END SERVER_RETURN_TYPING

// CLIENT_SEND_MESSAGE
const formSentData = document.querySelector(".chat .inner-form");
if (formSentData) {
    formSentData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.elements.content.value = "";
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    });
}
//END CLIENT_SEND_MESSAGE


// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    // console.log(data);
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector(".inner-list-typing");

    const div = document.createElement("div");

    let htmlFullName = "";

    if (myId == data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`
    }

    div.classList.add("inner-incoming");
    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `;

    body.insertBefore(div, boxTyping);

    body.scrollTop = body.scrollHeight;
});
// endSERVER_RETURN_MESSAGE

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll Chat To Bottom

// Show Popup Icon
const buttonIcon = document.querySelector("[button-icon]");
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.addEventListener("click", () => {
        tooltip.classList.toggle('shown');
    });
}
// End Show Popup Icon

//  Show Icon Chat

const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");

    emojiPicker.addEventListener('emoji-click', (event) => {
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;
        const endText = inputChat.value.length
        inputChat.setSelectionRange(endText, endText);
        inputChat.focus();
        showTyping();
    });

    inputChat.addEventListener("keyup", () => {
        showTyping();
    });
}
// end  Show Icon Chat

// FileUploadWithPreview
// const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images');
//end FileUploadWithPreview