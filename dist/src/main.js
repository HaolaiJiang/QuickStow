/**
 * Main entry point for QuickStow web interface.
 * Wires up event handlers for capture and find forms.
 * Requirements: 1.1, 1.3, 2.1, 2.2, 2.3
 */
import { QuickStowApp } from './app.js';
import { authService } from './auth.js';
import { SyncService } from './sync.js';
import { StorageService } from './storage.js';
// Initialize services
const storageService = new StorageService();
const syncService = new SyncService(storageService);
const app = new QuickStowApp();
// DOM Elements - Auth
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const authStatus = document.getElementById('authStatus');
const userName = document.getElementById('userName');
const syncIndicator = document.getElementById('syncIndicator');
const syncText = document.getElementById('syncText');
// DOM Elements - Capture Form
const captureForm = document.getElementById('captureForm');
const captureItemInput = document.getElementById('captureItem');
const captureLocationInput = document.getElementById('captureLocation');
const captureFeedback = document.getElementById('captureFeedback');
// DOM Elements - Find Form
const findForm = document.getElementById('findForm');
const findItemInput = document.getElementById('findItem');
const findFeedback = document.getElementById('findFeedback');
const findResults = document.getElementById('findResults');
const suggestions = document.getElementById('suggestions');
/**
 * Update UI based on auth state
 */
function updateAuthUI(user) {
    if (user) {
        signInBtn.style.display = 'none';
        signOutBtn.style.display = 'block';
        authStatus.style.display = 'flex';
        userName.textContent = user.displayName || user.email || 'User';
        syncText.textContent = 'Synced';
        syncIndicator.classList.remove('offline');
    }
    else {
        signInBtn.style.display = 'flex';
        signOutBtn.style.display = 'none';
        authStatus.style.display = 'none';
    }
}
/**
 * Handle sign in
 */
signInBtn.addEventListener('click', async () => {
    try {
        signInBtn.disabled = true;
        signInBtn.textContent = 'Signing in...';
        const user = await authService.signInWithGoogle();
        await syncService.initialize(user.uid);
    }
    catch (error) {
        console.error('Sign-in error:', error);
        showFeedback(captureFeedback, 'Sign-in failed. Please try again.', 'error');
    }
    finally {
        signInBtn.disabled = false;
        signInBtn.innerHTML = `
      <svg class="google-icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign in to sync
    `;
    }
});
/**
 * Handle sign out
 */
signOutBtn.addEventListener('click', async () => {
    try {
        await authService.signOut();
        syncService.disable();
    }
    catch (error) {
        console.error('Sign-out error:', error);
    }
});
/**
 * Listen to auth state changes
 */
authService.onAuthStateChanged(async (user) => {
    updateAuthUI(user);
    if (user) {
        try {
            await syncService.initialize(user.uid);
        }
        catch (error) {
            console.error('Sync initialization error:', error);
        }
    }
});
/**
 * Show feedback message with appropriate styling
 */
function showFeedback(element, message, type) {
    element.textContent = message;
    element.className = `feedback show ${type}`;
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            element.classList.remove('show');
        }, 3000);
    }
}
/**
 * Hide feedback message
 */
function hideFeedback(element) {
    element.classList.remove('show');
}
/**
 * Format timestamp to readable date/time
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}
/**
 * Handle capture form submission
 * Requirements: 1.1, 1.3 - Provide input method and confirm save within 1 second
 */
captureForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFeedback(captureFeedback);
    const itemName = captureItemInput.value.trim();
    const location = captureLocationInput.value.trim();
    try {
        // Capture the item location
        const entry = app.capture(itemName, location);
        // If sync is enabled, also save to cloud
        if (syncService.isSyncEnabled) {
            await syncService.saveEntry(entry);
        }
        // Show success feedback - Requirements 1.3
        const syncMsg = syncService.isSyncEnabled ? ' (synced)' : '';
        showFeedback(captureFeedback, `✓ Saved "${entry.itemName}" at "${entry.location}"${syncMsg}`, 'success');
        // Clear form inputs
        captureItemInput.value = '';
        captureLocationInput.value = '';
        captureItemInput.focus();
    }
    catch (error) {
        // Show error feedback
        const message = error instanceof Error ? error.message : 'Failed to save location';
        showFeedback(captureFeedback, message, 'error');
    }
});
/**
 * Handle find form submission
 * Requirements: 2.1, 2.2, 2.3 - Search for entries and display results
 */
findForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideFeedback(findFeedback);
    hideSuggestions();
    const itemName = findItemInput.value.trim();
    if (!itemName) {
        showFeedback(findFeedback, 'Please enter an item name', 'error');
        findResults.classList.remove('show');
        return;
    }
    // Find the item
    const result = app.find(itemName);
    if (result) {
        // Display results - Requirements 2.2
        displayResults(result);
        findResults.classList.add('show');
        hideFeedback(findFeedback);
    }
    else {
        // No results found - Requirements 2.3
        findResults.classList.remove('show');
        showFeedback(findFeedback, `No records found for "${itemName}"`, 'info');
    }
});
/**
 * Display item location results
 * Requirements: 2.2 - Display most recent location and up to 3 capture timestamps
 */
function displayResults(result) {
    let html = `
    <div class="result-item">
      <div class="result-label">Item</div>
      <div class="result-value">${escapeHtml(result.itemName)}</div>
    </div>
    <div class="result-item">
      <div class="result-label">Current Location</div>
      <div class="result-value highlight">${escapeHtml(result.currentLocation)}</div>
    </div>
  `;
    if (result.recentCaptures.length > 0) {
        html += `
      <div class="result-item">
        <div class="result-label">Recent History</div>
        <ul class="history-list">
    `;
        for (const capture of result.recentCaptures) {
            html += `
        <li>
          <span class="history-location">${escapeHtml(capture.location)}</span>
          <span class="history-time">${formatTimestamp(capture.timestamp)}</span>
        </li>
      `;
        }
        html += '</ul></div>';
    }
    findResults.innerHTML = html;
}
/**
 * Handle search input for suggestions
 * Requirements: 2.4 - Display list of matching items for selection
 */
let searchTimeout = null;
findItemInput.addEventListener('input', () => {
    // Debounce search
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => {
        const query = findItemInput.value.trim();
        if (query.length < 1) {
            hideSuggestions();
            return;
        }
        const matches = app.search(query);
        if (matches.length > 0) {
            displaySuggestions(matches);
        }
        else {
            hideSuggestions();
        }
    }, 150);
});
/**
 * Display search suggestions
 * Requirements: 2.4 - Display list of matching items
 */
function displaySuggestions(items) {
    let html = '';
    for (const item of items) {
        html += `<div class="suggestion-item" data-item="${escapeHtml(item)}">${escapeHtml(item)}</div>`;
    }
    suggestions.innerHTML = html;
    suggestions.classList.add('show');
    // Add click handlers to suggestions
    const suggestionItems = suggestions.querySelectorAll('.suggestion-item');
    suggestionItems.forEach((el) => {
        el.addEventListener('click', () => {
            const itemName = el.getAttribute('data-item');
            if (itemName) {
                findItemInput.value = itemName;
                hideSuggestions();
                // Trigger find
                findForm.dispatchEvent(new Event('submit'));
            }
        });
    });
}
/**
 * Hide search suggestions
 */
function hideSuggestions() {
    suggestions.classList.remove('show');
    suggestions.innerHTML = '';
}
/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    const target = e.target;
    if (!suggestions.contains(target) && target !== findItemInput) {
        hideSuggestions();
    }
});
// Focus on capture item input on page load
captureItemInput.focus();
//# sourceMappingURL=main.js.map