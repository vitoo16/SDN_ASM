const Perfume = require("../models/Perfume");
const Brand = require("../models/Brand");
const Member = require("../models/Member");

// Admin Dashboard - Main Page
exports.renderAdminDashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const brandPage = parseInt(req.query.brandPage) || 1;
    const memberPage = parseInt(req.query.memberPage) || 1;
    const limit = 10;

    // Fetch metrics (total counts)
    const [perfumesCount, brandsCount, membersCount] = await Promise.all([
      Perfume.countDocuments(),
      Brand.countDocuments(),
      Member.countDocuments(),
    ]);

    // Fetch paginated data
    const [perfumes, brands, members, allBrands] = await Promise.all([
      Perfume.find()
        .populate("brand")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Brand.find()
        .sort({ createdAt: -1 })
        .skip((brandPage - 1) * limit)
        .limit(limit),
      Member.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((memberPage - 1) * limit)
        .limit(limit),
      Brand.find().sort({ brandName: 1 }),
    ]);

    // Calculate pagination data
    const perfumesData = {
      perfumes,
      pagination: {
        current: page,
        total: Math.ceil(perfumesCount / limit),
        count: perfumes.length,
        totalItems: perfumesCount,
      },
    };

    const brandsData = {
      brands,
      pagination: {
        current: brandPage,
        total: Math.ceil(brandsCount / limit),
        count: brands.length,
        totalItems: brandsCount,
      },
    };

    const membersData = {
      members,
      pagination: {
        current: memberPage,
        total: Math.ceil(membersCount / limit),
        count: members.length,
        totalItems: membersCount,
      },
    };

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      user: req.session.user,
      metrics: {
        perfumes: perfumesCount,
        brands: brandsCount,
        members: membersCount,
      },
      perfumesData,
      brandsData,
      membersData,
      brands: allBrands,
    });
  } catch (error) {
    console.error("Error rendering admin dashboard:", error);
    res.status(500).render("error", {
      error: "Internal Server Error",
      message: "Failed to load admin dashboard",
      user: req.session.user,
    });
  }
};

// Create Perfume - Form Page
exports.renderCreatePerfumeForm = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ brandName: 1 });

    res.render("admin/perfume-form", {
      title: "Create Perfume",
      user: req.session.user,
      perfume: null,
      brands,
      isEdit: false,
    });
  } catch (error) {
    console.error("Error rendering create perfume form:", error);
    res.status(500).render("error", {
      error: "Internal Server Error",
      message: "Failed to load create perfume form",
      user: req.session.user,
    });
  }
};

// Edit Perfume - Form Page
exports.renderEditPerfumeForm = async (req, res) => {
  try {
    const { id } = req.params;

    const [perfume, brands] = await Promise.all([
      Perfume.findById(id).populate("brand"),
      Brand.find().sort({ brandName: 1 }),
    ]);

    if (!perfume) {
      return res.status(404).render("error", {
        error: "Not Found",
        message: "Perfume not found",
        user: req.session.user,
      });
    }

    res.render("admin/perfume-form", {
      title: "Edit Perfume",
      user: req.session.user,
      perfume,
      brands,
      isEdit: true,
    });
  } catch (error) {
    console.error("Error rendering edit perfume form:", error);
    res.status(500).render("error", {
      error: "Internal Server Error",
      message: "Failed to load edit perfume form",
      user: req.session.user,
    });
  }
};

// Create Perfume - Submit
exports.createPerfume = async (req, res) => {
  try {
    await Perfume.create(req.body);
    req.session.successMessage = `Perfume "${req.body.perfumeName}" created successfully`;
    res.redirect("/admin/dashboard?tab=perfumes");
  } catch (error) {
    console.error("Error creating perfume:", error);
    req.session.errorMessage = error.message || "Failed to create perfume";
    res.redirect("/admin/perfumes/create");
  }
};

// Update Perfume - Submit
exports.updatePerfume = async (req, res) => {
  try {
    const { id } = req.params;
    await Perfume.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    req.session.successMessage = `Perfume "${req.body.perfumeName}" updated successfully`;
    res.redirect("/admin/dashboard?tab=perfumes");
  } catch (error) {
    console.error("Error updating perfume:", error);
    req.session.errorMessage = error.message || "Failed to update perfume";
    res.redirect(`/admin/perfumes/edit/${id}`);
  }
};

// Create Brand - Form Page
exports.renderCreateBrandForm = async (req, res) => {
  try {
    res.render("admin/brand-form", {
      title: "Create Brand",
      user: req.session.user,
      brand: null,
      isEdit: false,
    });
  } catch (error) {
    console.error("Error rendering create brand form:", error);
    res.status(500).render("error", {
      error: "Internal Server Error",
      message: "Failed to load create brand form",
      user: req.session.user,
    });
  }
};

// Edit Brand - Form Page
exports.renderEditBrandForm = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).render("error", {
        error: "Not Found",
        message: "Brand not found",
        user: req.session.user,
      });
    }

    res.render("admin/brand-form", {
      title: "Edit Brand",
      user: req.session.user,
      brand,
      isEdit: true,
    });
  } catch (error) {
    console.error("Error rendering edit brand form:", error);
    res.status(500).render("error", {
      error: "Internal Server Error",
      message: "Failed to load edit brand form",
      user: req.session.user,
    });
  }
};

// Create Brand - Submit
exports.createBrand = async (req, res) => {
  try {
    await Brand.create(req.body);
    req.session.successMessage = `Brand "${req.body.brandName}" created successfully`;
    res.redirect("/admin/dashboard?tab=brands");
  } catch (error) {
    console.error("Error creating brand:", error);
    req.session.errorMessage = error.message || "Failed to create brand";
    res.redirect("/admin/brands/create");
  }
};

// Update Brand - Submit
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    req.session.successMessage = `Brand "${req.body.brandName}" updated successfully`;
    res.redirect("/admin/dashboard?tab=brands");
  } catch (error) {
    console.error("Error updating brand:", error);
    req.session.errorMessage = error.message || "Failed to update brand";
    res.redirect(`/admin/brands/edit/${id}`);
  }
};
