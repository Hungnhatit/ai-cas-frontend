import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Send, User } from "lucide-react";
import { testService } from "@/services/test/testService";
import { useAuth } from "@/providers/auth-provider";

// 1. Define the structure of a single comment
interface Comment {
  id: string;
  user: {
    name: string;
    avatarUrl: string | null;
  };
  timestamp: string;
  text: string;
  replies?: Comment[]; // Added to support nested replies in the future
}

// 2. Create mock data (replace with your data fetching)
const mockComments: Comment[] = [
  {
    id: "c1",
    user: {
      name: "Trang Nguyen",
      avatarUrl: "https://placehold.co/40x40/E2E8F0/4A5568?text=TN",
    },
    timestamp: "2 hours ago",
    text: "Bài giảng này rất chi tiết và hữu ích. Cảm ơn thầy!",
  },
  {
    id: "c2",
    user: {
      name: "Minh Le",
      avatarUrl: "https://placehold.co/40x40/CBD5E0/4A5568?text=ML",
    },
    timestamp: "1 day ago",
    text: "Phần 2 giải thích về prompt khá rõ ràng, nhưng em vẫn còn thắc mắc về cách áp dụng vào các mô hình ngôn ngữ lớn khác nhau.",
  },
];

interface CommentSectionProps {
  test_id: number,
  user_id: number
}

// 3. Create the main Comment Section component
export default function CommentSection({ test_id, user_id }: CommentSectionProps) {
  // State for the list of comments
  const [comments, setComments] = React.useState<Comment[]>(mockComments);
  // State for the new comment input
  const [newComment, setNewComment] = React.useState("");

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    // Simulate adding a new comment
    // In a real app, you would send this to your backend
    const newCommentData = {
      // ma_kiem_tra, ma_nguoi_dung, noi_dung, ma_binh_luan_goc
      ma_kiem_tra: test_id,
      ma_nguoi_dung: user_id,      
      noi_dung: newComment,
      // user: {
      //   name: "Current User",
      //   avatarUrl: null, // Use fallback
      // },
      // timestamp: "Just now",
    };

    const res = await testService.createComment(newCommentData);

    // Add new comment to the top of the list
    setComments([newCommentData, ...comments]);
    setNewComment(""); // Clear the textarea
  };

  return (
    <Card className="mt-8 rounded-lg border shadow-sm">
      <CardHeader>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Bình luận ({comments.length})
        </h2>
      </CardHeader>
      <CardContent>
        {/* New Comment Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src="https://placehold.co/40x40/94A3B8/FFFFFF?text=ME" />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              className="flex-1 rounded-[3px] shadow-none border-gray-300"
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={newComment.trim() === ""} className="rounded-[3px] cursor-pointer">
              <Send className="h-4 w-4 mr-2" />
              Gửi
            </Button>
          </div>
        </form>

        <Separator className="my-6" />

        {/* Existing Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 4. Create a sub-component for displaying a single comment
interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  // State to manage reply box visibility and content for each comment
  const [isReplying, setIsReplying] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim() === "") return;

    // In a real app, you would call a function (passed via props)
    // to add this reply to the parent comment in your main state/backend.
    console.log(`Replying to comment ${comment.id} with:`, replyText);

    // Reset and close the reply box
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <div className="flex gap-4">
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={comment.user.avatarUrl || undefined} />
        <AvatarFallback>
          {comment.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{comment.user.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {comment.timestamp}
          </span>
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
          {comment.text}
        </p>
        {/* Updated Reply button to toggle state */}
        <Button
          variant="ghost"
          size="sm"
          className="mt-1"
          onClick={() => setIsReplying(!isReplying)}
        >
          Reply
        </Button>

        {/* Conditional Reply Form */}
        {isReplying && (
          <form
            onSubmit={handleReplySubmit}
            className="mt-4 flex flex-col gap-4"
          >
            <div className="flex gap-3">
              <Avatar className="h-9 w-9 border">
                {/* Placeholder for current user's avatar */}
                <AvatarImage src="https://placehold.co/40x40/94A3B8/FFFFFF?text=ME" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Replying to ${comment.user.name}...`}
                className="flex-1 rounded-md"
                rows={2}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                type="button" // Important: set type to button to prevent form submit
                onClick={() => setIsReplying(false)} // Cancel
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={replyText.trim() === ""}
              >
                <Send className="h-3 w-3 mr-2" />
                Phản hồi
              </Button>
            </div>
          </form>
        )}

        {/* TODO: Render nested replies here if they exist */}
        <div className="pl-8 mt-4 space-y-4">
          {comment.replies?.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      </div>
    </div>
  );
}