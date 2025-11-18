export interface Editor {
  id: number; // Unique ID for CRUD operations
  journalId: number;
  editorName: string;
  designation: string;
  email: string;
  editorAddress: string;
  editorType: string;
}