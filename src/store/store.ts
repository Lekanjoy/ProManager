import {configureStore} from '@reduxjs/toolkit'
import asideCollapseSlice from '../features/asideCollapseSlice'
import addNewTaskSlice from '../features/addNewTaskSlice';
import showModalSlice from '../features/showModalSlice';
import taskDetailsModalSlice from '../features/taskDetailsModalSlice';
import isActionTriggeredSlice from '../features/isActionTriggeredSlice';

export const store = configureStore({
  reducer: {
    collapse: asideCollapseSlice,
    tasks: addNewTaskSlice,
    modal: showModalSlice,
    taskDetailsModal: taskDetailsModalSlice,
    isTriggered: isActionTriggeredSlice
  },
});