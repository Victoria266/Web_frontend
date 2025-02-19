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