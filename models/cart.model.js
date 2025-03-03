const mongoose = require("mongoose");

const generate = require("../helpers/generate");

const cartSchema = new mongoose.Schema(
    {
        user_id: String,
        products: [
            {
                product_id: String,
                quantity: Number,
            }
        ],
    }, 
    {
        timestamps: true
    }
);

const Cart = mongoose.model("Cart", cartSchema, "cart");

module.exports = Cart;