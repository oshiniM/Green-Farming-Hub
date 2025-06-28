import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCrop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/crop/crop/${id}`);
        setCrop(response.data.crop);
      } catch (error) {
        setErrorMessage('Error fetching crop data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCrop();
  }, [id]);

  const handleChange = (e) => {
    setCrop({
      ...crop,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    // Validation check
    if (!crop.cropName || !crop.fieldLocation || !crop.plantingDate || !crop.estimatedHarvestDate) {
      setErrorMessage('Please fill all required fields.');
      return;
    }
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append('cropName', crop.cropName);
    formData.append('cropType', crop.cropType);
    formData.append('fieldLocation', crop.fieldLocation);
    formData.append('plantingDate', new Date(crop.plantingDate).toISOString());
    formData.append('estimatedHarvestDate', new Date(crop.estimatedHarvestDate).toISOString());
    formData.append('soilType', crop.soilType);
    formData.append('growthStage', crop.growthStage);
    formData.append('healthStatus', crop.healthStatus);
  
    if (newImage) {
      formData.append('cropImage', newImage);
    }
  
    try {
      const response = await axios.put(`http://localhost:4000/api/crop/edit-crops/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.success) {
        alert('Crop updated successfully');
        console.log("Navigating to /Allcrops...");  // Add console log for debugging
        navigate('/Allcrops');  // Navigate to /Allcrops immediately after update
      } else {
        setErrorMessage(response.data.message || 'Error updating crop.');
      }
    } catch (error) {
      setErrorMessage('Failed to update crop. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  };

  if (loading) return <div>Loading...</div>;

  if (!crop) return <div>No crop data found!</div>;

  return (
    <div className="container mx-auto p-6 mb-40 mt-10 max-w-3xl bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Crop</h2>
      
      {errorMessage && <div className="mb-4 p-4 text-white bg-red-500 rounded">{errorMessage}</div>}
      
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cropName">Crop Name *</label>
          <input
            type="text"
            id="cropName"
            name="cropName"
            value={crop.cropName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter crop name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cropType">Crop Type</label>
          <select
            id="cropType"
            name="cropType"
            value={crop.cropType}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Seasonal">Seasonal</option>
            <option value="Perennial">Perennial</option>
            <option value="Annual">Annual</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fieldLocation">Field Location *</label>
          <input
            type="text"
            id="fieldLocation"
            name="fieldLocation"
            value={crop.fieldLocation}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter field location"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plantingDate">Planting Date *</label>
          <input
            type="date"
            id="plantingDate"
            name="plantingDate"
            value={formatDate(crop.plantingDate)}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estimatedHarvestDate">Estimated Harvest Date *</label>
          <input
            type="date"
            id="estimatedHarvestDate"
            name="estimatedHarvestDate"
            value={formatDate(crop.estimatedHarvestDate)}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="soilType">Soil Type</label>
          <select
            id="soilType"
            name="soilType"
            value={crop.soilType}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Sandy">Sandy</option>
            <option value="Clay">Clay</option>
            <option value="Loamy">Loamy</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="growthStage">Growth Stage</label>
          <select
            id="growthStage"
            name="growthStage"
            value={crop.growthStage}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Seedling">Seedling</option>
            <option value="Vegetative">Vegetative</option>
            <option value="Flowering">Flowering</option>
            <option value="Maturity">Maturity</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="healthStatus">Health Status</label>
          <select
            id="healthStatus"
            name="healthStatus"
            value={crop.healthStatus}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Healthy">Healthy</option>
            <option value="At-Risk">At-Risk</option>
            <option value="Infected">Infected</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cropImage">Crop Image</label>
          <input
            type="file"
            id="cropImage"
            name="cropImage"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-4 w-full h-auto" />
          )}
          {crop.cropImage && !imagePreview && (
     <img
     src={crop.cropImage.url}
     alt="Current Image"
     className="mt-4"
     style={{ width: '200px', height: 'auto' }} // Set width and height here
   />
   
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            {loading ? 'Updating...' : 'Update Crop'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCrop;
