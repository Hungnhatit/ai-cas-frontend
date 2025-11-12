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
import CustomPagination from './CustomPagination';
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

interface Exam {
  id: string;
  title: string;
  description: string;
  category: ExamCategory;
  difficulty: ExamDifficulty;
  numberOfQuestions: number;
  durationMinutes: number;
}

const MOCK_EXAMS: Exam[] = [
  {
    id: '1',
    title: 'Algebra Basics',
    description:
      'Test your fundamental knowledge of algebraic concepts, including variables, equations, and functions.',
    category: 'Mathematics',
    difficulty: 'Beginner',
    numberOfQuestions: 20,
    durationMinutes: 45,
  },
  {
    id: '2',
    title: 'World War II History',
    description:
      'A comprehensive review of the major events, figures, and battles of World War II.',
    category: 'History',
    difficulty: 'Intermediate',
    numberOfQuestions: 50,
    durationMinutes: 60,
  },
  {
    id: '3',
    title: 'Introduction to Physics',
    description:
      'Covering core concepts such as motion, force, energy, and thermodynamics.',
    category: 'Science',
    difficulty: 'Beginner',
    numberOfQuestions: 30,
    durationMinutes: 60,
  },
  {
    id: '4',
    title: 'Shakespearean Literature',
    description: 'Analyze themes, characters, and language in Shakespeare’s most famous plays.',
    category: 'Literature',
    difficulty: 'Advanced',
    numberOfQuestions: 40,
    durationMinutes: 90,
  },
  {
    id: '5',
    title: 'Python Programming Fundamentals',
    description:
      'Assess your understanding of Python syntax, data structures, and control flow.',
    category: 'Programming',
    difficulty: 'Beginner',
    numberOfQuestions: 25,
    durationMinutes: 60,
  },
  {
    id: '6',
    title: 'Calculus I',
    description:
      'Test your knowledge of limits, derivatives, and basic integration.',
    category: 'Mathematics',
    difficulty: 'Intermediate',
    numberOfQuestions: 30,
    durationMinutes: 75,
  },
  {
    id: '7',
    title: 'The American Revolution',
    description:
      'Explore the key causes, major conflicts, and significant outcomes of the American Revolution.',
    category: 'History',
    difficulty: 'Intermediate',
    numberOfQuestions: 40,
    durationMinutes: 60,
  },
  {
    id: '8',
    title: 'Chemistry Essentials',
    description:
      'Questions on atomic structure, chemical bonding, and the periodic table.',
    category: 'Science',
    difficulty: 'Beginner',
    numberOfQuestions: 35,
    durationMinutes: 45,
  },
  {
    id: '9',
    title: 'Modern American Novels',
    description:
      'A deep dive into prominent American literary works from the 20th century.',
    category: 'Literature',
    difficulty: 'Intermediate',
    numberOfQuestions: 25,
    durationMinutes: 60,
  },
  {
    id: '10',
    title: 'JavaScript Algorithms',
    description:
      'Solve common algorithm challenges using JavaScript. Focus on efficiency and logic.',
    category: 'Programming',
    difficulty: 'Advanced',
    numberOfQuestions: 15,
    durationMinutes: 120,
  },
  {
    id: '11',
    title: 'Data Structures in C++',
    description:
      'Test your understanding of arrays, linked lists, stacks, queues, and trees.',
    category: 'Programming',
    difficulty: 'Intermediate',
    numberOfQuestions: 30,
    durationMinutes: 90,
  },
  {
    id: '12',
    title: 'Biology: Cell Structure',
    description:
      'An examination of organelles, cell membranes, and the differences between prokaryotic and eukaryotic cells.',
    category: 'Science',
    difficulty: 'Intermediate',
    numberOfQuestions: 40,
    durationMinutes: 60,
  },
];

const EXAM_CATEGORIES: ExamCategory[] = [
  'Mathematics',
  'History',
  'Science',
  'Literature',
  'Programming',
];

const fetchExams = (
  page: number,
  limit: number,
  query: string,
  category: string,
): Promise<{ data: Exam[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. Filter by category
      let filteredExams = MOCK_EXAMS;
      if (category !== 'all') {
        filteredExams = MOCK_EXAMS.filter(
          (exam) => exam.category === category,
        );
      }

      // 2. Filter by search query
      if (query) {
        const lowerCaseQuery = query.toLowerCase();
        filteredExams = filteredExams.filter(
          (exam) =>
            exam.title.toLowerCase().includes(lowerCaseQuery) ||
            exam.description.toLowerCase().includes(lowerCaseQuery),
        );
      }

      // 3. Get total count
      const total = filteredExams.length;

      // 4. Apply pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = filteredExams.slice(start, end);

      resolve({ data: paginatedData, total });
    }, 800); // Simulate network delay
  });
};

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
    const loadExams = async () => {
      setIsLoading(true);
      const res = await testService.getAllTests(currentPage, 10, searchQuery, selectedCategory);
      console.log(res.pagination.totalItems);
      setExams(res.data);
      setTotalExams(res.pagination.totalItems);
      setExamPerPage(res.pagination.pageSize);

      setIsLoading(false);
    };
    loadExams();
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
      <div className="h-full flex flex-col mx-auto p-4 py-8 md:p-8">
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