import { Component, input, output, signal, inject, HostListener, effect, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarRoomService } from '../../../../../shared/services/war-room.service';

export interface CompanyFormData {
  companyName: string;
  location: string;
  logo?: string | ArrayBuffer | null;
  logoFile?: File;
}

@Component({
  selector: 'app-add-company-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-company-modal.component.html',
  styleUrl: './add-company-modal.component.scss',
})
export class AddCompanyModalComponent implements OnDestroy {
  // Inputs
  isVisible = input<boolean>(false);

  // Outputs
  companyAdded = output<CompanyFormData>();
  companyAddedComplete = output<void>();
  close = output<void>();

  // Services
  private warRoomService = inject(WarRoomService);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  // Form data
  companyName = signal<string>('');
  location = signal<string>('');
  logoFile = signal<File | null>(null);
  logoPreview = signal<string | null>(null);

  // Form state
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    // Move modal to body when visible
    effect(() => {
      const visible = this.isVisible();
      if (visible) {
        // Use setTimeout to ensure DOM is ready after Angular's change detection
        setTimeout(() => {
          this.moveToBody();
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up: remove from body if still attached
    const element = this.elementRef.nativeElement;
    if (element.parentNode === document.body) {
      this.renderer.removeChild(document.body, element);
    }
  }

  /**
   * Move modal component to body element for proper rendering
   */
  private moveToBody(): void {
    const element = this.elementRef.nativeElement;
    if (element.parentNode !== document.body) {
      this.renderer.appendChild(document.body, element);
    }
  }

  /**
   * Handle escape key to close modal
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(): void {
    if (this.isVisible()) {
      this.onClose();
    }
  }

  /**
   * Handle file selection for logo
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Check if it's an image file (SVG, PNG, JPG, JPEG, GIF, WEBP)
      const validImageTypes = [
        'image/svg+xml',
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp'
      ];
      
      const validExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (validImageTypes.includes(file.type) || validExtensions.includes(fileExtension)) {
        this.logoFile.set(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.logoPreview.set(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        this.errorMessage.set('Please select an image file (SVG, PNG, JPG, GIF, or WEBP)');
        setTimeout(() => this.errorMessage.set(null), 3000);
      }
    }
  }

  /**
   * Remove selected logo
   */
  removeLogo(): void {
    this.logoFile.set(null);
    this.logoPreview.set(null);
  }

  /**
   * Validate form
   */
  private validateForm(): boolean {
    if (!this.companyName().trim()) {
      this.errorMessage.set('Company name is required');
      return false;
    }

    if (!this.location().trim()) {
      this.errorMessage.set('Location is required');
      return false;
    }

    return true;
  }

  /**
   * Parse location input (coordinates or address)
   */
  private async parseLocation(locationInput: string): Promise<{ latitude: number | null; longitude: number | null; city: string; needsGeocoding?: boolean } | null> {
    const trimmed = locationInput.trim();

    // Extract city from input (everything after the coordinates if coordinates are provided)
    let city = trimmed;
    
    // Try to parse as coordinates (format: "lat, lng" or "lat,lng")
    const coordinateMatch = trimmed.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)(?:\s*,\s*(.+))?$/);
    if (coordinateMatch) {
      const latitude = parseFloat(coordinateMatch[1]);
      const longitude = parseFloat(coordinateMatch[2]);
      city = coordinateMatch[3] ? coordinateMatch[3].trim() : trimmed;

      // Validate coordinate ranges
      if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
        return { latitude, longitude, city: city || 'Unknown' };
      } else {
        throw new Error('Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180');
      }
    }

    // Check if it's a "City, Province" format (e.g., "Toronto, Ontario")
    // Pattern: text, text (at least one comma with text on both sides, not coordinates)
    const cityProvinceMatch = trimmed.match(/^([^,]+),\s*([^,]+)$/);
    if (cityProvinceMatch && !coordinateMatch) {
      // Valid "City, Province" format - accept it even if geocoding isn't available
      // Return null coordinates with needsGeocoding flag so downstream consumers can detect this
      city = trimmed;
      return { latitude: null, longitude: null, city: trimmed, needsGeocoding: true };
    }

    // If not coordinates or city/province format, try geocoding service
    try {
      const coords = await this.warRoomService.parseLocationInput(trimmed);
      // Use the input as city name if it's an address
      return { ...coords, city: trimmed };
    } catch (error) {
      // If geocoding fails but it looks like a valid location string, accept it
      // This allows "City, Province" format to work even without geocoding
      if (trimmed.length > 0 && !trimmed.match(/^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/)) {
        // Not coordinates, treat as location string (e.g., "Toronto, Ontario")
        return { latitude: null, longitude: null, city: trimmed, needsGeocoding: true };
      }
      throw error instanceof Error ? error : new Error('Could not parse location. Please enter coordinates in format "latitude, longitude" or a location like "City, Province"');
    }
  }

  /**
   * Handle form submission
   */
  async onSubmit(): Promise<void> {
    // Clear previous errors
    this.errorMessage.set(null);

    // Validate form
    if (!this.validateForm()) {
      setTimeout(() => this.errorMessage.set(null), 3000);
      return;
    }

    this.isSubmitting.set(true);

    try {
      // Parse location
      const locationData = await this.parseLocation(this.location());
      if (!locationData) {
        throw new Error('Failed to parse location');
      }

      // Prepare form data
      const formData: CompanyFormData = {
        companyName: this.companyName().trim(),
        location: this.location().trim(),
        logo: this.logoPreview(),
        logoFile: this.logoFile() || undefined,
      };

      // Emit company added event
      this.companyAdded.emit(formData);
      
      // Wait for parent to signal completion via companyAddedComplete event
      // The parent should call closeAfterSuccess() or emit companyAddedComplete when done
    } catch (error) {
      console.error('Error in onSubmit:', error);
      const errorMsg = error instanceof Error ? error.message : 'An error occurred while processing the form';
      this.errorMessage.set(errorMsg);
      console.error('Error message set:', errorMsg);
      // Don't auto-hide error - let user see it and fix the issue
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Reset form
   */
  private resetForm(): void {
    this.companyName.set('');
    this.location.set('');
    this.logoFile.set(null);
    this.logoPreview.set(null);
    this.errorMessage.set(null);
  }

  /**
   * Handle close button click
   */
  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  /**
   * Close modal after successful company addition
   * Called by parent when processing is complete
   */
  closeAfterSuccess(): void {
    this.resetForm();
    this.onClose();
  }

  /**
   * Handle backdrop click
   */
  onBackdropClick(event: MouseEvent): void {
    // Only close if clicking the backdrop itself, not the modal content
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  /**
   * Stop event propagation for modal content clicks
   */
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}
