/**
 * Simple Client-Side Authentication for Documentation
 * This runs on every page load to check authentication
 * 
 * IMPORTANT: This is a basic authentication system suitable for
 * protecting documentation from casual access. For production
 * use with sensitive data, implement server-side authentication.
 */

(function() {
    'use strict';
    
    // Skip auth check on login and logout pages
    const currentPage = window.location.pathname;
    if (currentPage === '/login.html' || currentPage === '/logout.html' || currentPage.includes('login') || currentPage.includes('logout')) {
        return;
    }
    
    // Check if user is authenticated
    function isAuthenticated() {
        const authToken = getCookie('doc-auth');
        if (!authToken) return false;
        
        try {
            // Simple token validation - just check if it exists and has expected format
            // The actual validation happens server-side (or in login page for static sites)
            const decoded = atob(authToken);
            return decoded && decoded.includes(':');
        } catch (error) {
            return false;
        }
    }
    
    // Get cookie value
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    // Redirect to login if not authenticated
    function redirectToLogin() {
        const currentUrl = window.location.pathname + window.location.search;
        const loginUrl = '/login.html' + (currentUrl !== '/' ? '?redirect=' + encodeURIComponent(currentUrl) : '');
        window.location.href = loginUrl;
    }
    
    // Check authentication on page load
    if (!isAuthenticated()) {
        redirectToLogin();
    }
    
    // Add logout functionality to logout buttons
    document.addEventListener('DOMContentLoaded', function() {
        const logoutLinks = document.querySelectorAll('a[href*="logout"]');
        logoutLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                // Clear auth cookie
                document.cookie = 'doc-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                window.location.href = '/logout.html';
            });
        });
    });
    
})();