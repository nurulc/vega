import * as d3 from "d3";
//Art inspired from https://bl.ocks.org/philipcdavis/b5224a272556fcb2d0c776b7a247ede4

const rays = 100;
const rayWidth = 0.02;
const cir = Math.PI * 2;
const chunk = cir / rays;

export const twirlData = d3.range(rays).map((d, i) => {
  return {
    startAngle: i * chunk,
    endAngle: i * chunk + rayWidth,
    outerRadius: 150 - i
  };
});

var arc = d3.arc().innerRadius(50);

const arcTween = (d, varient) => {
  //console.log(d.outerRadius);
  var interpolate = d3.interpolateNumber(10, d.outerRadius + varient);
  return function(t) {
    d.outerRadius = interpolate(t);
    return arc(d);
  };
};

export const endSimulation = svg => svg.selectAll(".piece").clear();

export const twirl = svg => {
  const data = d3.range(rays).map((d, i) => {
    return {
      startAngle: i * chunk,
      endAngle: i * chunk + rayWidth,
      outerRadius: 150 - i
    };
  });
  svg
    .selectAll(".piece")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "piece")
    .style("fill", "#70d5ad")
    .transition()
    .duration(2000)
    .delay(function(d, i) {
      return (i * 600) / 30;
    })
    .attrTween("d", function(d) {
      return arcTween(d, 0);
    })
    .on("start", function repeat() {
      d3.active(this)
        .transition()
        .duration(2000)
        .delay(function(d, i) {
          return (i * 600) / 30;
        })
        .attrTween("d", function(d) {
          var varient = d.outerRadius > 100 ? -15 : 15;
          return arcTween(d, varient);
        })
        .on("start", repeat);
    });
};
