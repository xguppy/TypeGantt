export interface Resource // атрибуты ресурса
{
    name: string;
    status: string;
    tasks: Task[];
}
export interface Task // атрибуты задачи
{
    id: number;
    name: string;
    start: Date;
    stop: Date;
    baseColor: string;  //В Hex, пример: #ebb7b7
    lineColor: string;
    connect: number[];
}