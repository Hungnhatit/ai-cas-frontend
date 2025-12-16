'use client'
import React, {
  useState, useEffect, useRef, createContext, useContext, HTMLAttributes,
} from "react";
import {
  BookMarked, Download, Share2, AlertOctagon, Edit, Settings, History, CheckCircle, XCircle, ChevronDown, ChevronRight, FileText, MessageCircle, StickyNote, User, Star, Clock, BarChart3, BookOpen, Rss, Sun, Moon, Loader2, Paperclip, Printer,
  MoveLeft,
  Tag,
} from "lucide-react"; // Using lucide-react for icons
import { Button } from "../ui/button";
import { Tooltip } from "@radix-ui/react-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { useSearchParams } from "next/navigation";
import { testService } from "@/services/test/testService";
import { Test, TestComment } from "@/types/interfaces/model";
import MetadataSidebar from "./test-detail/MetadataSidebar";
import { useAuth } from "@/providers/auth-provider";
import { CommentSection } from "./test-detail/CommentSection";
import ActionToolbar from "./test-detail/ActionToolBar";
import toast from "react-hot-toast";

export type UserRole = "student" | "instructor" | "admin";
export type DocumentType = "reading" | "rubric" | "guide" | "assessment";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
}

export interface Attachment {
  id: string;
  title: string;
  fileType: "pdf" | "docx" | "zip" | "link";
  url: string;
  sizeMb: number;
}

export interface Version {
  id: string;
  versionNumber: number;
  date: string; // ISO 8601 string
  authorName: string;
  summary: string;
}

export interface RelatedResource {
  id: string;
  title: string;
  type: DocumentType;
  slug: string;
}

export interface UserNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

export interface DocumentData {
  id: string;
  title: string;
  slug: string;
  authors: Author[];
  summary: string;
  contentHtml: string;
  metadata: {
    type: DocumentType;
    category: string;
    difficulty: Difficulty;
    readTimeMinutes: number;
    learningOutcomes: string[];
  };
  attachments: Attachment[];
  versions: Version[];
  relatedResources: RelatedResource[];
  // User-specific data
  userInteractions: {
    isBookmarked: boolean;
    userNotes: UserNote[];
  };
  // Optional module
  quiz?: QuizQuestion[];
}

// API Response Wrapper
export type APIResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// --- 2. MOCK DATA & API STUB ---
const MOCK_AUTHORS: Author[] = [
  {
    id: "author-1",
    name: "Dr. Evelyn Reed",
    avatarUrl: "https://placehold.co/40x40/E2E8F0/4A5568?text=ER",
    profileUrl: "/authors/evelyn-reed",
  },
];

const MOCK_DOCUMENT_DATA: DocumentData = {
  id: "doc-ai-ethics-101",
  title: "Introduction to AI Ethics and Competency",
  slug: "ai-ethics-101",
  authors: MOCK_AUTHORS,
  summary:
    "This foundational document outlines the core principles of ethical AI development and a rubric for assessing competency in deploying responsible AI systems.",
  contentHtml: `
    <h2>1. The Core Principles of Responsible AI</h2>
    <p>Responsible AI is built on several key pillars: fairness, transparency, accountability, privacy, and security. This section explores each concept in detail.</p>
    <p><strong>Fairness:</strong> Ensuring that AI systems do not perpetuate or amplify existing biases. This involves rigorous testing against diverse datasets.</p>
    <img src="https://placehold.co/600x300/F0F9FF/0284C7?text=Chart:AI+Fairness+Metrics" alt="Placeholder chart for AI fairness metrics" class="rounded-lg my-4" />
    <h2>2. Assessing Competency: The Rubric</h2>
    <p>The following rubric is used to assess student understanding and application of these principles in their projects.</p>
    <h3>Level 1: Novice</h3>
    <p>Student can identify basic ethical risks but struggles to apply mitigation strategies.</p>
    <h3>Level 2: Competent</h3>
    <p>Student can identify and apply standard mitigation strategies for common ethical risks.</p>
    <h3>Level 3: Proficient</h3>
    <p>Student can proactively design systems that embed fairness and transparency from the start, handling nuanced ethical dilemmas.</p>
  `,
  metadata: {
    type: "rubric",
    category: "Core Concept",
    difficulty: "intermediate",
    readTimeMinutes: 25,
    learningOutcomes: [
      "Define the five pillars of responsible AI.",
      "Apply the competency rubric to a sample AI project.",
      "Identify potential biases in a given dataset.",
    ],
  },
  attachments: [
    {
      id: "attach-1",
      title: "Full AI Ethics Rubric (Official).pdf",
      fileType: "pdf",
      url: "/api/download/attach-1",
      sizeMb: 2.5,
    },
    {
      id: "attach-2",
      title: "Case Study: Bias in Lending.docx",
      fileType: "docx",
      url: "/api/download/attach-2",
      sizeMb: 0.8,
    },
  ],
  versions: [
    {
      id: "v-2",
      versionNumber: 2,
      date: "2025-10-01T10:00:00Z",
      authorName: "Dr. Evelyn Reed",
      summary: "Added Level 3 rubric details and new case study.",
    },
    {
      id: "v-1",
      versionNumber: 1,
      date: "2025-09-15T09:00:00Z",
      authorName: "Dr. Evelyn Reed",
      summary: "Initial publication.",
    },
  ],
  relatedResources: [
    {
      id: "doc-data-privacy-201",
      title: "Advanced Data Privacy Techniques",
      type: "guide",
      slug: "data-privacy-201",
    },
    {
      id: "doc-model-explainability-301",
      title: "Model Explainability (XAI)",
      type: "reading",
      slug: "model-explainability-301",
    },
  ],
  userInteractions: {
    isBookmarked: false,
    userNotes: [
      {
        id: "note-1",
        text: "This is a key concept for the midterm project.",
        createdAt: "2025-10-26T14:30:00Z",
      },
    ],
  },
  quiz: [
    {
      id: "q-1",
      question: "Which of these is NOT a pillar of responsible AI?",
      options: [
        { id: "q1-o1", text: "Fairness" },
        { id: "q1-o2", text: "Performance" },
        { id: "q1-o3", text: "Transparency" },
        { id: "q1-o4", text: "Accountability" },
      ],
      correctOptionId: "q1-o2",
    },
  ],
};

const MOCK_COMMENTS: Comment[] = [
  {
    id: "comment-1",
    author: {
      id: "user-student-1",
      name: "Alex Johnson",
      avatarUrl: "https://placehold.co/32x32/E0E7FF/4338CA?text=AJ",
    },
    text: "Is the Level 3 proficiency expected for the final project, or is Level 2 sufficient?",
    createdAt: "2025-10-27T10:00:00Z",
    replies: [
      {
        id: "comment-2",
        author: {
          id: "author-1",
          name: "Dr. Evelyn Reed",
          avatarUrl: "https://placehold.co/32x32/E2E8F0/4A5568?text=ER",
        },
        text: "Great question, Alex. We are looking for a solid Level 2 application, with an attempt at Level 3 concepts for full marks.",
        createdAt: "2025-10-27T11:30:00Z",
        replies: [],
      },
    ],
  },
];

async function fetchDocumentData(
  slug: string,
  role: UserRole
): Promise<APIResponse<DocumentData>> {
  console.log(`Fetching data for slug: ${slug} with role: ${role}`);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate not found
  if (slug === "not-found") {
    return { success: false, error: "Document not found." };
  }

  // Return mock data
  return { success: true, data: MOCK_DOCUMENT_DATA };
}

async function fetchComments(
  documentId: string
): Promise<APIResponse<Comment[]>> {
  console.log(`Fetching comments for doc: ${documentId}`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { success: true, data: MOCK_COMMENTS };
}

// --- 3. i18n & THEMING (STUBS) ---

const i18nKeys = {
  en: {
    // Actions
    bookmark: "Bookmark",
    bookmarked: "Bookmarked",
    download: "Download",
    share: "Share",
    report: "Report",
    edit: "Edit",
    manageVersions: "Manage Versions",
    print: "Print",
    // Metadata
    metadata: "Metadata",
    type: "Type",
    category: "Category",
    difficulty: "Difficulty",
    readTime: "Est. Read Time",
    learningOutcomes: "Learning Outcomes",
    // Sections
    summary: "Summary",
    attachments: "Attachments",
    quickCheck: "Quick Check",
    relatedResources: "Related Resources",
    versionHistory: "Version History",
    myNotes: "My Notes",
    comments: "Comments",
    // ...etc
  },
  vi: {
    // Actions
    bookmark: "Đánh dấu",
    bookmarked: "Đã đánh dấu",
    download: "Tải xuống",
    share: "Chia sẻ",
    report: "Báo cáo",
    edit: "Chỉnh sửa",
    manageVersions: "Quản lý phiên bản",
    print: "In",
    // Metadata
    metadata: "Siêu dữ liệu",
    type: "Loại",
    category: "Danh mục",
    difficulty: "Độ khó",
    readTime: "Thời gian đọc ước tính",
    learningOutcomes: "Kết quả học tập",
    // Sections
    summary: "Tóm tắt",
    attachments: "Tài liệu đính kèm",
    quickCheck: "Kiểm tra nhanh",
    relatedResources: "Tài nguyên liên quan",
    versionHistory: "Lịch sử phiên bản",
    myNotes: "Ghi chú của tôi",
    comments: "Bình luận",
    // ...etc
  },
};

type TranslationKeys = typeof i18nKeys.en;
type Locale = "en" | "vi";

// Mock translation hook
const useTranslation = (
  locale: Locale = "en"
): { t: TranslationKeys; setLocale: (locale: Locale) => void } => {
  const [currentLocale, setLocale] = useState<Locale>(locale);
  const t = i18nKeys[currentLocale];
  return { t, setLocale };
};

// Mock Theme context
type Theme = "light" | "dark";
const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "light",
  setTheme: () => { },
});

// Mock useTheme hook
const useTheme = () => useContext(ThemeContext);

const useAlert = () => {
  const [alertMessage, setAlertMessage] = useState("");

  const alert = (message: string) => {
    setAlertMessage(message);
    // In a real app, you'd update the live region's textContent
    console.log(`[SR Announcement]: ${message}`);
    // Clear message after a bit so it can be re-announced
    setTimeout(() => setAlertMessage(""), 1000);
  };

  // The component would render:
  // <div className="sr-only" aria-live="polite" role="status">{alertMessage}</div>
  // For this demo, we just return the function.
  return { alert };
};

const ThemeToggle = () => {
  // "use client" - This component would be a client component
  const { theme, setTheme } = useTheme(); // Mock hook
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <TooltipProvider>
      <Tooltip content={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={
            theme === "light"
              ? "Switch to dark mode"
              : "Switch to light mode"
          }
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </Tooltip>
    </TooltipProvider>

  );
};

interface DocumentBodyProps {
  contentHtml: string;
}
const DocumentBody: React.FC<DocumentBodyProps> = ({ contentHtml }) => {
  // "use client"
  /**
   * INTERACTION PLAN for Inline Highlighting (Not fully implemented here):
   * 1. Add `onMouseUp` event to the `prose` container.
   * 2. On mouse up, check `window.getSelection()`.
   * 3. If selection is not collapsed and is within this component:
   * a. Get the `Range` object.
   * b. Store the selection range.
   * c. Show a small popover/tooltip near the selection with "Add Note".
   * 4. On "Add Note" click:
   * a. Open a small textarea.
   * b. On save, serialize the `Range` (e.g., using start/end containers and offsets)
   * and send to API with the note text.
   * 5. On load, fetch notes and *re-create* highlights by
   * de-serializing ranges and wrapping them in <mark> tags.
   * This is complex and requires a robust serialization library.
   *
   * For this demo, we just render the HTML.
   */

  return (
    <article
      // The `prose` classes from @tailwindcss/typography provide
      // excellent default styling for rich text content.
      className="prose prose-gray dark:prose-invert max-w-none
                 prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4
                 prose-p:leading-relaxed
                 prose-img:rounded-lg prose-img:shadow-md"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
};

// ---
// --- Server Component: AttachmentsSection ---
// ---
interface AttachmentsSectionProps {
  attachments: Attachment[];
  t: TranslationKeys;
}
const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  attachments,
  t,
}) => {
  // This is a Server Component.
  if (attachments.length === 0) return null;

  const getIcon = (fileType: Attachment["fileType"]) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <Paperclip className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <section aria-labelledby="attachments-title" className="mt-12">
      <h2
        id="attachments-title"
        className="text-2xl font-semibold mb-4 flex items-center"
      >
        <Paperclip className="h-6 w-6 mr-2 text-gray-600 dark:text-gray-400" />
        {t.attachments}
      </h2>
      <div className="space-y-3">
        {attachments.map((file) => (
          <Link
            key={file.id}
            href={file.url}
            download
            className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {getIcon(file.fileType)}
            <span className="ml-3 font-medium text-sm text-gray-800 dark:text-gray-200">
              {file.title}
            </span>
            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
              {file.sizeMb} MB
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

// ---
// --- Client Component: QuizWidget ---
// ---
interface QuizWidgetProps {
  quiz: QuizQuestion[];
  t: TranslationKeys;
}
const QuizWidget: React.FC<QuizWidgetProps> = ({ quiz, t }) => {
  // "use client"
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (!quiz || quiz.length === 0) return null;

  return (
    <section aria-labelledby="quiz-title" className="mt-12">
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle
            id="quiz-title"
            className="text-xl flex items-center text-blue-800 dark:text-blue-200"
          >
            <CheckCircle className="h-6 w-6 mr-2" />
            {t.quickCheck}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {quiz.map((q) => {
            const selectedOption = selectedAnswers[q.id];
            const isCorrect = selectedOption === q.correctOptionId;

            return (
              <div key={q.id}>
                <h4 className="font-medium mb-3">{q.question}</h4>
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    let stateClasses =
                      "border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400";
                    if (isSubmitted) {
                      if (opt.id === q.correctOptionId) {
                        stateClasses =
                          "border-green-500 bg-green-50 dark:bg-green-900";
                      } else if (isSelected && !isCorrect) {
                        stateClasses = "border-red-500 bg-red-50 dark:bg-red-900";
                      }
                    } else if (isSelected) {
                      stateClasses =
                        "border-blue-500 ring-2 ring-blue-500";
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(q.id, opt.id)}
                        disabled={isSubmitted}
                        role="radio"
                        aria-checked={isSelected}
                        className={`flex items-center w-full p-3 border rounded-md text-left transition-all ${stateClasses}`}
                      >
                        {isSubmitted &&
                          (opt.id === q.correctOptionId ? (
                            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                          ) : isSelected && !isCorrect ? (
                            <XCircle className="h-5 w-5 mr-2 text-red-600" />
                          ) : (
                            <div className="h-5 w-5 mr-2" />
                          ))}
                        {!isSubmitted && (
                          <div
                            className={`h-4 w-4 mr-3 border rounded-full ${isSelected
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-400"
                              }`}
                          />
                        )}
                        <span className="flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {!isSubmitted && (
            <Button
              onClick={handleSubmit}
              disabled={
                Object.keys(selectedAnswers).length !== quiz.length
              }
            >
              Submit Answers
            </Button>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

// ---
// --- Server Component: RelatedResources ---
// ---
interface RelatedResourcesProps {
  resources: RelatedResource[];
  t: TranslationKeys;
}
const RelatedResources: React.FC<RelatedResourcesProps> = ({
  resources,
  t,
}) => {
  // This is a Server Component.
  if (resources.length === 0) return null;

  const iconMap = {
    reading: <BookOpen className="h-4 w-4" />,
    rubric: <Star className="h-4 w-4" />,
    guide: <BookMarked className="h-4 w-4" />,
    assessment: <BarChart3 className="h-4 w-4" />,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.relatedResources}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {resources.map((res) => (
          <Link
            key={res.id}
            href={`/documents/${res.slug}`}
            className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-gray-500 dark:text-gray-400">
              {iconMap[res.type] || <BookOpen className="h-4 w-4" />}
            </span>
            <span className="ml-3 font-medium text-sm text-gray-800 dark:text-gray-200">
              {res.title}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

interface VersionHistoryProps {
  versions: Version[];
  t: TranslationKeys;
}
const VersionHistory: React.FC<VersionHistoryProps> = ({ versions, t }) => {
  // "use client"
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full justify-start"
      >
        <History className="h-4 w-4 mr-2" />
        {t.versionHistory}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.versionHistory}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            {versions.map((v) => (
              <div
                key={v.id}
                className="p-3 border-b border-gray-200 dark:border-gray-800"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm">
                    Version {v.versionNumber}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(v.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {v.summary}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By {v.authorName}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface CommentSectionProps {
  documentId: string;
  t: TranslationKeys;
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <div className="flex space-x-3">
    <Avatar className="h-8 w-8">
      <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
      <AvatarFallback>
        {comment.author.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="flex items-center space-x-2">
        <span className="font-medium text-sm">{comment.author.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="text-sm mt-1">{comment.text}</p>
      {/* Reply button and replies would go here */}
      {comment.replies.map((reply) => (
        <div key={reply.id} className="mt-4 flex space-x-3 pl-6">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={reply.author.avatarUrl}
              alt={reply.author.name}
            />
            <AvatarFallback>
              {reply.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">
                {reply.author.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(reply.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-sm mt-1">{reply.text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface UserNotesSectionProps {
  initialNotes: UserNote[];
  t: TranslationKeys;
}
const UserNotesSection: React.FC<UserNotesSectionProps> = ({
  initialNotes,
  t,
}) => {
  // "use client"
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim() === "") return;

    const mockNewNote: UserNote = {
      id: `note-${Date.now()}`,
      text: newNote,
      createdAt: new Date().toISOString(),
    };
    setNotes([mockNewNote, ...notes]);
    setNewNote("");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a private note..."
          aria-label="Add a private note"
        />
        <Button type="submit" disabled={newNote.trim() === ""}>
          Save Note
        </Button>
      </form>

      <Separator />

      <div className="space-y-4">
        {notes.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your private notes will appear here.
          </p>
        )}
        {notes.map((note) => (
          <Card key={note.id} className="bg-yellow-50 dark:bg-yellow-950">
            <CardContent className="pt-4">
              <p className="text-sm mb-2">{note.text}</p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(note.createdAt).toLocaleString()}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};


// Page Props
export interface PageProps {
  test_id: number;
}

export default function DocumentDetailPage({ test_id }: PageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTest = async () => {
      setIsLoading(true);
      const res = await testService.getTestById(test_id);
      if (res.success) {
        setTest(res.data);
      } else {
        setTest(null);
        setError(res.error);
      }
      setIsLoading(false)
    }

    fetchTest();
  }, [test_id]);

  if (isLoading) {
    return (
      <main className="flex items-center justify-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-gray-900 dark:text-gray-100" />
      </main>
    );
  }

  const handleDeleteComment = async (comment_id: number) => {
    try {
      const res = await testService.deleteComment(comment_id);
      if (res.success) {
        toast.success('Comment deleted successfully!');
      }

    } catch (error) {
      console.log(error);
      toast.error('Error when deleting comment');
    }
  }


  if (error) {
    return (
      <main className="flex items-center justify-center p-8">
        <div className="text-center">
          <XCircle className="h-12 w-12 mx-auto text-red-500" />
          <h1 className="mt-4 text-2xl font-bold">Document Not Found</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {error || "An unknown error occurred."}
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  console.log('TEST: ', test);

  return (
    <div className="">
      <ActionToolbar
        documentId={test?.ma_kiem_tra.toString()}
        initialBookmarkStatus={false}
        role={user?.vai_tro}
        test_id={test?.ma_kiem_tra}
      />

      {/* --- Main Content (Left Column) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-11 lg:gap-8">
        <div id="main-content" className="lg:col-span-8">
          <div className="min-w-0 bg-white p-6 rounded-[3px] border">
            {/* Author info */}
            <div className="space-y-2 mb-4">
              <div className="text-2xl font-bold">
                {test?.tieu_de}
              </div>
              <div className="flex items-center space-x-3">
                <div>
                  <Avatar>
                    <AvatarImage></AvatarImage>
                    <AvatarFallback>{test?.giang_vien?.ten.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <span>{test?.giang_vien?.ten}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag size={28} className="text-blue-600" />
                <div className="flex flex-wrap gap-2">
                  {test?.danh_muc.map((item, index) => (
                    <span key={index} className="line-clamp-3 px-2 py-[3px] rounded-lg bg-sky-700 text-white text-sm">{item.ten_danh_muc}</span>
                  ))}
                </div>
              </div>
            </div>

            <Card className="shadow-none bg-[#F9FAFB] gap-3">
              <CardHeader>
                <CardTitle>Tổng quan bài thi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="">{test?.mo_ta}</p>
              </CardContent>
            </Card>

            <Separator className="my-8" />

            <div className="space-y-2">
              <div className="text-2xl font-bold">Tổng quan các phần thi</div>
              <div>Số phần thi: {test?.phan_kiem_tra.length} phần | {test?.tong_so_cau_hoi}  câu hỏi</div>
              <div>
                <div>
                  {test?.phan_kiem_tra.map((section, index) => (
                    <div key={index} className="space-y-1 mb-4">
                      <p className=""><span className="font-bold">Phần {index + 1}: </span>{section.ten_phan}</p>
                      <div className="p-3 bg-[#edf0f4] rounded-sm">{section.mo_ta}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* <AttachmentsSection attachments={doc.attachments} t={t} /> */}
          </div>

          <div>
            <CommentSection
              test_id={test?.ma_kiem_tra}
              user_id={user?.ma_nguoi_dung}
            />
          </div>

        </div>

        {/* metadata */}
        <div className="lg:col-span-3 space-y-8 mt-12 lg:mt-0">
          <MetadataSidebar test={test} />

          {/* <RelatedResources resources={doc.relatedResources} t={t} /> */}

          {/* VersionHistory is a client component (uses Dialog) */}
          {/* <VersionHistory versions={doc.versions} t={t} /> */}
        </div>
      </div>
    </div>
  );
}