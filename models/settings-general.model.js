const mongoose = require("mongoose");

const settingGeneralSchema = new mongoose.Schema({
    websiteName: String,
    logo: String, 
    phone: String,
    email: String,
    addressText: String,
    facebook: String ,
    zalo: String,
    tiktok: String, 
    copyright: String,
    image_slider_right_top: String, 
    image_slider_right_bottom: String,
},
    {
        timestamps: true
    });

const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema, "settings-general");

module.exports = SettingGeneral