module.exports.priceNewProducts = (productsFeatured) => {
    const newProductsFeatured = productsFeatured.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100) .toFixed(0);
        return item;
    });

    return newProductsFeatured;
}