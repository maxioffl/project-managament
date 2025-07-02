import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Edit, Trash2, Clock, AlertTriangle } from 'lucide-react';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && project.status !== 'completed';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
            {project.description}
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(project)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
              title="Edit project"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(project._id || project.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
          {project.status.replace('-', ' ')}
        </span>
        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(project.priority)}`}>
          {getPriorityIcon(project.priority)}
          <span className="capitalize">{project.priority}</span>
        </span>
        {isOverdue(project.dueDate) && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200 animate-pulse">
            Overdue
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="font-medium">{project.createdBy}</span>
        </div>
        {project.dueDate && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${isOverdue(project.dueDate) ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50'}`}>
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{formatDate(project.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;