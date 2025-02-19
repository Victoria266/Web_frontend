export type T_Resource =  {
    id: number,
    name: string,
    description: string,
    density: number,
    image: string,
    status: number,
    volume?: number,
    plan_volume?: number
}

export type T_Report = {
    id: string | null
    status: E_ReportStatus
    date_complete: string
    date_created: string
    date_formation: string
    owner: string
    moderator: string
    resources: T_Resource[]
    company: string
    month: string
}

export enum E_ReportStatus {
    Draft=1,
    InWork,
    Completed,
    Rejected,
    Deleted
}

export type T_User = {
    id: number
    username: string
    is_authenticated: boolean
    is_superuser: boolean
}

export type T_ReportsFilters = {
    date_formation_start: string
    date_formation_end: string
    status: E_ReportStatus
    owner: string
}

export type T_ResourcesListResponse = {
    resources: T_Resource[],
    draft_report_id?: number,
    resources_count?: number
}

export type T_LoginCredentials = {
    username: string
    password: string
}

export type T_RegisterCredentials = {
    name: string
    email: string
    password: string
}

export type T_ResourceAddData = {
    name: string;
    description: string;
    density: number;
    image?: File | null;
}