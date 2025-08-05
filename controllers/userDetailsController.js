const UserDetails = require("../models/UserDetails");

exports.saveUserDetails = async (req, res) => {
  const { age, contact, city, state, status } = req.body;
  const userId = req.user.id;

  try {
    let details = await UserDetails.findOne({ userId });

    if (details) {
      // Update
      details.age = age;
      details.contact = contact;
      details.city = city;
      details.state = state;
      details.status = status;
      await details.save();
      return res.json({ message: "User details updated", data: details });
    } else {
      // Create
      const newDetails = new UserDetails({
        userId,
        age,
        contact,
        city,
        state,
        status,
      });
      await newDetails.save();
      return res
        .status(201)
        .json({ message: "User details saved", data: newDetails });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getUserDetails = async (req, res) => {
  const requestedUserId = req.params.userId;
  const requestingUser = req.user;

  try {
    if (
      requestingUser.role !== "admin" &&
      requestingUser.id !== requestedUserId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const details = await UserDetails.findOne({
      userId: requestedUserId,
    }).populate("userId");

    if (!details) return res.status(200).json({ message: "Details not found" });

    return res.json(details);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
