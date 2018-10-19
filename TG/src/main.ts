import * as d3 from 'd3'
var height :number = 500;
var width: number = 500;

var margin: number = 25;
var offset: number = 50;

var axisWidth: number = width - 2* margin;
var svg;
createAxes();

function createAxes(): void
{
    svg = d3.select("body").append("svg")
                           .attr("class", "axis")
                           .attr("width", width)
                           .attr("height", height);
    // функция интерполяции времени на оси
    var scale = d3.timeFormat
}