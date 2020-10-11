//canvas的宽高
var W = 300,
    H = 600;
//每个小方块的边长
var BLOCK_SIZE = W / COLS;
//方格线的宽度
var LINE_WIDTH = 1;

var points = [];
var colors = [];

//将坐标转换到canvas的坐标系下
function Vec2(x, y) {
    //console.log(x,y);
    var newX = 2 * x / W - 1;
    var newY = 2 * y / H - 1;
    return vec2(newX, newY);
}

function RGB(R, G, B) {
    return vec3(R / 255, G / 255, B / 255);
}
var CYAN = RGB(0, 255, 255);
var ORANGE = RGB(255, 128, 0);
var BLUE = RGB(0, 0, 255);
var YELLOW = RGB(255, 255, 0);
var RED = RGB(255, 0, 0);
var GREEN = RGB(0, 255, 0);
var PURPLE = RGB(128, 0, 255);
var BLACK = RGB(0, 0, 0);

var colorArray = [
    CYAN, ORANGE, BLUE, YELLOW, RED, GREEN, PURPLE
];

function drawTriangle(A, B, C, colour) {
    colors.push(colour);
    points.push(A);
    colors.push(colour);
    points.push(B);
    colors.push(colour);
    points.push(C);
}

//传入坐标所在坐标系的原点在左上角
function drawBlock(x, y, colour) {
    //先将坐标原点转换到左下角
    y = H / BLOCK_SIZE - y - 1;
    //在坐标（X，Y）处放置一个正方形
    var sX = x * BLOCK_SIZE,
        sY = y * BLOCK_SIZE;
    var tX = sX + BLOCK_SIZE,
        tY = sY + BLOCK_SIZE;
    var A = Vec2(sX, sY);
    var B = Vec2(sX, tY);
    var C = Vec2(tX, tY);
    var D = Vec2(tX, sY);
    drawTriangle(A, B, C, colour);
    drawTriangle(A, D, C, colour);
}

function drawRectangle(sx, sy, tx, ty, colour) {
    var A = Vec2(sx, sy);
    var B = Vec2(sx, ty);
    var C = Vec2(tx, ty);
    var D = Vec2(tx, sy);
    drawTriangle(A, B, C, colour);
    drawTriangle(A, D, C, colour);
}

//画格子
function drawGrids() {
    //画竖线
    for (var i = 0; i < W / BLOCK_SIZE; i++) {
        var x = i * BLOCK_SIZE;
        drawRectangle(x - LINE_WIDTH, 0, x + LINE_WIDTH, H, BLACK);
    }

    //画横线
    for (var i = 0; i < H / BLOCK_SIZE; i++) {
        var y = i * BLOCK_SIZE;
        drawRectangle(0, y - LINE_WIDTH, W, y + LINE_WIDTH, BLACK);
    }
}


function render() {
    //清理
    colors = [];
    points = [];

    for (var x = 0; x < COLS; ++x) {
        for (var y = 0; y < ROWS; ++y) {
            if (board[y][x]) {
                drawBlock(x, y, colorArray[board[y][x] - 1]);
            }
        }
    }

    for (var y = 0; y < 4; ++y) {
        for (var x = 0; x < 4; ++x) {
            if (current[y][x]) {
                drawBlock(currentX + x, currentY + y, colorArray[current[y][x] - 1]);
            }
        }
    }

    //画格子
    drawGrids();


    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);


    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var bufferId1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}