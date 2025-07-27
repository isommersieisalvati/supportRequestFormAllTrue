import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RequestForm } from "../types/formTypes";

interface FormState {
  data: RequestForm | null;
}

const initialState: FormState = {
  data: null,
};

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    saveFormData: (state, action: PayloadAction<RequestForm>) => {
      state.data = action.payload;
    },
  },
});

export const { saveFormData } = formSlice.actions;
export default formSlice.reducer;
