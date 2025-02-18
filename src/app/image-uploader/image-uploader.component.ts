import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-image-uploader',
  imports: [CommonModule, FileUploadModule], // No ReactiveFormsModule needed
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css'],
})
export class ImageUploaderComponent implements OnInit {
  public uploader!: FileUploader;
  public imagePreviews: string[] = [];
  public uploadedFileUrls: string[] = [];

  ngOnInit(): void {
    this.uploader = new FileUploader({
      url: 'http://localhost:3000/upload',
      itemAlias: 'images', // Important: Matches your backend's expected field name
    });

    this.uploader.onAfterAddingFile = (fileItem) => {
      fileItem.withCredentials = false; // May or may not be needed
      const reader = new FileReader(); // Preview logic here
      reader.onload = (event: any) => {
        this.imagePreviews.push(event.target.result as string);
      };
      reader.readAsDataURL(fileItem._file); // Use fileItem._file for the actual File object.
    };

    this.uploader.onCompleteItem = (item, response, status) => {
      console.log('Image Uploaded:', item, status, response);
      if (status === 200) {
        try {
          const parsedResponse = JSON.parse(response);
          // Assuming your backend sends back { fileUrl: '...' }
          this.uploadedFileUrls.push(parsedResponse.fileUrl);
          // Or if it's an array of URLs:
          // this.uploadedFileUrls.push(...parsedResponse.fileUrls);
        } catch (error) {
          console.error('Error parsing response:', error, response);
        }
      }
    };

  }

  clearQueue() {
    this.uploader.clearQueue()
    this.imagePreviews = [];
  }
}