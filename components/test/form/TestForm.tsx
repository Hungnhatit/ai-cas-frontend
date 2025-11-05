'use client'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TestFormProps {
  newTest: {
    tieu_de: string;
    mo_ta: string;
    thoi_luong: number;
    so_lan_lam_toi_da: number;
  };
  setNewTest: (value: any) => void;
}

const TestForm = ({ newTest, setNewTest }: TestFormProps) => {
  const handleChange = (field: string, value: any) => {
    setNewTest({ ...newTest, [field]: value });
  };

  return (
    <div className='bg-card p-4 rounded-[3px] shadow-xs mb-4 border border-gray-300'>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="test-title" className='mb-2'>Tên bài thi</Label>
            <Input
              id="test-title"
              value={newTest?.tieu_de}
              onChange={(e) => setNewTest({ ...newTest, tieu_de: e.target.value })}
              placeholder="Nhập tên bài thi"
              className="rounded-[3px] h-10 text-base border-gray-300/70 shadow-none"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="test-description" className='mb-2'>Mô tả</Label>
          <Textarea
            id="test-description"
            value={newTest?.mo_ta}
            onChange={(e) => setNewTest({ ...newTest, mo_ta: e.target.value })}
            placeholder="Describe what this test covers"
            className="rounded-[3px] h-12 text-base border-gray-300/70 shadow-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="test-duration" className='mb-2'>Thời gian làm bài</Label>
            <Input
              id="test-duration"
              type="number"
              value={newTest?.thoi_luong}
              onChange={(e) => setNewTest({ ...newTest, thoi_luong: Number.parseInt(e.target.value) })}
              min="5"
              max="180"
              className="rounded-[3px] h-12 text-base border-gray-300/80 shadow-none"
            />
          </div>
          <div>
            <Label htmlFor="test-attempts" className='mb-2'>Số lần làm tối đa</Label>
            <Input
              id="test-attempts"
              type="number"
              value={newTest?.so_lan_lam_toi_da}
              onChange={(e) => setNewTest({ ...newTest, so_lan_lam_toi_da: Number(e.target.value) })}
              min="1"
              max="10"
              className="rounded-[3px] h-12 text-base border-gray-300/80 shadow-none"
            />
          </div>
        </div>


      </div>
    </div>
  );
};

export default TestForm;
