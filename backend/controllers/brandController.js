const Brand = require('../models/Brand');

// Get all brands
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ brandName: 1 });
    
    res.json({
      success: true,
      data: { 
        brands,
        count: brands.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching brands',
      error: error.message
    });
  }
};

// Get single brand
const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.brandId);
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      data: { brand }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching brand',
      error: error.message
    });
  }
};

// Create brand (Admin only)
const createBrand = async (req, res) => {
  try {
    const { brandName } = req.body;

    // Check if brand already exists
    const existingBrand = await Brand.findOne({ brandName });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: 'Brand with this name already exists'
      });
    }

    const brand = new Brand({ brandName });
    await brand.save();

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: { brand }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating brand',
      error: error.message
    });
  }
};

// Update brand (Admin only)
const updateBrand = async (req, res) => {
  try {
    const { brandName } = req.body;
    const brandId = req.params.brandId;

    // Check if another brand with the same name exists
    const existingBrand = await Brand.findOne({ 
      brandName, 
      _id: { $ne: brandId } 
    });
    
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: 'Brand with this name already exists'
      });
    }

    const brand = await Brand.findByIdAndUpdate(
      brandId,
      { brandName },
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: { brand }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating brand',
      error: error.message
    });
  }
};

// Delete brand (Admin only)
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.brandId);
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting brand',
      error: error.message
    });
  }
};

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
};