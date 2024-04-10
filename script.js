let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
let req = new XMLHttpRequest()

let data = []


let heightScale
let xScale
let xAxisScale
let yAxisScale

let width = 800
let height = 600
let padding = 40 

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let drawCanvas =() => {
    svg.attr('width',width)
    svg.attr('height',height)
}

let generateScales = () => {
    xScale = d3.scaleLinear()
    .domain([d3.min(data, (d) => d.Year)-1, d3.max(data, (d) => d.Year)+1])
    .range([padding, width - padding]);

    yScale = d3.scaleLinear()
    .domain([d3.max(data, (d) => new Date (d['Seconds']*1000)), d3.min(data, (d) => new Date (d['Seconds']*1000-1))])
    .range([height - padding, padding]);



}

let drawDots = ()=> {
    svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr('class','dot')
    .attr('data-xvalue', (d)=> {return d.Year})
    .attr('data-yvalue', (d)=> {return new Date (d['Seconds']*1000)})
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy",(d) => yScale(new Date (d['Seconds']*1000)))
    .attr("r", (d) => 5)
    .attr('fill',(d)=> {
        if (d.Doping != ''){
            return 'rgb(244,91,105)'
        }else {return 'rgb(64,98,187)'}
    })

    .on ('mouseover',(d)=>{
        tooltip.transition()
                .style('visibility', 'visible')
        if (d.Doping != ''){
            tooltip.text(d.Year + " | " + d.Name + " | " + d.Time + " | " + d.Doping )
        } else {
            tooltip.text(d.Year + " | " + d.Name + " | " + d.Time + " | No Allegations" )
        }

        tooltip.attr('data-year',d.Year)


    })

    .on ('mouseout', (d) => {
        tooltip.transition()
        .style('visibility', 'hidden')
    })



}

let generateAxes = ()=> {
       
       let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
       svg.append('g')
           .call(xAxis) 
           .attr('id','x-axis')
           .attr('transform','translate(0,' + (height-padding) + ')')


        let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis)
            .attr('id','y-axis')
   
   

}

req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    console.log(data)
    drawCanvas()
    generateScales()
    generateAxes()
    drawDots()
    
}
req.send()