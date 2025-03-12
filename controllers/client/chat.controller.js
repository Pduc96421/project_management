const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
    const roomChatId = req.params.roomChatId;
    const userId = res.locals.user.id;
    let nameRoom = "";

    // SocketIo
    chatSocket(req, res);
    // end SocketIo

    // lấy ra data
    const chats = await Chat.find({
        deleted: false,
        room_chat_id: roomChatId,
    });

    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id,
        }).select("fullName");
        chat.infoUser = infoUser;
    }

    const roomChat = await RoomChat.findOne({
        _id: roomChatId,
        deleted: false,
    });

    const UserB = roomChat.users.find(user => user.user_id != userId);

    if (roomChat.typeRoom == "group") {
        nameRoom = roomChat.title;
    } else if (roomChat.typeRoom == "friend") {
        const infoUserB = await User.findOne({
            _id: UserB.user_id,
        }).select("fullName avatar id");

        nameRoom = infoUserB.fullName;
    }

    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats,
        nameRoom: nameRoom,
    });
};