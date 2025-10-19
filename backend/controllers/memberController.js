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

    // Set token in cookie for EJS views (httpOnly for security)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

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

// Render profile page (for EJS views)
const renderProfilePage = async (req, res) => {
  try {
    const member = await Member.findById(req.user._id).select("-password");

    // Fetch user reviews (will be empty for admin since they can't review)
    let userReviews = [];
    const Perfume = require("../models/Perfume");
    const perfumes = await Perfume.find({
      "comments.author": member._id,
    })
      .populate("brand", "brandName")
      .select("perfumeName uri comments brand");

    perfumes.forEach((perfume) => {
      const userComments = perfume.comments.filter(
        (comment) => comment.author.toString() === member._id.toString()
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

    userReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get flash messages from session
    const success = req.session.profileSuccess;
    const error = req.session.profileError;
    const passwordSuccess = req.session.passwordSuccess;
    const passwordError = req.session.passwordError;

    // Clear flash messages
    delete req.session.profileSuccess;
    delete req.session.profileError;
    delete req.session.passwordSuccess;
    delete req.session.passwordError;

    res.render("profile", {
      user: member,
      userReviews,
      success,
      error,
      passwordSuccess,
      passwordError,
    });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error loading profile",
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
      if (req.accepts('html')) {
        return res.redirect('/auth/login');
      }
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
      if (req.accepts('html')) {
        return res.render('error', {
          message: 'Member not found',
          error: { status: 404 }
        });
      }
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // For HTML form submissions, redirect back to profile with success message
    if (req.accepts('html')) {
      req.session.profileSuccess = 'Profile updated successfully!';
      return res.redirect('/api/members/profile/view');
    }

    // For API calls, return JSON
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { member },
    });
  } catch (error) {
    if (req.accepts('html')) {
      req.session.profileError = error.message || 'Error updating profile';
      return res.redirect('/api/members/profile/view');
    }
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
      if (req.accepts('html')) {
        return res.redirect('/auth/login');
      }
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      if (req.accepts('html')) {
        req.session.passwordError = 'Member not found';
        return res.redirect('/api/members/profile/view');
      }
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
      if (req.accepts('html')) {
        req.session.passwordError = 'Current password is incorrect';
        return res.redirect('/api/members/profile/view');
      }
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

    // For HTML form submissions, redirect back to profile with success message
    if (req.accepts('html')) {
      req.session.passwordSuccess = 'Password changed successfully!';
      return res.redirect('/api/members/profile/view');
    }

    // For API calls, return JSON
    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    if (req.accepts('html')) {
      req.session.passwordError = error.message || 'Error changing password';
      return res.redirect('/api/members/profile/view');
    }
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
    const { search, isAdmin, gender, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isAdmin !== undefined) {
      filter.isAdmin = isAdmin === 'true';
    }
    
    if (gender !== undefined) {
      if (gender === "true" || gender === true) {
        filter.gender = true;
      } else if (gender === "false" || gender === false) {
        filter.gender = false;
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const members = await Member.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Member.countDocuments(filter);

    res.json({
      success: true,
      data: {
        members,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: members.length,
          totalItems: total
        }
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

    // Admin cannot have reviews
    if (req.user.isAdmin) {
      return res.json({
        success: true,
        data: {
          reviews: [],
          count: 0,
        },
        message: "Admins cannot have reviews",
      });
    }

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
  renderProfilePage,
  updateProfile,
  changePassword,
  getAllMembers,
  getUserReviews,
};
