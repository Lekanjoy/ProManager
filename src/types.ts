export type taskDataObj = {
  task_id: string;
  title: string;
  text: string;
  comments: {
    id: string;
    text: string;
    author: string;
  }[];
  files: string[];
};
