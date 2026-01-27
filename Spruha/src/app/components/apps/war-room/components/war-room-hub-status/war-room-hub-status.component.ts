import { Component, input, computed, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyData, Node, ActivityLog } from '../../../../../shared/models/war-room.interface';
import { WarRoomService } from '../../../../../shared/services/war-room.service';
import { AddCompanyModalComponent, CompanyFormData } from '../add-company-modal/add-company-modal.component';

@Component({
  selector: 'app-war-room-hub-status',
  imports: [CommonModule, AddCompanyModalComponent],
  templateUrl: './war-room-hub-status.component.html',
  styleUrl: './war-room-hub-status.component.scss',
})
export class WarRoomHubStatusComponent {
  selectedCompany = input<CompanyData | null>(null);

  // Services
  private warRoomService = inject(WarRoomService);

  // Modal visibility
  readonly modalVisible = signal<boolean>(false);
  
  // Reference to modal component for calling closeAfterSuccess
  readonly modalRef = viewChild<AddCompanyModalComponent>('modalRef');

  readonly hubs = computed(() => {
    return this.selectedCompany()?.hubs || [];
  });

  readonly quantumChart = computed(() => {
    return this.selectedCompany()?.quantumChart || null;
  });

  /**
   * Get hub border class
   */
  getHubBorderClass(status: string): string {
    return status === 'OPTIMAL' ? 'border-tactical-green' : 'border-zinc-700';
  }

  /**
   * Handle add company click
   */
  onAddCompany(): void {
    this.modalVisible.set(true);
  }

  /**
   * Handle modal close
   */
  onModalClose(): void {
    this.modalVisible.set(false);
  }

  /**
   * Handle company added from modal
   */
  async onCompanyAdded(formData: CompanyFormData): Promise<void> {
    console.log('=== onCompanyAdded START ===');
    console.log('Form data received:', formData);
    
    // Validate form data
    if (!formData.companyName || !formData.location) {
      console.error('Invalid form data - missing required fields');
      throw new Error('Company name and location are required');
    }
    
    try {
      // Parse location to get coordinates
      console.log('Parsing location:', formData.location);
      const locationData = await this.warRoomService.parseLocationInput(formData.location);
      console.log('Location parsed successfully:', locationData);
      
      // Check if coordinates are valid (not null)
      if (!locationData || locationData.latitude === null || locationData.longitude === null || 
          typeof locationData.latitude !== 'number' || typeof locationData.longitude !== 'number') {
        throw new Error('Location coordinates are required. Please provide valid coordinates or a location that can be geocoded.');
      }
      
      // Generate IDs
      const companyId = this.warRoomService.generateCompanyId(formData.companyName);
      const nodeId = this.warRoomService.generateNodeId(formData.companyName);
      console.log('Generated IDs - companyId:', companyId, 'nodeId:', nodeId);

      // Extract city and location from input
      // Format: "City, Province" -> city = "City", fullLocation = "City, Province"
      const locationParts = formData.location.split(',').map(part => part.trim());
      const city = locationParts.length > 1 ? locationParts[0] : formData.location.trim();
      const fullLocation = formData.location.trim(); // Keep full location for display
      console.log('Extracted city:', city);
      console.log('Full location:', fullLocation);

      // Create new node
      const newNode: Node = {
        id: nodeId,
        name: city.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        company: formData.companyName.toUpperCase(),
        companyId: companyId,
        city: city || 'Unknown',
        coordinates: {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        },
        type: 'Facility',
        status: 'ONLINE',
        isHub: true,
        hubCode: this.generateHubCode(formData.companyName),
      };
      console.log('Created new node:', newNode);

      // Add node to service
      console.log('Adding node to service...');
      this.warRoomService.addNode(newNode);
      console.log('Node added to service. Current nodes count:', this.warRoomService.nodes().length);

      // Create company data if it doesn't exist
      const existingCompany = this.warRoomService.getCompanyData(companyId);
      if (!existingCompany) {
        console.log('Company does not exist, creating new company...');
        const newCompany: CompanyData = {
          id: companyId,
          name: formData.companyName.toUpperCase(),
          hubs: [
            {
              id: `hub-${companyId}-${Date.now()}`,
              code: newNode.hubCode || 'NEW',
              companyId: companyId,
              companyName: formData.companyName.toUpperCase(),
              status: 'ONLINE',
              capacity: '100% CAP',
              capacityPercentage: 100,
              statusColor: 'text-tactical-green',
              capColor: 'text-tactical-green',
            },
          ],
          quantumChart: {
            dataPoints: [85, 88, 90, 92, 89, 91],
            highlightedIndex: 3,
          },
        };
        this.warRoomService.addCompany(newCompany);
        console.log('Company added to service');
      } else {
        console.log('Company already exists');
      }

      // Create activity log entry
      const activityLog: ActivityLog = {
        id: `log-${nodeId}`,
        timestamp: new Date(),
        company: formData.companyName.toUpperCase(),
        companyId: companyId,
        status: 'ACTIVE',
        title: `${formData.companyName.toUpperCase()} | ${fullLocation.toUpperCase()}`,
        description: 'SYSTEM REGISTERED // NODE INITIALIZED',
        location: fullLocation,
        logo: formData.logo || null, // Include logo if provided
      };
      console.log('Creating activity log entry:', activityLog);
      this.warRoomService.addActivityLog(activityLog);
      console.log('Activity log added. Current logs count:', this.warRoomService.activityLogs().length);

      // Select the new company
      this.warRoomService.selectCompany(companyId);
      console.log('Company selected:', companyId);

      console.log('=== Company added successfully ===');
      console.log('Company name:', formData.companyName);
      console.log('Company ID:', companyId);
      console.log('Node ID:', nodeId);
      console.log('Total nodes now:', this.warRoomService.nodes().length);
      console.log('Total activity logs now:', this.warRoomService.activityLogs().length);
      
      // Signal completion to modal so it can close
      const modal = this.modalRef();
      if (modal) {
        modal.closeAfterSuccess();
      }
    } catch (error) {
      console.error('=== ERROR in onCompanyAdded ===');
      console.error('Error details:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error; // Re-throw to let modal handle the error display
    }
  }


  /**
   * Generate hub code from company name (first 3 letters)
   */
  private generateHubCode(companyName: string): string {
    const words = companyName.toUpperCase().split(/\s+/);
    if (words.length >= 2) {
      // Use first letter of first two words, and second character of second word (or first if only one char)
      const firstChar = words[0][0] || '';
      const secondWord = words[1];
      const secondChar = secondWord.charAt(0) || '';
      const thirdChar = secondWord.length > 1 ? secondWord.charAt(1) : secondWord.charAt(0);
      return (firstChar + secondChar + thirdChar).substring(0, 3);
    } else {
      // Use first 3 letters of company name
      return companyName.toUpperCase().substring(0, 3).padEnd(3, 'X');
    }
  }
}
