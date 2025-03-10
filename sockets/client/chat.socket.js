const Chat = require("../../models/chat.model");

module.exports = async (res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    // SocketIo
        _io.once("connection", (socket) => {
            socket.on("CLIENT_SEND_MESSAGE", async (content) => {
                // lưu vao database
                const chat = new Chat({
                    user_id: userId,
                    content: content,
                });
                await chat.save();
    
                // Trả data về cho client
                _io.emit("SERVER_RETURN_MESSAGE", {
                    userId: userId,
                    fullName: fullName,
                    content: content,
                });
            });
    
            socket.on("CLIENT_SEND_TYPING", (type) => {
                socket.broadcast.emit("SERVER_RETURN_TYPING", {
                    userId: userId,
                    fullName: fullName,
                    type: type,
                });
            });
        });
        // end SocketIo
}