import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {E_ReportStatus, T_Report, T_ReportsFilters, T_Resource} from "modules/types.ts";
import {NEXT_MONTH, PREV_MONTH} from "modules/consts.ts";
import {api} from "modules/api.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";

type T_ReportsSlice = {
    draft_report_id: number | null,
    resources_count: number | null,
    report: T_Report | null,
    reports: T_Report[],
    filters: T_ReportsFilters,
    save_mm: boolean
}

const initialState:T_ReportsSlice = {
    draft_report_id: null,
    resources_count: null,
    report: null,
    reports: [],
    filters: {
        status: 0,
        date_formation_start: PREV_MONTH.toISOString().split('T')[0],
        date_formation_end: NEXT_MONTH.toISOString().split('T')[0],
        owner: ""
    },
    save_mm: false
}

export const fetchReport = createAsyncThunk<T_Report, string, AsyncThunkConfig>(
    "reports/report",
    async function(report_id) {
        const response = await api.reports.reportsRead(report_id) as AxiosResponse<T_Report>
        return response.data
    }
)

export const fetchReports = createAsyncThunk<T_Report[], object, AsyncThunkConfig>(
    "reports/reports",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState()

        const response = await api.reports.reportsList({
            status: state.reports.filters.status,
            date_formation_start: state.reports.filters.date_formation_start,
            date_formation_end: state.reports.filters.date_formation_end
        }) as AxiosResponse<T_Report[]>

        return response.data.filter(report => report.owner.includes(state.reports.filters.owner))
    }
)

export const removeResourceFromDraftReport = createAsyncThunk<T_Resource[], string, AsyncThunkConfig>(
    "reports/remove_resource",
    async function(resource_id, thunkAPI) {
        const state = thunkAPI.getState()
        const response = await api.reports.reportsDeleteResourceDelete(state.reports.report.id, resource_id) as AxiosResponse<T_Resource[]>
        return response.data
    }
)

export const deleteDraftReport = createAsyncThunk<void, object, AsyncThunkConfig>(
    "reports/delete_draft_report",
    async function(_, {getState}) {
        const state = getState()
        await api.reports.reportsDeleteDelete(state.reports.report.id)
    }
)

export const sendDraftReport = createAsyncThunk<void, object, AsyncThunkConfig>(
    "reports/send_draft_report",
    async function(_, {getState}) {
        const state = getState()
        await api.reports.reportsUpdateStatusUserUpdate(state.reports.report.id)
    }
)

export const updateReport = createAsyncThunk<void, object, AsyncThunkConfig>(
    "reports/update_report",
    async function(data, {getState}) {
        const state = getState()
        await api.reports.reportsUpdateUpdate(state.reports.report.id, {
            ...data
        })
    }
)

export const updateResourceValue = createAsyncThunk<void, object, AsyncThunkConfig>(
    "reports/update_mm_value",
    async function({resource_id, plan_volume},thunkAPI) {
        const state = thunkAPI.getState()
        await api.reports.reportsUpdateResourceUpdate(state.reports.report.id, resource_id, {plan_volume})
    }
)

export const acceptReport = createAsyncThunk<void, string, AsyncThunkConfig>(
    "reports/accept_report",
    async function(report_id,{dispatch}) {
        await api.reports.reportsUpdateStatusAdminUpdate(report_id, {status: E_ReportStatus.Completed})
        await dispatch(fetchReports)
    }
)

export const rejectReport = createAsyncThunk<void, string, AsyncThunkConfig>(
    "reports/accept_report",
    async function(report_id,{dispatch}) {
        await api.reports.reportsUpdateStatusAdminUpdate(report_id, {status: E_ReportStatus.Rejected})
        await dispatch(fetchReports)
    }
)

const reportsSlice = createSlice({
    name: 'reports',
    initialState: initialState,
    reducers: {
        saveReport: (state, action) => {
            state.draft_report_id = action.payload.draft_report_id
            state.resources_count = action.payload.resources_count
        },
        removeReport: (state) => {
            state.report = null
        },
        triggerUpdateMM: (state) => {
            state.save_mm = !state.save_mm
        },
        updateFilters: (state, action) => {
            state.filters = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchReport.fulfilled, (state:T_ReportsSlice, action: PayloadAction<T_Report>) => {
            state.report = action.payload
        });
        builder.addCase(fetchReports.fulfilled, (state:T_ReportsSlice, action: PayloadAction<T_Report[]>) => {
            state.reports = action.payload
        });
        builder.addCase(removeResourceFromDraftReport.rejected, (state:T_ReportsSlice) => {
            state.report = null
        });
        builder.addCase(removeResourceFromDraftReport.fulfilled, (state:T_ReportsSlice, action: PayloadAction<T_Resource[]>) => {
            if (state.report) {
                state.report.resources = action.payload as T_Resource[]
            }
        });
        builder.addCase(sendDraftReport.fulfilled, (state:T_ReportsSlice) => {
            state.report = null
        });
    }
})

export const { saveReport, removeReport, triggerUpdateMM, updateFilters } = reportsSlice.actions;

export default reportsSlice.reducer