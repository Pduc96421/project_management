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
    const acceptFriends = myUser.acceptFriends;
    const friendList = myUser.friendList;
    const friendListId = friendList.map(item => item.user_id);

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
            },
            {
                _id: {
                    $nin: friendListId
                }
            },
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
        _id: {
            $in: requestFriends
        },
        status: "active",
        deleted: false,
    }).select("fullName avatar id");



    res.render("client/pages/users/request", {
        pageTitle: "lời mời đã gửi",
        users: users,
    });
};

// [Get] /users/accept
module.exports.accept = async (req, res) => {
    // socket
    usersSocket(res);
    // end socket 

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId,
    });

    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        _id: {
            $in: acceptFriends
        },
        status: "active",
        deleted: false,
    }).select("id fullName avatar");

    res.render("client/pages/users/accept", {
        pageTitle: "lời mời kết bạn",
        users: users,
    });
};

// [Get] /users/friends
module.exports.friends = async (req, res) => {
    // socket
    usersSocket(res);
    // end socket 

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId,
    });

    const friendList = myUser.friendList;
    const friendListId = friendList.map(item => item.user_id);

    const users = await User.find({
        _id: {
            $in: friendListId,
        },
        status: "active",
        deleted: false,
    }).select("id fullName avatar statusOnline");

    res.render("client/pages/users/friends", {
        pageTitle: "danh sách bạn bè",
        users: users,
    });
};