const { Long } = require('mongodb');
const mongoose=require('mongoose');

const userSchema= mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type:String,
        required:true,
        unique:true,
        match:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/

    },
    password: {type:String,required:true},
    firstName: {type:String,required:true},
    lastName:{type:String,required:true},
    phoneNo:{type:String}
    
});
module.exports=mongoose.model('User',userSchema);