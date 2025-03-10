const User = require("../../models/user.model");

module.exports = async (res) => {
    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // a)Thêm id của A vào acceptFriends của B
            const existUserAInB = await User.findOne({
                _id: userId,
                acceptFrients: myUserId,
            });

            if (!existUserAInB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: { acceptFrients: myUserId },
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
                    $push: { requestFriends: userId },
                });
            } 

        });
    });
}