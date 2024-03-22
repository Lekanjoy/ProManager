import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { teamData, taskDataObj }from "../types";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchInitialData = createAsyncThunk(
  "newTask/fetchInitialData",
  async () => {
    // Get Current User
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Select matching team database
    const { data: teamData1, error: memberError } = await supabase
      .from("teams") 
      .select("*")
      .eq('team_member @>', '["' + user?.id + '"]')
      .single();

      const { data: teamData2, error: adminError } = await supabase
      .from("teams")
      .select("*")
      .eq('admin_id', user?.id)
      .single();

    if (memberError || adminError) {
      console.error(memberError, adminError);
    }

    return teamData1 ?? teamData2;
  }
);

const addNewTaskSlice = createSlice({
  name: "newTask",
  initialState: {
    tasks: [] as teamData[],
    selectedTask: {} as taskDataObj,
  },
  reducers: {
    addNewTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    selectTask: (state, action) => {
      return { ...state, selectedTask: action.payload }; // Store the selected task
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.tasks = [action.payload];
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        console.error("Error fetching initial data:", action.error);
      });
  },
});

export const { addNewTask, selectTask } = addNewTaskSlice.actions;

export default addNewTaskSlice.reducer;
