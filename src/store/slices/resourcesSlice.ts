import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Resource, T_ResourcesListResponse} from "modules/types.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {api} from "modules/api.ts";
import {AxiosResponse} from "axios";
import {saveReport} from "store/slices/reportsSlice.ts";

type T_ResourcesSlice = {
    resource_density: string
    resource: null | T_Resource
    resources: T_Resource[]
}

const initialState:T_ResourcesSlice = {
    resource_density: "",
    resource: null,
    resources: []
}

export const fetchResource = createAsyncThunk<T_Resource, string, AsyncThunkConfig>(
    "fetch_resource",
    async function(id) {
        const response = await api.resources.resourcesRead(id) as AxiosResponse<T_Resource>
        return response.data
    }
)

export const fetchResources = createAsyncThunk<T_Resource[], object, AsyncThunkConfig>(
    "fetch_resources",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState();
        const response = await api.resources.resourcesList({
            resource_density: state.resources.resource_density
        }) as AxiosResponse<T_ResourcesListResponse>

        thunkAPI.dispatch(saveReport({
            draft_report_id: response.data.draft_report_id,
            resources_count: response.data.resources_count
        }))

        return response.data.resources
    }
)

export const addResourceToReport = createAsyncThunk<void, string, AsyncThunkConfig>(
    "resources/add_resource_to_report",
    async function(resource_id) {
        await api.resources.resourcesAddToReportCreate(resource_id)
    }
)

const resourcesSlice = createSlice({
    name: 'resources',
    initialState: initialState,
    reducers: {
        updateResourceName: (state, action) => {
            state.resource_density = action.payload
        },
        removeSelectedResource: (state) => {
            state.resource = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchResources.fulfilled, (state:T_ResourcesSlice, action: PayloadAction<T_Resource[]>) => {
            state.resources = action.payload
        });
        builder.addCase(fetchResource.fulfilled, (state:T_ResourcesSlice, action: PayloadAction<T_Resource>) => {
            state.resource = action.payload
        });
    }
})

export const { updateResourceName, removeSelectedResource} = resourcesSlice.actions;

export default resourcesSlice.reducer