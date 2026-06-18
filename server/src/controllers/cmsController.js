const WebsiteCMS = require('../models/WebsiteCMS');

exports.updateCMSSection = async (req, res) => {
  try {
    const { section, content } = req.body;
    
    let cmsData = await WebsiteCMS.findOneAndUpdate(
      { section },
      { content, lastUpdatedBy: req.user?.id },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: `${section} updated successfully`,
      data: cmsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCMSSection = async (req, res) => {
  try {
    const { section } = req.params;
    const cmsData = await WebsiteCMS.findOne({ section });
    
    if (!cmsData) {
      return res.status(200).json({
        success: true,
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: cmsData.content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllCMSStatus = async (req, res) => {
  try {
    const cmsData = await WebsiteCMS.find({}, 'section isEnabled updatedAt content');
    res.status(200).json({
      success: true,
      data: cmsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.toggleCMSSection = async (req, res) => {
  try {
    const { section } = req.params;
    const { isEnabled } = req.body;
    
    let cmsData = await WebsiteCMS.findOneAndUpdate(
      { section },
      { isEnabled, lastUpdatedBy: req.user?.id },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: `${section} status updated to ${isEnabled ? 'Published' : 'Disabled'}`,
      data: cmsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
