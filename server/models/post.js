const mongoose = require("mongoose");

const { Schema } = mongoose;       // this one is interesting !

const PostSchema = new Schema(
  {
    title: String,
    body: String,
    votes: {
      up: Number,
      down: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Post", PostSchema);

