import {configureStore, ThunkDispatch} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import userReducer from "./slices/userSlice.ts"
import reportsReducer from "./slices/reportsSlice.ts"
import resourcesReducer from "./slices/resourcesSlice.ts"

export const store = configureStore({
    reducer: {
        user: userReducer,
        reports: reportsReducer,
        resources: resourcesReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppThunkDispatch = ThunkDispatch<RootState, never, never>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;