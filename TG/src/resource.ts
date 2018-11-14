export interface Resource // атрибуты ресурса
{
    name: string;
    status: string;
    color: string;
    tasks: Task[];
}
export interface Task // атрибуты задачи
{
    id: number;
    name: string;
    start: Date;
    stop: Date;
    baseColor: string;  //В Hex, пример: #ebb7b7
    connect: number[];
}