import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";
import { Filter, Grid, List, Search } from "lucide-react";

const ProjectList = ({ searchTerm, showCreateForm, setShowCreateForm }) => {
  const { token, isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });
  const socket = useSocket("http://localhost:3001");

  useEffect(() => {
    fetchProjects();
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on("projectCreated", ({ project }) => {
        // Only add if we didn't create it ourselves
        setProjects((prev) => {
          // Check if project already exists to prevent duplicates
          const exists = prev.some(
            (p) => (p._id || p.id) === (project._id || project.id)
          );
          if (!exists) {
            return [project, ...prev];
          }
          return prev;
        });
      });

      socket.on("projectUpdated", ({ project }) => {
        setProjects((prev) =>
          prev.map((p) =>
            (p._id || p.id) === (project._id || project.id) ? project : p
          )
        );
      });

      socket.on("projectDeleted", ({ projectId }) => {
        setProjects((prev) =>
          prev.filter((p) => (p._id || p.id) !== projectId)
        );
      });

      return () => {
        socket.off("projectCreated");
        socket.off("projectUpdated");
        socket.off("projectDeleted");
      };
    }
  }, [socket]);

  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(
        (project) => project.status === filters.status
      );
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(
        (project) => project.priority === filters.priority
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        setError("Failed to fetch projects");
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = (newProject) => {
    setProjects((prev) => {
      // Check if project already exists to prevent duplicates
      const exists = prev.some(
        (p) => (p._id || p.id) === (newProject._id || newProject.id)
      );
      if (!exists) {
        return [newProject, ...prev];
      }
      return prev;
    });
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects((prev) =>
      prev.map((p) =>
        (p._id || p.id) === (updatedProject._id || updatedProject.id)
          ? updatedProject
          : p
      )
    );
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/projects/${projectId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          setProjects((prev) =>
            prev.filter((p) => (p._id || p.id) !== projectId)
          );
        } else {
          setError("Failed to delete project");
        }
      } catch (error) {
        setError("Network error occurred");
      }
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchProjects}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}>
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}>
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects found
          </h3>
          <p className="text-gray-500">
            {searchTerm || filters.status || filters.priority
              ? "Try adjusting your search or filters"
              : "Get started by creating your first project"}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id || project.id}
              project={project}
              onEdit={setEditingProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      {/* Create Project Form */}
      {showCreateForm && (
        <ProjectForm
          onSubmit={handleCreateProject}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {/* Edit Project Form */}
      {editingProject && (
        <ProjectForm
          project={editingProject}
          onSubmit={handleUpdateProject}
          onClose={() => setEditingProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectList;
