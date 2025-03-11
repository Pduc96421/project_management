const User = require("../../models/user.model");

module.exports = async (res) => {
    _io.once('connection', (socket) => {
        // người dùng gửi yêu cầu kết bạn
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

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

            // a)Thêm {user_id, room_chat_id} của A vào friendsList của B
            // a)Xóa id của A trong acceptFriends của B
            const existUserAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId,
            });

            if (existUserAInB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: {
                        friendList: { 
                            user_id: userId,
                            room_chat_id: "",
                        }
                    },
                    $pull: {
                        acceptFriends: userId,
                    },
                });
            }

            // Thêm {user_id, room_chat_id} của B vào friendsList của A
            // b)Xóa id của B trong requestFriends của A
            const existUserBInA = await User.findOne({
                _id: userId,
                requestFriends: myUserId,
            });

            if (existUserBInA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: {
                        friendList: { 
                            user_id: myUserId,
                            room_chat_id: "",
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