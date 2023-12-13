const { User, Thought } = require("../models");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find().select("-__v");

      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const singleUser = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("thoughts")
        .populate("friends");

      if (!singleUser) {
        return res
          .status(404)
          .json({ message: "No user found with the provided ID." });
      }

      res.json(singleUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async createUser(req, res) {
    try {
      const createdUser = await User.create(req.body);
      res.json(createdUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: req.params.userId,
        },
        {
          $set: req.body,
        }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "No user found with the provided ID." });
      }

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findOneAndRemove({
        _id: req.params.userId,
      });
      if (!deletedUser) {
        res.json({
          message: "No user found with the provided ID. Could not delete.",
        });
      } else {
        res.json({ message: "User successfully deleted!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async addFriend(req, res) {
    try {
        const newFriend = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId}},
            {new: true}
        );
        if (!newFriend) {
            res.json({message: "User or Friend not found"});
        } else {
            res.json({message: "Friend successfully added!"});
        }
    } catch (err) {
        res.status(500).json(err);
    }
  },
  async removeFriend(req, res) {
    try {
        const deleteFriend = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId}},
            {new: true}
        );
        if (!deleteFriend) {
            res.json({message: "User or Friend not found. Could not remove friend."});
        } else {
            res.json({message: "Friend successfully removed!"});
        }
    } catch (err) {
        res.status(500).json(err);
    }
  }
};
