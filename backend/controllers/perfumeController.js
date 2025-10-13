const Perfume = require('../models/Perfume');
const Brand = require('../models/Brand');

// Get all perfumes with filtering and search
const getAllPerfumes = async (req, res) => {
  try {
    const { search, brand, targetAudience, concentration, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { perfumeName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (brand) {
      // Find brand by name
      const brandDoc = await Brand.findOne({ brandName: { $regex: brand, $options: 'i' } });
      if (brandDoc) {
        filter.brand = brandDoc._id;
      }
    }
    
    if (targetAudience) {
      filter.targetAudience = targetAudience;
    }
    
    if (concentration) {
      filter.concentration = concentration;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get perfumes with brand population
    const perfumes = await Perfume.find(filter)
      .populate('brand', 'brandName')
      .populate('comments.author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Perfume.countDocuments(filter);

    res.json({
      success: true,
      data: { 
        perfumes,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: perfumes.length,
          totalItems: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching perfumes',
      error: error.message
    });
  }
};

// Get single perfume with full details
const getPerfumeById = async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.perfumeId)
      .populate('brand', 'brandName')
      .populate('comments.author', 'name email');
    
    if (!perfume) {
      return res.status(404).json({
        success: false,
        message: 'Perfume not found'
      });
    }

    res.json({
      success: true,
      data: { perfume }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching perfume',
      error: error.message
    });
  }
};

// Create perfume (Admin only)
const createPerfume = async (req, res) => {
  try {
    const {
      perfumeName,
      uri,
      price,
      concentration,
      description,
      ingredients,
      volume,
      targetAudience,
      brand
    } = req.body;

    // Verify brand exists
    const brandDoc = await Brand.findById(brand);
    if (!brandDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand ID'
      });
    }

    const perfume = new Perfume({
      perfumeName,
      uri,
      price,
      concentration,
      description,
      ingredients,
      volume,
      targetAudience,
      brand
    });

    await perfume.save();

    // Populate brand info for response
    await perfume.populate('brand', 'brandName');

    res.status(201).json({
      success: true,
      message: 'Perfume created successfully',
      data: { perfume }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating perfume',
      error: error.message
    });
  }
};

// Update perfume (Admin only)
const updatePerfume = async (req, res) => {
  try {
    const perfumeId = req.params.perfumeId;
    const updateData = req.body;

    // If brand is being updated, verify it exists
    if (updateData.brand) {
      const brandDoc = await Brand.findById(updateData.brand);
      if (!brandDoc) {
        return res.status(400).json({
          success: false,
          message: 'Invalid brand ID'
        });
      }
    }

    const perfume = await Perfume.findByIdAndUpdate(
      perfumeId,
      updateData,
      { new: true, runValidators: true }
    ).populate('brand', 'brandName');

    if (!perfume) {
      return res.status(404).json({
        success: false,
        message: 'Perfume not found'
      });
    }

    res.json({
      success: true,
      message: 'Perfume updated successfully',
      data: { perfume }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating perfume',
      error: error.message
    });
  }
};

// Delete perfume (Admin only)
const deletePerfume = async (req, res) => {
  try {
    const perfume = await Perfume.findByIdAndDelete(req.params.perfumeId);
    
    if (!perfume) {
      return res.status(404).json({
        success: false,
        message: 'Perfume not found'
      });
    }

    res.json({
      success: true,
      message: 'Perfume deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting perfume',
      error: error.message
    });
  }
};

// Add comment to perfume
const addComment = async (req, res) => {
  try {
    const { rating, content } = req.body;
    const perfumeId = req.params.perfumeId;
    const userId = req.user._id;

    const perfume = await Perfume.findById(perfumeId);
    if (!perfume) {
      return res.status(404).json({
        success: false,
        message: 'Perfume not found'
      });
    }

    // Check if user already commented on this perfume
    if (perfume.hasUserCommented(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You have already commented on this perfume'
      });
    }

    // Add comment
    const comment = {
      rating,
      content,
      author: userId
    };

    perfume.comments.push(comment);
    await perfume.save();

    // Populate the new comment
    await perfume.populate('comments.author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { 
        comment: perfume.comments[perfume.comments.length - 1]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// Update user's comment on perfume
const updateComment = async (req, res) => {
  try {
    const { rating, content } = req.body;
    const { perfumeId, commentId } = req.params;
    const userId = req.user._id;

    const perfume = await Perfume.findById(perfumeId);
    if (!perfume) {
      return res.status(404).json({
        success: false,
        message: 'Perfume not found'
      });
    }

    const comment = perfume.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns this comment
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments'
      });
    }

    comment.rating = rating;
    comment.content = content;
    
    await perfume.save();
    await perfume.populate('comments.author', 'name email');

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating comment',
      error: error.message
    });
  }
};

// Delete user's comment on perfume
const deleteComment = async (req, res) => {
  try {
    const { perfumeId, commentId } = req.params;
    const userId = req.user._id;

    const perfume = await Perfume.findById(perfumeId);
    if (!perfume) {
      return res.status(404).json({
        success: false,
        message: 'Perfume not found'
      });
    }

    const comment = perfume.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns this comment
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      });
    }

    comment.deleteOne();
    await perfume.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
};

module.exports = {
  getAllPerfumes,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  deletePerfume,
  addComment,
  updateComment,
  deleteComment
};