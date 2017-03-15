/*list of cool points:

-0.7349550997530568 + 0.19704996476661696i
-1.2483144568121969 + 0.056351259616207i
0.23674750381213505 + 0.5185951970728484i
*/
var VERSION_NUM = "1.0"
var DEFAULTWIDTH = 1200;
var DEFAULTHEIGHT = 800;

function mandelbrot(canvas, xmin, xmax, ymin, ymax, iterations, resolution)
{
   
   
   var width = canvas.width;
   var height = canvas.height;
   
   var ctx = canvas.getContext('2d');
   var img = ctx.getImageData(0, 0, width, height);
   var pix = img.data;
 
   for (var ix = 0; ix < width / resolution; ix++) {
      for (var iy = 0; iy < height / resolution; iy++) {
         var x0 = map(ix, 0, width / resolution, xmin, xmax);
         var y0 = map(iy, 0, height / resolution, ymin, ymax);
         var x = 0.0;
         var y = 0.0;
         var iteration = 0;
         
         var pix_pos = 4 * (resolution * width * iy + resolution * ix);
         
         while (x*x + y*y < 16  &&  iteration <= iterations)
         {
            xtemp = x*x - y*y + x0;
            y = 2*x*y + y0;
            x = xtemp;
            iteration++;
         }
         if (iteration >= iterations)
         {
            for(var i = 0; i < resolution; i++)
            {
               for(var j = 0; j < resolution; j++)
               {
                  pix[pix_pos + (i * width + j) * 4] = 0;
                  pix[pix_pos + 1 + (i * width + j) * 4] = 0;
                  pix[pix_pos + 2 + (i * width + j) * 4] = 0;
               }
            }
         }
         else
         {
            for (var i = 0; i < 3; i++)
            {
               xtemp = x*x - y*y + x0;
               y = 2*x*y + y0;
               x = xtemp;
               iteration++;
            }
            var mu = iteration + 1 - Math.log(Math.log(Math.sqrt(x * x + y * y))) / Math.log(2);
            var color1 = Math.floor(mu) % palette.length;
            var color2 = (color1 + 1) % palette.length;
            var frac = mu % 1;
            if (palette[color1] == null) {console.log(iteration, xmin, ymin)};
            for (var i = 0; i < resolution; i++)
            {
               for (var j = 0; j < resolution; j++)
               {
                  pix[pix_pos + (i * width + j) * 4] = map(frac, 0, 1, palette[color1][0], palette[color2][0]);
                  pix[pix_pos + 1 + (i * width + j) * 4] = map(frac, 0, 1, palette[color1][1], palette[color2][1]);
                  pix[pix_pos + 2 + (i * width + j) * 4] = map(frac, 0, 1, palette[color1][2], palette[color2][2]);
               }
            }
         }
         for (var i = 0; i < resolution; i++)
         {
            for (var j = 0; j < resolution; j++)
            {
               pix[pix_pos + 3 + (i * width + j) * 4] = 255;
            }
         }
      }
   }
   ctx.putImageData(img, 0, 0);
}

function gencolors(iterations)
{
   var iterations_4 = iterations / 4;
   var palette = [];
   var yellow = [250, 225, 50];
   var white = [255, 255, 255];
   var tan = [220, 160, 60];
   var yellow = [250, 225, 50];
   var blue = [10, 10, 120];
   var tan = [220, 160, 60];
   for (var i = 0; i <= iterations; i++)
   {
      if (i < iterations_4) //from i = 0 to i = iterations / 8 - 1
      {
         //blue to tan
         palette.push(
         [map(i, 0, iterations_4, blue[0], tan[0]),
          map(i, 0, iterations_4, blue[1], tan[1]),
          map(i, 0, iterations_4, blue[2], tan[2])]);
      }
      else if (i < iterations_4 * 2.5) //from i = iterations / 4 to i = 5 * iterations / 8 - 1
      {
         //tan to yellow
         palette.push(
         [map(i, iterations_4, iterations_4 * 2.5, tan[0], yellow[0]),
          map(i, iterations_4, iterations_4 * 2.5, tan[1], yellow[1]),
          map(i, iterations_4, iterations_4 * 2.5, tan[2], yellow[2])]);
      }
      else //from i = iterations / 2 to i = iterations
      {
         //yellow to white
         palette.push(
         [map(i, iterations_4 * 2.5, iterations, yellow[0], white[0]),
          map(i, iterations_4 * 2.5, iterations, yellow[1], white[1]),
          map(i, iterations_4 * 2.5, iterations, yellow[2], white[2])]);
      }
   }
   return palette;
}

function drawmand(canvas, centerx, centery, zoom, reitr)
{
   var res = Math.floor(Math.pow(parseInt(document.getElementById('res').value) / 40, 2) + 1);
   //canvas.width = DEFAULTWIDTH / res;
   //canvas.height = DEFAULTHEIGHT / res;
   itr = reitr ? 80 / (Math.pow(zoomlevel, 0.2)) : itr;
   mandelbrot(canvas, -3 * zoomlevel + centerx, 3 * zoomlevel + centerx, -2 * zoomlevel - centery, 2 * zoomlevel - centery, itr, res);
}

function map(x, in_min, in_max, out_min, out_max)
{
   return (out_max - out_min) / (in_max - in_min) * (x - in_min) + out_min;
}

function gohome()
{
   zoomlevel = 1;
   itr = 80;
   centerx = -1;
   centery = 0;
   drawmand(canvas, centerx, centery, zoomlevel, true)
}

function zoom(level)
{
   zoomlevel = level;
   drawmand(canvas, centerx, centery, zoomlevel, true);
}

function zoom_auto()
{
   zoom(zoomlevel * 0.9);
}

function redraw()
{
   centerx = parseFloat(document.getElementById('centerx').value);
   centery = parseFloat(document.getElementById('centery').value);
   zoomlevel = parseFloat(document.getElementById('zoomlevel').value);
   drawmand(canvas, centerx, centery, zoomlevel, true);
}

function restrictInput(event)
{
   //var str = event.target.value;
   //var flt = parseFloat(str);
   //if (isNaN(flt)) {event.target.value = ""; return;}
   //event.target.value = flt.toString() + (str.charAt(str.length - 1) == '.' && str.indexOf('.') == (str.length - 1) ? '.' : '');
}
 
var canvas = document.getElementById('MandelbrotCanvas');
document.body.insertBefore(canvas, document.body.childNodes[0]);
var zoomlevel = 1;
var itr = 80;
var centerx = -1;
var centery = 0;
var centerchangeable = true;
var zooming = false;
var timer;
gohome();
document.getElementById('centerx').value = centerx;
document.getElementById('centery').value = centery;
document.getElementById('zoomlevel').value = zoomlevel;
document.getElementById('ver').innerHTML = "Version " + VERSION_NUM;

canvas.addEventListener('dblclick', function(event) {gohome();}, false);

canvas.addEventListener('wheel', function(event)
{
   zoomlevel /= (100 - (event.deltaY) / 25) / 100;
   var x = event.pageX - canvas.width / 2;
   var y = event.pageY - canvas.height / 2;
   x = (x ** 3) * zoomlevel / 10;
   y = (y ** 3) * zoomlevel / 10;
   if (centerchangeable)
   {
      var dx = map(x, ((-canvas.width / 2) ** 3) * 0.05, ((canvas.width / 2) ** 3) * 0.05, -0.075, 0.075) * Math.abs(event.deltaY / 50);
      var dy = map(y, ((-canvas.height / 2) ** 3) * 0.05, ((canvas.height / 2) ** 3) * 0.05, -0.05, 0.05) * Math.abs(event.deltaY / 50);
      centerx += event.deltaY < 0 ? dx : -dx;
      centery -= event.deltaY < 0 ? dy : -dy;
   }
   drawmand(canvas, centerx, centery, zoomlevel, false);
   document.getElementById('centerx').value = centerx.toString();
   document.getElementById('centery').value = centery.toString();
   document.getElementById('zoomlevel').value = zoomlevel.toString();
}, false);

document.addEventListener('keydown', function(event) {
   if (event.key == 'r')
   {
      redraw();
   }
   if (event.key == 'l')
   {
      centerchangeable = !centerchangeable;
   }
   if (event.key == 'z')
   {
      if (zooming)
      {
         window.clearInterval(timer);
         zooming = false;
      }
      else
      {
         timer = window.setInterval(zoom_auto, 100);
         zooming = true;
      }
   }
}, false);