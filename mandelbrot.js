function map(x, in_min, in_max, out_min, out_max)
{
	return (out_max - out_min) / (in_max - in_min) * (x - in_min) + out_min;
}

function mandelbrot(canvas, xmin, xmax, ymin, ymax, iterations)
{
	var palette = []
	for (var i = 0; i <= iterations; i++)
	{
		palette.push([map(i, 0, iterations, 0, 10), map(i, 0, iterations, 75, 255), map(i, 0, iterations, 0, 70)])
	}
	palette.push([0, 0, 0]);
	
	var width = canvas.width;
	var height = canvas.height;
	
	var ctx = canvas.getContext('2d');
	var img = ctx.getImageData(0, 0, width, height);
	var pix = img.data;
 
	for (var ix = 0; ix < width; ++ix) {
		for (var iy = 0; iy < height; ++iy) {
			var x0 = xmin + (xmax - xmin) * ix / (width - 1);
			var y0 = ymin + (ymax - ymin) * iy / (height - 1);
			var x = 0.0;
			var y = 0.0;
			var iteration = 0;
			var max_iteration = 1000;
			
			var pix_pos = 4 * (width * iy + ix);
			
			while (x*x + y*y < 4  &&  iteration <= iterations)
			{
				xtemp = x*x - y*y + x0;
				y = 2*x*y + y0;
				x = xtemp;
				iteration++;
			}
			if (iteration == iterations)
			{
				pix[pix_pos] = 0;
				pix[pix_pos + 1] = 0;
				pix[pix_pos + 2] = 0;
			}
			else
			{
				color = palette[Math.floor(iteration)];
				pix[pix_pos] = color[0];
				pix[pix_pos + 1] = color[1];
				pix[pix_pos + 2] = color[2];
			}
			pix[pix_pos + 3] = 255;
		}
		
	}
	ctx.putImageData(img, 0, 0);
}
 
var canvas = document.getElementById('MandelbrotCanvas');
document.body.insertBefore(canvas, document.body.childNodes[0]);

var xmin = 0, ymin = 0, xmax = canvas.width, ymax = canvas.height;
var m_last_xmin = -2, m_last_ymin = -1, m_last_xmax = 1, m_last_ymax = 1;

canvas.addEventListener('dblclick', function(event) {xmin = 0; ymin = 0; xmax = canvas.width; ymax = canvas.height; m_last_xmin = -2; m_last_ymin = -1; m_last_xmax = 1; m_last_ymax = 1;}, false);
canvas.addEventListener('mousedown', function(event) {xmin = event.pageX; ymin = event.pageY;}, false);
canvas.addEventListener('mouseup', function(event)
{
	xmax = event.pageX;
	ymax = event.pageY;
	if (xmin > xmax)
	{
		var tmp = xmin;
		xmin = xmax;
		xmax = tmp;
	}
	if (ymin > ymax)
	{
		var tmp = ymin;
		ymin = ymax;
		ymax = tmp;
	}
	m_xmin = map(xmin, 0, canvas.width, m_last_xmin, m_last_xmax);
	m_xmax = map(xmax, 0, canvas.width, m_last_xmin, m_last_xmax);
	m_ymin = map(ymin, 0, canvas.height, m_last_ymin, m_last_ymax);
	m_ymax = map(ymax, 0, canvas.height, m_last_ymin, m_last_ymax);
	mandelbrot(canvas, m_xmin, m_xmax, m_ymin, m_ymax, 3 * 25 * 1 / (m_xmax - m_xmin));
	m_last_xmin = m_xmin; m_last_xmax = m_xmax; m_last_ymin = m_ymin; m_last_ymax = m_ymax;
}, false);
 
mandelbrot(canvas, -2, 1, -1, 1, 50);