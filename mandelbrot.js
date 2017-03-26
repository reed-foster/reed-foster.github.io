/*list of cool points:

-0.7349550997530568 + 0.19704996476661696i
-1.2483144568121969 + 0.056351259616207i
0.23674750381213505 + 0.5185951970728484i
*/
var VERSION_NUM = "1.0";

function mandelbrot(canvas, min, max, iterations, resolution)
{
   var palette = gencolors(iterations);
   var width = canvas.width;
   var height = canvas.height;
   var ctx = canvas.getContext('2d');
   var img = ctx.getImageData(0, 0, width, height);
   var pix = img.data;

   for (var ire = 0; ire < width / resolution; ire++)
   {
      for (var iim = 0; iim < height / resolution; iim++)
      {
         var z0 = {re : map(ire, 0, width / resolution, min.re, max.re), im : map(iim, 0, height / resolution, min.im, max.im)};
         var z = {re : 0.0, im : 0.0};
         var iteration = 0;

         var pix_pos = 4 * (resolution * width * iim + resolution * ire);

         while (z.re * z.re + z.im * z.im < 16 && iteration <= iterations)
         {
            z = iteratedfunc(z, z0);
            iteration++;
         }
         if (iteration >= iterations)
         {
            pix = drawpix(pix, pix_pos, resolution, width, 0, 0, 0);
         }
         else
         {
            for (var i = 0; i < 3; i++)
            {
               z = iteratedfunc(z, z0);
               iteration++;
            }
            var mu = iteration + 1 - Math.log(Math.log(Math.sqrt(z.re * z.re + z.im * z.im))) / Math.log(2);
            var color1 = Math.floor(mu) % palette.length;
            var color2 = (color1 + 1) % palette.length;
            var frac = mu % 1;
            pix = drawpix(pix, pix_pos, resolution, width, map(frac, 0, 1, palette[color1][0], palette[color2][0]), map(frac, 0, 1, palette[color1][1], palette[color2][1]), map(frac, 0, 1, palette[color1][2], palette[color2][2]));
         }
      }
   }
   ctx.putImageData(img, 0, 0);
}

function julia(canvas, min, max, c, iterations, resolution)
{
   var palette = gencolors(iterations);
   var width = canvas.width;
   var height = canvas.height;

   var ctx = canvas.getContext('2d');
   var img = ctx.getImageData(0, 0, width, height);
   var pix = img.data;

   for (var ire = 0; ire < width / resolution; ire++)
   {
      for (var iim = 0; iim < height / resolution; iim++)
      {
         var z = {re : 0.0, im : 0.0};
         var iteration = 0;

         var pix_pos = 4 * (resolution * width * iim + resolution * ire);

         while (z.re * z.re + z.im * z.im < 16 && iteration <= iterations)
         {
            z = iteratedfunc(z, c);
            iteration++;
         }
         if (iteration >= iterations)
         {
            pix = drawpix(pix, pix_pos, resolution, width, 0, 0, 0);
         }
         else
         {
            for (var i = 0; i < 3; i++)
            {
               z = iteratedfunc(z, c);
               iteration++;
            }
            var mu = iteration + 1 - Math.log(Math.log(Math.sqrt(z.re * z.re + z.im * z.im))) / Math.log(2);
            var color1 = Math.floor(mu) % palette.length;
            var color2 = (color1 + 1) % palette.length;
            var frac = mu % 1;
            pix = drawpix(pix, pix_pos, resolution, width, map(frac, 0, 1, palette[color1][0], palette[color2][0]), map(frac, 0, 1, palette[color1][1], palette[color2][1]), map(frac, 0, 1, palette[color1][2], palette[color2][2]));
         }
      }
   }
   ctx.putImageData(img, 0, 0);
}

function iteratedfunc(z, c) {
   return {re : z.re * z.re - z.im * z.im + c.re, im : 2 * z.re * z.im + c.im};
}

function drawpix(pixdat, pos, resolution, width, R, G, B) {
   for (var i = 0; i < resolution; i++)
   {
      for (var j = 0; j < resolution; j++)
      {
         pixdat[pos + (i * width + j) * 4] = R;
         pixdat[pos + 1 + (i * width + j) * 4] = G;
         pixdat[pos + 2 + (i * width + j) * 4] = B;
         pixdat[pos + 3 + (i * width + j) * 4] = 255;
      }
   }
   return pixdat;
}

function gencolors(iterations)
{
   var iterations_4 = iterations / 4;
   var palette = [];
   var yellow = [250, 225, 50];
   var white = [255, 255, 255];
   var tan = [220, 160, 60];
   var blue = [10, 10, 120];
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
   var res = Math.floor(Math.pow((100 - parseInt(document.getElementById('res').value)) / 40, 2) + 1);
   itr = reitr ? 80 / (Math.pow(zoomlevel, 0.2)) : itr;
   mandelbrot(canvas, {re : -3 * zoomlevel + centerx, im : -2 * zoomlevel - centery}, {re : 3 * zoomlevel + centerx, im : 2 * zoomlevel - centery}, itr, res);
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
   drawmand(canvas, centerx, centery, zoomlevel, true);
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

canvas.addEventListener('wheel', function(event) {
   zoomlevel /= (100 - (event.deltaY) / 25) / 100;
   
   var x = event.pageX - canvas.width / 2;
   var y = event.pageY - canvas.height / 2;
   x = (x * x * x) * zoomlevel / 10;
   y = (y * y * y) * zoomlevel / 10;
   if (centerchangeable) {
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
   if (event.key == 'r') {
      redraw();
   }
   if (event.key == 'l') {
      centerchangeable = !centerchangeable;
   }
   if (event.key == 'z') {
      if (zooming) {
         window.clearInterval(timer);
         zooming = false;
      } else {
         timer = window.setInterval(zoom_auto, 100);
         zooming = true;
      }
   }
}, false);