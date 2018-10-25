export interface Resource // атрибуты ресурса
{
    name: string;
    tasks: Task[];
}
export interface Task // атрибуты задачи
{
    id: number;
    name: string;
    start: Date;
    stop: Date;
    connect: number[];
}