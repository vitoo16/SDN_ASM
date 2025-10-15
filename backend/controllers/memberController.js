const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Member = require("../models/Member");
const Perfume = require("../models/Perfume");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// Register member
const registerMember = async (req, res) => {
  try {
    const { email, password, name, YOB, gender } = req.body;

    // Check if member already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Member with this email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create member
    const member = new Member({
      email,
      password: hashedPassword,
      name,
      YOB,
      gender,
      isAdmin: false, // Default to non-admin
    });

    await member.save();

    // Generate token
    const token = generateToken(member._id);

    res.status(201).json({
      success: true,
      message: "Member registered successfully",
      data: {
        member: {
          _id: member._id,
          email: member.email,
          name: member.name,
          YOB: member.YOB,
          gender: member.gender,
          isAdmin: member.isAdmin,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering member",
      error: error.message,
    });
  }
};

// Login member
const loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find member by email
    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, member.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(member._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        member: {
          _id: member._id,
          email: member.email,
          name: member.name,
          YOB: member.YOB,
          gender: member.gender,
          isAdmin: member.isAdmin,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// Get current member profile
const getProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.user._id).select("-password");

    res.json({
      success: true,
      data: { member },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// Update member profile
const updateProfile = async (req, res) => {
  try {
    const { name, YOB, gender } = req.body;
    const memberId = req.params.id;

    // Ensure the authenticated user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const member = await Member.findByIdAndUpdate(
      memberId,
      { name, YOB, gender },
      { new: true, runValidators: true }
    ).select("-password");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { member },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const memberId = req.params.id;

    // Ensure the authenticated user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      member.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    member.password = hashedNewPassword;
    await member.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

// Get all members (Admin only)
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().select("-password");

    res.json({
      success: true,
      data: {
        members,
        count: members.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching members",
      error: error.message,
    });
  }
};

// Get user's reviews/comments
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all perfumes that contain comments by this user
    const perfumes = await Perfume.find({
      "comments.author": userId,
    })
      .populate("brand", "brandName")
      .select("perfumeName uri comments brand");

    // Extract only the user's comments from each perfume
    const userReviews = [];
    perfumes.forEach((perfume) => {
      const userComments = perfume.comments.filter(
        (comment) => comment.author.toString() === userId.toString()
      );

      userComments.forEach((comment) => {
        userReviews.push({
          _id: comment._id,
          perfumeId: perfume._id,
          perfumeName: perfume.perfumeName,
          perfumeImage: perfume.uri,
          brandName: perfume.brand?.brandName || "Unknown Brand",
          rating: comment.rating,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        });
      });
    });

    // Sort by creation date, newest first
    userReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: {
        reviews: userReviews,
        count: userReviews.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user reviews",
      error: error.message,
    });
  }
};

module.exports = {
  registerMember,
  loginMember,
  getProfile,
  updateProfile,
  changePassword,
  getAllMembers,
  getUserReviews,
};
