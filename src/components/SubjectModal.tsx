import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubjectWithStats } from '@/hooks/useSubjects';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; code: string; color: string }) => void;
  subject?: SubjectWithStats | null;
  loading?: boolean;
}

const colorOptions = [
  'hsl(199 89% 48%)',
  'hsl(160 84% 39%)',
  'hsl(38 92% 50%)',
  'hsl(280 65% 55%)',
  'hsl(0 84% 60%)',
  'hsl(220 70% 55%)',
  'hsl(340 75% 55%)',
  'hsl(180 70% 45%)',
];

const SubjectModal = ({ isOpen, onClose, onSubmit, subject, loading }: SubjectModalProps) => {
  const [name, setName] = useState(subject?.name || '');
  const [code, setCode] = useState(subject?.code || '');
  const [color, setColor] = useState(subject?.color || colorOptions[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, code, color });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-card rounded-2xl border border-border p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {subject ? 'Edit Subject' : 'Add New Subject'}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name</Label>
              <Input
                id="name"
                placeholder="e.g., Data Structures"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Subject Code</Label>
              <Input
                id="code"
                placeholder="e.g., CS201"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Color
              </Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full transition-all ${
                      color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-primary"
                disabled={loading || !name || !code}
              >
                {loading ? 'Saving...' : subject ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubjectModal;
