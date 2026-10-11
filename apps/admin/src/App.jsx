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
      <div className="min-h-screen p-[18px]">
        <div className="mx-auto mt-20 max-w-[440px] rounded-[18px] border border-admin-line bg-white p-6">Loading admin data...</div>
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
    <div className="min-h-screen p-[18px]">
      <div className="grid h-[calc(100vh-36px)] grid-cols-[250px_1fr] overflow-hidden rounded-[var(--admin-shell-radius)] border border-[#272028] bg-admin-shell max-[1080px]:h-auto max-[1080px]:grid-cols-1">
        <AdminSidebar onLogout={handleLogout} />

        <main className="flex min-w-0 flex-col">
          <AdminHeader adminUser={auth.adminUser} />
          <AdminContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
            isPublishing={editor.isPublishing}
            hasPendingChanges={editor.hasPendingChanges}
            onPublish={editor.publish}
            editor={editor}
          />
        </main>
      </div>
      <div className="mt-2.5 hidden text-center text-[#f5f1f5] max-[1080px]:block">{title}</div>
    </div>
  );
}

export default App;
