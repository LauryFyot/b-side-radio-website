// Main container for the admin experience.
// Connects auth state, editable content state, and tab routing.
// Decides whether to show login, loader, or the admin workspace.
import { useMemo, useEffect, useState } from 'react';
import LoginView from './components/LoginView';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import AdminContent from './components/AdminContent';
import { tabs } from './constants/adminUi';
import useAdminAuth from './hooks/useAdminAuth';
import useAdminEditor from './hooks/useAdminEditor';

function App() {
  const [activeTab, setActiveTab] = useState('comments');
  const auth = useAdminAuth();
  const editor = useAdminEditor();
  const title = useMemo(() => tabs.find((t) => t.id === activeTab)?.label || 'Website edition', [activeTab]);

  useEffect(() => {
    // When user session changes, reset or reload editable data.
    if (!auth.adminUser) {
      editor.clearData();
      return;
    }

    editor.loadData();
  }, [auth.adminUser]);

  async function handleLogin(event) {
    await auth.login(event);
  }

  async function handleLogout() {
    await auth.logout();
    editor.clearData();
  }

  if (auth.isLoading) {
    return (
      <div className="app-bg">
        <div className="loading-card">Loading admin data...</div>
      </div>
    );
  }

  if (!auth.adminUser) {
    return (
      <LoginView
        loginForm={auth.loginForm}
        loginError={auth.loginError}
        onSubmit={handleLogin}
        onChange={auth.updateLoginField}
      />
    );
  }

  return (
    <div className="app-bg">
      <div className="admin-shell">
        <AdminSidebar onLogout={handleLogout} />

        <main className="content-wrap">
          <AdminHeader adminUser={auth.adminUser} />
          <AdminContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
            isPublishing={editor.isPublishing}
            hasPendingChanges={editor.hasPendingChanges}
            onPublish={editor.publish}
            message={editor.message}
            editor={editor}
          />
        </main>
      </div>
      <div className="mobile-title">{title}</div>
    </div>
  );
}

export default App;
