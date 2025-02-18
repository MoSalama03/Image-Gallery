import { Component, OnInit } from '@angular/core';
import { GalleryLightboxComponent, Item } from "../gallery-lightbox/gallery-lightbox.component";
import { ImageService } from '../services/image.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [GalleryLightboxComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

    data: Item[] = [];

  constructor(private imageService: ImageService) {}

    
 ngOnInit(): void {
        this.fetchImages();
    }

    fetchImages(): void {
        this.imageService.getImageList().subscribe(
          (imageData) => {
            this.data = imageData.map((item, index) => ({
              imageSrc: `http://localhost:3000/uploads/${item.name}`,
              imageAlt: `Image ${index + 1}`,
              imageWidth: item.width,
              imageHeight: item.height,
            }));
          },
          (error) => {
            console.error('Error fetching images:', error);
          }
        );
      }

    // Upload the selected file
    uploadImages(files: File[]): void {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });


      this.imageService.uploadImages(formData).subscribe(
        (response) => {
          console.log('Files uploaded successfully:', response);
           response.fileUrls.forEach((fileUrl) => {
            this.data.push({
              imageSrc: `http://localhost:3000${fileUrl}`,
              imageAlt: `Uploaded Images`,
              imageWidth: response.width,
              imageHeight: response.height,
            });
          });
          },
          (error) => {
            console.error('Error uploading images:', error);
          });
        }
    }
