export interface Resource // атрибуты ресурса
{
    name: string;
    status: string;
    color: string;
    fcolor: string;
    tasks: Task[];
}
export interface Task // атрибуты задачи
{
    id: number;
    name: string;
    start: Date;
    stop: Date;
    event: string;
    baseColor: string;  //В Hex, пример: #ebb7b7
    fcolor: string;
    connect: number[];
}