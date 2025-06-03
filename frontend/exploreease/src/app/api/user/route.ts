import { NextResponse } from 'next/server';

// This would typically connect to a database, but for this demo we'll use an in-memory array
let USERS = [
  {
    id: 1,
    email: 'user@example.com',
    name: 'Demo User',
    password: 'password123', // In a real app, this would be hashed
    phone: '+1234567890',
    profilePic: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop',
    dob: '1990-01-01',
    gender: 'male',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    preferences: {
      seatingPreference: 'window',
      mealPreference: 'vegetarian',
      specialAssistance: false,
      currency: 'USD',
      language: 'English',
    }
  }
];

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
    console.error('User profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get user details' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { userId, ...updateData } = data;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const userIndex = USERS.findIndex(u => u.id === parseInt(userId));

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Update user data - real implementation would validate fields
    USERS[userIndex] = {
      ...USERS[userIndex],
      ...updateData,
      // Ensure we don't overwrite the ID and password
      id: USERS[userIndex].id,
      password: USERS[userIndex].password
    };

    // Remove password from response
    const { password: _, ...userWithoutPassword } = USERS[userIndex];

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { userId, currentPassword, newPassword } = data;

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'User ID, current password, and new password are required' },
        { status: 400 }
      );
    }

    const userIndex = USERS.findIndex(u => u.id === parseInt(userId));

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    if (USERS[userIndex].password !== currentPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Update password
    USERS[userIndex].password = newPassword;

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update password' },
      { status: 500 }
    );
  }
}
