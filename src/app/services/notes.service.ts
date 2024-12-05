import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private notesKey = 'notes'; // The key for storing notes in localStorage
  private notesSubject = new BehaviorSubject<any[]>(this.loadNotes()); // BehaviorSubject to manage state

  notes$ = this.notesSubject.asObservable(); // Observable for components to subscribe to

  // Save a new note in localStorage
  addNote(note: any) {
    const currentNotes = this.loadNotes();
    currentNotes.push(note);
    this.saveNotes(currentNotes); // Save the updated list to localStorage
    this.notesSubject.next(this.sortNotes(currentNotes)); // Update the BehaviorSubject
  }

  // Load notes from localStorage
  loadNotes(): any[] {
    const notes = localStorage.getItem(this.notesKey);
    return  notes ? this.sortNotes(JSON.parse(notes)) : [];;
  }

  // Save notes to localStorage
  saveNotes(notes: any[]) {
    localStorage.setItem(this.notesKey, JSON.stringify(notes));
  }
  // Sort notes by timestamp (new to old)
  sortNotes(notes: any[]): any[] {
    return notes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  deleteNote(noteToDelete: any) {
    const currentNotes = this.loadNotes().filter(
      (note) => note.timestamp !== noteToDelete.timestamp
    );
    this.saveNotes(currentNotes);
    this.notesSubject.next(currentNotes);
  }
}
