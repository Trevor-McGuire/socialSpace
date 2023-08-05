const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction')
const moment = require('moment');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;

        delete ret.__v
      },
    },
  }
);

thoughtSchema.virtual('createdAtFormatted').get(function() {
  return moment(this.createdAt).format('MMMM Do YYYY, h:mm:ss a');
});

thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;