//////////////// Глобальные КОНСТАНТЫ //////////////////////////////////////////////////////////
const
kScale   = 1.35,  // масшатаб размера фигур на доске
kH      = 1.02,  // масшатаб возвышения фигур над доской
r       = 1,
ω0      = π/600, // базовая частота периодических анимации
dt      = 1,
timeDelay = 250,   // мс время искуссственной задержки хода AI
///////// Conditions (состояния)  ///////////////////////////////////////////////////////////////   
CHECK    = "ШАХ",
MATE  = "МАТ",
STALEMATE = "ПАТ",   
DRAW  = "НИЧЬЯ",
CRASH    = "РАЗГРОМ",
TIME  = "ВРЕМЯ",
CONTINUE  = "игра",

ζmin  =  40,
ζmax  =  75,   // градусы рысканья на пешку
ζmid  =  90,   // 
ζAxe  =  90,   // градусы рысканья на Ладью 80
ζPike = 120,   // градусы рысканья на Слона 110
ζπ   = 180,   // развёрнутый угол
rOfLight =  2,
rCamera0 = 15,
farAway  = 1000*rCamera0,
rCameraMin    = rCamera0/5.7,
rCameraMax    = rCamera0/1.3,
rCameraMid    = rCamera0/1.6,
rCameraAlbom   = rCamera0/5.3,
rCameraPortret = rCamera0/3.0,
cameraFovy = 30,
rotationAuto = 0.0005,
nUnits    = 52,
nLUBegin   = 01,
nLUEnd    = nUnits/2,
nDUBegin   = nLUEnd + 1,
nDUEnd    = nUnits,
nFields   = (32 - 2)*3 + 2,
nΠ       = 30; // число сторон большой "окружности" "тора"
   
// 92 клетки для 52 юнитов [номер клетки]
fieldX = [0, 0, 0, -0.894427, -0.723607, -0.276393, 0.276393, 0.723607, 0.894427, 0.723607, 0.276393, -0.276393, -0.723607, -0.491123, -0.491123, 0.187592, 0.607062, 0.187592, -0.187592, -0.607062, 0.491123, 0.491123, -0.187592, -0.794654, -0.982247, -0.794654, -0.303531, 0.303531, 0.794654, 0.982247, 0.794654, 0.303531, -0.303531, -0.354684, -0.109603, -0.109603, 0.286946, 0.286946, -0.286946, 0.109603, -0.286946, 0.354684, 0.109603, -0.677657, -0.787261, -0.787261, -0.964603, -0.964603, -0.548236, -0.438633, -0.835182, -0.902921, -0.65784, -0.209408, -0.564092, 0.077538, -0.496353, -0.099804, 0.209408, -0.077538, 0.564092, 0.099804, 0.496353, 0.548236, 0.438633, 0.835182, 0.65784, 0.902921, 0.677657, 0.787261, 0.787261, 0.964603, 0.964603, 0.548236, 0.835182, 0.438633, 0.902921, 0.65784, 0.209408, 0.564092, -0.077538, 0.496353, 0.099804, -0.209408, -0.564092, 0.077538, -0.496353, -0.099804, -0.548236, -0.835182, -0.438633, -0.902921, -0.65784];
fieldY = [0, 0, 0, 0, -0.525731, -0.850651, -0.850651, -0.525731, 0, 0.525731, 0.850651, 0.850651, 0.525731, -0.356822, 0.356822, -0.57735, 0, 0.57735, -0.57735, 0, -0.356822, 0.356822, 0.57735, -0.57735, 0, 0.57735, -0.934172, -0.934172, -0.57735, 0, 0.57735, 0.934172, 0.934172, 0, -0.337325, 0.337325, -0.208478, 0.208478, -0.208478, -0.337325, 0.208478, 0, 0.337325, 0, -0.337325, 0.337325, -0.208478, 0.208478, -0.398317, -0.735642, -0.189839, -0.398317, -0.735642, -0.64449, -0.64449, -0.852969, -0.852969, -0.981815, -0.64449, -0.852969, -0.64449, -0.981815, -0.852969, -0.398317, -0.735642, -0.189839, -0.735642, -0.398317, 0, -0.337325, 0.337325, -0.208478, 0.208478, 0.398317, 0.189839, 0.735642, 0.398317, 0.735642, 0.64449, 0.64449, 0.852969, 0.852969, 0.981815, 0.64449, 0.64449, 0.852969, 0.852969, 0.981815, 0.398317, 0.189839, 0.735642, 0.398317, 0.735642];
fieldZ = [0, 1, -1, 0.447214, -0.447214, 0.447214, -0.447214, 0.447214, -0.447214, 0.447214, -0.447214, 0.447214, -0.447214, 0.794654, 0.794654, 0.794654, 0.794654, 0.794654, -0.794654, -0.794654, -0.794654, -0.794654, -0.794654, 0.187592, -0.187592, 0.187592, -0.187592, 0.187592, -0.187592, 0.187592, -0.187592, 0.187592, -0.187592, 0.934986, 0.934986, 0.934986, 0.934986, 0.934986, -0.934986, -0.934986, -0.934986, -0.934986, -0.934986, 0.735378, 0.516171, 0.516171, 0.161487, 0.161487, -0.735378, -0.516171, -0.516171, -0.161487, -0.161487, 0.735378, 0.516171, 0.516171, 0.161487, 0.161487, -0.735378, -0.516171, -0.516171, -0.161487, -0.161487, 0.735378, 0.516171, 0.516171, 0.161487, 0.161487, -0.735378, -0.516171, -0.516171, -0.161487, -0.161487, 0.735378, 0.516171, 0.516171, 0.161487, 0.161487, -0.735378, -0.516171, -0.516171, -0.161487, -0.161487, 0.735378, 0.516171, 0.516171, 0.161487, 0.161487, -0.735378, -0.516171, -0.516171, -0.161487, -0.161487];

const
unitPreviosStart = 
[ 0,
  1,
  1, 
  1,1,1,1,
  1,1,1,1,1,
  1,1,1,1,1,
  1,1,1,1,1,1,1,1,1,1,
  2,
  2,
  2,2,2,2,
  2,2,2,2,2,
  2,2,2,2,2,
  2,2,2,2,2,2,2,2,2,2
],
unitFieldStart = [ 0,
   1,
  33, 
  34,35,36,37,
  43,53,63,73,83,
  13,14,15,16,17,
  44,54,55,64,65,74,75,85,84,45,
   2,
  41,
  42,39,40,38,
  48,58,68,78,88,
  18,19,20,21,22,
  49,59,60,69,70,79,80,90,89,50
],
positionStart = unitFieldStart;
const fieldUnitStart = new Array(93).fill(0); // [0..92]

for (let unitId = 1; unitId < unitFieldStart.length; unitId++) {
    const fieldIndex = unitFieldStart[unitId];

    if (fieldIndex !== 0) {
        fieldUnitStart[fieldIndex] = unitId;
    }
}

const
fieldName =    
['O',
 'C','D','A','X','B','Y','E','T','K','P','M','H',
 'CAB','CAM','CEB','CEK','CKM','DXY','DXH','DYT','DTP','DPH',
 'AXB','AXH','AMH','XBY','BYE','YET','ETK','TKP','KPM','PMH',
 'CA','CB','CM','CE','CK','DX','DY','DH','DT','DP',
 'AC','AB','AM','AX','AH','XD','XY','XH','XA','XB',
 'BC','BA','BE','BX','BY','YD','YX','YT','YB','YE',
 'EC','EB','EK','EY','ET','TD','TY','TP','TE','TK',
 'KC','KE','KM','KT','KP','PD','PT','PH','PK','PM',
 'MC','MA','MK','MH','MP','HD','HX','HP','HA','HM'],
 
helm     = 'Король',   
sword    = 'Ферзь',   
arrow    = 'пешка',
axe      = 'Ладья',
pike     = 'Слон',  
dart     = 'Конь', 
C        = [],

///////// Colors ////////////////////////////////////////////////////////////////////////
noType        = 'no',
redType       = 'red',  
blueType      = 'blue', 
greenType     = 'green', 
black         = 0x000000,
white         = 0xffffff,
red           = 0xff0000,
blue          = 0x0000ff,
green         = 0x00ff00,
magenta       = 0xff00ff,
violet        = 0xaa00ff,
yellow        = 0xffff00,
orange        = 0xffaa00,
cyan          = 0x00ffff,
gray          = 0x808080,
dark          = 0x6600cc,
light         = 0xcc6600,
darkField     = 0x9900ff,
lightField    = 0xff9900,
neutralField  = 0xffffff,
redHTML       = "#ff0000",
darkHTML      = "#ff22ff",
lightHTML     = "#ffff22",
neutralHTML   = "#cccccc",
brightHTML    = "#ffffff",   
deadDarkHTML  = "#885588",
deadLightHTML = "#888855",
colorMark  = gray,
colors    =[black, red, blue, green, magenta, yellow, cyan, white],
strongOpacity = 0.7,
weakOpacity   = 0.4,
///////// Units ///////////////////////////////////////////////////////////////////////////
deadRadius    = 1.3,
deadStep      = 0.1,
unitType      = 'Unit',
fieldType     = 'Field',
lightSide     = 'LIGHT',
darkSide      = 'DARK',
///////// геометрии и материалы ///////////////////////////////////////////////////////////   
fR   = 0.2,
tor      = new THREE.TorusGeometry (fR-0.030,0.020, 3, nΠ),
disk   = new THREE.CircleGeometry(fR-0.030, nΠ),
torSmall   = new THREE.TorusGeometry (fR-0.070,0.015, 6, nΠ),
circ0     = new THREE.Geometry(),
circ  = summGeoms(disk, torSmall),
icoMat  = new THREE.MeshStandardMaterial({  
    vertexColors: THREE.VertexColors,
    metalness: 0.7,
    roughness: 0.4,
    transparent: true, 
    opacity: weakOpacity*1.5,
    side: THREE.BackSide,
}),
baseMat = new THREE.MeshPhysicalMaterial({                       
    vertexColors: THREE.VertexColors,
    metalness: 0.6,
    roughness: 0.4,
    transparent: true, 
    opacity: strongOpacity,
    side: THREE.DoubleSide,
}),
ballLightMat = new THREE.MeshPhysicalMaterial({                       
    vertexColors: THREE.VertexColors,
    metalness: 0.6,
    roughness: 0.4,
    transparent: true, 
    opacity: strongOpacity,
    side: THREE.DoubleSide,
}),
ballDarkMat = new THREE.MeshPhysicalMaterial({                       
    vertexColors: THREE.VertexColors,
    metalness: 0.6,
    roughness: 0.4,
    transparent: true, 
    opacity: strongOpacity,
    side: THREE.DoubleSide,
}),
helmLightMat = new THREE.MeshStandardMaterial({  
    vertexColors: THREE.VertexColors,
    metalness: 0.6,
    roughness: 0.4,
    transparent: true, 
    opacity: strongOpacity,
    side: THREE.DoubleSide,
}),
helmDarkMat  = new THREE.MeshStandardMaterial({  
    vertexColors: THREE.VertexColors,
    metalness: 0.6,
    roughness: 0.4,
    transparent: true, 
    opacity: strongOpacity,
    side: THREE.DoubleSide,
}),
torLightMat    = new THREE.MeshPhysicalMaterial({                     
    color: light,
    metalness: 0.2,
    roughness: 0.5,
    clearcoat: 0.7,
    side: THREE.FrontSide,
    transparent: true,
    opacity: strongOpacity,
}),
torDarkMat     = new THREE.MeshPhysicalMaterial({                     
    color: dark,
    metalness: 0.2,
    roughness: 0.5,
    clearcoat: 0.7,
    side: THREE.FrontSide,
    transparent: true,
    opacity: strongOpacity,
}),
φ        = [],
θ        = [],
color    = [],
unitMat  = [],
fieldMat = [],
empty    = {
name: "пусто",
side: "пусто"
};
//////////// Глобальные ПЕРЕМЕННЫЕ  ///////////////////////////////////////////////////////////////
//////////// их ДЕФОЛТНЫЕ значения  //////////////////////////////////////////////////////////////
let
system       = new Uint8Array(600);
unit         = [],
field        = [],
Ψ            = {}, // активный Юнит
Φ            = {}, // пассивный Юнит
CLICK        = {}, // объект для НАЖАТОГО объекта
timeLight    = 0,
timeDark     = 0,
timePause    = 0,
timeStop     = new Date(), 
timeGo       = new Date(),
timeBegin    = new Date(), 
timeEnd      = new Date(),
timeTurn     = timeEnd - timeBegin,
ΔTime        = timeLimit,
timeIsUp     = false,
CONDITION    = CONTINUE,
STATUSCOLOR  = brightHTML,
rCamera      = (rCameraMax + rCameraMin)/2,
queue        = null,   // текущая очередь хода
singleAuto   = false,     // одиночный автоход
multiAuto    = false,     // множественный автоход с задержкой timeDelay
cameraOnUnit = false,     // камеру НА ЮНИТ
move = 0,     // абсолютный номер хода
play         = null,   // игровое время на паузе
t            = 0,     // графическое время 
// номера Юнитов 
lightOwners  = new Set(),
darkOwners   = new Set(),
Ω            = 0;     // значение  Целевой Функции

///////////////////////////////////////////////////////////////////////////////////////////
elemUnit      = document.getElementById("unit"),
elemField     = document.getElementById("field"),
elemMove      = document.getElementById("move"),
elemTime      = document.getElementById("time"),
elemOmega     = document.getElementById("omega"),
elemCheckMate = document.getElementById("check-mate");
/////////////////// для ТАБЛИЦЫ состояния //////////////////////////////////////////////////
// elemOmega.innerHTML = "баланс";
// elemOmega.default = "баланс";
elemOmega.style.color = neutralHTML;
elemOmega.style.backgroundColor = "#00000000";
elemField.innerHTML = "клетка";
elemField.default = "клетка";
elemField.style.color = neutralHTML;
elemField.style.backgroundColor = "#00000000";
elemTime.innerHTML = "таймер";
elemTime.default = "таймер";
elemTime.style.color = neutralHTML;
elemTime.style.backgroundColor = "#00000000";
elemCheckMate.innerHTML = "процесс";
elemCheckMate.default = "процесс";
elemCheckMate.style.color = neutralHTML;
elemCheckMate.style.backgroundColor = "#00000000";
elemUnit.innerHTML = "фигура";
elemUnit.default = "фигура";
elemUnit.style.color = neutralHTML;
elemUnit.style.backgroundColor = "#00000000";
elemMove.innerHTML = "ход";
elemMove.default = "ход";
elemMove.style.color = neutralHTML;
elemMove.style.backgroundColor = "#00000000";

let tableElements = [];
tableElements[0] = null;
tableElements[1] = elemOmega;
tableElements[2] = elemField;
tableElements[3] = elemTime;
tableElements[4] = elemCheckMate;
tableElements[5] = elemUnit;
tableElements[6] = elemMove;

//////////////////////////////////////////////////////////////////////////////////////////        
elemZoomHelpWindow = document.getElementById("help-window"),
/////////////////////////////////////////////////////////////////////////////////////////// 
elemSwipe          = document.getElementById("swipe"),    
elemSwipe = document.querySelector("#swipe, .game #swipe"),
elemCenter         = document.getElementById("center"),      
elemPinch          = document.getElementById("pinch"),     
elemLeftTap        = document.getElementById("left-tap"),     
elemMoveUnit       = document.getElementById("move-unit"),     
elemRightTap       = document.getElementById("right-tap"),     
elemLeftDoubleTap  = document.getElementById("left-double-tap"),     
elemCenterTap      = document.getElementById("center-tap"),     
elemRightDoubleTap = document.getElementById("right-double-tap"),
// ///////////////////////////////////////////////////////////////////////////////////////////
elemZoomSwipe          = document.getElementById("zoom-swipe"),       
elemZoomCenter         = document.getElementById("zoom-center"),      
elemZoomPinch          = document.getElementById("zoom-pinch"),     
elemZoomLeftTap        = document.getElementById("zoom-left-tap"),     
elemZoomMoveUnit       = document.getElementById("zoom-move-unit"),     
elemZoomRightTap       = document.getElementById("zoom-right-tap"),     
elemZoomLeftDoubleTap  = document.getElementById("zoom-left-double-tap"),     
elemZoomCenterTap      = document.getElementById("zoom-center-tap"),     
elemZoomRightDoubleTap = document.getElementById("zoom-right-double-tap"); 

let helpElements = [];
helpElements[0] = null;
helpElements[1] = elemSwipe;
helpElements[2] = elemCenter;
helpElements[3] = elemPinch;
helpElements[4] = elemLeftTap;
helpElements[5] = elemMoveUnit;
helpElements[6] = elemRightTap;
helpElements[7] = elemLeftDoubleTap;
helpElements[8] = elemCenterTap;
helpElements[9] = elemRightDoubleTap;

let helpZoomElements = [];
helpZoomElements[0] = null;
helpZoomElements[1] = elemZoomSwipe;
helpZoomElements[2] = elemZoomCenter;
helpZoomElements[3] = elemZoomPinch;
helpZoomElements[4] = elemZoomLeftTap;
helpZoomElements[5] = elemZoomMoveUnit;
helpZoomElements[6] = elemZoomRightTap;
helpZoomElements[7] = elemZoomLeftDoubleTap;
helpZoomElements[8] = elemZoomCenterTap;
helpZoomElements[9] = elemZoomRightDoubleTap;
// DeepSeek
function updateHelpElements() {
    const mode = GAME ? ".game" : ".test";
    helpElements = [
        null,
        document.querySelector(`${mode} #swipe`),
        document.querySelector(`${mode} #center`),
        document.querySelector(`${mode} #pinch`),
        document.querySelector(`${mode} #left-tap`),
        document.querySelector(`${mode} #move-unit`),
        document.querySelector(`${mode} #right-tap`),
        document.querySelector(`${mode} #left-double-tap`),
        document.querySelector(`${mode} #center-tap`),
        document.querySelector(`${mode} #right-double-tap`)
    ];
}
// DeepSeek
function bindHelpElements() {
    helpElements.forEach((helpElement, i) => {
        if (!helpElement) return;
        helpElement.addEventListener("click", () => {
            elemZoomHelpWindow.style.display = "flex";
            helpZoomElements.forEach((helpZoomElement, j) => {
                if (!helpZoomElement) return;
                helpZoomElement.style.display = i === j ? "flex" : "none";
            });
        });
    });
}
