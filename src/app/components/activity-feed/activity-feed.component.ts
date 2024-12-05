import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-activity-feed',
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.css'],
})
export class ActivityFeedComponent implements OnInit {
  notes: any[] = [];
  noteContent = '';
  selectedType = 'message';
  activePopover: string | null = null; // Track the active popover

  icons = [
    { type: 'message', icon: 'message' },
    { type: 'phone', icon: 'phone' },
    { type: 'coffee', icon: 'coffee' },
    { type: 'calendar', icon: 'calendar' },
  ];
  // Reference to templates for icons
  @ViewChild('messageIcon') messageIcon!: TemplateRef<any>;
  @ViewChild('phoneIcon') phoneIcon!: TemplateRef<any>;
  @ViewChild('coffeeIcon') coffeeIcon!: TemplateRef<any>;
  @ViewChild('calendarIcon') calendarIcon!: TemplateRef<any>;
  @ViewChild('defaultIcon') defaultIcon!: TemplateRef<any>;

  constructor(private notesService: NotesService) {}

  ngOnInit() {
    this.notesService.notes$.subscribe((notes) => {
      this.notes = notes;
    });
  }

  getIcon(type: string): TemplateRef<any> {
    switch (type) {
      case 'message':
        return this.messageIcon;
      case 'phone':
        return this.phoneIcon;
      case 'coffee':
        return this.coffeeIcon;
      case 'calendar':
        return this.calendarIcon;
      default:
        return this.defaultIcon;
    }
  }
  // Method to calculate relative time
  getRelativeTime(timestamp: string): string {
    const now = new Date();
    const noteDate = new Date(timestamp);
    const diffInMs = now.getTime() - noteDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `${diffInHours}hr`;
    } else if (diffInDays === 1) {
      return `1d`;
    } else {
      return `${diffInDays}d`;
    }
  }
  selectType(type: string) {
    this.selectedType = type;
  }

  submitNote() {
    if (this.noteContent) {
      const newNote = {
        type: this.selectedType, // Type of note (e.g., message, phone, coffee)
        user: 'Milton Romaguera',
        content: this.noteContent,
        timestamp: new Date().toISOString(), // Current timestamp
      };
      this.notesService.addNote(newNote);
      this.noteContent = '';
      this.selectedType = 'message'
    }
  }

  deleteNote(note: any) {
    this.notesService.deleteNote(note);
    this.activePopover = null;
  }

  togglePopover(timestamp: string) {
    this.activePopover = this.activePopover === timestamp ? null : timestamp;
  }
}
