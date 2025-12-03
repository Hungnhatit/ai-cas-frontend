'use client'
import React, { useEffect, useId, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MailOpen, MessageCircleDashed, MessageSquare, Send, Trash, User } from "lucide-react";
import { testService } from "@/services/test/testService";
import { useAuth } from "@/providers/auth-provider";
import toast from "react-hot-toast";
import { TestComment } from '@/types/interfaces/model';
import { formatDate } from '@/utils/formatDate';
import ConfirmModal from '@/components/modals/confirm-modal';

interface CommentSectionProps {
  test_id: number,
  user_id: number
}

export const CommentSection = ({ test_id, user_id }: CommentSectionProps) => {
  const [comments, setComments] = useState<TestComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [countComment, setCountComment] = useState(0);
  const { user } = useAuth();

  const fetchComments = async () => {
    const res = await testService.getCommentsByTestId(test_id);
    if (res.success) {
      setCountComment(res.total_comments)
      setComments(res.data);
    }
  }
  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    if (!user) {
      toast.error("Bạn cần đăng nhập để bình luận.");
      return;
    }

    const newCommentData = {
      ma_kiem_tra: test_id,
      ma_nguoi_dung: user_id,
      noi_dung: newComment,
    };

    const res = await testService.createComment(newCommentData);
    if (res.success) {
      toast.success('Đã bình luận!');
      const postedComment: TestComment = {
        ...res.data,
        nguoi_dung: {
          ma_nguoi_dung: user.ma_nguoi_dung,
          ten: user.ten,
        }
      };

      setComments([postedComment, ...comments]);
      setNewComment("");
    } else {
      toast.error("Error when posting comment");
    }
  };

  const addReplyToTree = (tree: TestComment[], parentId: number, reply: TestComment): TestComment[] => {
    return tree.map(comment => {
      if (comment.ma_binh_luan === parentId) {
        return {
          ...comment,
          binh_luan_phan_hoi: [reply, ...(comment.binh_luan_phan_hoi || [])]
        };
      }

      if (comment.binh_luan_phan_hoi) {
        return {
          ...comment,
          binh_luan_phan_hoi: addReplyToTree(comment.binh_luan_phan_hoi, parentId, reply)
        };
      }

      return comment;
    });
  };

  const handleDeleteComment = async (comment_id: number) => {
    try {
      const res = await testService.deleteComment(comment_id);
      if (res.success) {
        toast.success('Bình luận đã xoá thành công!');
        fetchComments();
      }
      setComments((prev) => prev.filter((comment) => comment.ma_binh_luan !== comment_id));
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi xoá bình luận');
    }
  }

  return (
    <Card className=" gap-3 mt-8 rounded-[3px] border shadow-none ">
      <CardHeader>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MailOpen className="h-5 w-5" />
          Bình luận ({comments.length})
        </h2>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* New Comment Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <Avatar className="h-10 w-10 border">
              {/* <AvatarImage src="https://placehold.co/40x40/94A3B8/FFFFFF?text=ME" /> */}
              {user
                ? (
                  <AvatarFallback>
                    {user?.ten.charAt(0)}
                  </AvatarFallback>
                )
                : (<AvatarFallback>
                  <User />
                </AvatarFallback>)}

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

        {comments.length == 0 && (
          <div>
            <div className='flex flex-col items-center gap-4'>
              <MessageCircleDashed />
              <p className='text-center text-lg'>Chưa có bình luận nào</p>
            </div>
          </div>
        )}

        {/* Existing Comments List */}
        <div className="space-y-1">
          {comments.map((comment) => (
            <div key={comment.ma_binh_luan}>
              <CommentItem
                key={comment.ma_binh_luan}
                comment={comment}
                user_id={comment.ma_nguoi_dung}
                addReply={(parentId, reply) => {
                  setComments(prev => addReplyToTree(prev, parentId, reply));
                }}
                handleDeleteComment={handleDeleteComment}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface CommentItemProps {
  user_id: number
  comment: TestComment;
  addReply: (parent_id: number, reply: TestComment) => void
  level?: number
  handleDeleteComment: (comment_id: number) => void
}

function CommentItem({ comment, user_id, addReply, level = 1, handleDeleteComment }: CommentItemProps) {
  const [isReplying, setIsReplying] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");
  const { user } = useAuth();

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    console.log(`Replying to comment ${comment.ma_binh_luan} with:`, replyText);

    const replyData = {
      ma_kiem_tra: comment.ma_kiem_tra,
      ma_nguoi_dung: user_id,
      noi_dung: replyText,
      ma_binh_luan_goc: comment.ma_binh_luan,
    }

    console.log('replyData: ', replyData);

    const res = await testService.createComment(replyData);

    if (res.success) {
      toast.success("Đã phản hồi!");
      addReply(comment.ma_binh_luan, res.data);
    } else {
      toast.error("Lỗi khi gửi phản hồi");
    }

    setReplyText("");
    setIsReplying(false);
  };

  console.log(user)

  return (
    <div key={comment.ma_binh_luan} className="flex flex-col gap-2">
      <div className={`flex gap-2 flex-1 space-y-2 ${level !== 1 ? 'ml-12' : ''}`}>
        <div>
          <Avatar className="h-10 w-10 border">
            {/* <AvatarImage src={comment.user.avatarUrl || undefined} /> */}
            <AvatarFallback>
              {comment.nguoi_dung?.ten.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className='w-full'>
          <div className='w-fit space-y-1'>
            <div className='bg-gray-100 p-3 rounded-[3px]'>
              <div className="flex items-center justify-between gap-4">
                <div className='flex items-center gap-2'>
                  <span className="text-sm font-semibold">{comment.nguoi_dung?.ten}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(comment.ngay_tao)}
                  </span>
                </div>
                {user && user?.ma_nguoi_dung === user_id && (
                  <ConfirmModal
                    onConfirm={() => handleDeleteComment(comment.ma_binh_luan)}
                    title='Bạn muốn xoá bình luận? Hành động này không thể hoàn tác!'
                    description='Xoá bình luận'
                  >
                    <Button variant="ghost" size="sm" className='h-4 w-4 cursor-pointer rounded-[3px] bg-transparent shadow-none'>
                      <Trash size={16} className='text-slate-500' />
                    </Button>
                  </ConfirmModal>
                )}
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                <span className='text-[#295fe6] font-bold'>{comment.reply_to_user_name && `@${comment.reply_to_user_name}`} </span>
                <span>{comment.noi_dung}</span>
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className=" rounded-[3px] cursor-pointer text-sky-800"
              onClick={() => setIsReplying(!isReplying)}
            >
              Phản hồi
            </Button>
          </div>

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
                  placeholder={`Phản hồi ${comment.nguoi_dung?.ten}...`}
                  className="flex-1 rounded-[3px] shadow-none border-gray-300"
                  rows={2}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button" // Important: set type to button to prevent form submit
                  onClick={() => setIsReplying(false)}
                  className="rounded-[3px] cursor-pointer"
                >
                  Huỷ
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={replyText.trim() === ""}
                  className="cursor-pointer rounded-[3px]"
                >
                  <Send className="h-3 w-3 mr-2" />
                  Phản hồi
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="">
        {comment.binh_luan_phan_hoi?.map((reply) => (
          <CommentItem
            key={reply.ma_binh_luan}
            comment={reply}
            user_id={reply.ma_nguoi_dung}
            addReply={addReply}
            level={2}
            handleDeleteComment={() => handleDeleteComment(reply.ma_binh_luan)}
          />
        ))}
      </div>
    </div >
  );
}