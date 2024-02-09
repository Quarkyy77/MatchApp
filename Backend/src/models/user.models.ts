import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
        type: String,
        enum : ['male', 'female'],
    },
    location:{
        type: String,
        default:"",
    },
    spamreports:{
      type: Array,
      default:[]
    },
    MatchStatus: {
      type: String,
      enum: [ "Idle", "Rejected", "Approved",],
      default: "Idle"
  },
    matches: [{
        userId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default:[]
    },
    location: String,
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;