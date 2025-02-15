import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Upload an image
  uploadImage(file: File): Observable<{ fileUrl: string; width: number; height: number }> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ fileUrl: string; width: number; height: number }>(`${this.apiUrl}/upload`, formData);
  }

  // Fetch the list of images
  getImageList(): Observable<{ name:string; width: number; height:number }[]> {
    return this.http.get<{ name:string; width: number; height:number }[]>(`${this.apiUrl}/api/images`)
  }
}
