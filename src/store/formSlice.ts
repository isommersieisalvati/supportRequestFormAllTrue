import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SupportForm } from "../types/formTypes";

interface FormState {
  data: SupportForm | null;
}

const initialState: FormState = {
  data: null,
};

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    saveFormData: (state, action: PayloadAction<SupportForm>) => {
      state.data = action.payload;
    },
  },
});

export const { saveFormData } = formSlice.actions;
export default formSlice.reducer;
