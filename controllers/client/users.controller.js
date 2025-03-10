const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket");

// [Get] /users/not-friend
module.exports.notFriend = async (req, res) => {
    // socket
    usersSocket(res);
    // end socket 

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId,
    });

    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFrients;

    const users = await User.find({
        $and: [{
                _id: {
                    $nin: requestFriends
                }
            },
            {
                _id: {
                    $ne: userId
                }
            },
            {
                _id: {
                    $nin: acceptFriends
                }
            }
        ],
        status: "active",
        deleted: false,
    }).select("avatar fullName");

    res.render("client/pages/users/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users,
    });
};

// [Get] /users/request
module.exports.request = async (req, res) => {
    // socket
    usersSocket(res);
    // end socket 

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId,
    });

    const requestFriends = myUser.requestFriends;

    const users = await User.find({
        _id : { $in: requestFriends },
        status: "active",
        deleted: false,
    }).select("fullName avatar id");



    res.render("client/pages/users/request", {
        pageTitle: "Danh sách người dùng",
        users: users,
    });
};