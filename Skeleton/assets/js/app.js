// D3 Scatterplot Assignment

// set up responsize window
d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

// The code for the chart is wrapped inside a function
// that automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads, remove it
    // and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }
    // Students:
    // =========
    // Follow your written instructions and create a scatter plot with D3.js.
    var svgWidth = 900;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart with margins
    var svg = d3.select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);   
    

    // Import Data
    var url = "https://raw.githubusercontent.com/the-Coding-Boot-Camp-at-UT/UTAUS201804DATA2-Class-Repository-DATA/master/16-D3/HOMEWORK/Instructions/data/data.csv?token=AcaP65wU9ky_4ms699pv8OBKjSk96_Tmks5bcXxYwA%3D%3D"

    d3.csv(url).then(successHandle, errorHandle);

    function errorHandle(error) {
        throw err;
    }

    function successHandle(healthData) {
           
        // Step 1: Parse Data/Cast as numbers
        // ==============================
        
        healthData.forEach(function (data) {
            data.income = +data.income;
            data.smokes = +data.smokes;
        });

        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d.income) - 10000, d3.max(healthData, d => d.income)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(healthData, d => d.smokes)])
            .range([height, 0]);


        // Step 3: Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);


        // Step 4: Append Axes to the chart
        // ==============================
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);


        // Step 5: Create Circles
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.income))
            .attr("cy", d => yLinearScale(d.smokes))
            .attr("r", "12")
            .attr("fill", "blue")
            .attr("opacity", ".5");


        // Step 6: Initialize tool tip
        // ==============================
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function (d) {
                return (`${d.state}<br>Med. Income: ${d.income}<br>Percent smokers: ${d.smokes}`);
            });

        // Step 7: Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
        circlesGroup.on("click", function (data) {
            toolTip.show(data);
        })
            // onmouseout event
            .on("mouseout", function (data, index) {
                toolTip.hide(data);
            });

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 45)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Percent Smokers");


        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
            .attr("class", "axisText")
            .text("Average Income");

        
        // event listener for mouseover
        circlesGroup.on("mouseover", function() {
            d3.select(this)
                  .attr("fill", "green");
          })
          // event listener for mouseout
          .on("mouseout", function() {
            d3.select(this)
                  .attr("fill", "blue");
        });
    }

}
