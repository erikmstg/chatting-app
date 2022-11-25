// const { Schema, model } = mongoose;
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [3, "Min length name is 3 char"],
      required: [true, "can't be blank"],
    },
    email: {
      type: String,
      lowercase: true,
      index: true,
      trim: true,
      unique: true,
      required: [true, "can't be blank"],
      validate: [isEmail, "Invalid email"],
    },
    password: {
      type: String,
      minLength: [3, "Min length password is 3 char"],
      required: [true, "can't be blank"],
    },
    picture: {
      type: String,
    },
    newMessage: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: "online",
    },
  },
  { minimize: false }
);

// UserSchema.path("email").index({ unique: true });

// before save the user, hide the password first
UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

// we don't want to send back the user password
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  return user;
};

// create User model
const User = mongoose.model("User", UserSchema);

module.exports = User;
