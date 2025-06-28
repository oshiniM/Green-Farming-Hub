import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  PlusCircle, 
  Loader2, 
  Leaf, 
  Bug, 
  Shield, 
  Award, 
  FlaskConical, 
  Target, 
  Workflow, 
  Image, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

function AddItem() {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const [inputs, setInputs] = useState({
    title: '',
    imgurl: '',
    disc: '',
    fertilizer: '',
    work: '',
    pest: '',
    pestcontral: '',
    challenge: '',
  });

  const validateField = (name, value) => {
    // Define field-specific validation rules
    switch(name) {
      case 'title':
        if (!value.trim()) return 'Project title is required';
        if (value.length < 5) return 'Title should be at least 5 characters';
        if (value.length > 100) return 'Title should be less than 100 characters';
        return '';
      
      case 'imgurl':
        if (!value.trim()) return 'Image URL is required';
        try {
          new URL(value);
          return '';
        } catch (e) {
          return 'Please enter a valid URL';
        }
      
      case 'disc':
        if (!value.trim()) return 'Project overview is required';
        if (value.length < 20) return 'Please provide a more detailed description (min 20 chars)';
        return '';
      
      case 'fertilizer':
        if (!value.trim()) return 'Fertilization strategy is required';
        if (value.length < 15) return 'Please provide more details about your fertilization approach';
        return '';
      
      case 'work':
        if (!value.trim()) return 'Maintenance routine is required';
        if (value.length < 15) return 'Please provide more details about your maintenance routine';
        return '';
      
      case 'pest':
        if (!value.trim()) return 'Pest observations are required';
        return '';
      
      case 'pestcontral':
        if (!value.trim()) return 'Treatment methods are required';
        return '';
      
      case 'challenge':
        if (!value.trim()) return 'Additional challenges section is required';
        return '';
      
      default:
        if (!value.trim()) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    
    // Update preview image if imgurl changes
    if (name === 'imgurl' && value) {
      setPreviewImage(value);
    }
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    
    // Validate field as user types (after a short delay)
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields
    Object.keys(inputs).forEach(key => {
      const error = validateField(key, inputs[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    // Mark all fields as touched
    const allTouched = Object.keys(inputs).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await sendRequest();
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/inventory');
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert('Failed to share experience. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendRequest = async () => {
    return axios.post("http://localhost:4000/community", {
      disc: inputs.disc,
      fertilizer: inputs.fertilizer,
      work: inputs.work,
      uname: user?.name,
      title: inputs.title,
      imgurl: inputs.imgurl,
      pest: inputs.pest,
      pestcontral: inputs.pestcontral,
      challenge: inputs.challenge,
      userId: user?._id,
    });
  };

  const formSections = [
    {
      title: 'Basic Information',
      description: 'Start with the fundamentals of your gardening experience',
      fields: [
        {
          name: 'title',
          label: 'Project Title',
          type: 'text',
          placeholder: 'E.g., Urban Organic Tomato Garden',
          icon: <Leaf className="h-5 w-5" />,
          rows: 1,
        },
        {
          name: 'imgurl',
          label: 'Featured Image URL',
          type: 'url',
          placeholder: 'https://images.unsplash.com/...',
          icon: <Image className="h-5 w-5" />,
          rows: 1,
        },
        {
          name: 'disc',
          label: 'Project Overview',
          type: 'textarea',
          placeholder: 'Provide a comprehensive description of your gardening project...',
          icon: <Target className="h-5 w-5" />,
          rows: 4,
        },
      ]
    },
    {
      title: 'Plant Care Details',
      description: 'Share your expertise on plant maintenance and care',
      fields: [
        {
          name: 'fertilizer',
          label: 'Nutrition & Fertilization Strategy',
          type: 'textarea',
          placeholder: 'Detail your fertilization approach and schedule...',
          icon: <FlaskConical className="h-5 w-5" />,
          rows: 3,
        },
        {
          name: 'work',
          label: 'Maintenance Routine & Future Plans',
          type: 'textarea',
          placeholder: 'Describe your regular maintenance practices and future plans...',
          icon: <Workflow className="h-5 w-5" />,
          rows: 4,
        },
      ]
    },
    {
      title: 'Challenges & Solutions',
      description: 'Document the obstacles you faced and how you overcame them',
      fields: [
        {
          name: 'pest',
          label: 'Pest & Disease Observations',
          type: 'textarea',
          placeholder: 'Document any pest or disease issues encountered...',
          icon: <Bug className="h-5 w-5" />,
          rows: 4,
        },
        {
          name: 'pestcontral',
          label: 'Treatment Methods',
          type: 'textarea',
          placeholder: 'Detail your pest management solutions...',
          icon: <Shield className="h-5 w-5" />,
          rows: 4,
        },
        {
          name: 'challenge',
          label: 'Additional Challenges',
          type: 'textarea',
          placeholder: 'Share other challenges and your solutions...',
          icon: <Target className="h-5 w-5" />,
          rows: 4,
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-green-50 rounded-full mb-4">
            <Award className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl tracking-tight">
            Garden Experience Documentation
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Share your horticultural journey to inspire and educate the community
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="px-8 pt-6">
              <ol className="flex items-center">
                {formSections.map((section, index) => (
                  <li key={index} className={`flex items-center ${index !== formSections.length - 1 ? 'flex-1' : ''}`}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(index)}
                      className={`flex items-center ${currentStep === index ? 'text-green-600' : 'text-gray-500'}`}
                    >
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                        currentStep === index ? 'bg-green-50 text-green-600' : 
                        currentStep > index ? 'bg-green-600 text-white' : 'bg-gray-100'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="ml-3 text-sm font-medium hidden sm:block">{section.title}</span>
                    </button>
                    {index !== formSections.length - 1 && (
                      <div className="flex-1 mx-4">
                        <div className={`h-0.5 ${currentStep > index ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {formSections[currentStep].title}
                </h2>
                <p className="text-gray-600">
                  {formSections[currentStep].description}
                </p>
              </div>

              <div className="space-y-6">
                {formSections[currentStep].fields.map((field) => (
                  <div key={field.name} className="relative">
                    <label className="flex items-center text-sm font-medium text-gray-900 mb-2">
                      <span className="p-1.5 bg-green-50 rounded-lg mr-2">
                        {field.icon}
                      </span>
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        value={inputs[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={field.rows}
                        className={`block w-full py-3 px-4 rounded-lg border ${
                          touched[field.name] && errors[field.name] 
                            ? 'border-red-300 bg-red-50' 
                            : touched[field.name] && !errors[field.name]
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 bg-white'
                        } shadow-sm text-gray-700 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 sm:text-sm transition duration-200 ease-in-out hover:border-gray-300`}
                        placeholder={field.placeholder}
                        required
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={inputs[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`block w-full h-12 py-3 px-4 rounded-lg border ${
                          touched[field.name] && errors[field.name] 
                            ? 'border-red-300 bg-red-50' 
                            : touched[field.name] && !errors[field.name]
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 bg-white'
                        } shadow-sm text-gray-700 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 sm:text-sm transition duration-200 ease-in-out hover:border-gray-300`}
                        placeholder={field.placeholder}
                        required
                      />
                    )}
                    {touched[field.name] && errors[field.name] && (
                      <div className="mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-600">{errors[field.name]}</p>
                      </div>
                    )}
                    {touched[field.name] && !errors[field.name] && (
                      <div className="mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-green-600">Looks good!</p>
                      </div>
                    )}
                  </div>
                ))}

                {currentStep === 0 && previewImage && (
                  <div className="relative mt-4 rounded-lg overflow-hidden">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={() => setPreviewImage('')}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <p className="text-white text-sm font-medium">Preview Image</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={currentStep === 0}
                >
                  Previous
                </button>

                {currentStep === formSections.length - 1 ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className={`transition-all duration-300 ${showSuccess ? 'opacity-0' : 'opacity-100'}`}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Experience
                        </>
                      )}
                    </span>
                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      showSuccess ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Success!
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.min(formSections.length - 1, currentStep + 1))}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddItem;