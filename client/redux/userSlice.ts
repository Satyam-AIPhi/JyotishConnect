import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface UserState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// 1) Async thunk for signing up
export const signupUser = createAsyncThunk(
  'user/signup',
  async (
    payload: { firstName: string; lastName: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Make your POST request to /api/v1/signup (or whatever endpoint)
      // For demonstration, we’ll do a fetch
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }
      const data = await response.json();
      return data; // this is the user object from the server
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

export const signupAstrologer = createAsyncThunk(
  'user/signupAstrologer',
  async (
    payload: {
      name: string;
      username: string;
      email: string;
      password: string;
      languages: string[];
      experience: number;
      costPerMinute: number;
      about: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/signup-astrologer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }
      const data = await response.json();
      return data; // user data
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);


// 2) Async thunk for logging in
export const loginUser = createAsyncThunk(
  'user/login',
  async (
    payload: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include', // important if your server sets a HttpOnly cookie
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }
      const data = await response.json();
      return data; // user object
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

// 3) Async thunk for signing out
export const signoutUser = createAsyncThunk(
  'user/signout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/signout`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }
      // Could return a message or something
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/profile`, {
        credentials: "include", // important so cookies are sent
      });
      if (!response.ok) {
        return rejectWithValue("Not logged in or cannot fetch profile");
      }
      const userData = await response.json();
      return userData;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // For any synchronous reducers if needed
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ============== SIGNUP THUNKS ==============
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload;
      state.error = null;
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(signupAstrologer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupAstrologer.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload;
      state.error = null;
    });
    builder.addCase(signupAstrologer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    

    // ============== LOGIN THUNKS ==============
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ============== SIGNOUT THUNKS ==============
    builder.addCase(signoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
    });
    builder.addCase(signoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Then handle in extraReducers
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.user = null;    // means not logged in or error
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
  },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectLoading = (state: RootState) => state.user.loading;
export const selectError = (state: RootState) => state.user.error;
