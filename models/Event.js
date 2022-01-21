const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    eventid : Number,
    name : String,
    attendance : Number,
    eventdate : String,
    type : String,
    time : String,
    picture : String,
});

const Event = mongoose.model('Event',EventSchema);

module.exports = Event