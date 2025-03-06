const SettingGeneral = require("../../models/settings-general.model");


//[Get] /admin/dasboard
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        setting: settingGeneral,
    });
}

//[Post] /admin/dasboard
module.exports.generalPatch = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});
    if(settingGeneral){
        await SettingGeneral.updateOne({
            _id: settingGeneral.id,
        }, req.body);
    } else {
        const record = new SettingGeneral(req.body);
        await record.save();
    }
   

    req.flash("success", "Cập nhập thành công");

    res.redirect("back");
}