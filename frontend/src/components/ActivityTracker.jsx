import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { logActivity } from '../utils/api';

const ActivityTracker = () => {
  const location = useLocation();
  const lastClickTime = useRef(0);

  // 1. Track Page Views
  useEffect(() => {
    const contactId = localStorage.getItem('sfContactId');
    if (!contactId) return;

    logActivity(contactId, 'PAGE_VIEW', location.pathname, `User viewed page: ${location.pathname}`);
  }, [location.pathname]);

  // 2. Track Meaningful Clicks (debounced — 2s minimum gap)
  useEffect(() => {
    const handleGlobalClick = (event) => {
      const contactId = localStorage.getItem('sfContactId');
      if (!contactId) return;

      // Debounce: minimum 2 seconds between click logs
      const now = Date.now();
      if (now - lastClickTime.current < 2000) return;

      // Only track buttons and links (meaningful interactions)
      const target = event.target.closest('button, a');
      if (!target) return;

      // Get descriptive text
      const text = target.innerText?.trim() || target.getAttribute('aria-label') || '';

      // Skip empty or generic clicks
      if (!text || text.length < 2) return;

      lastClickTime.current = now;

      logActivity(
        contactId,
        'CLICK',
        window.location.pathname,
        `Clicked: "${text.substring(0, 50)}"`
      );
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return null;
};

export default ActivityTracker;

