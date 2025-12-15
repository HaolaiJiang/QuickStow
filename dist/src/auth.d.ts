/**
 * AuthService handles user authentication via Firebase.
 * Requirements: 1.2, 1.3, 1.4
 */
/**
 * User interface for authenticated users
 */
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}
/**
 * AuthService provides authentication functionality using Firebase Auth.
 */
export declare class AuthService {
    private _currentUser;
    private listeners;
    constructor();
    /**
     * Get the current authenticated user
     */
    get currentUser(): User | null;
    /**
     * Check if a user is authenticated
     */
    get isAuthenticated(): boolean;
    /**
     * Subscribe to auth state changes
     * Returns an unsubscribe function
     */
    onAuthStateChanged(callback: (user: User | null) => void): () => void;
    /**
     * Sign in with Google
     * Requirements: 1.2
     */
    signInWithGoogle(): Promise<User>;
    /**
     * Sign out the current user
     * Requirements: 1.4
     */
    signOut(): Promise<void>;
    /**
     * Notify all listeners of auth state change
     */
    private notifyListeners;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.d.ts.map