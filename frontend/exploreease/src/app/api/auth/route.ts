import { NextResponse } from 'next/server';

// This would typically connect to a database, but for this demo we'll use an in-memory array
const USERS = [
  {
    id: 1,
    email: 'user@example.com',
    name: 'Demo User',
    password: 'password123', // In a real app, this would be hashed
    phone: '+1234567890'
  }
];

export async function POST(request: Request) {
  try {
    const { action, email, password, name, phone } = await request.json();

    // Login flow
    if (action === 'login') {
      const user = USERS.find(u => u.email === email);

      if (!user || user.password !== password) {
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // In a real app, you would generate a JWT or session token here
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        token: 'dummy-auth-token-' + Date.now()
      });
    }

    // Register flow
    if (action === 'register') {
      // Check if user already exists
      const existingUser = USERS.find(u => u.email === email);
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'User with this email already exists' },
          { status: 400 }
        );
      }

      // Create new user
      const newUser = {
        id: USERS.length + 1,
        email,
        name,
        password,
        phone
      };

      USERS.push(newUser);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      return NextResponse.json({
        success: true,
        message: 'Registration successful',
        user: userWithoutPassword,
        token: 'dummy-auth-token-' + Date.now()
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Get user details for an authenticated user
export async function GET(request: Request) {
  try {
    // In a real app, you would validate a JWT or session token here
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = USERS.find(u => u.id === parseInt(userId));

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get user details' },
      { status: 500 }
    );
  }
}
