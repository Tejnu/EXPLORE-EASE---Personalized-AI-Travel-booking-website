/**
 * Auth utility functions for ExploreEase
 */

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

// Mock function to simulate getting the current user
// In a real app, this would check cookies, JWT tokens, or call an API
export function getCurrentUser(): User | null {
  // If we have user data in localStorage, use that
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

  if (storedUser) {
    try {
      return JSON.parse(storedUser) as User;
    } catch (e) {
      console.error('Failed to parse stored user', e);
    }
  }

  // Return null if no user is authenticated
  return null;
}

// Mock function to simulate login
export async function login(email: string, password: string): Promise<User> {
  // This would normally verify credentials with an API
  // For demo purposes, we'll just return a mock user
  const user: User = {
    id: 'user-123',
    name: 'Demo User',
    email: email,
  };

  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }

  return user;
}

// Mock function to simulate logout
export function logout(): void {
  // Clear user data from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}

// Check if a user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
