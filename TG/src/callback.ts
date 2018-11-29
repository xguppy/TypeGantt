import * as d3 from 'd3'
import { Task } from './resource';
export let context =
{
    nameFunc:
        (obj: d3.BaseType, tsk: Task) =>
        {
            d3.select(obj).remove();
        },
    chColor:
        (obj: d3.BaseType, tsk: Task) =>
        {
            d3.select(obj).style('fill', 'blue')
        },
    showName:
        (obj: d3.BaseType, tsk: Task) =>
        {
            alert(tsk.name);
        }
}

