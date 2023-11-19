const { User } = require("../model/User");

exports.fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await User.findById(id, "name email id addresses").exec();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).exec();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json(error);
  }
};
