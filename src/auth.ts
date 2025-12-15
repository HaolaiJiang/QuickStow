/**
 * AuthService handles user authentication via Firebase.
 * Requirements: 1.2, 1.3, 1.4
 */

import { auth, googleProvider } from './firebase-config.js';

/**
 * User interface for authenticated users
 */
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

/**
 * Convert Firebase User to our User interface
 */
function toUser(firebaseUser: any): User {
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
  private _currentUser: User | null = null;
  private listeners: Set<(user: User | null) => void> = new Set();

  constructor() {
    // Listen to Firebase auth state changes (only if auth is available)
    if (auth) {
      auth.onAuthStateChanged((firebaseUser: any) => {
        this._currentUser = firebaseUser ? toUser(firebaseUser) : null;
        this.notifyListeners();
      });
    }
  }

  /**
   * Get the current authenticated user
   */
  get currentUser(): User | null {
    return this._currentUser;
  }

  /**
   * Check if a user is authenticated
   */
  get isAuthenticated(): boolean {
    return this._currentUser !== null;
  }

  /**
   * Subscribe to auth state changes
   * Returns an unsubscribe function
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
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
  async signInWithGoogle(): Promise<User> {
    if (!auth || !googleProvider) {
      throw new Error('Firebase not available');
    }
    try {
      const result = await auth.signInWithPopup(googleProvider);
      return toUser(result.user);
    } catch (error) {
      console.error('Sign-in failed:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   * Requirements: 1.4
   */
  async signOut(): Promise<void> {
    if (!auth) {
      return;
    }
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Sign-out failed:', error);
      throw error;
    }
  }

  /**
   * Notify all listeners of auth state change
   */
  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this._currentUser);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
