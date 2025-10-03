'use client';

import { useState } from 'react';
import Header from './header';
import Sidebar from './sidebar';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: 'tests' | 'test' | 'results';
  title?: string;
  showTimer?: boolean;
  timeRemaining?: number;
  questionNavigation?: {
    totalQuestions: number;
    currentQuestion: number;
    answeredQuestions: number[];
    onQuestionSelect: (index: number) => void;
  };
}

export default function Layout({
  children,
  currentPage,
  title,
  showTimer,
  timeRemaining,
  questionNavigation
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=''>
        {/* <Sidebar
          currentPage={currentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          questionNavigation={questionNavigation}
        /> */}

        <main className="">
          {children}
        </main>
      </div>
    </div>
  );
}