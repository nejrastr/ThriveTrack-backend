const mongoose = require("mongoose");
const uniqueValidatorequire = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, minlength: 6 },
  image: { type: String, require: true },
  places: { type: String, require: true },
});

userSchema.plugin(uniqueValidatorequire);

module.exports = mongoose.model("User", userSchema);
