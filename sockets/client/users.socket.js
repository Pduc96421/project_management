const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

module.exports = async (res) => {
    _io.once('connection', (socket) => {
        // người dùng gửi yêu cầu kết bạn
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // console.log(myUserId) // id cua A
            // console.log(userId) // id cua B

            // a)Thêm id của A vào acceptFriends của B
            const existUserAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId,
            });

            if (!existUserAInB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: {
                        acceptFriends: myUserId
                    },
                });
            }

            // b)Thêm id của B vào requestFriends của A
            const existUserBInA = await User.findOne({
                _id: myUserId,
                requestFriends: userId,
            });

            if (!existUserBInA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: {
                        requestFriends: userId
                    },
                });
            }

            // lấy độ dài acceptFriends của B trả về cho B
            const infoUserB = await User.findOne({
                _id: userId,
            });

            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGHT_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends,
            });

            // lấy thông tin của A trả về cho B
            const infoUserA = await User.findOne({
                _id: myUserId,
            }).select("id avatar fullName");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA,
            });

        });
        // end người dùng gửi yêu cầu kết bạn

        // người dùng hủy gửi yêu cầu kết bạn 
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // a)Xóa id của A trong acceptFriends của B
            await User.updateOne({
                _id: userId,
            }, {
                $pull: {
                    acceptFriends: myUserId
                },
            });


            // b)Xóa id của B trong requestFriends của A
            await User.updateOne({
                _id: myUserId,
            }, {
                $pull: {
                    requestFriends: userId
                },
            });

            // lấy độ dài acceptFriends của B trả về cho B
            const infoUserB = await User.findOne({
                _id: userId,
            });

            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGHT_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends,
            });

            // lấy thông tin của A trả về cho B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userId: userId,
                userIdA: myUserId,
            });

        });
        // end người dùng hủy gửi yêu cầu kết bạn 

        // người dùng từ chối yêu cầu kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // a)Xóa id của A trong acceptFriends của B
            const existUserAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId,
            });

            if (existUserAInB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: {
                        acceptFriends: userId,
                    },
                });
            }

            // b)Xóa id của B trong requestFriends của A
            const existUserBInA = await User.findOne({
                _id: userId,
                requestFriends: myUserId,
            });

            if (existUserBInA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: {
                        requestFriends: myUserId,
                    },
                });
            }

        });
        // end người dùng từ chối yêu cầu kết bạn 

        // chấp nhận kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // kiểm tra tồn tại
            const existUserAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId,
            });

            const existUserBInA = await User.findOne({
                _id: userId,
                requestFriends: myUserId,
            });

            let roomChat;

            // tạo phòng chat
            if(existUserAInB && existUserBInA){
                roomChat = new RoomChat({
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: userId,
                            role: "superAdmin",
                        },
                        {
                            user_id: myUserId,
                            role: "superAdmin",
                        }
                    ]
                });
                await roomChat.save();
            }

            // a)Thêm {user_id, room_chat_id} của A vào friendsList của B
            // a)Xóa id của A trong acceptFriends của B
            

            if (existUserAInB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: roomChat.id,
                        }
                    },
                    $pull: {
                        acceptFriends: userId,
                    },
                });
            }

            // Thêm {user_id, room_chat_id} của B vào friendsList của A
            // b)Xóa id của B trong requestFriends của A

            if (existUserBInA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: roomChat.id,
                        }
                    },
                    $pull: {
                        requestFriends: myUserId,
                    },
                });
            }
        });
        // end chấp nhận kết bạn


    });
}