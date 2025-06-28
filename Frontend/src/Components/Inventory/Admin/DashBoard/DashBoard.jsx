import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit, 
  Leaf, 
  AlertCircle, 
  LayoutGrid, 
  LayoutList, 
  ChevronDown, 
  Filter,
  Printer,
  Download
} from 'lucide-react';

const URL = "http://localhost:4000/community";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Dashboard() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [expandedCard, setExpandedCard] = useState(null);
  const [noResults, setNoResults] = useState(false);
  
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const componentRef = useRef();

  useEffect(() => {
    setIsLoading(true);
    fetchHandler()
      .then((data) => {
        const userItems = data.inven.filter(item => item.userId === user?._id);
        setItems(userItems);
        setFilteredItems(userItems);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [user]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = items.filter((item) =>
        Object.values(item).some((value) =>
          value && value.toString().toLowerCase().includes(query)
        )
      );
      setFilteredItems(filtered);
      setNoResults(filtered.length === 0);
    } else {
      setFilteredItems(items);
      setNoResults(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this garden?')) {
      try {
        await axios.delete(`${URL}/${id}`);
        setItems(items.filter(item => item._id !== id));
        setFilteredItems(filteredItems.filter(item => item._id !== id));
        alert("Garden deleted successfully!");
      } catch (error) {
        console.error("Error deleting garden:", error);
        alert("Failed to delete garden. Please try again.");
      }
    }
  };

  const toggleCardExpansion = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Garden Community Report",
    onAfterPrint: () => alert("Garden Report Successfully Downloaded!"),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex items-center space-x-2 text-green-600">
          <Leaf className="h-6 w-6 animate-spin" />
          <span className="text-xl font-medium">Loading garden data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-[90rem] mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-8 p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Community Article</h1>
              </div>
              <p className="text-gray-600 text-lg">Explore and manage your garden experiences</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search gardens..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full sm:w-80 bg-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'table' 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title="Table view"
                >
                  <LayoutList className="h-5 w-5" />
                </button>
                
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-lg transition-all duration-200 text-gray-500 hover:bg-gray-100 hover:text-green-600"
                  title="Print report"
                >
                  <Printer className="h-5 w-5" />
                </button>
                
                <Link to="/additem">
                  <button className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-200/50">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Article
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div ref={componentRef} className="space-y-6">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
              <AlertCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No gardens found</h3>
              <p className="text-gray-600">
                {noResults ? "Try adjusting your search criteria" : "Add your first garden experience by clicking 'Add Garden'"}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    <img
                      src={item.imgurl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x200?text=Garden+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-white font-semibold text-xl">{item.title}</h3>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-800 mb-4">{item.disc}</p>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Fertilizer</h4>
                          <p className="text-sm text-gray-600">{item.fertilizer}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Pests</h4>
                          <p className="text-sm text-gray-600">{item.pest}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleCardExpansion(item._id)}
                        className="w-full flex items-center justify-between text-gray-600 hover:text-green-600 transition-colors duration-200"
                      >
                        <span className="text-sm font-medium">
                          {expandedCard === item._id ? 'Show less' : 'Show more'}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${
                            expandedCard === item._id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {expandedCard === item._id && (
                        <div className="pt-4 space-y-4 border-t border-gray-100">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Challenges</h4>
                            <p className="text-sm text-gray-600">{item.challenge}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Work & Plans</h4>
                            <p className="text-sm text-gray-600">{item.work}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 bg-black text-green-400 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        title="Delete garden"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <Link
                        to={`/updateitem/${item._id}`}
                        className="p-2 bg-black text-green-400 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        title="Edit garden"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden bg-white rounded-2xl shadow-md border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Image</th>
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pest & Diseases</th>
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fertilizers</th>
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Challenges</th>
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Work & Plans</th>
                      <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredItems.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                        <td className="px-6 py-4">
                          <div className="relative group">
                            <img 
                              src={item.imgurl} 
                              alt={item.title} 
                              className="h-24 w-24 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/100x100?text=Garden";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-all duration-200" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 max-w-xs">
                          <div className="line-clamp-2">{item.disc}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 max-w-xs">
                          <div className="line-clamp-2">{item.pest}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 max-w-xs">
                          <div className="line-clamp-2">{item.fertilizer}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 max-w-xs">
                          <div className="line-clamp-2">{item.challenge}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 max-w-xs">
                          <div className="line-clamp-2">{item.work}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-2 bg-black text-green-400 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                              title="Delete garden"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                            <Link
                              to={`/updateitem/${item._id}`}
                              className="p-2 bg-black text-green-400 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                              title="Edit garden"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;