
import React, { useState, useCallback, useEffect } from 'react';
import { User, UserRole, Transmission, SystemStats, AuditEntry, SystemNotification, Announcement } from './types';
import LoginCard from './components/LoginCard';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [pendingTransmissions, setPendingTransmissions] = useState<Transmission[]>(() => {
    const saved = localStorage.getItem('aa2001_pending_transmissions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [validatedStats, setValidatedStats] = useState<Record<string, SystemStats>>(() => {
    const saved = localStorage.getItem('aa2001_validated_stats');
    return saved ? JSON.parse(saved) : {};
  });

  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(() => {
    const saved = localStorage.getItem('aa2001_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('aa2001_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('aa2001_announcements');
    return saved ? JSON.parse(saved) : [];
  });

  // Storage event listener for multi-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aa2001_pending_transmissions') {
        setPendingTransmissions(e.newValue ? JSON.parse(e.newValue) : []);
      }
      if (e.key === 'aa2001_validated_stats') {
        setValidatedStats(e.newValue ? JSON.parse(e.newValue) : {});
      }
      if (e.key === 'aa2001_audit_logs') {
        setAuditLogs(e.newValue ? JSON.parse(e.newValue) : []);
      }
      if (e.key === 'aa2001_notifications') {
        setNotifications(e.newValue ? JSON.parse(e.newValue) : []);
      }
      if (e.key === 'aa2001_announcements') {
        setAnnouncements(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('aa2001_pending_transmissions', JSON.stringify(pendingTransmissions));
  }, [pendingTransmissions]);

  useEffect(() => {
    localStorage.setItem('aa2001_validated_stats', JSON.stringify(validatedStats));
  }, [validatedStats]);

  useEffect(() => {
    localStorage.setItem('aa2001_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('aa2001_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('aa2001_announcements', JSON.stringify(announcements));
  }, [announcements]);

  const addNotification = useCallback((message: string, targetUserId: string, type: 'INFO' | 'SUCCESS' | 'ALERT' = 'INFO') => {
    const newNotif: SystemNotification = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      targetUserId,
      message,
      timestamp: new Date().toISOString(),
      type
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 100));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addAuditEntry = useCallback((action: string, details: string, type: 'INFO' | 'OK' | 'WARN' = 'INFO', userName?: string) => {
    const entry: AuditEntry = {
      id: Math.random().toString(36).substr(2, 8).toUpperCase(),
      timestamp: new Date().toISOString(),
      user: userName || user?.name || 'SYSTEM',
      action,
      details,
      type
    };
    setAuditLogs(prev => [entry, ...prev].slice(0, 500));
  }, [user]);

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    addNotification(`Welcome back, ${loggedInUser.name}. Session established.`, loggedInUser.id, 'SUCCESS');
    addAuditEntry('SESSION_INIT', `Authorized login with role: ${loggedInUser.role}`, 'OK', loggedInUser.name);
  }, [addNotification, addAuditEntry]);

  const handleLogout = useCallback(() => {
    addAuditEntry('SESSION_TERM', 'User terminated secure connection', 'INFO');
    setUser(null);
    setIsAuthenticated(false);
  }, [addAuditEntry]);

  const handleTransmit = useCallback((transmission: Transmission) => {
    if (!user) return;
    setPendingTransmissions(prev => [...prev, transmission]);
    addNotification(`Transmission ${transmission.id} has been broadcast to the network.`, user.id, 'INFO');
    addAuditEntry('DATA_TRANSMIT', `Node update ${transmission.id} submitted for review`, 'INFO', transmission.userName);
  }, [user, addAuditEntry, addNotification]);

  const handleValidate = useCallback((transmissionId: string, overrides?: SystemStats) => {
    const transmission = pendingTransmissions.find(t => t.id === transmissionId);
    if (transmission && user) {
      const statsToUse = overrides || {
        responseTime: transmission.responseTime,
        accuracy: transmission.accuracy,
        uptime: transmission.uptime
      };

      setValidatedStats(prev => ({
        ...prev,
        [transmission.userId]: statsToUse
      }));
      setPendingTransmissions(prev => prev.filter(t => t.id !== transmissionId));
      
      addNotification(`Transmission ${transmissionId} successfully validated${overrides ? ' with manual override' : ''}.`, user.id, 'SUCCESS');
      addNotification(`Your performance log ${transmissionId} has been verified by ${user.name}.`, transmission.userId, 'SUCCESS');
      
      addAuditEntry('VERIFY_SUCCESS', `Supervisor validated Transmission ${transmissionId}${overrides ? ' (Override applied)' : ''}`, 'OK');
    }
  }, [pendingTransmissions, user, addAuditEntry, addNotification]);

  const handlePostAnnouncement = useCallback((message: string) => {
    if (!user || !user.department) return;
    const newAnnouncement: Announcement = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      department: user.department,
      senderName: user.name,
      message,
      timestamp: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnnouncement, ...prev].slice(0, 50));
    addAuditEntry('DEPT_BROADCAST', `Supervisor posted a group announcement to ${user.department}`, 'OK');
  }, [user, addAuditEntry]);

  const handleDeleteAnnouncement = useCallback((id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addAuditEntry('DEPT_BROADCAST_RM', `Supervisor manually removed a broadcast announcement`, 'INFO');
  }, [addAuditEntry]);

  const handleDeleteUser = useCallback((userId: string, userName: string) => {
    const regRaw = localStorage.getItem('aa2001_credential_registry');
    if (regRaw) {
      const reg = JSON.parse(regRaw);
      const updatedReg = reg.filter((u: any) => u.name !== userName);
      localStorage.setItem('aa2001_credential_registry', JSON.stringify(updatedReg));
    }

    const adminUsersRaw = localStorage.getItem('aa2001_admin_users');
    if (adminUsersRaw) {
      try {
        const adminUsers = JSON.parse(adminUsersRaw);
        const updatedAdminUsers: Record<string, string[]> = {};
        Object.keys(adminUsers).forEach(dept => {
          updatedAdminUsers[dept] = adminUsers[dept].filter((name: string) => name !== userName);
        });
        localStorage.setItem('aa2001_admin_users', JSON.stringify(updatedAdminUsers));
      } catch (e) {
        console.error("Failed to parse admin users for deletion", e);
      }
    }

    setPendingTransmissions(prev => prev.filter(t => t.userId !== userId));
    setNotifications(prev => prev.filter(n => n.targetUserId !== userId));
    setValidatedStats(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });

    addAuditEntry('ADMIN_PURGE', `Permanently purged all records and access for node: ${userName}`, 'WARN');
    window.dispatchEvent(new Event('storage'));
  }, [addAuditEntry]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {isAuthenticated && user ? (
        <>
          <Navbar 
            user={user} 
            onLogout={handleLogout} 
            notifications={notifications}
            onDeleteNotification={deleteNotification}
          />
          <main className="flex-grow p-4 md:p-8 animate-in fade-in duration-500">
            <Dashboard 
              user={user} 
              pendingTransmissions={pendingTransmissions}
              validatedStats={validatedStats}
              auditLogs={auditLogs}
              announcements={announcements}
              onTransmit={handleTransmit}
              onValidate={handleValidate}
              onPostAnnouncement={handlePostAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              onAddAuditEntry={addAuditEntry}
              onDeleteUser={handleDeleteUser}
            />
          </main>
        </>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center p-4 py-12 bg-gradient-to-br from-slate-50 to-blue-50">
          <LoginCard onLogin={handleLogin} onAddAuditEntry={addAuditEntry} />
        </div>
      )}
      
      <footer className="py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} AA2001 Security and Technology Solutions Inc. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;
