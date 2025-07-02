import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, FileText, Flag, Clock, Save, AlertCircle } from 'lucide-react';
import { validateForm, validationRules, sanitizeInput, formatValidationErrors } from '../utils/validation';

const ProjectForm = ({ project, onSubmit, onClose }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setErrors({});
    
    // Sanitize input data
    const sanitizedData = sanitizeInput(formData);
    
    // Validate form data
    const validation = validateForm(sanitizedData, validationRules.project);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setLoading(true);

    try {
      const url = project 
        ? `http://localhost:3001/api/projects/${project._id || project.id}`
        : 'http://localhost:3001/api/projects';
      
      const method = project ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sanitizedData)
      });

      const data = await response.json();

      if (response.ok) {
        onSubmit(data);
        onClose();
      } else {
        if (data.details) {
          // Backend validation errors
          setErrors(formatValidationErrors(data.details));
        } else {
          // General error
          setErrors({ general: data.error || 'An error occurred' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName];
  };

  const hasFieldError = (fieldName) => {
    return !!errors[fieldName];
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {project ? 'Edit Project' : 'Create New Project'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-xl transition-all duration-200 hover:scale-105"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 mr-2 text-blue-500" />
              Project Title
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                  hasFieldError('title') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
                placeholder="Enter project title"
                disabled={loading}
              />
              {hasFieldError('title') && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
              )}
            </div>
            {hasFieldError('title') && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('title')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 mr-2 text-blue-500" />
              Description
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none ${
                  hasFieldError('description') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
                placeholder="Enter project description"
                disabled={loading}
              />
              {hasFieldError('description') && (
                <div className="absolute right-3 top-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
              )}
            </div>
            {hasFieldError('description') && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('description')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Clock className="w-4 h-4 mr-2 text-green-500" />
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                  hasFieldError('status') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
                disabled={loading}
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
              {hasFieldError('status') && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getFieldError('status')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Flag className="w-4 h-4 mr-2 text-orange-500" />
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                  hasFieldError('priority') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              {hasFieldError('priority') && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getFieldError('priority')}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-purple-500" />
              Due Date (Optional)
            </label>
            <div className="relative">
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                  hasFieldError('dueDate') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
                disabled={loading}
              />
              {hasFieldError('dueDate') && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
              )}
            </div>
            {hasFieldError('dueDate') && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('dueDate')}
              </p>
            )}
          </div>

          {(errors.general || errors.error) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in slide-in-from-top-2 duration-200">
              <p className="text-red-600 text-sm font-medium flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.general || errors.error}
              </p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex space-x-3 p-6 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{project ? 'Update' : 'Create'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;