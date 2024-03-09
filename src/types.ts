export type taskDataObj= {
  task_id: number;
  files: string[];
  title: string;
  text: string;
  severity: string;
  comments: {
    id: string;
    text: string;
    author: string;
  }[];
};