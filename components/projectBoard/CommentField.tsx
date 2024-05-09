'use client'

import { User } from "@supabase/supabase-js";
import { Dispatch, FormEvent, SetStateAction } from "react";

type commentFieldProps = {
    addComment: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    commentText: string;
    setCommentText: Dispatch<SetStateAction<string>>;
    user: User | null;
    loading: boolean;

}

const CommentField = ({addComment, commentText,setCommentText, user, loading}: commentFieldProps) => {

  return (
    <form
            onSubmit={addComment}
            className="relative w-full mt-2 grid gap-y-2"
          >
            <textarea
              rows={1}
              placeholder={`Comment as ${user?.email}...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className=" border border-primColor rounded-tl-none resize-none text-sm text-secColor placeholder:text-secColor w-full rounded-md py-3 px-2"
            ></textarea>
            {commentText.length > 0 && (
              <button
                disabled={loading}
                className={` text-white px-3 py-1 rounded-lg  justify-self-end  w-fit ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-secColor"
                }`}
              >
                Send
              </button>
            )}
          </form>
  )
}

export default CommentField