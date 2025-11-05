'use client'
import { Button } from '@/components/ui/button';
import { Trash2, Save } from 'lucide-react';

interface TestActionsProps {
  onSave: () => void;
  onDelete: () => void;
  isEditMode: boolean;
}

const TestActions = ({ onSave, onDelete, isEditMode }: TestActionsProps) => {
  return (
    <div className="flex justify-end gap-3 pb-8">
      {isEditMode && (
        <Button
          variant="destructive"
          onClick={onDelete}
          className="flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa bài kiểm tra
        </Button>
      )}
      <Button onClick={onSave} className="flex items-center">
        <Save className="h-4 w-4 mr-2" />
        {isEditMode ? 'Cập nhật bài kiểm tra' : 'Tạo bài kiểm tra'}
      </Button>
    </div>
  );
};

export default TestActions;
