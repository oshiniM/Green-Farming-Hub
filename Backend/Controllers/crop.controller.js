const cloudinary = require("../utils/cloudinaryConfig");
const Crop = require("../models/crop");

exports.createCrop = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Crop image is required" });
    }

    // Upload image to Cloudinary using buffer
    const uploadedImage = await cloudinary.uploader.upload(`data:image/png;base64,${req.file.buffer.toString("base64")}`, {
      folder: "crop_images",
    });

    // Ensure planting date and estimated harvest date are valid
    const plantingDate = new Date(req.body.plantingDate);
    const estimatedHarvestDate = new Date(req.body.estimatedHarvestDate);
    if (estimatedHarvestDate <= plantingDate) {
      return res.status(400).json({ message: "Estimated harvest date must be after planting date" });
    }

    // Create crop entry
    const cropData = {
      ...req.body,
      cropImage: { public_id: uploadedImage.public_id, url: uploadedImage.secure_url },
    };

    const newCrop = new Crop(cropData);
    await newCrop.save();

    return res.status(201).json({ message: "Crop added successfully", crop: newCrop });
  } catch (error) {
    console.error("Error creating crop:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Edit an existing crop
exports.editCrop = async (req, res) => {
  try {
    const { id } = req.params; // Use id instead of cropId
    const data = req.body;

    console.log("Received data:", data);  // Log received data from the frontend

    // Find the existing crop
    const existingCrop = await Crop.findById(id);
    if (!existingCrop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    console.log("Existing crop:", existingCrop);  // Log existing crop data

    // Validate planting and harvest dates if updated
    if (data.plantingDate && data.estimatedHarvestDate) {
      const plantingDate = new Date(data.plantingDate);
      const estimatedHarvestDate = new Date(data.estimatedHarvestDate);
      console.log("Planting Date:", plantingDate);  // Log planting date
      console.log("Estimated Harvest Date:", estimatedHarvestDate);  // Log estimated harvest date

      if (estimatedHarvestDate <= plantingDate) {
        return res.status(400).json({ message: "Estimated harvest date must be after planting date" });
      }
    }

    // If a new image is uploaded, replace the existing image in Cloudinary
    if (data.cropImage && data.cropImage !== existingCrop.cropImage.url) {
      try {
        console.log("New crop image:", data.cropImage);  // Log new crop image if it exists

        // Delete old image from Cloudinary if it exists
        if (existingCrop.cropImage && existingCrop.cropImage.public_id) {
          console.log("Deleting old image from Cloudinary:", existingCrop.cropImage.public_id);  // Log old image ID
          await cloudinary.uploader.destroy(existingCrop.cropImage.public_id);
        }

        // If the image is a base64 string, convert it into a format Cloudinary can process
        let uploadImage;
        if (data.cropImage.startsWith("data:image/")) {
          // If it's a base64 string, upload using the base64 encoded data
          uploadImage = await cloudinary.uploader.upload(data.cropImage, { folder: "crop_images", resource_type: "auto" });
        } else {
          // If it's a URL or path, upload normally
          uploadImage = await cloudinary.uploader.upload(data.cropImage, { folder: "crop_images", resource_type: "auto" });
        }

        data.cropImage = { public_id: uploadImage.public_id, url: uploadImage.secure_url };
        console.log("Uploaded image:", data.cropImage);  // Log uploaded image details
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(500).json({ message: "Failed to upload image to Cloudinary", error: uploadError.message });
      }
    }

    // Remove any properties that should not be updated, like timestamps
    const updateData = { ...data };
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    console.log("Update data after removing unwanted fields:", updateData);  // Log final data to be updated

    // Update the crop details
    const updatedCrop = await Crop.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    console.log("Updated crop:", updatedCrop);  // Log the updated crop

    if (!updatedCrop) {
      return res.status(500).json({ message: "Failed to update crop" });
    }

    return res.status(200).json({ message: "Crop updated successfully", crop: updatedCrop });

  } catch (error) {
    console.error("Error in update:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};





exports.getAllCrops = async (req, res) => {
    try {
      const crops = await Crop.find().populate("userId", "name email"); // Populate user info if needed
      res.status(200).json({ message: "Crops fetched successfully", crops });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

  exports.deleteCrop = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the crop by ID
      const crop = await Crop.findById(id);
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
  
      // Delete the image from Cloudinary if it exists
      if (crop.cropImage && crop.cropImage.public_id) {
        try {
          await cloudinary.uploader.destroy(crop.cropImage.public_id);
        } catch (cloudinaryError) {
          return res.status(500).json({ message: "Failed to delete image from Cloudinary", error: cloudinaryError.message });
        }
      }
  
      // Delete the crop from the database
      await Crop.findByIdAndDelete(id);
  
      res.status(200).json({ message: "Crop deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  // Controller method to fetch a crop by its ID


  exports.getCropById = async (req, res) => {
    try {
      const { id } = req.params; // Get the crop ID from the URL
      const crop = await Crop.findById(id).populate('userId'); // Populate userId field
  
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
  
      res.status(200).json({ crop }); // Return the crop data with populated userId
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
