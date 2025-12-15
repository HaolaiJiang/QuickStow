/**
 * AuthService handles user authentication via Firebase.
 * Requirements: 1.2, 1.3, 1.4
 */
import { auth, googleProvider } from './firebase-config.js';
/**
 * Convert Firebase User to our User interface
 */
function toUser(firebaseUser) {
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
    };
}
/**
 * AuthService provides authentication functionality using Firebase Auth.
 */
export class AuthService {
    constructor() {
        this._currentUser = null;
        this.listeners = new Set();
        // Listen to Firebase auth state changes (only if auth is available)
        if (auth) {
            auth.onAuthStateChanged((firebaseUser) => {
                this._currentUser = firebaseUser ? toUser(firebaseUser) : null;
                this.notifyListeners();
            });
        }
    }
    /**
     * Get the current authenticated user
     */
    get currentUser() {
        return this._currentUser;
    }
    /**
     * Check if a user is authenticated
     */
    get isAuthenticated() {
        return this._currentUser !== null;
    }
    /**
     * Subscribe to auth state changes
     * Returns an unsubscribe function
     */
    onAuthStateChanged(callback) {
        this.listeners.add(callback);
        // Immediately call with current state
        callback(this._currentUser);
        return () => {
            this.listeners.delete(callback);
        };
    }
    /**
     * Sign in with Google
     * Requirements: 1.2
     */
    async signInWithGoogle() {
        if (!auth || !googleProvider) {
            throw new Error('Firebase not available');
        }
        try {
            const result = await auth.signInWithPopup(googleProvider);
            return toUser(result.user);
        }
        catch (error) {
            console.error('Sign-in failed:', error);
            throw error;
        }
    }
    /**
     * Sign out the current user
     * Requirements: 1.4
     */
    async signOut() {
        if (!auth) {
            return;
        }
        try {
            await auth.signOut();
        }
        catch (error) {
            console.error('Sign-out failed:', error);
            throw error;
        }
    }
    /**
     * Notify all listeners of auth state change
     */
    notifyListeners() {
        for (const listener of this.listeners) {
            listener(this._currentUser);
        }
    }
}
// Export singleton instance
export const authService = new AuthService();
//# sourceMappingURL=auth.js.map