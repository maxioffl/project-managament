import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import ProjectList from './components/ProjectList';
import Toast from './components/Toast';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header
        onCreateProject={() => setShowCreateForm(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectList
          searchTerm={searchTerm}
          showCreateForm={showCreateForm}
          setShowCreateForm={setShowCreateForm}
        />
      </main>
      <Toast />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;