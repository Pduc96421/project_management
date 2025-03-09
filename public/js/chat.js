
// CLIENT_SEND_MESSAGE
const formSentData = document.querySelector(".chat .inner-form");
if(formSentData){
    formSentData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if(content){
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.elements.content.value = "";
        }
    });
}
//END CLIENT_SEND_MESSAGE

