const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        permissions:{
            type: Array,
            default: [],
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
        slug:{
            type: String,
            slug: "title",
            unique: true
        }
    }, 
    {
        timestamps: true
    }
);

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;