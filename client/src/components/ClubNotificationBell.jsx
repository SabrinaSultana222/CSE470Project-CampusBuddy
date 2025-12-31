import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { clubNotificationApi } from '../utils/api';
import { DiscussionSocket } from '../services/discussionSocket';

const ClubNotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showList, setShowList] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ For portal positioning
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const bellRef = useRef(null);
  const socketRef = useRef(null);
  const processedNotifications = useRef(new Set()); // ✅ Prevent duplicates

  const fetchNotifications = useCallback(async () => {
    console.log('🔄 Club Refresh clicked!');
    setIsRefreshing(true);

    try {
      const [notificationsRes, countRes] = await Promise.all([
        clubNotificationApi.getMyNotifications(),
        clubNotificationApi.getUnreadCount()
      ]);

      const notificationsData = notificationsRes?.data || notificationsRes || [];
      const countData = countRes?.data?.count || countRes?.count || 0;

      const userId = localStorage.getItem('campusbuddy.user')?.split('"')[3];
      const validNotifications = Array.isArray(notificationsData)
        ? notificationsData.filter(notif =>
            notif && notif.message && notif.postId &&
            notif.recipientId?.toString() === userId
          )
        : [];

      setNotifications(validNotifications);
      setUnreadCount(countData);
      console.log('✅ Club Refreshed! Valid:', validNotifications.length, 'Unread:', countData);
    } catch (err) {
      console.error('❌ Club Refresh failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const token = localStorage.getItem('campusbuddy.token');
    if (!token) return;

    console.log('🔌 Creating DiscussionSocket (for club notifications too)...');
    const socket = new DiscussionSocket(token);
    socketRef.current = socket;

    return () => {
      console.log('🧹 Disconnecting socket');
      socket.disconnect();
    };
  }, []);

  // ✅ Listen for clubNotification event
  useEffect(() => {
    const handleNewNotification = (e) => {
      const newNotif = e.detail;
      const notifId = newNotif._id || newNotif.id;

      console.log('🎉 Raw CLUB notification received:', newNotif);

      // ✅ Prevent duplicates
      if (!notifId || processedNotifications.current.has(notifId)) {
        console.log('⏭️ Duplicate CLUB notification skipped:', notifId);
        return;
      }

      if (newNotif && !newNotif.deleted) {
        console.log('✅ Processing NEW CLUB notification:', newNotif);
        processedNotifications.current.add(notifId);

        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
        showPopupToast(newNotif);
      }
    };

    window.addEventListener('clubNotification', handleNewNotification);
    return () => window.removeEventListener('clubNotification', handleNewNotification);
  }, []);

  // ✅ Reposition portal popup when opened + on resize/scroll
  useEffect(() => {
    const updatePos = () => {
      if (!bellRef.current) return;
      const rect = bellRef.current.getBoundingClientRect();
      setPopupPos({
        top: rect.bottom + 12,
        left: rect.left + rect.width / 2,
        width: rect.width
      });
    };

    if (showList) {
      updatePos();
      window.addEventListener('resize', updatePos);
      window.addEventListener('scroll', updatePos, true);
    }

    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
    };
  }, [showList]);

  // ✅ Close when clicking outside (works with portal too)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!showList) return;
      if (bellRef.current && bellRef.current.contains(event.target)) return;

      // If click is inside the portal popup, ignore
      const popup = document.getElementById('club-notif-portal');
      if (popup && popup.contains(event.target)) return;

      setShowList(false);
    };

    if (showList) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showList]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await clubNotificationApi.markAsRead(notificationId);
      setNotifications(prev => prev.map(n =>
        (n.id === notificationId || n._id === notificationId)
          ? { ...n, isRead: true }
          : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark CLUB notification as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const notif of unread) {
      await markAsRead(notif._id || notif.id);
    }
  }, [notifications, markAsRead]);

  const showPopupToast = useCallback((notification) => {
    const toast = document.createElement('div');
    toast.innerHTML = `🔔 ${notification?.message || 'New notification'}`;
    toast.style.cssText = `
      position: fixed; top: 20px; right: 20px; 
      background: #3b82f6; color: white; padding: 16px 24px;
      border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 2147483647; font-weight: 500;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }, []);

  // icon based on club notification type
  const getIcon = (t) => {
    if (t === 'club_post_submitted') return '📩';
    if (t === 'club_post_approved') return '✅';
    if (t === 'club_post_rejected') return '❌';
    return '🔔';
  };

  // ✅ PORTAL POPUP (same style pattern as Discussion bell)
  const popup = showList ? (
    <div
      id="club-notif-portal"
      style={{
        position: 'fixed',
        top: popupPos.top,
        left: popupPos.left,
        transform: 'translateX(-50%)',
        width: '320px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        zIndex: 2147483647, // ✅ always on top
        border: '1px solid #e5e7eb',
        maxHeight: '500px',
        overflow: 'hidden'
      }}
    >
      <div style={{
        padding: '24px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        color: 'white'
      }}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{
              width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              🔔
            </div>
            <div>
              <h3 style={{fontSize: '20px', fontWeight: 'bold', margin: 0}}>Club Notifications</h3>
              <p style={{margin: '4px 0 0 0', opacity: 0.9}}>({notifications.length})</p>
            </div>
          </div>
          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} style={{
                padding: '8px 16px', background: 'rgba(255,255,255,0.2)',
                border: 'none', borderRadius: '8px', color: 'white',
                fontSize: '14px', fontWeight: '500', cursor: 'pointer'
              }}>
                Mark all read
              </button>
            )}
            <button
              onClick={fetchNotifications}
              disabled={isRefreshing}
              style={{
                padding: '8px 12px',
                background: isRefreshing ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)',
                border: 'none', borderRadius: '8px', color: 'white',
                fontSize: '12px', cursor: isRefreshing ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center'
              }}
              title="Refresh notifications"
            >
              {isRefreshing ? '⏳' : '🔄'}
            </button>
          </div>
        </div>
      </div>

      <div style={{maxHeight: '400px', overflowY: 'auto'}}>
        {notifications.length === 0 ? (
          <div style={{padding: '48px 24px', textAlign: 'center'}}>
            <div style={{
              width: '64px', height: '64px', margin: '0 auto 16px',
              background: '#f3f4f6', borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              🔔
            </div>
            <h4 style={{fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0'}}>
              No notifications
            </h4>
            <p style={{color: '#6b7280', margin: 0}}>Click refresh 🔄 to check for new ones</p>
          </div>
        ) : (
          notifications.map((notif, index) => (
            <div key={notif._id || notif.id || index} style={{
              padding: '24px',
              borderBottom: !notif.isRead ? '3px solid #3b82f6' : '1px solid #f3f4f6',
              background: !notif.isRead ? '#eff6ff' : 'white',
              transition: 'all 0.3s ease'
            }}>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                <div style={{
                  width: '48px', height: '48px',
                  background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '20px', flexShrink: 0
                }}>
                  {getIcon(notif.type)}
                </div>

                <div style={{flex: 1, minWidth: 0}}>
                  <p style={{fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0'}}>
                    {notif.message || 'New notification'}
                  </p>
                  <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                    }) : 'Just now'}
                  </p>
                </div>

                {!notif.isRead && (
                  <button onClick={() => markAsRead(notif._id || notif.id)} style={{
                    padding: '6px 12px',
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#374151',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    ✓
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  ) : null;

  return (
    <div ref={bellRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setShowList(!showList)}
        style={{
          padding: '12px',
          borderRadius: '12px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#dbeafe';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#eff6ff';
          e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }}
        title="Club Notifications"
      >
        <div style={{ position: 'relative', width: '20px', height: '20px' }}>
          🔔
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              background: isRefreshing ? '#f59e0b' : '#ef4444',
              color: 'white',
              fontSize: '10px',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* ✅ Portal dropdown renders on body (not trapped behind cards) */}
      {popup ? ReactDOM.createPortal(popup, document.body) : null}
    </div>
  );
};

export default ClubNotificationBell;
