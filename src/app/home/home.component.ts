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
    uploadImage(file: File): void {
        this.imageService.uploadImage(file).subscribe(
          (response) => {
            const newImage: Item = {
              imageSrc: `http://localhost:3000${response.fileUrl}`,
              imageAlt: `Uploaded Image`,
              imageWidth: response.width,
              imageHeight: response.height,
            };
            this.data.push(newImage); // Push the new image into the data array
          },
          (error) => {
            console.error('Error uploading image:', error);
          }
        );
      }
    }
