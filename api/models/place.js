const mongoose = require("mongoose");
const {Schema} = mongoose;

const placeSchema = new Schema({
    owner : {type : mongoose.Schema.Types.ObjectId,ref:'User'},
    title:String,
    address:String,
    photos:[String],
    description:String,
    perks : [String],
    extraInfo : String,
    checkIn : String,
    checkOut : String,
    maxGuests : String,
    price : Number,
});


const PlaceModel = mongoose.model('Place',placeSchema);

module.exports = PlaceModel;