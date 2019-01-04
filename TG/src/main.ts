import * as d3 from 'd3'
import {Resource} from './resource'
import {context} from './callback'
import { selection, transition } from 'd3';

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


var drag = d3.drag()
  .on("start", onStart)
  .on("drag", onDrag)
  .on("end", onEnd);

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
                    .attr("x", heightResource*2 - 10)
                    .attr("y", heightResource/3)
                    //.style("font", "italic .75em sans-serif")
                    .text(item.name)
                    .style('fill', item.fcolor);

                bar.append('text')
                    .attr("x", heightResource*2 - 10)
                    .attr("y", heightResource/3*2)
                    //.style("font", "italic .75em sans-serif")
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
                    .attr('xcoord', xScale(startdate))
                    .attr('ycoord', yScale(item.name) + plotMargins.top/data.length)
                    .on('click', function (d) {
                        if(typeof(context[interval.event]) === "function")
                            context[interval.event](this, interval);
                    })
                    .call(drag);

                block.append("rect") // Стиль "точки", метод ON = создание системы эвентов
                    .classed('pointRect', true)
                    .attr('width', interv)
                    .attr('height', heightResource)
                    .style('fill', interval.baseColor)
                    .attr('constWidth', interv)
                    .attr('stroke', 'black')
                    .append("title")
                    .text(interval.name);

                block.append("text")
                    .append('tspan')
                    .classed('pointText', true)
                    .attr('constText', interval.name)
                    .attr("x", 5)
                    .attr("y", heightResource/2)
                    .attr('width', interv )
                    .text(wrap);
            });
        });
    },
    (error) =>      //Если ошибка
    {
        console.log(error);
    });

    //Здесь должнен быть guреализован Zoom time-лайна
    function zoomed() {
        pointsGroup.selectAll('.point')
        .each (function() {
            var x = +d3.select(this).attr("xcoord");
            var y = +d3.select(this).attr("ycoord");
            var tempscale = 1/d3.event.transform.k;
            var constWidth = +d3.select(this).select('.pointRect').attr('constWidth');
            d3.select(this).select('.pointRect').attr('width', constWidth * d3.event.transform.k);
            d3.select(this).select('.pointText')
                .attr('width', constWidth * d3.event.transform.k)
                .text(wrap);
                
            var tempTransform = 'translate ('+x+','+y+') scale ('+tempscale+',1)';
            d3.select(this).attr('transform', tempTransform);
        });
        pointsGroup.attr("transform", 'translate('+d3.event.transform.x+',0) scale('+d3.event.transform.k+',1)');
        xAxisGroup.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
    }

    function wrap( ) {
        var text = d3.select(this).attr('constText');
        var width = +d3.select(this).attr('width');
        if (text.length*10 < width) {
            return text;
        }
        else {
            if (width < 60)
                return '...';
            else
                return text.substring(0,width/10)+'..';
        }
    }

    function onStart() {
        d3.select(this).raise().classed("active", true);
      }
      
      function onDrag() {
          var tempTrans = d3.select(this).attr('transform');
          var requiredString = tempTrans.substring(tempTrans.indexOf("(") + 1, tempTrans.indexOf(","));
          d3.select(this).attr('xcoord', d3.event.x);
          d3.select(this).attr('transform', tempTrans.replace(requiredString, d3.event.x));
          console.log(tempTrans);
      }
      
      function onEnd() {
        d3.select(this).classed("active", false);
      }