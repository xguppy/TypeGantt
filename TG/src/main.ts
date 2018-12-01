import * as d3 from 'd3'
import {Resource} from './resource'
import {context} from './callback'
//Определяем размеры и пространство вывода svg
const width = 1200;
const height = 480;
const widthResource = 120;
const heightResource = 60;

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

let yScale = d3.scaleBand();
let yAxis= d3.axisLeft(yScale); //.tickSize(-1200);
let yAxisGroup = plotGroup.append('g')
    .attr('color', 'blue')
    .classed('y', true)
    .classed('axis', true)
    .call(yAxis);

let pointsGroup = plotGroup.append('g')
    .classed('points', true).append('g').classed('dataY', true);

d3.json<Resource[]>('tasks.json').then((data)=>
    {
        yScale.domain(data.map(d => d.name))  //Добавил на ось
             .range([0, data.length * heightResource]);     

        //Тут будем рисовать "точки" из d.Resource.tasks
        var dataBound = pointsGroup.selectAll('.post') //
            .data(data);
        
        dataBound //Удалим повторяющие точки (вроде не надо исходя из условий задачи)
            .exit()
            .remove();

        dataBound //Добавим точки
            .enter()
            .append('g')
            .classed('post', true)
            .attr('stroke', 'black')
            .attr('strokeWidth', 1);

        let bar = d3.selectAll(".post") // объект для отрисовки ресурсов
            .data(data)
            .append("g")
            .attr("transform", function(d) { return `translate(${xScale(startDate)-widthResource}, ${yScale(d.name)})`});          
        
        bar.append("rect")
            .attr("width", widthResource)
            .attr("height", heightResource)
            .attr('rx', 3)
            .attr('ry', 3)
            .attr("stroke", "black")
            .attr('strokeWidth', 5)
            .style('fill', d=> d.color);

        bar.append("text")
            .attr("x", 5)
            .attr("y", heightResource/3)
            .style("font", "italic .75em sans-serif")
            .text(d=> d.name)
            .style('fill', d => d.fcolor);         
                        
        bar.append("text")
            .attr("x", 15)
            .attr("y", heightResource/3*2)
            .style("font", "italic .75em sans-serif")
            .text(d=>d.status)
            .style('fill', d => d.fcolor);  

        data.forEach( item => 
        {
            item.tasks.forEach((interval, i) => {
                var startdate: Date = new Date(interval.start);
                var stopdate: Date = new Date(interval.stop);
                startdate.setMonth(startdate.getMonth() + 1);
                stopdate.setMonth(stopdate.getMonth() + 1);
                var interv = xScale(stopdate) - xScale(startdate);
                
                let block=d3.select(".points") // для вывода задач
                    .append('g')
                    .attr('transform', `translate(${xScale(startdate)},${yScale(item.name)})`)
                    .on('click', function (d) {
                        if(typeof(context[interval.event]) === "function")
                            context[interval.event](this, interval);
                    });

                block.append("rect") // Стиль "точки", метод ON = создание системы эвентов
                    .attr("stroke", "black")
                    .attr('strokeWidth', 5)
                    .attr('width', interv)
                    .attr('height', heightResource)
                    .attr('rx', 3)
                    .attr('ry', 3)
                    .style('fill', interval.baseColor)
                    .append("title")
                    .text(interval.name);

                block.append("text")
                    .append('tspan')
                    .text(interval.name)
                    .attr("x", 5)
                    .attr("y", heightResource/2)
                    .attr('width', interv )
                    .each( wrap );
            });
        });

    },
    (error) =>      //Если ошибка
    {
        console.log(error);
    });

    function wrap(  ) { // функция для обрезания лишнего текста
        var self = d3.select(this),
            textLength = self.node().getComputedTextLength(),
            text = self.text();
        while ( ( textLength > self.attr('width') )&& text.length > 0) {
            text = text.slice(0, -1);
            self.text(text + '...');
            textLength = self.node().getComputedTextLength();
        }
    }