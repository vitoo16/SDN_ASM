require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const jwt = require("jsonwebtoken");
const passport = require("./config/passport");

// Import routes
const memberRoutes = require("./routes/members");
const brandRoutes = require("./routes/brands");
const perfumeRoutes = require("./routes/perfumes");
const authRoutes = require("./routes/auth");

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
// Method override for PUT/DELETE from forms
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "odour-perfume-secret-key-2024",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGODB_URI || "mongodb://localhost:27017/perfume_db",
      ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware to make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!req.session.user;
  next();
});

// Helper function to render with layout
const renderWithLayout = (res, view, data = {}) => {
  const defaultData = {
    title: "",
    additionalCSS: [],
    additionalJS: [],
    ...data,
  };

  res.render(view, {
    ...defaultData,
    body: "", // Will be populated by the view
  });
};

// Import controllers
const Perfume = require("./models/Perfume");
const Brand = require("./models/Brand");
const Member = require("./models/Member");
const bcrypt = require("bcryptjs");

// ======================
// PUBLIC ROUTES
// ======================

// Home Page
app.get("/", async (req, res) => {
  try {
    const {
      search,
      brand,
      targetAudience,
      concentration,
      page = 1,
    } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Build filter query
    let query = {};
    if (search && search !== 'undefined') {
      query.perfumeName = { $regex: search, $options: "i" };
    }
    if (brand && brand !== 'undefined') {
      query.brand = brand;
    }
    if (targetAudience && targetAudience !== 'undefined') {
      query.targetAudience = targetAudience;
    }
    if (concentration && concentration !== 'undefined') {
      query.concentration = concentration;
    }

    // Fetch perfumes with pagination
    const perfumes = await Perfume.find(query)
      .populate("brand")
      .populate("comments.author", "name email")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalPerfumes = await Perfume.countDocuments(query);
    const totalPages = Math.ceil(totalPerfumes / limit);

    // Fetch all brands for filter
    const brands = await Brand.find().sort({ brandName: 1 });

    // Featured perfumes for hero section
    const featuredPerfumes = await Perfume.find()
      .populate("brand")
      .limit(5)
      .sort({ createdAt: -1 });

    res.render("home", {
      perfumes,
      brands,
      featuredPerfumes,
      filters: { search, brand, targetAudience, concentration },
      pagination: {
        current: parseInt(page),
        total: totalPages,
        totalItems: totalPerfumes,
      },
      searchQuery: search || "",
    });
  } catch (error) {
    console.error("Error fetching perfumes:", error);
    res.status(500).render("error", {
      error: "Failed to load perfumes",
      message: error.message,
    });
  }
});

// Perfume Detail Page
app.get("/perfumes/:id", async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.id)
      .populate("brand")
      .populate("comments.author", "name email");

    if (!perfume) {
      return res.status(404).render("error", {
        error: "Perfume not found",
        message: "The perfume you are looking for does not exist.",
      });
    }

    res.render("perfume-detail", {
      perfume,
      title: perfume.perfumeName,
    });
  } catch (error) {
    console.error("Error fetching perfume:", error);
    res.status(500).render("error", {
      error: "Failed to load perfume details",
      message: error.message,
    });
  }
});

// Cart Page
app.get("/cart", (req, res) => {
  res.render("cart", {
    title: "Shopping Cart",
  });
});

// Collections/Browse Page (alias for home with filters)
app.get("/collections", async (req, res) => {
  try {
    const { brand, targetAudience, concentration, page = 1 } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;

    let query = {};
    if (brand) query.brand = brand;
    if (targetAudience) query.targetAudience = targetAudience;
    if (concentration) query.concentration = concentration;

    const perfumes = await Perfume.find(query)
      .populate("brand")
      .populate("comments.author", "name email")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalPerfumes = await Perfume.countDocuments(query);
    const totalPages = Math.ceil(totalPerfumes / limit);

    const brands = await Brand.find().sort({ brandName: 1 });

    res.render("home", {
      perfumes,
      brands,
      featuredPerfumes: [],
      filters: { brand, targetAudience, concentration, search: "" },
      pagination: {
        current: parseInt(page),
        total: totalPages,
        totalItems: totalPerfumes,
      },
      searchQuery: "",
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).render("error", {
      error: "Failed to load collections",
      message: error.message,
    });
  }
});

// ======================
// AUTH ROUTES
// ======================

// Login Page - Redirect to home with modal
app.get("/auth/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  // Redirect to home, modal will be opened by client-side script
  const redirectUrl = req.query.redirect || "/";
  res.redirect(`${redirectUrl}?openAuth=login`);
});

// Login POST
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const member = await Member.findOne({ email });
    if (!member) {
      return res.render("auth/login", {
        title: "Login",
        error: "Invalid email or password",
        redirect: req.body.redirect || "/",
      });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.render("auth/login", {
        title: "Login",
        error: "Invalid email or password",
        redirect: req.body.redirect || "/",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: member._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    });

    // Set JWT token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Also set session for backward compatibility
    req.session.user = {
      _id: member._id.toString(),
      email: member.email,
      name: member.name,
      isAdmin: member.isAdmin,
      gender: member.gender,
      YOB: member.YOB,
    };

    const redirectUrl = req.body.redirect || req.query.redirect || "/";

    // For admin dashboard AJAX calls, set token in localStorage via redirect page
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Logging in...</title></head>
      <body>
        <p>Logging in...</p>
        <script>
          // Set token in localStorage for admin dashboard AJAX calls
          localStorage.setItem('token', '${token}');
          // Redirect to target page
          window.location.href = '${redirectUrl}';
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Login error:", error);
    res.render("auth/login", {
      title: "Login",
      error: "An error occurred. Please try again.",
      redirect: req.body.redirect || "/",
    });
  }
});

// Register Page - Redirect to home with modal
app.get("/auth/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  // Redirect to home, modal will be opened by client-side script
  const redirectUrl = req.query.redirect || "/";
  res.redirect(`${redirectUrl}?openAuth=register`);
});

// Register POST
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, YOB, gender } = req.body;

    // Validation
    if (password !== confirmPassword) {
      return res.render("auth/register", {
        title: "Register",
        error: "Passwords do not match",
        redirect: req.body.redirect || "/",
      });
    }

    // Check if user exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.render("auth/register", {
        title: "Register",
        error: "Email already registered",
        redirect: req.body.redirect || "/",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new member
    const member = await Member.create({
      name,
      email,
      password: hashedPassword,
      YOB: parseInt(YOB),
      gender: gender === "true",
      isAdmin: false,
    });

    // Generate JWT token
    const token = jwt.sign({ id: member._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    });

    // Set JWT token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Also set session for backward compatibility
    req.session.user = {
      _id: member._id.toString(),
      email: member.email,
      name: member.name,
      isAdmin: member.isAdmin,
      gender: member.gender,
      YOB: member.YOB,
    };

    const redirectUrl = req.body.redirect || req.query.redirect || "/";

    // For admin dashboard AJAX calls, set token in localStorage via redirect page
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Registering...</title></head>
      <body>
        <p>Account created! Redirecting...</p>
        <script>
          // Set token in localStorage for admin dashboard AJAX calls
          localStorage.setItem('token', '${token}');
          // Redirect to target page
          window.location.href = '${redirectUrl}';
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Register error:", error);
    res.render("auth/register", {
      title: "Register",
      error: "An error occurred. Please try again.",
      redirect: req.body.redirect || "/",
    });
  }
});

// Logout
app.post("/auth/logout", (req, res) => {
  // Clear the token cookie
  res.clearCookie("token");

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }

    // Clear localStorage token and redirect
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Logging out...</title></head>
      <body>
        <p>Logging out...</p>
        <script>
          // Clear token from localStorage
          localStorage.removeItem('token');
          // Redirect to home
          window.location.href = '/';
        </script>
      </body>
      </html>
    `);
  });
});

// ======================
// PROTECTED ROUTES
// ======================

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login?redirect=" + req.originalUrl);
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).render("error", {
      error: "Access Denied",
      message: "You must be an administrator to access this page.",
    });
  }
  next();
};

// Profile Page
app.get("/profile", requireAuth, (req, res) => {
  res.render("profile", {
    title: "My Profile",
  });
});

// Admin Dashboard Routes
const adminController = require("./controllers/adminController");

// Main Dashboard
app.get("/admin/dashboard", requireAdmin, adminController.renderAdminDashboard);
app.get("/admin", requireAdmin, (req, res) => {
  res.redirect("/admin/dashboard");
});

// Perfume Management
app.get(
  "/admin/perfumes/create",
  requireAdmin,
  adminController.renderCreatePerfumeForm
);
app.get(
  "/admin/perfumes/edit/:id",
  requireAdmin,
  adminController.renderEditPerfumeForm
);
app.post("/admin/perfumes/create", requireAdmin, adminController.createPerfume);
app.post(
  "/admin/perfumes/edit/:id",
  requireAdmin,
  adminController.updatePerfume
);

// Brand Management
app.get(
  "/admin/brands/create",
  requireAdmin,
  adminController.renderCreateBrandForm
);
app.get(
  "/admin/brands/edit/:id",
  requireAdmin,
  adminController.renderEditBrandForm
);
app.post("/admin/brands/create", requireAdmin, adminController.createBrand);
app.post("/admin/brands/edit/:id", requireAdmin, adminController.updateBrand);

// ======================
// COMMENT ROUTES
// ======================

// Add Comment
app.post("/perfumes/:id/comments", requireAuth, async (req, res) => {
  try {
    const { rating, content } = req.body;
    const perfume = await Perfume.findById(req.params.id);

    if (!perfume) {
      return res.status(404).redirect("/");
    }

    // Check if user already commented on this perfume
    if (perfume.hasUserCommented(req.session.user._id)) {
      req.session.errorMessage = "You have already reviewed this perfume. You can edit your existing review instead.";
      return res.redirect(`/perfumes/${req.params.id}`);
    }

    perfume.comments.push({
      rating: parseInt(rating),
      content,
      author: req.session.user._id,
    });

    await perfume.save();
    req.session.successMessage = "Review submitted successfully!";
    res.redirect(`/perfumes/${req.params.id}`);
  } catch (error) {
    console.error("Error adding comment:", error);
    req.session.errorMessage = "Failed to submit review. Please try again.";
    res.redirect(`/perfumes/${req.params.id}`);
  }
});

// Edit Comment
app.post(
  "/perfumes/:perfumeId/comments/:commentId/edit",
  requireAuth,
  async (req, res) => {
    try {
      const { rating, content } = req.body;
      const perfume = await Perfume.findById(req.params.perfumeId);

      if (!perfume) {
        return res.status(404).redirect("/");
      }

      const comment = perfume.comments.id(req.params.commentId);
      if (!comment) {
        return res.redirect(`/perfumes/${req.params.perfumeId}`);
      }

      // Check if user is the author or admin
      if (
        comment.author.toString() !== req.session.user._id &&
        !req.session.user.isAdmin
      ) {
        return res.status(403).redirect(`/perfumes/${req.params.perfumeId}`);
      }

      comment.rating = parseInt(rating);
      comment.content = content;

      await perfume.save();
      res.redirect(`/perfumes/${req.params.perfumeId}`);
    } catch (error) {
      console.error("Error editing comment:", error);
      res.redirect(`/perfumes/${req.params.perfumeId}`);
    }
  }
);

// Delete Comment
app.post(
  "/perfumes/:perfumeId/comments/:commentId/delete",
  requireAuth,
  async (req, res) => {
    try {
      const perfume = await Perfume.findById(req.params.perfumeId);

      if (!perfume) {
        return res.status(404).redirect("/");
      }

      const comment = perfume.comments.id(req.params.commentId);
      if (!comment) {
        return res.redirect(`/perfumes/${req.params.perfumeId}`);
      }

      // Check if user is the author or admin
      if (
        comment.author.toString() !== req.session.user._id &&
        !req.session.user.isAdmin
      ) {
        return res.status(403).redirect(`/perfumes/${req.params.perfumeId}`);
      }

      comment.deleteOne();
      await perfume.save();
      res.redirect(`/perfumes/${req.params.perfumeId}`);
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.redirect(`/perfumes/${req.params.perfumeId}`);
    }
  }
);

// ======================
// API ROUTES (for AJAX)
// ======================
app.use("/api/members", memberRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/perfumes", perfumeRoutes);

// OAuth Routes
app.use("/auth", authRoutes);

// ======================
// ERROR HANDLERS
// ======================

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", {
    error: "404 - Page Not Found",
    message: "The page you are looking for does not exist.",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).render("error", {
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// ======================
// DATABASE & SERVER
// ======================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/perfume_db"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`View the app at: http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
