import * as d3 from 'd3'
import {Resource, Task} from './resource'
import {timeParse} from "d3";

//Определяем размеры и пространство вывода svg
const width = 1200;
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

let startDate: Date = new Date(2018, 10, 25);
let endDate: Date = new Date(2018, 10, 26);
// Теперь определим размеры оси, и определим, то что ось временная
let xScale = d3.scaleTime()
    .range([0, plotWidth])
    .domain([startDate, endDate]);
let xInvAxis  =d3.axisBottom(xScale).ticks(25).tickSize(height).tickFormat(d3.timeFormat(""));
//Опредлим ось X, зададим 24 тика на оси от 00 часов до 00 часов
let xAxis = d3.axisTop(xScale).ticks(25).tickFormat(d3.timeFormat("%H:%M"));
let xAxisGroup = plotGroup.append('g')
    .attr('color', 'blue')
    .classed('x', true)
    .classed('axis', true)
    .attr('transform', `translate(${0},${0})`)
    .call(xAxis);
let xInvAxisGroup = plotGroup.append('g')
    .attr('color', 'blue')
    .style('stroke-dasharray', ('3, 3'))
    .classed('x', true)
    .classed('axis', true)
    .attr('transform', `translate(${0},${0})`)
    .call(xInvAxis);
//Аналогично для оси ресурсов
let yScale = d3.scaleBand()
    .range([plotHeight, 0]);
let yAxis= d3.axisLeft(yScale); //.tickSize(-1200);
let yAxisGroup = plotGroup.append('g')
    .attr('color', 'blue')
    .classed('y', true)
    .classed('axis', true)
    .call(yAxis);

let pointsGroup = plotGroup.append('g')
    .classed('points', true);

d3.json<Resource[]>('tasks.json').then((data)=>
    {
        yScale.domain(data.map(d => d.name));  //Добавил на ось
        //yAxisGroup.call(yAxis); //Обновим ось
        let barHeight: number = 60;
        let barWidth: number = 120;        

        //Тут будем рисовать "точки" из d.Resource.tasks

        var dataBound = pointsGroup.selectAll('.post') //
            .data(data);

        dataBound //Удалим повторяющие точки (вроде не надо исходя из условий задачи)
            .exit()
            .remove();

        var enterSelection = dataBound //Добавим точки
            .enter()
            .append('g')
            .classed('post', true)
            .attr('stroke', 'black')
            .attr('strokeWidth', 1);

        let bar = d3.selectAll(".post") // объект для отрисовки ресурсов
            .data(data)
            .append("g")
            .attr("transform", function(d) { return `translate(${xScale(startDate)-barWidth} , ${yScale(d.name)+barHeight/2});`});

        data.forEach( item => 
        {
            bar.append("rect")
                .attr("width", barWidth)
                .attr("height", barHeight)
                .attr("stroke", "black")
                .attr('strokeWidth', 5)
                .style('fill', item.color);

            bar.append("text")
                .attr("x", 5)
                .attr("y", barHeight/3)
                .attr("font-size", "0.75em")
                .text(d=> d.name);

            bar.append("text")
                .attr("x", 15)
                .attr("y", barHeight/3*2)
                .attr("font-size", "0.75em")
                .text(d=>d.status);  

            item.tasks.forEach((interval, i) => {
                var startdate: Date = new Date(interval.start);
                var stopdate: Date = new Date(interval.stop);
                startdate.setMonth(startdate.getMonth() + 1);
                stopdate.setMonth(stopdate.getMonth() + 1);
                var interv = xScale(stopdate) - xScale(startdate);

                enterSelection.append('rect') // Стиль "точки"
                    .attr('width', interv)
                    .attr('height', barHeight)
                    .attr('rx', 3)
                    .attr('ry', 3)
                    .attr('transform', `translate(${xScale(startdate)},${yScale(item.name) + barHeight/2})`)
                    .style('fill', interval.baseColor);

                //console.log(1); цикл проходит 5 раз по пяти таскам - проверено!!!
            });
        });

        enterSelection.merge(dataBound); //Обновим все точки и отрисуем на графике
    },
    (error) =>      //Если ошибка
    {
        console.log(error);
    });