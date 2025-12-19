'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Đảm bảo đường dẫn đúng tới shadcn
import { Button } from '@/components/ui/button';
import { Share2, Link as LinkIcon, Check, Facebook, Linkedin } from 'lucide-react';
import toast from 'react-hot-toast'; // Hoặc dùng toast của shadcn/sonner tuỳ bạn

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string; // Nếu không truyền sẽ tự lấy window.location.href
}

const ShareButton = ({ title, description, url }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  // Lấy URL hiện tại nếu không được truyền vào
  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : '';

  // 1. Hàm Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Đã sao chép liên kết!');

    // Reset icon sau 2 giây
    setTimeout(() => setCopied(false), 2000);
  };

  // 2. Hàm chia sẻ Native (Cho điện thoại)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const openSocialShare = (platform: 'facebook' | 'linkedin') => {
    let socialUrl = '';

    switch (platform) {
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        socialUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }

    if (socialUrl) {
      window.open(socialUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
          <Share2 className="h-4 w-4" />
          Chia sẻ
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Chia sẻ bài viết</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Nút Copy Link */}
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer gap-2">
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <LinkIcon className="h-4 w-4" />}
          {copied ? 'Đã sao chép' : 'Sao chép liên kết'}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Social Media */}
        <DropdownMenuItem onClick={() => openSocialShare('facebook')} className="cursor-pointer gap-2">
          <Facebook className="h-4 w-4 text-blue-600" />
          Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => openSocialShare('linkedin')} className="cursor-pointer gap-2">
          <Linkedin className="h-4 w-4 text-blue-700" />
          LinkedIn
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;