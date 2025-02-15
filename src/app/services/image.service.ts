import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Upload an image
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ fileUrl: string }>(`${this.apiUrl}/upload`, formData);
  }

  // Fetch the list of images
  getImageList() {
    return this.http.get<string[]>(`${this.apiUrl}/api/images`)
  }
}
