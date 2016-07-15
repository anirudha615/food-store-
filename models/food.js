    var mongoose = require ('mongoose');
    var Schema = mongoose.Schema;
    
    
    var foodstores = new Schema({
        Name: {type: String, required:true},
        Rating:{type: Number, min:1, max:10, required: true},
        SpecialDish:{type: String, required: true},
        Timing:{type: String, required: true}},
        {timestamps: true});
    
    var food = new Schema({
        Name: {type: String, required: true },
        Gender: {type: String, required: true },
        Age: {type: Number, required: true},
        Email: {type: String, required: true},
        foodstores: [foodstores]},
        {timestamps: true});
            
    var store = mongoose.model('place',food);
    
    module.exports = store;