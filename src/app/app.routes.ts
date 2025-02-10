import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';

export const routes: Routes = [
  {path: '', title: 'Home', component: HomeComponent},
  {path: 'upload', title:'Image Uploader' , component: ImageUploaderComponent}
];