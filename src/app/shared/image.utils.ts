import { Item } from "../gallery-lightbox/gallery-lightbox.component";

export function findLargestImageIndex(data: Item[]): number {
  let largestIndex = 0;
  let largestArea = 0;

  data.forEach((item: Item, index: number) => {
      const area = item.imageWidth * item.imageHeight;
      if (area > largestArea) {
          largestArea = area;
          largestIndex = index;
      }
  });

  return largestIndex;
}