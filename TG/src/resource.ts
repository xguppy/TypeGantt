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
  /*  
const width = 960;
const height = 480;
    
let svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
    
let plotMargins = 
{
    top: 30,
    bottom: 30,
    left: 150,
    right: 30
};
let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);
    
let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;
    
let xScale = d3.scaleTime()
    .range([0, plotWidth]);
let xAxis = d3.axisBottom(xScale);
let xAxisGroup = plotGroup.append('g')
    .classed('x', true)
    .classed('axis', true)
    .attr('transform', `translate(${0},${plotHeight})`)
    .call(xAxis);


let list:string[]=[];
d3.json<Resource[]>('\src\tasks.json').then((data)=>
{
    for(var i=0; i<data.length; i++)
    {
        var s=JSON.stringify(data[i].name);
        list.push(s);
    }
        
});

let yScale = d3.scaleBand()
.domain(list)
.range([plotHeight, 0]);
let yAxis=d3.axisLeft(yScale);
let yAxisGroup = plotGroup.append('g')
    .classed('y', true)
    .classed('axis', true)
    .call(yAxis);*/