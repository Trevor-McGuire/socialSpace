// ObjectId() method for converting userId string into an ObjectId for querying database
const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {

  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      if (!users) {return res.status(404).json({ message: 'No users found' });}

      return res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findById(req.params.userId).populate('thoughts');
      if (!user) {return res.status(404).json({ message: 'No user with that ID' });}

      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  /* create a new user
  {
    "username": "testuser1",
    "email": "testuser1@test.com"
  }
  */
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);

      res.json({ message: 'New user created' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a user and their thoughts/reactions
  async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.userId)
      if (!user) {return res.json({message:'No user found'})}

      const thoughts = await Thought.deleteMany({username:user.username})

      const reactions = await Thought.updateMany(
        { 'reactions.username': user.username },
        { $pull: { reactions: { username: user.username } } },
        { arrayFilters: [{ 'elem.username': user.username }], runValidators: true}
      )

      await User.deleteOne({ _id: req.params.userId });
      
      if (!user.thoughts.length) {return res.json({message: 'User deleted'})}
      res.json({ message: 'User and associated thoughts deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  /* update username/email in the user and username in thoughts and thoughts.reactions
  {
    "username": "updated",
    "email": "asdf@gmail.com"
  }
  */
  async updateSingleUser(req, res) {
    try {
      let user = await User.findById(req.params.userId)
      if (!user) {return res.status(404).json({ message: 'No user with this id!' });}

      const oldUsername = user.username
      const newUsername = req.body.username

      const thoughts = await Thought.updateMany(
        { username: oldUsername },
        { $set: {username:newUsername} },
        { runValidators: true}
      )

      const reactions = await Thought.updateMany(
        { 'reactions.username': oldUsername },
        { $set: {'reactions.$[elem].username' :newUsername} },
        { arrayFilters: [{ 'elem.username': oldUsername }], runValidators: true}
      )
      
      await User.updateOne(
        { _id: req.params.userId },
        { $set: req.body},
        { runValidators: true}
      )

      res.json({ message: 'User updated' });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async addFriend(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
      if (!user) {return res.status(404).json({ message: 'No such user exists' })}

      const friend = await User.findOne({ _id: req.params.friendId })
      if (!friend) {return res.status(404).json({ message: 'No such friend exists' })}
      
      if (user.friends.includes(friend._id)) {return res.status(404).json({ message: 'Friendship already exists' })}

      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { new: true },
      );

      res.json(updatedUser);
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },

  async deleteFriend(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
      if (!user) {return res.status(404).json({ message: 'No such user exists' })}

      const friend = await User.findOne({ _id: req.params.friendId })
      if (!friend) {return res.status(404).json({ message: 'No such friend exists' })}
      
      if (!user.friends.includes(friend._id)) {return res.status(404).json({ message: 'No friendship already exists' })}

      const updatedUser  = await User.updateOne(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { multi: true }
      );

      res.json(updatedUser);
    } catch (err) {
      console.log(err)
      res.status(500).json(err);v
    }
  },
}