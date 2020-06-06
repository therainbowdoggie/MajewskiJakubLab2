const Drawing = () => {
    const points = [];
    let drawing = false;

    const getDrawing = () => drawing;
    const setDrawing = (value) => drawing = value;
    const reset = () => points.length = 0;
    const getLength = () => points.length;
    const getPoint = (i) => points[i];
    const setPoint = (x, y, dragging, color, brush, size) => {
        points.push({
            x,
            y,
            dragging,
            color,
            brush,
            size
        });
    };

    return {
        getPoint,
        setPoint,
        getLength,
        reset,
        getDrawing,
        setDrawing
    }
};

const CanvasObj = () => {
    const img = new Image();
    let imgWidth = 0;
    let imgHeight = 0;
    let centerY = 0;
    let lastX;
    let lastY;

    const saveToImg = () => {
        const downloadLink = document.querySelector('.savePainting');

        downloadLink.setAttribute('download', 'myCanvas.png');
        downloadLink.setAttribute('href', canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream'));

        downloadLink.click();
    };


    const hideUploadBtn = () => {
        document.querySelector('.imageLoaderLabel').classList.add('imageLoaderLabel--hide');
    };


    const onLoadImage = function () {
        imgWidth = img.width;
        imgHeight = img.height;

        imgHeight *= imgUploadField.offsetWidth / imgWidth;
        imgWidth = imgUploadField.offsetWidth;

        canvas.width = imgUploadField.offsetWidth;
        canvas.height = imgUploadField.offsetHeight;

        centerY = (canvas.height - imgHeight) / 2;

        ctx.drawImage(img, 0, centerY, imgWidth, imgHeight);

        hideUploadBtn();
    };

 
    const handleImage = function (e) {
        const reader = new FileReader();
        reader.onload = function (event) {
            img.onload = onLoadImage;
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    };

 
    const draw = function (x, y, brush, color, size, start) {
        ctx.beginPath();
        ctx.lineWidth = size;
        ctx.lineJoin = 'round';
        ctx.fillStyle = ctx.strokeStyle = color;

        if (brush === 'square') {
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
        } else {
            if (start) {
                ctx.moveTo(x - 1, y - 1);
            } else {
                ctx.moveTo(lastX, lastY);
            }
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }

        lastX = x;
        lastY = y;
    };

    const clear = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.filter = 'none';
        ctx.drawImage(img, 0, centerY, imgWidth, imgHeight);
    };

    const redraw = function () {
        const brightness = userSettingss.getBrightness();
        const contrast = userSettingss.getContrast();
        const blur = userSettingss.getBlur();

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
        ctx.filter = 'none';

        if (brightness !== false || contrast !== false || blur !== false) {
            const brFilter = brightness !== false ? `brightness(${brightness}%) ` : '';
            const ctFilter = contrast !== false ? `contrast(${contrast}%) ` : '';
            const blFilter = blur !== false ? `blur(${blur}px)` : '';

            ctx.filter = `${brFilter}${ctFilter}${blFilter}`;
        }

        ctx.drawImage(img, 0, centerY, imgWidth, imgHeight);

        for (let i = 0; i < userDrawing.getLength(); i++) {

            const currentPoint = userDrawing.getPoint(i);
            const previousPoint = userDrawing.getPoint(i - 1);
            const dragging = currentPoint.dragging;
            const brush = currentPoint.brush;

            ctx.lineJoin = brush;

            ctx.beginPath();

            if (dragging === true && i > 0) {
                ctx.moveTo(previousPoint.x, previousPoint.y);
            } else {
                ctx.moveTo(currentPoint.x - 1, currentPoint.y);
            }

            ctx.strokeStyle = currentPoint.color;
            ctx.lineWidth = currentPoint.size;
            ctx.lineTo(currentPoint.x, currentPoint.y);
            ctx.closePath();
            ctx.stroke();

        }
    };

    return {
        draw,
        redraw,
        saveToImg,
        handleImage,
        clear
    }
};


const Settings = () => {
    let color = "#ffffff";
    let brush = 'round';
    const defaultSize = 5;
    let size = defaultSize;

    const getColor = () => color;
    const setColor = (newColor) => color = newColor;

    const getSize = () => size;
    const setSize = (newSize, callback) => {
        if (newSize === 'default') {
            size = defaultSize;
        } else {
            size = parseInt(newSize);
        }

        if (callback) {
            callback();
        }
    };

    const getBrush = () => brush;
    const setBrush = (newBrush) => brush = newBrush;

 


    return {
        getColor,
        setColor,
        getSize,
        setSize,
        getBrush,
        setBrush,
    }
};

const imageLoader = document.querySelector('.imageLoader');
const imgUploadField = document.querySelector('.imageUpload');
const brushCircle = document.querySelector('.tBarBrushCircle');
const brushSquare = document.querySelector('.tBarBrushSquare');
const paletteSelector = document.getElementById('pickColor');
const sizeBtn = document.getElementById('sizeRange');
const clearBtn = document.querySelector('.tBarClear');
const saveBtn = document.querySelector('.tBarSave');
const canvas = document.querySelector('.imageCanvas');
const ctx = canvas.getContext('2d');
const canvasData = ctx.getImageData(0, 0, 1176, 672)

//Inicjalizacja głównych obiektów aplikacji
const userSettings = Settings();
const userDrawing = Drawing();
const userCanvas = CanvasObj();

// Funkcja która resetuje filtry, dane obiektu userDrawing i canvas
const clearCanvas = () => {
  userDrawing.reset();
  userCanvas.clear();
};

// Funkcja która zapisuje każde działania użytkownika na canvasie
const addClick = function (x, y, dragging) {
  const color = userSettings.getColor();
  const size = userSettings.getSize();
  const brush = userSettings.getBrush();

  userDrawing.setPoint(x, y, dragging, color, brush, size);
};

// Funkcja obsługująca mouseMove event na canvasie. Przy spełnionym warunku, że myszka została naciśnięta, definuje pozycję myszki według canvasu, zapisuje te dane przy pomocy addClick i rysuje to na canvasie przy pomocy metody draw w obiekcie userCanvas
const mouseMoveHandler = function (e) {
  if (userDrawing.getDrawing() === true) {
    const offsetLeft = (window.innerWidth - this.offsetWidth) / 2;
    const offsetTop = (window.innerHeight - this.offsetHeight) / 2;
    const mouseX = e.pageX - offsetLeft;
    const mouseY = e.pageY - offsetTop;

    addClick(mouseX, mouseY, true);
    userCanvas.draw(mouseX, mouseY, userSettings.getBrush(), userSettings.getColor(), userSettings.getSize());
  }
};

// Funkcja obsługująca mouseDown event na canvasie. Definuje pozycję myszki według canvasu, zapisuje te dane przy pomocy addClick i rysuje to na canvasie przy pomocy metody draw w obiekcie userCanvas
const mouseDownHandler = function (e) {
  const offsetLeft = (window.innerWidth - this.offsetWidth) / 2;
  const offsetTop = (window.innerHeight - this.offsetHeight) / 2;
  const mouseX = e.pageX - offsetLeft;
  const mouseY = e.pageY - offsetTop;

  userDrawing.setDrawing(true);
  addClick(mouseX, mouseY);
  userCanvas.draw(mouseX, mouseY, userSettings.getBrush(), userSettings.getColor(), userSettings.getSize(), true);
};


imageLoader.addEventListener('change', userCanvas.handleImage);

// eventListenery które obserwują działania użytkownika przy pomocy myszki na canvasie
canvas.addEventListener("mousedown", mouseDownHandler);
canvas.addEventListener("mousemove", mouseMoveHandler);
canvas.addEventListener("mouseup", () => {
  userDrawing.setDrawing(false);
  ctx.beginPath();
});
canvas.addEventListener("mouseleave", () => userDrawing.setDrawing(false));

// eventListenery które obsługują clicknięcia na pasku narzędzi
brushCircle.addEventListener('click', () => {
  userSettings.setBrush('round');
  brushCircle.classList.add('toolbar__brush--selected');
  brushSquare.classList.remove('toolbar__brush--selected');
});
brushSquare.addEventListener('click', () => {
  userSettings.setBrush('square');
  brushCircle.classList.remove('toolbar__brush--selected');
  brushSquare.classList.add('toolbar__brush--selected');
});
sizeBtn.addEventListener('change', (e) => userSettings.setSize(e.target.value));
paletteSelector.addEventListener('change', (e) => userSettings.setColor(e.target.value));
clearBtn.addEventListener('click', clearCanvas);
saveBtn.addEventListener('click', userCanvas.saveToImg);


function darkenImage(amount = 10) {
  const canvasData = ctx.getImageData(0, 0, 1176, 672)
  console.log(canvasData.data[0])
  for(let i = 0; i<canvasData.data.length; i++) {
      canvasData.data[i] -= amount
  }
  ctx.putImageData(canvasData, 0, 0)
}
function lighterImage(amount = 10) {
  const canvasData = ctx.getImageData(0, 0, 1176, 672)
  console.log(canvasData.data[0])
  for(let i = 0; i<canvasData.data.length; i++) {
      canvasData.data[i] += amount
  }
  ctx.putImageData(canvasData, 0, 0)
}
//kontrast

function contrastImagePlus(){  
    const canvasData = ctx.getImageData(0, 0, 1176, 672)
    var d = canvasData.data;
    contrast = (10/100) + 1;  //convert to decimal & shift range: [0..2]
    var intercept = 128 * (1 - contrast);
    for(var i=0;i<d.length;i+=4){   //r,
        g,b,a
        d[i] = d[i]*contrast + intercept;
        d[i+1] = d[i+1]*contrast + intercept;
        d[i+2] = d[i+2]*contrast + intercept;
    }
    ctx.putImageData(canvasData, 0, 0)
}
function contrastImageMinus(){  
    const canvasData = ctx.getImageData(0, 0, 1176, 672)
    var d = canvasData.data;
    contrast = (-10/100) + 1;  //zmiana kontrastu co 2 
    var intercept = 128 * (1 - contrast);
    for(var i=0;i<d.length;i+=4){   //pobieranie kolorów rgb
        d[i] = d[i]*contrast + intercept;
        d[i+1] = d[i+1]*contrast + intercept;
        d[i+2] = d[i+2]*contrast + intercept;
    }
    ctx.putImageData(canvasData, 0, 0)
}


// Funkcja zmiany Nasycenia
function saturationP(){
    var saturation = 30;
    let imgData = ctx.getImageData(0, 0, 1176, 672); //pobranie obszaru roboczego obrazka
    let data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        let color = [data[i], data[i + 1], data[i + 2]]
        let hsv = RGBtoHSV(color);
        hsv[1] *= parseInt(saturation) / 100;
        let rgb = HSVtoRGB(hsv);
        data[i] = rgb[0];
        data[i + 1] = rgb[1];
        data[i + 2] = rgb[2];
    }
    ctx.putImageData(canvasData, 0, 0);

}