const { Thought, User } = require('../models');

module.exports = {

  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      if (!thoughts) {return res.json({message:'No thoughts exist'})}
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thought) {return res.status(404).json({ message: 'No thought with that ID' });}

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a thought
  async createThought(req, res) {
    try {
      const user = await User.findOne({username:req.body.username})
      if(!user) {return res.json({message: `${req.body.username} is not an active user`})}

      const thought = await Thought.create(req.body);

      // find user by username and update thoughts array
      await User.findOneAndUpdate(
        { username: req.body.username },
        { $push: { thoughts: thought._id } }
      );
  
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
      if (!thought) {return res.status(404).json({ message: 'No thought with that ID' });}

      await User.deleteMany({ _id: { $in: thought.users } });

      res.json({ message: 'Thought deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { thoughtText: req.body.thoughtText},
        { runValidators: false}
      );
      if (!thought) {return res.status(404).json({ message: 'No thought with this id!' });}

      await thought.save();

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addReaction(req, res) {
    try {
      const user = await User.findOne({username:req.body.username})
      if (!user) {return res.status(404).json({ message: `${req.body.username} is not a valid username` });}

      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {return res.status(404).json({ message: `${req.params.thoughtId} is not a valid thoughtId` });}
      
      thought.reactions.push(req.body);

      await thought.save();

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
      const reactions = await Thought.updateMany(
        { 'reactions._id': req.params.reactionId },
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { arrayFilters: [{ 'elem._id': req.params.reactionId }], runValidators: true}
      )
      if(!reactions) {res.json({message:`${req.params.reactionId} is not a valid reactionId`})}

      res.json({message:`reactionId: ${req.params.reactionId} deleted`});
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
