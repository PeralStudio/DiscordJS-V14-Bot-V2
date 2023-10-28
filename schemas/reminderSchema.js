const { model, Schema } = require(`mongoose`);

let reminderSchema = new Schema({
    ID: String,
    Guild: String,
    UserID: String,
    Username: String,
    Task: String,
    Date: String,
    Cron: String
});

module.exports = model("reminder", reminderSchema);
