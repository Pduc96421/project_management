const mongoose = require("mongoose");

const generate = require("../helpers/generate");

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        tokenUser: {
            type: String,
            default: generate.generateRandomString(20), 
        },
        phone: String,
        avatar: String,
        acceptFrients: Array,
        requestFriends: Array,
        friendList: [
            {
                user_id: String,
                room_chat_id: String,
            }
        ],
        status: {
            type: String,
            default: "active",
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
        
    }, 
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;