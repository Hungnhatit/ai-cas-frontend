'use client'

import { useState } from "react";
import useAlert from "./UserAlert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertOctagon, BookMarked, Download, Edit, Loader2, NotebookTabs, Printer, Settings, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { testAttemptService } from "@/services/test/testAttemptService";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export type UserRole = "student" | "instructor" | "admin" | undefined;

interface ActionToolbarProps {
  documentId: string | undefined;
  initialBookmarkStatus: boolean;
  role: UserRole;
  test_id?: number
}

const ActionToolbar = ({ documentId, initialBookmarkStatus, role, test_id }: ActionToolbarProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarkStatus);
  const [isPending, setIsPending] = useState(false);

  // dialog
  const [open, setOpen] = useState(false);

  const { alert } = useAlert();
  const { user } = useAuth();
  const router = useRouter();

  const handleBookmark = async () => {
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newStatus = !isBookmarked;
    setIsBookmarked(newStatus);
    setIsPending(false);
    alert(newStatus ? 'bookmarked' : "Bookmark removed");
  };

  const handlePrint = () => window.print();

  const isInstructor = role === "instructor" || role === "admin";

  const handleStartTest = async () => {
    if (!user) {
      setOpen(true); // mở dialog
      return;
    }

    try {
      const res = await testAttemptService.startTestAttempt(test_id, user.ma_nguoi_dung);
      if (res.success) {
        const attempt_id = res.data.ma_lan_lam;
        router.push(`/tests/${test_id}/take?attempt=${attempt_id}`);
      }
    } catch (error) {
      console.error("Failed to start test:", error);
    }
  };

  const handleLoginRedirect = () => {
    router.push(`/auth/login?redirect=/tests/${test_id}`);
  };

  return (
    <>
      {/* MAIN TOOLBAR */}
      <nav className="flex flex-wrap items-center gap-6 mb-6">
        {/* Bookmark */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                onClickCapture={handleBookmark}
                aria-pressed={isBookmarked}
                className={`
                  inline-flex h-9 w-9 items-center justify-center rounded-md border 
                  transition-colors duration-200
                  ${isBookmarked
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border-input bg-background hover:bg-accent hover:text-accent-foreground"}
                  ${isPending ? "pointer-events-none opacity-50" : ""}
                `}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BookMarked className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>{isBookmarked ? 'bookmarked' : 'bookmark'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Download */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div>
                <Download className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>download</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Share */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div>
                <Share2 className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>share</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Print */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div onClick={handlePrint}>
                <Printer className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>print</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Report */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="text-red-600">
                <AlertOctagon className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>report</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-8 w-[1px] mx-2 hidden sm:block" />

        <div className="ml-auto"><ThemeToggle /></div>

        {/* START TEST BUTTON */}
        <Button className="rounded-[3px] cursor-pointer" onClick={handleStartTest}>
          <NotebookTabs />
          Vào thi
        </Button>
      </nav>

      {/* LOGIN REQUIRED ALERT DIALOG */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="rounded-[3px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chưa đăng nhập</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn cần đăng nhập để tiếp tục làm bài thi
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer rounded-[3px]">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleLoginRedirect} className="cursor-pointer rounded-[3px]">
              Đăng nhập
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActionToolbar;
