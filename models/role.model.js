const mongoose = require("mongoose");

const roletSchema = new mongoose.Schema({
    title: String,
    description: String,
    permissions: {  //nhóm quyền
        type: Array,
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
    },
    createdBy:{
        account_id: String,
        createdAt:{
            type:Date,
            default: Date.now
        }
    },
    deletedBy:{
        account_id: String,
        deletedAt: Date
    },
    updatedBy:[
        {
            account_id: String,
            updatedAt: Date
        }
    ]
},
    {
        timestamps: true
    });

const Role = mongoose.model('Role', roletSchema, "roles");

module.exports = Role