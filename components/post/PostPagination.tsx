import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

const PostPagination = ({ page, total, limit, onPageChange,
}: {
  page: number; total: number; limit: number; onPageChange: (p: number) => void
}) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-1 text-sm font-medium">
        Page {page} of {totalPages}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PostPagination
