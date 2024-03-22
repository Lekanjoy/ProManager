export type teamData = {
  id: number;
  team_name: string;
  description: string;
  admin_id: string;
  created_at: Date;
  team_member: string[];
  tasks: taskDataObj[]
}


export type taskDataObj= {
  task_id: number;
  files: string[];
  title: string;
  description: string;
  priority: string;
  comments: {
    id: string;
    text: string;
    author: string;
  }[];
};
