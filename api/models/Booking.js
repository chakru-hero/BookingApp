const mongoose = require("mongoose");
const {Schema} = mongoose;

const bookingSchema = new Schema({
    place : {type:mongoose.Schema.Types.ObjectId, required:true},
    checkIn : {type:Date, required:true},
    checkIn : {type:Date, required:true},
    name:{type:String, required:true},
    mobile:{type:String, required:true},
    price : Number;

});


const BookingModel = mongoose.model('Bookings',bookingSchema);

module.exports = BookingModel;