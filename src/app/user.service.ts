import { Injectable } from '@angular/core';

interface User {
  Id: number;
  userName: string;
  userEmail: string;
  role: 'admin' | 'user' | 'guest'; // Define user role
}

interface UserImage {
id: number;
url: string; // URL of the image
title: string;
description?: string;
userId: number; // ID of the user who uploaded the image
}
@Injectable({
  providedIn: 'root'
})

export class UserService {
  private users: User[] = [];
  private images: UserImage[] = [];
  private nextUserId: number = 1;
  private nextImageId: number = 1;

  // Add a new user
  addUser(userName: string, userEmail: string, role: 'admin' | 'user' | 'guest'): User {
    const newUser : User = {
      Id: this.nextImageId++,
      userName,
      userEmail,
      role,
    };
    this.users.push(newUser);
    return newUser;
  }

  // Get all users
  getUsers(): User[] {
    return this.users;
  }

  // Get a user by ID
  getUserById(id: number): User | undefined {
    return this.users.find((user) => user.Id === id);
  }

  // Add an image for a user
  addImage(userId: number, url: string, title: string, description: string): UserImage {
    const newImage: UserImage = {
      id: this.nextImageId++,
      url,
      title,
      description,
      userId,
    };
    this.images.push(newImage);
    return newImage;
  }

  // Get all images for a user
  getImagesByUserId(userId: number): UserImage[] {
    return this.images.filter((image) => image.userId === userId);
  }

  // Get all images (for admins)
  getAllImages(): UserImage[] {
    return this.images;
  }
}
