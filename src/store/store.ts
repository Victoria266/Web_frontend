import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import resourcesReducer from "./slices/resourcesSlice.ts"

export const store = configureStore({
    reducer: {
        resources: resourcesReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;