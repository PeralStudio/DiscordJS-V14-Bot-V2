const { model, Schema } = require(`mongoose`);

let notesSchema = new Schema({
    Guild: String,
    User: String,
    Code: String,
    Note: String
});

module.exports = model("note", notesSchema);
