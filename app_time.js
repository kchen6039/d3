$(document).ready(function () {

		var svgHeight = '500';
		var svgWidth = '1200';
		var barPadding = '1';

		function createSvg(parent, height, width) {
			return d3.select(parent)
					 .append('svg')
					 .attr('height', height)
					 .attr('width', width);
		}

		var svg = createSvg('div#mp3_player', svgHeight, svgWidth);
		
		var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		var audioElement = document.getElementById('audioElement');
		var audioSrc = audioCtx.createMediaElementSource(audioElement);
		var analyser = audioCtx.createAnalyser();
	
		var timeDomainData = new Uint8Array(analyser.fftSize);
		console.log(analyser.fftSize);
		
		var bars = analyser.fftSize/16;
		
		// Bind our analyser to the media element source.
		audioSrc.connect(analyser);
		analyser.connect(audioCtx.destination);
		
		// Create our initial D3 chart.
		svg.selectAll('rect')
		   .data(timeDomainData)
		   .enter()
		   .append('rect')
		   .attr('x', function (d, i) {
			  return i * (svgWidth / bars);
		   })
		   .attr('width', svgWidth / bars - barPadding);
		  
		   // Continuously loop and update chart with time domain data.
function renderChart() {
   requestAnimationFrame(renderChart);

   // Copy time domain data to timeDomainData array.
   analyser.getByteTimeDomainData(timeDomainData); 

   //console.log(timeDomainData)
   // Update d3 chart with new data.
   svg.selectAll('rect')
      .data(timeDomainData)
      .attr('y', function(d) {
         return svgHeight - d;
      })
      .attr('height', function(d) {
		 //console.log(d);
         return d;
      })
	  .attr('fill', function(d) {
         return 'rgb(0, 204, ' + d + ')';
      });
}

// Run the loop
renderChart();
		  	  
});