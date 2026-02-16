import type { Comment } from "../types/comment";

interface CommentProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentProps) {
  return (
    <div className="bg-white border-l-4 border-primary p-4 my-4 shadow-sm rounded-r-lg">
      <div className="flex justify-between items-center mb-2"></div>
      <p className="text-gray-700 text-sm leading-relaxed">
        {comment.description}
      </p>
    </div>
  );
}
