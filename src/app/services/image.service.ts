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
  uploadImages(formData: FormData): Observable<{ files: any[] ; fileUrls: string[]; width: number; height: number }> {
    return this.http.post<{ files: any[]; fileUrls: string[]; width: number; height: number }>(`${this.apiUrl}/upload`, formData);
  }

  // Fetch the list of images
  getImageList(): Observable<{ name:string; width: number; height:number }[]> {
    return this.http.get<{ name:string; width: number; height:number }[]>(`${this.apiUrl}/api/images`)
  }
}
