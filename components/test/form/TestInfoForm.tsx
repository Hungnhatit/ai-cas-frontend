'use client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

export default function TestInfoForm({ categories, newTest, setNewTest }: any) {
  const selectedCount = newTest.danh_muc?.length || 0;


  const handleCateToggle = (categoryId: number) => {
    const currentCategoryObjects = Array.isArray(newTest.danh_muc)
      ? newTest.danh_muc.filter((item: any) => typeof item === 'object' && item.ma_danh_muc)
      : [];

    // Tìm index của danh mục đã chọn
    const existingIndex = currentCategoryObjects.findIndex(
      (cate: any) => cate.ma_danh_muc === categoryId
    );

    let updatedCategories: any[];

    if (existingIndex !== -1) {
      // BỎ CHỌN: Lọc bỏ object có ID tương ứng
      updatedCategories = currentCategoryObjects.filter(
        (cate: any) => cate.ma_danh_muc !== categoryId
      );
    } else {
      // CHỌN: Tìm object đầy đủ từ mảng categories
      const categoryToAdd = categories.find(
        (cate: any) => cate.ma_danh_muc === categoryId
      );

      if (categoryToAdd) {
        // --- BƯỚC 2: CHỈ LẤY MA_DANH_MUC VÀ TEN_DANH_MUC ---
        const simplifiedCategory = {
          ma_danh_muc: categoryToAdd.ma_danh_muc,
          ten_danh_muc: categoryToAdd.ten_danh_muc,
        };

        updatedCategories = [...currentCategoryObjects, simplifiedCategory];
      } else {
        updatedCategories = currentCategoryObjects;
      }
    }

    setNewTest({
      ...newTest,
      danh_muc: updatedCategories, // Mảng object (ma_danh_muc, ten_danh_muc)
    });

    console.log('UPDATE CATEGORY: ', updatedCategories);
  };

  const displayPlaceholder = selectedCount > 0
    ? `${selectedCount} danh mục đã chọn`
    : "Chọn danh mục";



  return (
    <div className='bg-card p-4 rounded-[3px] shadow-xs mb-4 border border-gray-300'>
      <div className="space-y-5">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="test-title" className='mb-2'>Tên bài thi</Label>
            <Input
              id="test-title"
              value={newTest.tieu_de}
              onChange={(e) => setNewTest({ ...newTest, tieu_de: e.target.value })}
              placeholder="Nhập tên bài thi"
              className="rounded-[3px] h-10 text-base border-gray-300/70 shadow-none"
            />
          </div>

          <div>
            <Label htmlFor="test-duration" className='mb-2'>Thời gian làm bài</Label>
            <Input
              id="test-duration"
              type="number"
              value={newTest.thoi_luong || ''}
              onChange={(e) => setNewTest({ ...newTest, thoi_luong: Number.parseInt(e.target.value) })}
              min="5"
              max="180"
              className="rounded-[3px] h-10 text-base border-gray-300/80 shadow-none"
            />
          </div>

          <div>
            <Label className='mb-2 text-black' htmlFor="test-title">Danh mục</Label>
            <Select>
              <SelectTrigger className='w-full !h-10 rounded-[3px] shadow-none border-gray-300 cursor-pointer'>
                {/* SỬ DỤNG selectedCount mới tính toán */}
                <SelectValue placeholder={displayPlaceholder} />
              </SelectTrigger>
              <SelectContent className='rounded-[3px] shadow-none border-gray-300'>
                <SelectGroup>
                  <SelectLabel>Danh mục</SelectLabel>
                  {categories.map((cate: any) => (
                    <div
                      key={cate.ma_danh_muc}
                      className="flex items-center px-3 py-1 cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => handleCateToggle(cate.ma_danh_muc)}
                    >
                      <input
                        type="checkbox"
                        // SỬA LOGIC CHECKED để tìm ID trong mảng object
                        checked={newTest.danh_muc?.some((selected: any) => selected.ma_danh_muc === cate.ma_danh_muc)}
                        onChange={(e) => { e.stopPropagation(); }}
                        className="mr-2"
                      />
                      <span>{cate.ten_danh_muc}</span>
                    </div>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="test-description" className='mb-2'>Mô tả</Label>
          <Textarea
            id="test-description"
            value={newTest.mo_ta}
            onChange={(e) => setNewTest({ ...newTest, mo_ta: e.target.value })}
            placeholder="Nhập thông tin mô tả bài thi"
            className="rounded-[3px] h-24 text-base border-gray-300/70 shadow-none"
          />
        </div>
      </div>
    </div>
  );
}
