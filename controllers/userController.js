// ObjectId() method for converting userId string into an ObjectId for querying database
const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {

  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      const userObj = {
        users,
      };
      return res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })


      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json({
        user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a user and remove them from the thought
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No such user exists' })
      }

      const thought = await Thought.findOneAndUpdate(
        { users: req.params.userId },
        { $pull: { users: req.params.userId } },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({
          message: 'User deleted, but no thoughts found',
        });
      }

      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Get a single user
  async updateSingleUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // add a freind
  async addFriend(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
      if (!user) {
        return res.status(404).json({ message: 'No such user exists' })
      }

      const friend = await User.findOne({ _id: req.params.friendId })
      if (!friend) {
        return res.status(404).json({ message: 'No such friend exists' })
      }
      
      if (user.friends.includes(friend._id)) {
        return res.status(404).json({ message: 'Friendship already exists' })
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { new: true },
      );

      res.json(updatedUser );
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },

  async deleteFriend(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
      if (!user) {
        return res.status(404).json({ message: 'No such user exists' })
      }

      const friend = await User.findOne({ _id: req.params.friendId })
      if (!friend) {
        return res.status(404).json({ message: 'No such friend exists' })
      }
      
      if (!user.friends.includes(friend._id)) {
        return res.status(404).json({ message: 'No friendship already exists' })
      }

      console.log(req.params.userId);
      console.log(req.params.friendId);

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