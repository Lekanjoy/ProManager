import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../supabase";
import { teamData, taskDataObj} from "../types";


export const fetchInitialData = createAsyncThunk(
  "newTask/fetchInitialData",
  async () => {
    // Get Current User
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Select matching team database
    const { data: teamData, error } = await supabase
      .from("teams")
      .select("*")
      .eq("admin_id", user?.id)
      .single();

    if (error) {
      throw error;
    }
    return teamData;
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
        state.tasks =[ action.payload];
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        console.error("Error fetching initial data:", action.error);
      });
  },
});

export const { addNewTask, selectTask } = addNewTaskSlice.actions;

export default addNewTaskSlice.reducer;
