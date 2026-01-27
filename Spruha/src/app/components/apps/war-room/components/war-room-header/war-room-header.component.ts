import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-war-room-header',
  imports: [CommonModule],
  templateUrl: './war-room-header.component.html',
  styleUrl: './war-room-header.component.scss',
})
export class WarRoomHeaderComponent {
  currentTime = input.required<Date>();

  readonly zuluTime = computed(() => {
    const date = this.currentTime();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  });
}
