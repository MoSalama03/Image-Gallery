import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { query } from 'express';
import { fromEvent, Observable, debounceTime, map, switchMap, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-search-engine',
  imports: [],
  templateUrl: './search-engine.component.html',
  styleUrl: './search-engine.component.css'
})
export class SearchEngineComponent implements AfterViewInit {
  @ViewChild('searchInput')
  searchInput!: ElementRef;
  results: string[] = [];

  // Mock data for search
  private data = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

  ngAfterViewInit() {
    // Create an observable from the input event
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        // Extract the input value
        map((event: any) => (event.target as HTMLInputElement).value),
        // Wait for 300ms after the user stops typing
        debounceTime(300),
        // Ignore if the value hasn't changed
        distinctUntilChanged(),
        // Perform the search
        // Clear the results if the input is empty
        filter((query: string) => {
          if (!query) {
          this.results = [];
        }
        return !!query
      }),
        switchMap(query => this.search(query))).
        subscribe((results: string[]) => {
        this.results = results;
      })
  }

  // Simulate a search API call
  private search(query: string): Observable<string[]> {
    return new Observable(subscriber => {
      const filteredResults = this.data.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      subscriber.next(filteredResults);
      subscriber.complete();
    });
  }
}
