import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-forms-placeholder',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './forms-placeholder.component.html',
  styleUrl: './forms-placeholder.component.scss',
})
export class FormsPlaceholderComponent implements OnInit {
  title = 'Forms';
  title1: string[] = ['Forms'];
  activeitem = 'Overview';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.title = data['title'] ?? this.title;
      this.title1 = data['title1'] ?? this.title1;
      this.activeitem = data['activeitem'] ?? this.activeitem;
    });
  }
}
