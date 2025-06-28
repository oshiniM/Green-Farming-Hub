import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { jsPDF } from "jspdf"; // Import jsPDF

const CropList = () => {
  const [crops, setCrops] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    fetchCrops();
  }, []); // Runs only once on component mount

  const fetchCrops = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/crop/all-crops"
      );
      setCrops(response.data.crops);
    } catch (error) {
      console.error("Error fetching crops:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/crop/delete-crop/${id}`);
      fetchCrops(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting crop:", error);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/edit-crop/${id}`); // Navigate to update page with crop ID
  };

  const handleAddCrop = () => {
    navigate("/AddCrop"); // Navigate to add crop page
  };

  // PDF Generation Function
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add Header Image
    const headerImage =
      "https://th.bing.com/th/id/OIP.huTNLBYhVjudN7Jnn8UmgwHaEk?rs=1&pid=ImgDetMain";
    doc.addImage(headerImage, "JPEG", 10, 10, 180, 40); // Add image at the top
  
    // Add Company Name and Address
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Set black color for text
    doc.text("Eco", 20, 60); // Company Name
    doc.setFontSize(12);
    doc.text("1234 EcoPro Street, Colombo, Sri Lanka", 20, 70); // Company Address
  
    // Add Invoice Title
    doc.setFontSize(18);
    doc.text("Invoice - Crop List", 20, 90);
  
    // Add Table Headers
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Set black color for text
    const headerX = [20, 60, 100, 150]; // X coordinates for each column header
    doc.text("Crop Name", headerX[0], 110);
    doc.text("Type", headerX[1], 110);
    doc.text("Location", headerX[2], 110);
    doc.text("Harvest Date", headerX[3], 110);
  
    // Line under headers for separation
    doc.setLineWidth(0.5);
    doc.line(20, 115, 210, 115); // Draw a horizontal line
  
    // Add Crops Data to PDF
    let yPosition = 120; // Start adding data after the line
    crops.forEach((crop) => {
      doc.setFontSize(12);
      doc.text(crop.cropName, headerX[0], yPosition); // Crop Name in left column
      doc.text(crop.cropType, headerX[1], yPosition); // Type in middle column
      doc.text(crop.fieldLocation, headerX[2], yPosition); // Location in middle column
      doc.text(new Date(crop.estimatedHarvestDate).toLocaleDateString(), headerX[3], yPosition); // Harvest Date in right column
      yPosition += 10; // Add some space between rows
    });
  
    // Save PDF
    doc.save("crops_invoice.pdf");
  };
  
  
  return (
    <div className="container mx-auto p-6 mb-40 mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="mt-10 text-2xl font-semibold"><span className="text-green-500">Crop</span> Marketplace</h1>
        <button
          onClick={handleAddCrop}
          className="bg-black text-green-400 py-2 px-4 rounded-md hover:bg-gray-700 mt-4"
        >
          Add Crop
        </button>
      </div>

      {/* PDF Generate Button */}
      <button
        onClick={generatePDF}
        className="bg-black text-green-400 py-2 px-4 rounded-md mb-6 hover:bg-gray-700"
      >
        Generate PDF
      </button>

      <table className="min-w-full bg-white border border-black shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white text-left">
            <th className="py-3 px-4 font-semibold">Crop Name</th>
            <th className="py-3 px-4 font-semibold">Type</th>
            <th className="py-3 px-4 font-semibold">Location</th>
            <th className="py-3 px-4 font-semibold">Planting Date</th>
            <th className="py-3 px-4 font-semibold">Harvest Date</th>
            <th className="py-3 px-4 font-semibold">Image</th>
            <th className="py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {crops.map((crop) => (
            <tr
              key={crop._id}
              className="border-t border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-4">{crop.cropName}</td>
              <td className="py-3 px-4">{crop.cropType}</td>
              <td className="py-3 px-4">{crop.fieldLocation}</td>
              <td className="py-3 px-4">
                {new Date(crop.plantingDate).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                {new Date(crop.estimatedHarvestDate).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <img
                  src={crop.cropImage.url}
                  alt={crop.cropName}
                  className="w-24 h-24 object-cover rounded-md"
                />
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleUpdate(crop._id)}
                  className="bg-black text-green-400 py-1 px-3 mr-2 rounded-md hover:bg-gray-700"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(crop._id)}
                  className="bg-black text-green-400 py-1 px-3 rounded-md hover:bg-gray-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CropList;
