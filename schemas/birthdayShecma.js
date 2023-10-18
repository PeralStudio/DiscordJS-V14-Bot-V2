const { model, Schema } = require(`mongoose`);

let birthdaySchema = new Schema({
    UserID: String,
    Age: Number,
    Year: Number,
    Month: Number,
    Day: Number
});

module.exports = model("birthdaySchema_x", birthdaySchema);
