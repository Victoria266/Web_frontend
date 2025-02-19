import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Resource, T_ResourceAddData, T_ResourcesListResponse} from "modules/types.ts";
import {api} from "modules/api.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";
import {saveReport} from "store/slices/reportsSlice.ts";
import {Resource} from "src/api/Api.ts";

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

export const deleteResource = createAsyncThunk<T_Resource[], string, AsyncThunkConfig>(
    "delete_resource",
    async function(resource_id) {
        const response = await api.resources.resourcesDeleteDelete(resource_id) as AxiosResponse<T_Resource[]>
        return response.data
    }
)

export const updateResource = createAsyncThunk<void, object, AsyncThunkConfig>(
    "update_resource",
    async function({resource_id, data}) {
        await api.resources.resourcesUpdateUpdate(resource_id as string, data as Resource)
    }
)

export const updateResourceImage = createAsyncThunk<void, object, AsyncThunkConfig>(
    "update_resource_image",
    async function({resource_id, data}) {
        await api.resources.resourcesUpdateImageCreate(resource_id as string, data as {image?: File})
    }
)

export const createResource = createAsyncThunk<void, T_ResourceAddData, AsyncThunkConfig>(
    "update_resource",
    async function(data) {
        await api.resources.resourcesCreateCreate(data)
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
        builder.addCase(deleteResource.fulfilled, (state:T_ResourcesSlice, action: PayloadAction<T_Resource[]>) => {
            state.resources = action.payload
        });
    }
})

export const { updateResourceName, removeSelectedResource} = resourcesSlice.actions;

export default resourcesSlice.reducer