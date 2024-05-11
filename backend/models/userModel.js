import mongoose from "mongoose";
import { hash, compare } from "../utils/hashPassword.js";

const userSchema = mongoose.Schema(
  {
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  number: {
    type: String,
    required: [true, "phone number is required"],
  },
  role: {
    type: String,
    default: "user",
    // role types and levels:
    // blocked - user - member - commitee - admin - dev
  },
  chessComId: {
    type: String,
  },
  lichessId: {
    type: String
  },
  badges: [],
  deleted: {type: Boolean, default: false},
  fideId: {
    type: String
  },
  profilePicture: {
    type: String
  },
  trophees: [],
  country: {
    type: String
  }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    this.password = await hash(this.password);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
