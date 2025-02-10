import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms' ;
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploader } from 'ng2-file-upload'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ReactiveFormsModule],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.css'
})
export class ImageUploaderComponent {
  public uploader: FileUploader = new FileUploader({
    url: "http://localhost:3000",
    itemAlias: "image",
    headers: [{name: 'file-name', value: ''}] // Add a custom header for the file name
  });
  uploadForm!: FormGroup;

  public imagePreview: string | ArrayBuffer | null = null;  

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false; // Set to true if your API requires credentials
      // Set the file name in the custom header
      file.headers = [{name: 'file-name', value: file.file.name}]

      this.uploadForm = this.fb.group({
        file:[null] // Initialize the file control
      })
    }

    this.uploader.onCompleteItem = (item: any, response: any, status: any) => {
      console.log('Image Uploaded:', item, status, response);
      // Handle the response from the server
    };
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadForm?.patchValue({ file }); // Update the form control
      this.previewImage(file); // Preview the imagessssswsss
    }
  }
  
  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result; // Set the image preview
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('image', this.uploadForm.get('file')?.value); // Append the file to FormData

    // Send the file to the backend
    // Example: this.http.post('http://localhost:3000/upload', formData).subscribe(...);
    console.log('File to upload:', this.uploadForm.get('file')?.value);
    // Send the file to the backend
    this.http.post('http://localhost:3000/upload', formData)
    .subscribe({
      next: (response) => console.log('File Uploaded Successfully', response),
      error: (error: Error) => console.error('File Upload Failed', error)
    });
  }
}