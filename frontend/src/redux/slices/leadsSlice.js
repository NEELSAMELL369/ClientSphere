import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import * as leadService from "../../services/leadsService";

// ------------------- Async Thunks -------------------
export const fetchLeads = createAsyncThunk(
  "leads/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await leadService.getLeads();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Error fetching leads"
      );
    }
  }
);

export const addLead = createAsyncThunk("leads/add", async (data, thunkAPI) => {
  try {
    const res = await leadService.createLead(data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data || "Error creating lead"
    );
  }
});

export const editLead = createAsyncThunk(
  "leads/edit",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await leadService.updateLead(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Error updating lead"
      );
    }
  }
);

export const removeLead = createAsyncThunk(
  "leads/remove",
  async (id, thunkAPI) => {
    // Optimistic update: remove from state first
    thunkAPI.dispatch(leadsSlice.actions.removeLocalLead(id));
    try {
      await leadService.deleteLead(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Error deleting lead"
      );
    }
  }
);

// ------------------- Slice -------------------
const leadsSlice = createSlice({
  name: "leads",
  initialState: {
    leads: [],
    selectedLead: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
    removeLocalLead: (state, action) => {
      state.leads = state.leads.filter((lead) => lead.id !== action.payload);
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all leads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads || [];
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add lead
      .addCase(addLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads.push(action.payload);
        state.successMessage = "Lead added successfully!";
      })
      .addCase(addLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit lead
      .addCase(editLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editLead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leads.findIndex(
          (lead) => lead.id === action.payload.id
        );
        if (index !== -1) state.leads[index] = action.payload;
        state.successMessage = "Lead updated successfully!";
      })
      .addCase(editLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove lead
      .addCase(removeLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeLead.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Lead deleted successfully!";
      })
      .addCase(removeLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ------------------- Selectors -------------------
export const selectLeads = (state) => state.leads.leads;
export const selectLeadById = (id) =>
  createSelector([selectLeads], (leads) =>
    leads.find((lead) => lead.id === id)
  );
export const selectLoading = (state) => state.leads.loading;
export const selectError = (state) => state.leads.error;
export const selectSuccessMessage = (state) => state.leads.successMessage;

// ------------------- Exports -------------------
export const { clearSelectedLead, removeLocalLead, clearMessages } =
  leadsSlice.actions;
export default leadsSlice.reducer;
