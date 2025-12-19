import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, FileText, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const handleAddNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    toast.success('Note added successfully!');
  };

  const handleUpdateNote = (id: string, title: string, content: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, title, content, updatedAt: new Date().toLocaleString() } : note
      )
    );
    toast.success('Note updated successfully!');
  };

  const handleDeleteNote = () => {
    if (deletingNoteId) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== deletingNoteId));
      setDeletingNoteId(null);
      toast.success('Note deleted successfully!');
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Notes</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Create, edit, and manage your notes.
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="h-9">
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Add Note</span>
        </Button>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <Card key={note.id} className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{note.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Last updated: {note.updatedAt}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-4">{note.content}</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingNote(note)}
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeletingNoteId(note.id)}
                  >
                    <Trash2 className="w-4 h-4 text-danger" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full shadow-card">
            <CardContent className="p-8 text-center text-muted-foreground">
              No notes found. Click "Add Note" to create one!
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Note Modal */}
      <AddNoteModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddNote}
      />

      {/* Edit Note Modal */}
      {editingNote && (
        <EditNoteModal
          open={!!editingNote}
          onOpenChange={(open) => !open && setEditingNote(null)}
          note={editingNote}
          onUpdate={handleUpdateNote}
        />
      )}

      {/* Delete Note Alert Dialog */}
      <AlertDialog open={!!deletingNoteId} onOpenChange={(open) => !open && setDeletingNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote} className="bg-danger hover:bg-danger/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (title: string, content: string) => void;
}

function AddNoteModal({ open, onOpenChange, onAdd }: AddNoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onAdd(title, content);
      setTitle('');
      setContent('');
      onOpenChange(false);
    } else {
      toast.error('Title and content cannot be empty.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
          <DialogDescription>
            Enter the title and content for your new note.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
  onUpdate: (id: string, title: string, content: string) => void;
}

function EditNoteModal({ open, onOpenChange, note, onUpdate }: EditNoteModalProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onUpdate(note.id, title, content);
      onOpenChange(false);
    } else {
      toast.error('Title and content cannot be empty.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>
            Make changes to your note here.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
