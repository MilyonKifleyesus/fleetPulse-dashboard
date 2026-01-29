import { Component, input, computed, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyData } from '../../../../../shared/models/war-room.interface';

@Component({
  selector: 'app-war-room-hub-status',
  imports: [CommonModule],
  templateUrl: './war-room-hub-status.component.html',
  styleUrl: './war-room-hub-status.component.scss',
})
export class WarRoomHubStatusComponent {
  selectedCompany = input<CompanyData | null>(null);

  addCompanyRequested = output<void>();

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
   * Handle add company click – request modal (handled by war-room, modal over map)
   */
  onAddCompany(): void {
    this.addCompanyRequested.emit();
  }
}
