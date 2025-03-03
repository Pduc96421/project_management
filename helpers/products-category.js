const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async (parentId) => {
    const getSubCategory = async (parenId) => {
        const subs = await ProductCategory.find({
            parent_id: parenId,
            status: "active",
            deleted: false,
        });

        let allSub = [...subs];

        for(const sub of subs){
            const childs = await getSubCategory(sub.id);
            allSub = allSub.concat(childs);
        }

        return allSub;
    }

    const result = getSubCategory(parentId);
    return result;
}