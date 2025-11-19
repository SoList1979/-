// Возврат к начальной конфигурации БЕЗ выхода из текущего режима
reload = () => {
    clearGraphicsOfUnitCluster(Ψ);        // очистить Кластер взятого ПОЛЬЗОВАТЕЛЕМ Юнита
    clearGraphicsOfUnitCluster(unit[01]); // очистить Кластер Короля светлых
    clearGraphicsOfUnitCluster(unit[27]); // очистить Кластер Короля тёмных
    
    time0();
    
    queue        = null,       // текущая очередь хода
    singleAuto   = false;      // одиночный автоход
    multiAuto    = false;      // множественный автоход с задержкой timeDelay
    cameraOnUnit = false;      // камеру НА ЮНИТ
    move         = 0,      // абсолютный номер хода
    CONDITION = CONTINUE;
    side         = null,   // НИКАКАЯ сторона
    t            = 0,      // графическое время 
    Ω            = 0;      // значение  Целевой Функции для подсчёта преимущества одной из сторон
   
    for (j = 1; j <= nFields; j++) {
        field[j].unit = empty;
    }
    for (i = 1; i <= nUnits; i++) {
        unit[i].position.x = 0; 
        unit[i].position.y = 0; 
        unit[i].position.z = 0; 
        unit[i].field = {};
        unit[i].material.opacity = strongOpacity;
 
        let p0 = 0;
        if (unit[i].side === lightSide) {
            p0 = 1;
            unit[i].previos = field[1];
        } // Светлых всех с ТОЧКИ СЕВЕРНОГО ПОЛЮСА отправляем на своё field[j]
        if (unit[i].side === darkSide) {
            p0 = 2;
            unit[i].previos = field[2];
        } // Тёмных  всех с ТОЧКИ    ЮЖНОГО ПОЛЮСА отправляем на своё field[j]
        
        unit[i].position.x = icoVertices[p0 * 3 - 1 + 1]*kH;      
        unit[i].position.y = icoVertices[p0 * 3 - 1 + 2]*kH;
        unit[i].position.z = icoVertices[p0 * 3 - 1 + 3]*kH;
        rotateAroundWorldAxis(unit[i], new THREE.Vector3(1, 0, 0), rad(-90)); // Подcтройка под иллюстрацию Земли

        // Теперь нужно только для Demo. ВсЁ подгружается из phpMyAdmin через php, а отрисовывается в periodic-animation.js
        let xA = unit[i].position.x;
        let yA = unit[i].position.y;
        let zA = unit[i].position.z;
        let jposition = positionStart[i]; // Начальная позиция
        field[jposition].unit = unit[i];
        let xB = field[jposition].position.x; // Всех отправляем на своё field
        let yB = field[jposition].position.y; // Всех отправляем на своё field
        let zB = field[jposition].position.z; // Всех отправляем на своё field

        unit[i].direction = new THREE.Vector3(0, 0, 0);
        unit[i].mark  = false;
        unit[i].step  = 0;
        unit[i].mdead = 0;
        
        unit[i].direction = orientation(xA, yA, zA, xB, yB, zB);
        displacement(unit[i], xA, yA, zA, xB, yB, zB);
        
        unit[i].lookAt(
            unit[i].position.x - unit[i].direction.x, //направление Вперёд
            unit[i].position.y - unit[i].direction.y,
            unit[i].position.z - unit[i].direction.z
        );
        unit[i].up.set(xB, yB, zB); //направление Вверх
        unit[i].index = i;
        unit[i].xd = 0;
        unit[i].yd = 0;
        unit[i].zd = 0;
        unit[i].h  = 0;
        unit[i].t  = 0;
        unit[i].type = unitType;
        unit[i].alive = true;

        if (i >= 2 && i <= 16) {
            unit[i].castling = true;
        } else if (i >= 28 && i <= 42) {
            unit[i].castling = true;
        } else {
            unit[i].castling = false;
        }

        unit[i].field = field[jposition];
        unit[i].name = unit[i].sort + ' "'+ unit[i].field.name + '"'; 
        
        let kUp   = 1.10; // корректировочный коэффициент поднятия  короля и ферзя над доской
        switch (i) {
            case  1:
            case  2:
            case 27:
            case 28:
                unit[i].position.x *= kUp;
                unit[i].position.y *= kUp;
                unit[i].position.z *= kUp;
                break;
        }
        // "оживить" части ферзя (и короля)
        switch (i) {
            case 01:
            case 27:
                unit[i].tor1.alive = true; unit[i].tor1.material.opacity = strongOpacity;
                unit[i].tor2.alive = true; unit[i].tor2.material.opacity = strongOpacity; 
                unit[i].tor3.alive = true; unit[i].tor3.material.opacity = strongOpacity;
                break;
            case 02:
            case 28:
                unit[i].ball.alive = true; unit[i].ball.material.opacity = strongOpacity;
                break;
        }
        
        unit[i].updateMatrix();
    }
    
    startConfiguration();
    defineAllSets();
    makeSystem();
    // --- ИНИЦИАЛИЗАЦИЯ ПРЕДВАРИТЕЛЬНЫХ ВЫЧИСЛЕНИЙ ---
    precomputeAllDistances();
    precomputeRayChecks();
    precomputeAllJumps();
    // карты для перигеев
    precomputeBigRings();
    precomputeRingIdMap();
    precomputeRedBFS();
    precomputeBlueBFS();
    // карты для getExchange()
    precomputePikeRayMap();
    precomputeAxeRayMap();
};
////////////////////////////////////////////////////////////////////

let Depth;     
let TimeMove;   

let CSV = 0;  
console.log(new Date());

// по умолчанию
var DEMO = false;
var GAME = false;
var timerView = true;
var uQueue  = null;

var inputLight = document.getElementById("light");
var inputDark  = document.getElementById("dark");
var inputDepthLevel = document.getElementById("DepthLevel");
DepthLevel = Number(inputDepthLevel.value);

Depth = DepthLevel;
const kD = 1000;
TimeMove = Depth*kD;

var inputTimeLimit = document.getElementById("timeLimit");
timeLimit  = inputTimeLimit.value*1000*60;

var inputTimer = document.getElementById("on-off");
timer = inputTimer.checked;

if (uQueue === null) {
    uQueue = getRandomItem([true, false]);
    if (uQueue === true) {
        inputLight = document.getElementById("light");
        inputLight.checked = true;
        console.log("I am: LIGHT → uQueue = ", uQueue);
    }
    if (uQueue === false) {
        inputDark = document.getElementById("dark");
        inputDark.checked = true;
        console.log("I am: DARK  → uQueue = ", uQueue);
    }
}
/////////////////////////////////////////////////////////////////////
const elementLightColor = document.getElementById("light");
const elementDarkColor  = document.getElementById("dark");

// Добавление обработчика события
elementLightColor.addEventListener("input", function(event) {
    // Вывод измененного значения в консоль
    uQueue  = true;
    console.log("I am: LIGHT → uQueue = ", uQueue);
});

// Добавление обработчика события
elementDarkColor.addEventListener("input", function(event) {
    // Вывод измененного значения в консоль
    uQueue  = false;
    console.log("I am: DARK  → uQueue = ", uQueue);
});
/////////////////////////////////////////////////////////////////////
const elementDepthLevel = document.getElementById("DepthLevel");
// Добавление обработчика события
elementDepthLevel.addEventListener("input", function(event) {
    // Вывод измененного значения в консоль
    DepthLevel = Number(event.target.value);
    
    Depth = DepthLevel;
    TimeMove = Depth*kD;
    
    console.log("Глубина  = ", DepthLevel + " полуходов");
});

const elementTimeLimit = document.getElementById("timeLimit");
// Добавление обработчика события
elementTimeLimit.addEventListener("input", function(event) {
    // Вывод измененного значения в консоль
    timeLimit = 60*1000*Number(event.target.value);
    console.log("time limit = ", timeLimit/1000/60 + " minutes");
});
const elementOnOff = document.getElementById("on-off");
elementOnOff.addEventListener("input", function(event) {
    // Вывод измененного значения в консоль
    timer = (elementOnOff.checked);
    if (timer) {
        $(document).ready(function() {
            $("#rangeValueTime").css({"filter" : "grayscale( 0%) blur(0vh)"});
            $(".select-time").css({"color": "#00ffff"});
            $("#timeLimit").css({"filter" : "grayscale( 0%) blur(0vh)"});
            $("#minutes"  ).css({"filter" : "grayscale( 0%) blur(0vh)"});
            $("#timeLimit").css({"pointer-events": "auto"});
            $("#minutes"  ).css({"pointer-events": "auto"});
        });
    }
    else {
        $(document).ready(function() {
            $("#rangeValueTime").css({"filter" : "grayscale(50%) blur(1vh)"});
            $(".select-time").css({"color": "#999999"});
            $("#timeLimit").css({"filter" : "grayscale(50%) blur(1vh)"});
            $("#minutes"  ).css({"filter" : "grayscale(50%) blur(1vh)"});
            $("#timeLimit").css({"pointer-events": "none"});
            $("#minutes"  ).css({"pointer-events": "none"});
        });
    }
    console.log("new timer: ", timer);
});

bindHelpElements();
initZobristKeys();  
checkForErrors();
/////////////////////////////////////////////////////////////////////