'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Clock, BookOpen, Award, TrendingUp, Calendar, User, ChevronDown, Grid3x3, List } from 'lucide-react';
import { Header } from '../layout/header';
import { testService } from '@/services/test/testService';
import { Test } from '@/types/interfaces/test';
import toast from 'react-hot-toast';

// Mock data based on the Test interface
const tests = [
  {
    ma_kiem_tra: 1,
    ma_giang_vien: 101,
    giang_vien: "Dr. Sarah Chen",
    anh_giang_vien: "SC",
    tieu_de: "Machine Learning Fundamentals",
    mo_ta: "Comprehensive assessment covering supervised and unsupervised learning, neural networks, and model evaluation techniques.",
    ten_bai_kiem_tra: "ML Basics Assessment",
    thoi_luong: 60,
    tong_diem: 100,
    so_lan_lam_toi_da: 3,
    do_kho: "trung_binh" as const,
    trang_thai: "hoat_dong" as const,
    danh_muc: "Machine Learning",
    so_cau_hoi: 25,
    luot_tham_gia: 1247,
    ngay_tao: "2024-09-15",
    ngay_cap_nhat: "2025-01-10"
  },
  {
    ma_kiem_tra: 2,
    ma_giang_vien: 102,
    giang_vien: "Prof. Michael Wong",
    anh_giang_vien: "MW",
    tieu_de: "Deep Learning Architectures",
    mo_ta: "Advanced test on CNNs, RNNs, Transformers, and modern deep learning architectures with practical applications.",
    ten_bai_kiem_tra: "Deep Learning Expert",
    thoi_luong: 90,
    tong_diem: 150,
    so_lan_lam_toi_da: 2,
    do_kho: "kho" as const,
    trang_thai: "hoat_dong" as const,
    danh_muc: "Deep Learning",
    so_cau_hoi: 35,
    luot_tham_gia: 892,
    ngay_tao: "2024-10-20",
    ngay_cap_nhat: "2025-01-12"
  },
  {
    ma_kiem_tra: 3,
    ma_giang_vien: 103,
    giang_vien: "Dr. Emily Rodriguez",
    anh_giang_vien: "ER",
    tieu_de: "Natural Language Processing Basics",
    mo_ta: "Introduction to NLP techniques including tokenization, word embeddings, sentiment analysis, and text classification.",
    ten_bai_kiem_tra: "NLP Fundamentals",
    thoi_luong: 45,
    tong_diem: 80,
    so_lan_lam_toi_da: 5,
    do_kho: "de" as const,
    trang_thai: "hoat_dong" as const,
    danh_muc: "Natural Language Processing",
    so_cau_hoi: 20,
    luot_tham_gia: 2103,
    ngay_tao: "2024-11-05",
    ngay_cap_nhat: "2025-01-08"
  },
  {
    ma_kiem_tra: 4,
    ma_giang_vien: 101,
    giang_vien: "Dr. Sarah Chen",
    anh_giang_vien: "SC",
    tieu_de: "Computer Vision Applications",
    mo_ta: "Practical assessment on image processing, object detection, image segmentation, and computer vision algorithms.",
    ten_bai_kiem_tra: "Computer Vision Pro",
    thoi_luong: 75,
    tong_diem: 120,
    so_lan_lam_toi_da: 2,
    do_kho: "kho" as const,
    trang_thai: "hoat_dong" as const,
    danh_muc: "Computer Vision",
    so_cau_hoi: 30,
    luot_tham_gia: 756,
    ngay_tao: "2024-08-30",
    ngay_cap_nhat: "2025-01-05"
  },
  {
    ma_kiem_tra: 5,
    ma_giang_vien: 104,
    giang_vien: "Prof. David Kim",
    anh_giang_vien: "DK",
    tieu_de: "AI Ethics and Responsible AI",
    mo_ta: "Understanding ethical considerations, bias in AI, fairness, transparency, and responsible AI development practices.",
    ten_bai_kiem_tra: "AI Ethics Assessment",
    thoi_luong: 40,
    tong_diem: 70,
    so_lan_lam_toi_da: 3,
    do_kho: "trung_binh" as const,
    trang_thai: "hoat_dong" as const,
    danh_muc: "AI Ethics",
    so_cau_hoi: 18,
    luot_tham_gia: 1589,
    ngay_tao: "2024-12-01",
    ngay_cap_nhat: "2025-01-14"
  },
  {
    ma_kiem_tra: 6,
    ma_giang_vien: 105,
    giang_vien: "Dr. Lisa Anderson",
    anh_giang_vien: "LA",
    tieu_de: "Reinforcement Learning Principles",
    mo_ta: "Core concepts of RL including Q-learning, policy gradients, actor-critic methods, and practical applications.",
    ten_bai_kiem_tra: "RL Mastery Test",
    thoi_luong: 80,
    tong_diem: 140,
    so_lan_lam_toi_da: 2,
    do_kho: "kho" as const,
    trang_thai: "hoat_dong" as const,
    danh_muc: "Reinforcement Learning",
    so_cau_hoi: 32,
    luot_tham_gia: 634,
    ngay_tao: "2024-09-25",
    ngay_cap_nhat: "2025-01-11"
  },
  {
    ma_kiem_tra: 7,
    ma_giang_vien: 102,
    giang_vien: "Prof. Michael Wong",
    anh_giang_vien: "MW",
    tieu_de: "Introduction to AI",
    mo_ta: "Beginner-friendly introduction to artificial intelligence concepts, history, and basic algorithms.",
    ten_bai_kiem_tra: "AI 101",
    thoi_luong: 30,
    tong_diem: 60,
    so_lan_lam_toi_da: 5,
    do_kho: "de" as const,
    trang_thai: "hoat_dong" as const,
    danh_muc: "AI Fundamentals",
    so_cau_hoi: 15,
    luot_tham_gia: 3421,
    ngay_tao: "2024-07-15",
    ngay_cap_nhat: "2025-01-03"
  },
  {
    ma_kiem_tra: 8,
    ma_giang_vien: 103,
    giang_vien: "Dr. Emily Rodriguez",
    anh_giang_vien: "ER",
    tieu_de: "Data Science for AI",
    mo_ta: "Essential data science skills for AI practitioners including statistics, data preprocessing, and feature engineering.",
    ten_bai_kiem_tra: "Data Science Essentials",
    thoi_luong: 55,
    tong_diem: 90,
    so_lan_lam_toi_da: 3,
    do_kho: "trung_binh" as const,
    trang_thai: "hoat_dong" as const,
    danh_muc: "Data Science",
    so_cau_hoi: 22,
    luot_tham_gia: 1876,
    ngay_tao: "2024-10-10",
    ngay_cap_nhat: "2025-01-09"
  }
];

const categories = ["All", "Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision", "AI Ethics", "Reinforcement Learning", "AI Fundamentals", "Data Science"];

const TestLibrary = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await testService.getAllTests();
        if (res.success) {
          setTests(res.data);
        }
      } catch (error) {
        toast.error(`Failed when fetching tests: ${error}`);
        console.error('Failed to fetch data: ', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  console.log(tests);

  const filteredAndSortedTests = useMemo(() => {
    let filtered = tests.filter(test => {
      const matchesSearch = test.tieu_de.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.mo_ta.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.giang_vien?.ten.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || test.danh_muc === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || test.do_kho === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.ngay_cap_nhat).getTime() - new Date(a.ngay_cap_nhat).getTime();
        case 'oldest':
          return new Date(a.ngay_cap_nhat).getTime() - new Date(b.ngay_cap_nhat).getTime();
        case 'difficulty-asc':
          const difficultyOrder = { 'de': 1, 'trung_binh': 2, 'kho': 3 };
          return difficultyOrder[a.do_kho] - difficultyOrder[b.do_kho];
        case 'difficulty-desc':
          const difficultyOrderDesc = { 'de': 1, 'trung_binh': 2, 'kho': 3 };
          return difficultyOrderDesc[b.do_kho] - difficultyOrderDesc[a.do_kho];
        case 'popular':
          return b.luot_tham_gia - a.luot_tham_gia;
        default:
          return 0;
      }
    });

    return filtered;
  }, [tests, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'de': return 'bg-green-100 text-green-700 border-green-200';
      case 'trung_binh': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'kho': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'de': return 'Easy';
      case 'trung_binh': return 'Medium';
      case 'kho': return 'Hard';
      default: return difficulty;
    }
  };

  console.log(filteredAndSortedTests);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <Header />
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                Test Library
              </h1>
              <p className="text-slate-600 mt-1">Explore AI competency assessments</p>
            </div>
            {/* <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div> */}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tests, instructors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="de">Easy</option>
                <option value="trung_binh">Medium</option>
                <option value="kho">Hard</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="difficulty-asc">Easy to Hard</option>
                <option value="difficulty-desc">Hard to Easy</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl flex items-center justify-between mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-slate-600">
          Showing <span className="font-semibold text-slate-900">{filteredAndSortedTests.length}</span> test{filteredAndSortedTests.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 cursor-pointer rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 cursor-pointer rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Test Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredAndSortedTests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No tests found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
            {filteredAndSortedTests.map((test) => (
              <div
                key={test.ma_kiem_tra}
                className={`bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 cursor-pointer group overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}
                onClick={() => alert(`Navigate to test ${test.ma_kiem_tra}`)}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="p-6">
                      {/* Category Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                          {test.danh_muc}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(test.do_kho)}`}>
                          {getDifficultyLabel(test.do_kho)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {test.tieu_de}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {test.mo_ta}
                      </p>

                      {/* Instructor */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {test.anh_giang_vien}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{test.giang_vien?.ten}</p>
                          <p className="text-xs text-slate-500">Instructor</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{test.thoi_luong} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Award className="w-4 h-4" />
                          <span className="text-sm">{test.tong_diem} pts</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm">{test?.cau_hoi?.length} questions</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">{test?.luot_tham_gia?.toLocaleString()} taken</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Updated {new Date(test.ngay_cap_nhat).toLocaleDateString()}</span>
                        </div>
                        <div className="text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                          Start Test →
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <div className="flex-1 p-6 flex items-center gap-6">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {test.anh_giang_vien}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {test.tieu_de}
                            </h3>
                            <p className="text-sm text-slate-600 truncate">{test.mo_ta}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${getDifficultyColor(test.do_kho)}`}>
                            {getDifficultyLabel(test.do_kho)}
                          </span>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-600 flex-wrap">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{test.giang_vien?.ten}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{test.thoi_luong} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            <span>{test.tong_diem} pts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{test?.cau_hoi?.length} questions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>{test?.luot_tham_gia?.toLocaleString()} taken</span>
                          </div>
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                            {test.danh_muc}
                          </span>
                        </div>
                      </div>

                      <div className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform flex-shrink-0">
                        Start Test →
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestLibrary;