import {createSlice} from "@reduxjs/toolkit";

type T_ResourcesSlice = {
    resource_density: string
}

const initialState:T_ResourcesSlice = {
    resource_density: "",
}


const resourcesSlice = createSlice({
    name: 'resources',
    initialState: initialState,
    reducers: {
        updateResourceName: (state, action) => {
            state.resource_density = action.payload
        }
    }
})

export const { updateResourceName} = resourcesSlice.actions;

export default resourcesSlice.reducer