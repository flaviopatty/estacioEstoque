import React, { useState } from 'react';
import { Page } from './types';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import InventoryMovement from './pages/InventoryMovement';
import UserManagement from './pages/UserManagement';
import ProfileSettings from './pages/ProfileSettings';
import Products from './pages/Products';
import Reports from './pages/Reports';
import Auth from './pages/Auth';
import { useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
    const { user, profile, loading } = useAuth();
    const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-dark text-primary">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Auth />;
    }

    const renderPage = () => {
        const isPending = profile?.status === 'pending';

        // Navigation Guard: Restricted users only access Dashboard and Settings
        if (isPending && (currentPage !== Page.DASHBOARD && currentPage !== Page.SETTINGS)) {
            return <Dashboard />;
        }

        switch (currentPage) {
            case Page.DASHBOARD:
                return <Dashboard />;
            case Page.PRODUCTS:
                return <Products />;
            case Page.INVENTORY:
                return <InventoryMovement />;
            case Page.REPORTS:
                return <Reports />;
            case Page.USERS:
                return <UserManagement />;
            case Page.SETTINGS:
                return <ProfileSettings />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-dark text-white font-display">
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default App;
