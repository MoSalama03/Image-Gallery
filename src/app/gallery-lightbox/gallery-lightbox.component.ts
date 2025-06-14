import { Component, OnInit, Input, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { UserService } from '../services/user.service';
import { findLargestImageIndex } from '../shared/image.utils';
import { animate, style, transition, trigger, AnimationEvent } from '@angular/animations';

export interface Item {
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}

@Component({
    selector: 'app-gallery-lightbox',
    imports: [CommonModule, NgOptimizedImage],
    templateUrl: './gallery-lightbox.component.html',
    styleUrl: './gallery-lightbox.component.css',
    animations: [
        trigger('animation', [
            transition('void => visible', [
                style({ transform: 'scale(0.5)' }),
                animate('150ms', style({ transform: 'scale(1)' }))
            ]),
            transition('visible => void', [
                style({ transform: 'scale(1)' }),
                animate('150ms', style({ transform: 'scale(0.5)' }))
            ])
        ]),
        trigger('animation2', [
            transition(':leave', [
                style({ opacity: 1 }),
                animate('50ms', style({ opacity: 0.8 }))
            ])
        ])
    ]
})

export class GalleryLightboxComponent implements OnInit {
  userService = inject(UserService);
  @Input() galleryData: Item[] = [];
  @Input() showCount: boolean = false
  
  previewImage: boolean = false;
  showMask: boolean = false;
  currentlightBoxImage: Item = this.galleryData[0];
  currentIndex: number = 0;
  controls: boolean = true
  totalImageCount: number = 0;
  
  ngOnInit(): void {
    this.totalImageCount = this.galleryData.length;
    this.updateTotalImageCount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['galleryData']) {
      this.updateTotalImageCount();
    }
  }

  private updateTotalImageCount(): void {
    this.totalImageCount = this.galleryData.length;
  }

  onPreviewImage(index: number): void {
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.currentlightBoxImage = this.galleryData[index];
  }

  onAnimationEnd(event: AnimationEvent) {
    if(event.toState === 'void') {
      this.showMask = false;
    }
  }

  onClosePreview() {
    this.previewImage = false
  }

  next(): void {
    this.currentIndex = this.currentIndex + 1;
    if(this.currentIndex > this.galleryData.length -1) {
      this.currentIndex = 0;
    }
    this.currentlightBoxImage = this.galleryData[this.currentIndex];
  }

  prev(): void {
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.galleryData.length - 1;
    }
    this.currentlightBoxImage = this.galleryData[this.currentIndex];
  }

  findLargestImageIndex(): number {
    return findLargestImageIndex(this.galleryData)
  }

  getSrcset(maxWidth: number = 1239): string {
    const widths = [413, 826, maxWidth];
    return widths.map(width => `${width}w`).join(', ');
  }
}