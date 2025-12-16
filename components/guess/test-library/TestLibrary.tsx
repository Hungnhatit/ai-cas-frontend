'use client'
import React, {
  useState, useEffect, ChangeEvent
} from 'react';
import {
  Search, AlertCircle,
} from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import ExamList from './ExamList';
import { useRouter, useSearchParams } from 'next/navigation';
import { testService } from '@/services/test/testService';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Test } from '@/types/interfaces/model';

// --- Application Types & Mock Data ---

type ExamDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
type ExamCategory =
  | 'Mathematics'
  | 'History'
  | 'Science'
  | 'Literature'
  | 'Programming';

const EXAM_CATEGORIES: ExamCategory[] = [
  'Mathematics',
  'History',
  'Science',
  'Literature',
  'Programming',
];

interface FilterControlsProps {
  searchQuery: string;
  selectedCategory: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
}

const FilterControls = ({ searchQuery, selectedCategory, onSearchChange, onCategoryChange,
}: FilterControlsProps) => {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:justify-between">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm bài thi"
          className="pl-10 rounded-[3px] shadow-none bg-white border-gray-300"
          value={searchQuery}
          onChange={onSearchChange}
          aria-label="Search exams"
        />
      </div>
      <div className="w-full md:w-auto md:min-w-[200px]">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger aria-label="Filter by category" className='w-full border-gray-300 rounded-[3px] shadow-none cursor-pointer bg-white'>
            <SelectValue placeholder="Filter by category" className='w-full' />
          </SelectTrigger>
          <SelectContent className='border-gray-300 rounded-[3px] shadow-none cursor-pointer'>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="all" className='border-gray-300 rounded-[3px] shadow-none cursor-pointer'>Tất cả danh mục</SelectItem>
              {EXAM_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category} className='border-gray-300 rounded-[3px] shadow-none cursor-pointer'>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex h-64 flex-col items-center justify-center rounded-md border border-dashed">
    <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
    <h3 className="text-xl font-semibold">No Exams Found</h3>
    <p className="text-muted-foreground">
      Try adjusting your search or filter.
    </p>
  </div>
);

type PageState =
  | { view: 'list' }
  | { view: 'details'; examId: number };

const TestLibrary = () => {
  const [pageState, setPageState] = useState<PageState>({ view: 'list' });
  const router = useRouter();
  const [exams, setExams] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalExams, setTotalExams] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [examPerPage, setExamPerPage] = useState(0);
  const totalPages = Math.ceil(totalExams / examPerPage);
  const searchParams = useSearchParams();

  const onSelectExam = (id: number) => {
    setPageState({ view: 'details', examId: id })
  }

  if (pageState.view === 'details') {
    router.push(`/test-library/test/${pageState.examId}`);
  }

  useEffect(() => {
    try {
      const loadExams = async () => {
        setIsLoading(true);
        const res = await testService.getAllTests(currentPage, 10, searchQuery, selectedCategory);
        console.log(res.pagination.totalItems);
        setExams(res.data);
        setTotalExams(res.pagination.totalItems);
        setExamPerPage(res.pagination.pageSize);
      };
      loadExams();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }

  }, [currentPage, searchQuery, selectedCategory]);

  console.log('total exam: ', totalPages);

  // Event Handlers
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset to first page on new filter
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }

    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || 'all';

    router.push(`/test-library?page=${page}&query=${query}&category=${category}`)
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-7xl h-full flex flex-col mx-auto p-4 py-8 md:p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Thư viện đề thi
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Duyệt, tìm kiếm các bài thi có sẵn của chúng tôi
          </p>
        </header>

        {/* Filter Controls */}
        <FilterControls
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
        />

        {/* Exam List Section */}
        <main>
          {!isLoading && exams.length === 0 ? (
            <EmptyState />
          ) : (
            <ExamList
              exams={exams}
              isLoading={isLoading}
              itemsPerPage={examPerPage}
              onSelectExam={onSelectExam}
            />
          )}
        </main>

        {/* Pagination */}
        <footer>
          {/* Pagination */}
          <footer className="mt-8 flex justify-center">
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                  </PaginationItem>

                  {/* Hiển thị trang */}
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={currentPage === i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </footer>


        </footer>
      </div>
    </div>
  );
}

export default TestLibrary;