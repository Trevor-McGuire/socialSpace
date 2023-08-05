const { Schema, Types } = require('mongoose');
const moment = require('moment');

const reactionSchema = new Schema(
  {
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      getters: true,
      transform: (doc, ret) => {
        delete ret.reactionId;
        delete ret.createdAt;
      },
    },
    id: false,
  }
);

reactionSchema.virtual('createdAtFormatted').get(function() {
  return moment(this.createdAt).format('MMMM Do YYYY, h:mm:ss a');
});

module.exports = reactionSchema;
