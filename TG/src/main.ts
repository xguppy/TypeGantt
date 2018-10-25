import * as d3 from 'd3'
import { timeFormat } from 'd3';

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
//Опреедлим ось X, зададим 24 тика на оси от 00 часов до 00 часов
let xAxis = d3.axisBottom(xScale).tickFormat(timeFormat("%H")).ticks(24);
let xAxisGroup = plotGroup.append('g')
    .classed('x', true)
    .classed('axis', true)
    .attr('transform', `translate(${0},${plotHeight})`)
    .call(xAxis);