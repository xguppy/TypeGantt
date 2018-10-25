import * as d3 from 'd3'
import {Resource} from './resource'

//Определяем размеры и пространство вывода svg 
const width = 960;
const height = 480;

let svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

 //Отступы от графика
let plotMargins = {
    top: 30,
    bottom: 30,
    left: 150,
    right: 30
};
//Определим график
let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);
 // Ширина
let plotWidth = width - plotMargins.left - plotMargins.right;
// Высота
let plotHeight = height - plotMargins.top - plotMargins.bottom;
// Теперь определим размеры оси, и определим, то что ось временная
let xScale = d3.scaleTime()
    .range([0, plotWidth]);
//Опредлим ось X, зададим 24 тика на оси от 00 часов до 00 часов
let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H")).ticks(25);
let xAxisGroup = plotGroup.append('g')
    .classed('x', true)
    .classed('axis', true)
    .attr('transform', `translate(${0},${plotHeight})`)
    .call(xAxis);
//Аналогично для оси ресурсов
let yScale = d3.scaleBand()
    .range([plotHeight, 0]);
let yAxis= d3.axisLeft(yScale);
let yAxisGroup = plotGroup.append('g')
    .classed('y', true)
    .classed('axis', true)
    .call(yAxis);

    d3.json<Resource[]>('tasks.json').then((data)=>
    {
            //Массив ресурсов
            let prepared = data.map(d => {
                let obj: Resource = {name: d.name, tasks: d.tasks}  //Соберем ресурс
                return {
                    Resource : obj
                }
                });
                yScale.domain(prepared.map(d => d.Resource.name));  //Добавил на ось
                yAxisGroup.call(yAxis); //Обновим ось
                //Тут будем рисовать "точки" из d.Resource.tasks
    }, 
    (error) =>      //Если ошибка
    {
        console.log(error);
    });