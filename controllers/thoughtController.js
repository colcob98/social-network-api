const { User, Thought } = require("../models");

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().select("-__v");
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const singleThought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      if (!singleThought) {
        return res
          .status(404)
          .json({ message: "No thought found with the provided ID." });
      }

      res.json(singleThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async createThought(req, res) {
    try {
      const createdThought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: createdThought._id } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          message: "Thought created, but found no user with that ID",
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        {
          $set: req.body,
        },
        {
          runValidators: true,
          new: true,
        }
      );
      res.json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteThought(req, res) {
    try {
      deletedThought = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });
      if (!deletedThought) {
        return res.status(404).json({
          message: "No thought found with the provided ID. Could not delete.",
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async addReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!reaction) {
        return res.status(404).json({
          message: "No thought with this id!",
        });
      }
      res.json(reaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async removeReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.body.thoughtId },
        { $pull: { reactions: req.params.reactionId } },
        { new: true }
      );
      if (!reaction) {
        return res.status(404).json({
          message: "No thought with this id!",
        });
      }
      res.json(reaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
