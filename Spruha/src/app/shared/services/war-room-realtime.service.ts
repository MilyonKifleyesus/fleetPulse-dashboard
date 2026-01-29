import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { WarRoomService } from './war-room.service';
import {
  ActivityLog,
  ActivityStatus,
  NetworkMetrics,
  NetworkThroughput,
} from '../models/war-room.interface';

@Injectable({
  providedIn: 'root',
})
export class WarRoomRealtimeService implements OnDestroy {
  private updateInterval: Subscription | null = null;
  private activityLogIntervalSub: Subscription | null = null;
  private isRunning = false;
  private readonly companyLogos: Record<string, string> = {
    'creative carriage': '/assets/images/creative-carriage-logo.png',
    'alexander dennis': '/assets/images/alexander-dennis.jpg',
    'karsan': '/assets/images/KARSAN.jpg',
    'karzan': '/assets/images/KARSAN.jpg',
    'arboc': '/assets/images/ARBOC.jpg',
    'arbroc': '/assets/images/ARBOC.jpg',
    'tam': '/assets/images/tam-logo.png',
    'nfl': '/assets/images/New-Flyer.jpg',
    'new flyer': '/assets/images/New-Flyer.jpg',
    'nova': '/assets/images/Nova-Bus.jpg.png',
    'nova bus': '/assets/images/Nova-Bus.jpg.png',
  };

  constructor(private warRoomService: WarRoomService) {}

  /**
   * Start real-time updates
   */
  startRealTimeUpdates(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    // Update every 5 seconds
    this.updateInterval = interval(5000).subscribe(() => {
      this.updateMetrics();
      this.updateNetworkThroughput();
    });

    // Add new activity log every 30 seconds
    interval(30000).subscribe(() => {
      this.addRandomActivityLog();
    });
  }

  /**
   * Stop real-time updates
   */
  stopRealTimeUpdates(): void {
    if (this.updateInterval) {
      this.updateInterval.unsubscribe();
      this.updateInterval = null;
    }
    if (this.activityLogIntervalSub) {
      this.activityLogIntervalSub.unsubscribe();
      this.activityLogIntervalSub = null;
    }
    this.isRunning = false;
  }

  /**
   * Update network metrics (fleet sync rate, data integrity, latency)
   */
  private updateMetrics(): void {
    const currentMetrics = this.warRoomService.getNetworkMetrics();
    if (!currentMetrics) return;

    currentMetrics.subscribe((metrics) => {
      // Simulate small variations in metrics
      const updatedMetrics: Partial<NetworkMetrics> = {
        dataFlowIntegrity: this.varyValue(metrics.dataFlowIntegrity, 0.1, 99.5, 100),
        fleetSyncRate: this.varyValue(metrics.fleetSyncRate, 10, 1400, 1450),
        networkLatency: this.varyValue(metrics.networkLatency, 1, 2, 8),
        nodeDensity: this.varyValue(metrics.nodeDensity, 0.5, 98, 100),
      };

      // Calculate latency change
      const latencyChange = updatedMetrics.networkLatency
        ? updatedMetrics.networkLatency - metrics.networkLatency
        : 0;
      updatedMetrics.latencyChange = latencyChange;

      this.warRoomService.updateNetworkMetrics(updatedMetrics);
    });
  }

  /**
   * Update network throughput bars
   */
  private updateNetworkThroughput(): void {
    const currentThroughput = this.warRoomService.networkThroughput();
    if (!currentThroughput) return;

    // Generate new random bar heights
    const newBars = currentThroughput.bars.map((bar) =>
      this.varyValue(bar, 5, 40, 100)
    );

    this.warRoomService.updateNetworkThroughput({
      bars: newBars,
    });
  }

  /**
   * Add a random activity log entry
   */
  private addRandomActivityLog(): void {
    const companies = this.warRoomService.companies();
    if (companies.length === 0) return;

    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const statuses: ActivityStatus[] = ['ACTIVE', 'INFO'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const descriptions = [
      'SYSTEM OPTIMAL',
      'SYNC SUCCESS',
      'OPERATIONAL',
      'CONNECTED',
      'PEAK EFFICIENCY',
      'LOAD BALANCING COMPLETE',
      'LATENCY REDUCED',
      'HUB SHIFT START',
    ];

    const randomDescription =
      descriptions[Math.floor(Math.random() * descriptions.length)];

    // Get the actual location for this company from nodes
    const nodes = this.warRoomService.nodes();
    const companyNode = nodes.find((node) => node.companyId === randomCompany.id);
    const location = companyNode 
      ? companyNode.city.toUpperCase() 
      : this.getRandomLocation(); // Fallback if node not found

    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      company: randomCompany.name,
      companyId: randomCompany.id,
      status: randomStatus,
      title: `${randomCompany.name.toUpperCase()} | ${location}`,
      description: randomDescription,
      location: companyNode?.city || location,
      logo: this.getCompanyLogo(randomCompany.name),
    };

    this.warRoomService.addActivityLog(log);
  }

  /**
   * Update hub status for a random company
   */
  updateHubStatus(): void {
    const companies = this.warRoomService.companies();
    if (companies.length === 0) return;

    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    if (randomCompany.hubs.length === 0) return;

    const randomHub = randomCompany.hubs[Math.floor(Math.random() * randomCompany.hubs.length)];

    // Simulate small capacity changes
    if (randomHub.capacityPercentage !== undefined) {
      const newCapacity = this.varyValue(
        randomHub.capacityPercentage,
        2,
        45,
        100
      );
      this.warRoomService.updateHubStatus(randomCompany.id, randomHub.code, {
        capacityPercentage: newCapacity,
        capacity: `${Math.round(newCapacity)}% CAP`,
      });
    }
  }

  /**
   * Vary a value within a range
   */
  private varyValue(
    current: number,
    variation: number,
    min: number,
    max: number
  ): number {
    const change = (Math.random() - 0.5) * 2 * variation;
    const newValue = current + change;
    return Math.max(min, Math.min(max, Math.round(newValue * 10) / 10));
  }

  private getCompanyLogo(companyName: string): string | undefined {
    const lowerName = companyName.toLowerCase();
    const match = Object.keys(this.companyLogos).find((key) => lowerName.includes(key));
    return match ? this.companyLogos[match] : undefined;
  }

  /**
   * Get random location for activity log
   */
  private getRandomLocation(): string {
    const locations = [
      'NANJING, CHINA',
      'PARIS, ONTARIO',
      'INDIANAPOLIS',
      'WINNIPEG',
      'ST. EUSTACHE',
      'LAS VEGAS',
      'TURKEY',
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  ngOnDestroy(): void {
    this.stopRealTimeUpdates();
    // Ensure all subscriptions are cleaned up
    if (this.updateInterval) {
      this.updateInterval.unsubscribe();
      this.updateInterval = null;
    }
    if (this.activityLogIntervalSub) {
      this.activityLogIntervalSub.unsubscribe();
      this.activityLogIntervalSub = null;
    }
  }
}
