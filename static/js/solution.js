class Fraction {
    constructor(a, b) {
        this.numerator = a;
        this.denominator = b;
    }
}

function solve(params) {
    showFunc(params);
    $('function').fadeIn();
    $('#graph').fadeIn();
    window.scrollTo(0, document.body.scrollHeight);
}

function gcd(a, b){
    if(b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

function simplify(frac) {
    var tempa = frac.denominator.denominator;
    var tempb = frac.numerator.denominator;
    if (tempa != undefined) {
        frac.denominator = frac.denominator.numerator;
        frac.numerator *= tempa;
    }
    if (tempb != undefined) {
        frac.numerator = frac.numerator.numerator;
        frac.denominator *= tempb;
    }
    var hcf = gcd(frac.numerator, frac.denominator);
    var a = frac.numerator;
    var b = frac.denominator;
    a /= hcf;
    b /= hcf;
    if (a == 1 && b == 1) {
        return '';
    }
    if (b == 1) {
        return a;
    }
    return `\\frac{${a}}{${b}}`
}

function showFunc(params) {
    var P0 = parseInt(params['initial']);
    var P = parseInt(params['sample-pop']);
    var M = parseInt(params['capacity']);
    var t = parseInt(params['sample-time']);
    var x = parseInt(params['arg']);

    var A = new Fraction(M - P0, P0);
    var A_math = (M - P0)/P0;
    var A_txt = simplify(A);

    var AP = new Fraction(P * (M - P0), P0);

    var MPAP = simplify(new Fraction(M - P, AP));

    var coeff = simplify(new Fraction(1, t));
    
    var func = `\\frac{${M}}{1+${A_txt}(${MPAP})^{${coeff}t}}`
    $('function').text(`$$P(t) = ${func}$$`);
    var coords;
    if (params['question'] == 'time') {
        var ans = M/(1 + A_math*Math.pow((M - P)/(A_math * P), x/t));
        var rans = Math.round(ans);
        coords = [x, rans];
        $('function').append(`$$P(${x}) = ${rans}$$`);
        $('function').append(`Therefore, the population is ${rans} after ${x} ${params['unit']+(x != 1 ? 's' : '')}.`);
    } else {
        $('function').append(`$$${x} = ${func}$$`);
        var ans = t * Math.log((M - x)/(A_math * x))/Math.log((M - P)/(A_math * P));
        var rans = Math.round(1000 * ans)/1000;
        coords = [rans, x];
        $('function').append(`$$t ${ans == rans ? '=' : '\\approx'} ${rans}$$`);
        if (rans == Infinity) {
            rans = 'an infinite number of'
        }
        $('function').append(`Therefore, when the population is ${x}, ${rans} ${params['unit']+(x != 1 ? 's' : '')} would've passed.`);
        if (x == M) {
            $('function').append('<br>The carrying capacity is an asymptote, the population will technically never reach it!');
        }
    }
    MathJax.typeset();
    graph(params, coords);
}

function generate(params) {
    data = [];
    var P0 = parseFloat(params['initial']);
    var P = parseFloat(params['sample-pop']);
    var M = parseFloat(params['capacity']);
    var t = parseFloat(params['sample-time']);
    var A = (M - P0)/P0;

    var x = 0;
    var domain = 1.1 * t * Math.log((0.00001)/(A * (M - 0.00001)))/Math.log((M - P)/(A * P));
    var step = domain/960;
    while (x <= domain) {
        var y = Math.max(Math.round(1000 * M/(1 + A*Math.pow((M - P)/(A * P), x/t)))/1000, 0)
        data.push([Math.round(1000 * x)/1000, y]);
        x += step;
    }
    console.log(x);
    return data;
}

function graph(params, coords) {
    $('#graph').empty();
    var w = 960;
    var h = 540;
    var padding = 60;

    var data = generate(params);

    let svg = d3.select('#graph');

    var xScale = d3.scaleLinear().domain(d3.extent(data, function(d) {return d[0];})).range([padding + 20, w - padding - 20]);
    var yScale = d3.scaleLinear()
        .domain([
            d3.min(data, function(d) {return d[1];}), 
            (21 * d3.max(data, function(d) {return d[1];}) - d3.min(data, function(d) {return d[1];}))/20
        ])
        .range([h - padding, padding]);
    
    svg.append('clipPath')
        .attr('id', 'chart-area')
        .append('rect')
        .attr('x', padding)
        .attr('y', padding)
        .attr('width', w - 2 * padding + 40)
        .attr('height', h - 2 * padding);

    let line_func = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))
        .curve(d3.curveNatural);
    svg.append('path')
        .datum(data)
        .attr('clip-path', 'url(#chart-area)')
        .attr('fill', 'none')
        .attr('stroke', $(':root').css('--theme'))
        .attr('stroke-width', 2)
        .attr('d', line_func);
    
    svg.append('text')
        .attr('x', w/2)
        .attr('y', 520)
        .text('Time');
    svg.append('text')
        .attr('x', 20)
        .attr('y', h/2)
        .attr('transform', `rotate(-90, 30, ${h/2})`)
        .text('Population');

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);
    
    svg.append('g')
        .attr('transform', `translate(0, ${h - padding})`)
        .call(xAxis);
    svg.append('g')
        .attr('transform', `translate(${padding + 20}, 0)`)
        .call(yAxis);
    
    let totalLength = svg.select('path').node().getTotalLength();

    svg.select('path')
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);

    svg.append('g')
        .append('circle')
        .style('fill', 'none')
        .attr('r', 6)
        .attr('class', 'point')
        .attr('cx', xScale(coords[0]))
        .attr('cy', yScale(coords[1]))
        .attr('opacity', 0)
        .transition()
        .delay(2000*coords[0]/d3.max(data, function(d) {return d[0];}))
        .duration(400)
        .attr('opacity', 1);
    svg.append('g')
        .append('text')
        .attr('text-anchor', 'left')
        .attr('alignment-baseline', 'middle')
        .html(coords[0] + ', ' + coords[1])
        .attr('x', xScale(coords[0])+15)
        .attr('y', yScale(coords[1]))
        .attr('opacity', 0)
        .transition()
        .delay(2000*coords[0]/d3.max(data, function(d) {return d[0];}))
        .duration(400)
        .attr('opacity', 1);
    
    var bisect = d3.bisector(function(d) {return d[0];}).left;

    var focusXLine = svg.append('g')
        .append('rect')
        .attr('class', 'focusLine')
        .attr('width', '1px');
    var focusYLine = svg.append('g')
        .append('rect')
        .attr('class', 'focusLine')
        .attr('height', '1px');
    var focusCircle = svg.append('g')
        .append('circle')
        .attr('class', 'focusPoint')
        .attr('r', 4)
        .style("opacity", 0);
    var focusText = svg.append('g')
        .append('text')
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle");

    svg.append('rect')
        .attr('class', 'listening-rect')
        .attr('x', padding + 20)
        .attr('y', padding)
        .attr('width', w - 2 * padding - 40)
        .attr('height', h - 2 * padding)
        .on('mouseover', () => {
            focusXLine.style('opacity', 1);
            focusYLine.style('opacity', 1);
            focusCircle.style('opacity', 1);
            focusText.style('opacity', 1);
        })
        .on('mousemove', (event) => {
            var x0 = xScale.invert(d3.pointer(event)[0]);
            var i = bisect(data, x0, 1);
            selectedData = data[i];
            focusXLine.attr('x', xScale(selectedData[0])-0.5)
                .attr('y', yScale(selectedData[1])-0.5)
                .attr('height', h - padding - yScale(selectedData[1])+0.5);
            focusYLine.attr('x', padding+19.5)
                .attr('y', yScale(selectedData[1])-0.5)
                .attr('width', xScale(selectedData[0]) - padding - 19.5);
            focusCircle.attr('cx', xScale(selectedData[0]))
                .attr('cy', yScale(selectedData[1]));
            focusText.attr('x', xScale(selectedData[0])+15)
                .attr('y', yScale(selectedData[1]))
                .html(selectedData[0] + ', ' + selectedData[1]);
        })
        .on('mouseout', () => {
            focusXLine.style('opacity', 0);
            focusYLine.style('opacity', 0);
            focusCircle.style('opacity', 0);
            focusText.style('opacity', 0);
        });

    
    return svg.node()
}