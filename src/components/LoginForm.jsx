import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Shield, Eye, AlertCircle } from 'lucide-react';
import { validateForm, validationRules, sanitizeInput, formatValidationErrors } from '../utils/validation';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'viewer'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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
    setErrors({});
    
    // Sanitize input data
    const sanitizedData = sanitizeInput(formData);
    
    // Validate form data
    const validation = validateForm(sanitizedData, validationRules.login);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setLoading(true);

    const result = await login(sanitizedData.username, sanitizedData.password, sanitizedData.role);
    
    if (!result.success) {
      if (result.details) {
        // Backend validation errors
        setErrors(formatValidationErrors(result.details));
      } else {
        // General error
        setErrors({ general: result.error });
      }
    }
    
    setLoading(false);
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName];
  };

  const hasFieldError = (fieldName) => {
    return !!errors[fieldName];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your project management account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    hasFieldError('username') 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200'
                  }`}
                  placeholder="Enter your username"
                  disabled={loading}
                />
                {hasFieldError('username') && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {hasFieldError('username') && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getFieldError('username')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    hasFieldError('password') 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200'
                  }`}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                {hasFieldError('password') && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {hasFieldError('password') && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getFieldError('password')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'role', value: 'admin' } })}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.role === 'admin'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <Shield className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'role', value: 'viewer' } })}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.role === 'viewer'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <Eye className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Viewer</span>
                </button>
              </div>
              {hasFieldError('role') && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getFieldError('role')}
                </p>
              )}
            </div>

            {(errors.general || errors.error) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.general || errors.error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Note: New users will be automatically registered
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;