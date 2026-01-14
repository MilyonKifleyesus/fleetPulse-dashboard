import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone:false,
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit, AfterViewInit {

  @Input() title!: string;
  @Input() title1!: any[];
  @Input() activeitem!: string;
  @Input() showSaveButton: boolean = false;
  @Input() isUploading: boolean = false;
  
  @Output() importClick = new EventEmitter<void>();
  @Output() saveClick = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();
  
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // ViewChild is now available after view initialization
  }

  onImportClick(): void {
    // Emit event first (in case parent wants to handle it)
    this.importClick.emit();
    // Then trigger file input
    this.triggerFileInput();
  }

  onSaveClick(): void {
    this.saveClick.emit();
  }

  triggerFileInput(): void {
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      // Method 1: Use ViewChild if available
      if (this.fileInput?.nativeElement) {
        this.fileInput.nativeElement.click();
        return;
      }
      
      // Method 2: Find the input element in the current component's view
      // This is more reliable for non-standalone components
      const viewContainer = document.querySelector('app-page-header');
      if (viewContainer) {
        const fileInputElement = viewContainer.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInputElement) {
          fileInputElement.click();
          return;
        }
      }
      
      // Method 3: Direct DOM query (fallback)
      const fileInputElement = document.querySelector('input[type="file"][accept=".xlsx,.xls"]') as HTMLInputElement;
      if (fileInputElement) {
        fileInputElement.click();
        return;
      }
      
      console.error('File input element not found. Please check the component template.');
    }, 0);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileSelected.emit(file);
      // Reset the input so the same file can be selected again
      input.value = '';
    }
  }

}
