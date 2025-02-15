import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ReactiveFormsModule],
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css'],
})
export class ImageUploaderComponent implements OnInit {
  public uploader!: FileUploader; // Declare the uploader property
  uploadForm!: FormGroup;
  public imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private imageService: ImageService // Inject the service
  ) {
    this.uploadForm = this.fb.group({
      file: [null],
    });
  }

  ngOnInit(): void {
    // Initialize the uploader after the component is fully initialized
    this.uploader = new FileUploader({
      url: 'http://localhost:3000/upload',
      itemAlias: 'image',
      headers: [{ name: 'file-name', value: '' }],
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      file.headers = [{ name: 'file-name', value: file.file.name }];
      this.previewImage(file._file);
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any) => {
      console.log('Image Uploaded:', item, status, response);
      if (status === 200) {
        const fileUrl = JSON.parse(response).fileUrl;
      }
    };
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadForm.patchValue({ file });
      this.previewImage(file);
    }
  }

  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    const file = this.uploadForm.get('file')?.value;
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    this.http.post('http://localhost:3000/upload', formData).subscribe({
      next: (response) => {
        console.log('File Uploaded Successfully', response);
        const fileUrl = (response as any).fileUrl;
      },
      error: (error) => console.error('File Upload Failed', error),
    });
  }
}