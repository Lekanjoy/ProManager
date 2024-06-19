import { UniqueIdentifier } from "@dnd-kit/core";

export type teamData = {
  id: number;
  team_name: string;
  description: string;
  admin_id: string;
  created_at: Date;
  team_member: string[];
  tasks: taskDataObj[]
}


export type taskDataObj = {
  task_id: number;
  columnId: UniqueIdentifier,
  created_at:string;
  files: string[];
  title: string;
  description: string;
  priority: string;
  comments: {
    id: string;
    text: string;
    author: string;
    authorId: string;
  }[];
};

export type userProfileData = {
  userID: string;
  fullName: string;
  email: string;
  role: string;
}

export type ColumnDataType = {
  id: string | number,
  title: string
}
