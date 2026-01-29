import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityLog } from '../../../../../shared/models/war-room.interface';

@Component({
  selector: 'app-war-room-activity-log',
  imports: [CommonModule],
  templateUrl: './war-room-activity-log.component.html',
  styleUrl: './war-room-activity-log.component.scss',
})
export class WarRoomActivityLogComponent {
  activityLogs = input.required<ActivityLog[]>();
  selectedCompanyId = input<string | null>(null);

  companySelected = output<string>();

  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp: Date | string): string {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * Handle log entry click
   */
  onLogClick(log: ActivityLog): void {
    console.log('Activity log entry clicked:', log);
    console.log('Emitting companyId:', log.companyId);
    this.companySelected.emit(log.companyId);
  }

  /**
   * Check if log entry is selected
   */
  isSelected(log: ActivityLog): boolean {
    return this.selectedCompanyId() === log.companyId;
  }

  /**
   * Get status background class
   */
  getStatusClass(status: string): string {
    return status === 'ACTIVE' ? 'status-active' : 'status-info';
  }

  /**
   * Get displayed logs - limit to 7 entries (one per company)
   */
  getDisplayedLogs(): ActivityLog[] {
    const logs = this.activityLogs();
    // Sort by timestamp (most recent first)
    const sortedLogs = logs
      .slice()
      .sort((a, b) => {
        const dateA = typeof a.timestamp === 'string' ? new Date(a.timestamp) : a.timestamp;
        const dateB = typeof b.timestamp === 'string' ? new Date(b.timestamp) : b.timestamp;
        return dateB.getTime() - dateA.getTime();
      });
    
    // Deduplicate by companyId - keep first entry for each company
    const companyMap = new Map<string, ActivityLog>();
    for (const log of sortedLogs) {
      if (!companyMap.has(log.companyId)) {
        companyMap.set(log.companyId, log);
      }
      // Stop once we have 7 entries
      if (companyMap.size >= 7) {
        break;
      }
    }
    
    // Return array of unique company logs (up to 7)
    return Array.from(companyMap.values());
  }

  /**
   * Extract company name from title (format: "COMPANY | LOCATION")
   */
  getCompanyNameFromTitle(title: string): string {
    const parts = title.split('|');
    const companyName = parts.length > 0 ? parts[0].trim() : title;
    return this.normalizeCompanyName(companyName);
  }

  /**
   * Extract location from title (format: "COMPANY | LOCATION")
   */
  getLocationFromTitle(title: string): string {
    const parts = title.split('|');
    return parts.length > 1 ? parts[1].trim() : '';
  }

  /**
   * Handle company name click specifically
   */
  onCompanyNameClick(log: ActivityLog, event: Event): void {
    event.stopPropagation(); // Prevent triggering the parent click handler twice
    console.log('Company name clicked:', log.company, 'companyId:', log.companyId);
    this.companySelected.emit(log.companyId);
  }

  private normalizeCompanyName(companyName: string): string {
    const lowerName = companyName.toLowerCase();
    if (lowerName.includes('karzan') || lowerName.includes('karsan')) {
      return 'KARSAN';
    }
    if (lowerName.includes('arbroc') || lowerName.includes('arboc')) {
      return 'ARBOC';
    }
    if (lowerName.includes('nova bus') || lowerName.includes('nova')) {
      return 'Nova Bus';
    }
    if (lowerName.includes('nfl') || lowerName.includes('new flyer')) {
      return 'New Flyer';
    }
    return companyName;
  }
}
