import { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import { generateCommentId } from "../../hooks/generateId";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "../../features/taskDetailsModalSlice";
import { setActionTriggered } from "../../features/isActionTriggeredSlice";
import comment from "../../assets/comments.svg";
import file from "../../assets/folder-2.svg";
import member from "../../assets/member.svg";
import member1 from "../../assets/member1.svg";
import member2 from "../../assets/member2.svg";

const TaskCardDetails = () => {
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();
  const selectedTask = useSelector((store) => store.tasks.selectedTask);
  const { title, text, severity, comments, files } = selectedTask;


  async function addComment(e) {
    e.preventDefault();

    const newComments = [
      {
        id: generateCommentId(),
        text: commentText,
        author: "new.author",
      },
    ];
    dispatch(setActionTriggered(true));

    // Retrieve the existing comments first
    const { data: existingTask, error: taskError } = await supabase
      .from("tasks")
      .select("comments")
      .eq("task_id", selectedTask.task_id)
      .single();

    if (!taskError) {
      // Combine existing and new comments into a single array
      const combinedComments = [
        ...(existingTask.comments || []),
        ...newComments,
      ];

      // Update the task's comments with the combined array
      const { data, error: updateError } = await supabase
        .from("tasks")
        .update({ comments: combinedComments })
        .eq("task_id", selectedTask.task_id);

      if (!updateError) {
        console.log("Comments added successfully");
        dispatch(setActionTriggered(false));
      } else {
        console.error("Error updating task with comments:", updateError);
      }
    } else {
      console.error("Error retrieving task:", taskError);
    }
  }

  return (
    <section className="z-50 bg-[rgba(0,0,0,0.5)] w-full h-screen fixed left-0 top-0 flex justify-center items-center">
      <div className="flex flex-col gap-y-3 bg-white shadow-md rounded-lg p-6 w-[500px] ">
        <p
          className={`py-1 px-[6px] w-fit rounded bg-[rgba(223,_168,_116,_0.20)] text-[#D58D49] text-xs font-medium`}
        >
          {severity}
        </p>
        <div className=" my-2">
          <h1 className="text-secColor font-semibold mb-[6px] text-3xl ">
            {title}
          </h1>
          <p className="text-xs">{text}</p>
        </div>
        <div className="flex items-center gap-x-6">
          <div className="flex">
            <img src={member} alt="Team members avatar" />
            <img src={member2} alt="Team members avatar" className="-ml-2" />
            <img src={member1} alt="Team members avatar" className="-ml-2" />
          </div>
          <div className="flex gap-x-1 items-center text-xs">
            <img src={comment} alt="Comment Icon" />
            <p>{comments.length} comments</p>
          </div>
          <div className="flex gap-x-1 items-center text-xs">
            <img src={file} alt="files Icon" />
            <p>{files.length} files</p>
          </div>
        </div>

        {comments.map((comment) => {
          return (
            <div
              key={comment.id}
              className=" w-full bg-[#F5F5F5] p-2 flex-col rounded-tl-none rounded-md flex gap-x-2"
            >
              <div className="flex gap-x-2  items-center">
                <img src={member} alt="Team members avatar" />
                <p className="font-medium text-secColor text-sm">Jeff Arthur</p>
              </div>
              <p className="text-sm text-primColor pl-8">{comment.text}</p>
            </div>
          );
        })}

        <form onSubmit={addComment} className="w-full mt-2 grid gap-y-2">
          <textarea
            rows={1}
            // cols={5}
            placeholder="Drop a comment . . . ."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border border-primColor rounded-tl-none resize-none text-sm text-secColor placeholder:text-secColor w-full rounded-md py-3 px-2"
          ></textarea>
          {commentText.length > 0 && (
            <button className="bg-secColor text-white px-3 py-1 rounded-lg  justify-self-end  w-fit :focus">
              Send
            </button>
          )}
        </form>
      </div>
      <p
        onClick={() => dispatch(toggleModal())}
        className="absolute right-8 z-20 top-3 bg-red-500 text-white cursor-pointer w-4 h-4 flex justify-center items-center p-4 font-bold rounded-full"
      >
        X
      </p>
    </section>
  );
};

export default TaskCardDetails;
