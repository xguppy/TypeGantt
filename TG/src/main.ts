import * as d3 from 'd3'
import {Resource} from './resource'
import {context} from './callback'
import { selection } from 'd3';

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

// Ширина графика
let plotWidth = width - plotMargins.left - plotMargins.right;
// Высота графика
let plotHeight = height - plotMargins.top - plotMargins.bottom;

//Временно: зададим временные границы оси времени
let startDate: Date = new Date(2018, 10, 25);
let endDate: Date = new Date(2018, 10, 26);

//Объект - зум (для зума шкалы времени и графика в целом)
let zoom = d3.zoom()
    .scaleExtent([1, 5])
    .extent([[0, 0], [plotWidth, plotHeight]])
    .translateExtent([[0, 0], [plotWidth, plotHeight]])
    .on('zoom', zoomed);

//svg.call(zoom);

// Теперь определим размеры оси, и определим, то что ось временная
let xScale = d3.scaleTime()
    .range([0, plotWidth])
    .domain([startDate, endDate]);

let yScale = d3.scaleBand()
    .range([0, plotHeight]);

let drawSpace = plotGroup
    .append('svg')
    .attr('width', plotWidth)
    .attr('height', plotHeight);

//Опредлим ось X, зададим 24 тика на оси от 00 часов до 00 часов
let xAxis = d3.axisTop(xScale).ticks(25).tickFormat(d3.timeFormat("%H:%M"));

let xAxisGroup = plotGroup.append('g')
    .attr('color', 'black')
    .classed('x', true)
    .classed('axis', true)
    .attr('transform', `translate(${0},${0})`)
    .call(xAxis);

//Аналогично для оси ресурсов
let yAxis= d3.axisLeft(yScale);

let yAxisGroup = plotGroup.append('g')
    .attr('color', 'black')
    .classed('y', true)
    .classed('axis', true)
    .call(yAxis);

//Определяем пространство рисования точек
let pointsGroup = drawSpace.append('g')
    .classed('points', true);

svg.call(zoom);

d3.json<Resource[]>('tasks.json').then((data)=>
    {
        yScale.domain(data.map(d => d.name));  //Добавил на ось
        //yAxisGroup.call(yAxis); //Обновим ось

        data.forEach( item => { //запускаем цикл по ресурсам

            var bar = d3.select('.y')
                .append('g')
                .classed('resourse', true)
                    .attr("transform", `translate(${-widthResource}, ${yScale(item.name) + plotMargins.top/data.length})`);

                bar.append('rect')
                    .attr('width', widthResource)
                    .attr('height', heightResource)
                    .attr('stroke', 'black')
                    .style('fill', item.color);

                bar.append('text')
                    .attr("x", 5)
                    .attr("y", heightResource/3)
                    .style("font", "italic .75em sans-serif")
                    .text(item.name)
                    .style('fill', item.fcolor);

                bar.append('text')
                    .attr("x", 15)
                    .attr("y", heightResource/3*2)
                    .style("font", "italic .75em sans-serif")
                    .text(item.status)
                    .style('fill', item.fcolor);

            item.tasks.forEach((interval) => { //запускаем цикл по задачам очередного ресурса
                var startdate: Date = new Date(interval.start);
                var stopdate: Date = new Date(interval.stop);
                startdate.setMonth(startdate.getMonth() + 1);
                stopdate.setMonth(stopdate.getMonth() + 1);
                var interv = xScale(stopdate) - xScale(startdate);
                
                let block = pointsGroup // для вывода задач
                    .append('g')
                    .classed('point', true)
                    .attr('transform', `translate(${xScale(startdate)},${yScale(item.name) + plotMargins.top/data.length})`)
                    .attr('y', yScale(item.name) + plotMargins.top/data.length)
                    .on('click', function (d) {
                        if(typeof(context[interval.event]) === "function")
                            context[interval.event](this, interval);
                    });

                block.append("rect") // Стиль "точки", метод ON = создание системы эвентов
                    .classed('pointRect', true)
                    .attr('width', interv)
                    .attr('height', heightResource)
                    .style('fill', interval.baseColor)
                    .attr('stroke', 'black')
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
        //enterSelection.merge(dataBound); //Обновим все точки и отрисуем на графике
    },
    (error) =>      //Если ошибка
    {
        console.log(error);
    });

    //Здесь должнен быть guреализован Zoom time-лайна
    function zoomed() {
        d3.event.transform.y = 0;
        //pointsGroup.selectAll('.point')
            //.each (function() {
            //    var x = +d3.select(this).attr("x");
            //var y = +d3.select(this).attr("y");
            //d3.select(this).attr("transform", 'translate('+x+','+y+')');
            //var newWidth = +d3.select(this).select('.pointRect').attr('width');
            //d3.select(this).select('.pointRect').attr('width', newWidth * d3.event.transform.k);
            //console.log(newWidth);
            //});

        pointsGroup.attr("transform", 'translate('+d3.event.transform.x+',0) scale('+d3.event.transform.k+',1)');
        xAxisGroup.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
    }
    
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