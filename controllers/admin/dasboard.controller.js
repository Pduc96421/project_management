
//[Get] /admin/dasboard
module .exports.dasboard = async (req, res) => {
    res.render("admin/pages/dasboard/index", {
        pageTitle: "Trang tong quat"
    });
}