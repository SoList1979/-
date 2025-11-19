const
π = Math.PI, 
е = Math.E,
ε = 1E-6;

// нормализация вектора
function normalization2D(x0, y0, r0, x, y) {
    let r =Math.sqrt((x-x0)*(x-x0) + (y-y0)*(y-y0)); 
    x = (x/r)*r0;
    y = (y/r)*r0;
    
    let gradientPosition = {};
    gradientPosition.x = x;
    gradientPosition.y = y;
    
    return gradientPosition;
}
// получить (x,y) на ОКРУЖНОСТИ
function get_xy_circle(x0, y0, r0, T, t0, t) {
    const φ0 = 2*π*(t0/T);
    let φ = 2*π*(t/T) - φ0;
    let x = +x0 + r0*Math.cos(φ);
    let y = +y0 + r0*Math.sin(φ);
    
    let gradientPosition = {};
    gradientPosition.x = 1-x;    
    // знак в (1-x) для background, возможно в нормальном виде должно быть наоборот
    gradientPosition.y = y;
    
    return gradientPosition;
}
// получить t(x,y) на ОКРУЖНОСТИ 
function get_t_circle(x0, y0, r0, T, x, y) {
    let cosφ = (x - x0)/r0;
    let sinφ = (y - y0)/r0;
    let  tgφ = (sinφ/cosφ);
    let    φ = Math.atan(tgφ);
    let    t = T*φ/(2*π);
        
    if ((x - x0) >  0) {t =  t + T/2}
    // знак в (x - x0) для background, возможно в нормальном виде должно быть наоборот
    return t;
}
// получить (x,y) на ЛЕМНИСТКАТЕ
function get_xy_lemniscata(x0, y0, r0, T, t0, t) {
    const φ0 = 2*π*(t0/T);
    let φ = 2*π*(t/T) - φ0;
    let c = 1;
    let cQ2 = c*c;
    let sin2 = Math.pow(Math.sin(φ), 2);
    let x = +x0 + r0*cQ2*(Math.cos(φ))/(1+sin2);
    let y = +y0 + r0*cQ2*(Math.sin(φ))*(Math.cos(φ))/(1+sin2);
    
    let gradientPosition = {};
    gradientPosition.x = 1-x;
    // знак в (1-x) для background, возможно в нормальном виде должно быть наоборот
    gradientPosition.y = y;
    
    return gradientPosition;
}
// получить t(x,y) на ЛЕМНИСТКАТЕ     
function get_t_lemniscata(x0, y0, r0, T, x, y) {
    if (x ===x0 && y > y0) {
        x += ε;
    }
    if (x ===x0 && y < y0) {
        x -= ε;
    }
    
    let c = 1;
    let cos2φ = (((x - x0)/r0)*((x - x0)/r0) + ((y - y0)/r0)*((y - y0)/r0))/(2*c*c);
    let φ2 =   Math.acos(cos2φ);
    let φ  = φ2/2;
    let t  = T*φ/(2*π);
    
    if ((x - x0) >  0) {t =  t - T/2} // цетрально-симметричное отражение относительно (0,0)
    if ((y - y0) >  0) {t =  T - t}   // зеркальное отражение относительно оси 0-x
    // знак в (x - x0) и (y - y0) для background, возможно в нормальном виде должно быть наоборот
    return t;
}

// Сделано Qwen для minmax
function normalizeVector(v) {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return {
        x: length ? v.x / length : 0,
        y: length ? v.y / length : 0,
        z: length ? v.z / length : 0
    };
}
// Сделано Qwen для minmax
function getDirection(a, b) {
    const xA = fieldX[a];
    const yA = fieldY[a];
    const zA = fieldZ[a];

    const xB = fieldX[b];
    const yB = fieldY[b];
    const zB = fieldZ[b];

    // Вектор от a к b
    const x = xB - xA;
    const y = yB - yA;
    const z = zB - zA;

    // Нормализация
    const length = Math.sqrt(x * x + y * y + z * z);
    return {
        x: length ? x / length : 0,
        y: length ? y / length : 0,
        z: length ? z / length : 0
    };
}


// РАССТОЯНИЕ между точками
function dist3D(x, y, z) {
    return Math.sqrt(x*x + y*y + z*z);
}
// ДЛИНА вектора
function modul(vector) {
    return dist3D(vector.x, vector.y, vector.z);
}
// СФЕРИЧЕСКИЕ координаты из декартовых 
function geoSpheric(x, y, z) {
    let φ, θ;
    if (y>0) {φ =  π/2 - Math.atan(x/y)}
    if (y<0) {φ = -π/2 - Math.atan(x/y)}
    θ = π/2 - Math.acos(z);
    return new THREE.Vector2(φ ,θ);
}
// нормаль к плоскомти ABC    
function normal(xA, yA, zA, xB, yB, zB, xC, yC, zC) {                       
    let nx = + (yB - yA)*(zC - zA) - (zB - zA)*(yC - yA);
    let ny = - (xB - xA)*(zC - zA) + (zB - zA)*(xC - xA);
    let nz = + (xB - xA)*(yC - yA) - (yB - yA)*(xC - xA);
    return new THREE.Vector3(nx, ny, nz);
}
// Векторное Произведение A и B    
function vectorProduct(A, B) {                                            
    let xC = + A.y*B.z - A.z*B.y;
    let yC = - A.x*B.z + A.z*B.x;
    let zC = + A.x*B.y - A.y*B.x;
    return new THREE.Vector3(xC, yC, zC);
}
// Скалярное Произведение A и B    
function scalarProduct(A, B) {                                             
    return (A.x*B.x + A.y*B.y + A.z*B.z);
}
// Перемещение по дуге Единичной Сферы
function displacement(object, xA, yA, zA, xB, yB, zB) {                     
    let normAB0 = normal(xA, yA, zA, xB, yB, zB, 0, 0, 0);
    let arcAB = arcC(new THREE.Vector3(xA, yA, zA), 
                     new THREE.Vector3(xB, yB, zB));
    return rotateAroundWorldAxis(object, normAB0, arcAB);
}
// Установка Направления (ориентации) Объекта 
function orientation(xA, yA, zA, xB, yB, zB) {   
    let AB  = new THREE.Vector3(xB - xA, yB - yA, zB - zA);
    AB.normalize();
    let OA  = new THREE.Vector3(xA, yA, zA);
    OA.normalize();
    let OB  = new THREE.Vector3(xB, yB, zB);
    OB.normalize();
    let nAB = normal(xA, yA, zA, 0, 0, 0, xB, yB, zB);
    nAB.normalize();
    let direct = vectorProduct(nAB, OB);
    // Результат = ВЕКТОР
    return direct.normalize();                                              
}
// вращение Объекта вокруг СОБСТВЕННОЙ Оси     
function rotateAroundObjectAxis(object, axis, radians) {                    
    let rotObjectMatrix = new THREE.Matrix4();
        rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);                
        object.matrix.multiply(rotObjectMatrix);
        object.rotation.setFromRotationMatrix(object.matrix);
}
// вращение Объекта вокруг МИРОВОЙ Оси
function rotateAroundWorldAxis(object, axis, radians) {                     
    let rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        let currentPos = new THREE.Vector4(object.position.x, 
                                       object.position.y, 
                                       object.position.z, 1);
    let newPos = currentPos.applyMatrix4(rotWorldMatrix);
            rotWorldMatrix.multiply(object.matrix);
        object.matrix = rotWorldMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
        object.position.x = newPos.x;
        object.position.y = newPos.y;
        object.position.z = newPos.z;
}

// true =>+1, false => -1
function boolSign(bool) {
    if (bool === true) {
        return +1;
    } 
    if (bool === false) {
        return -1;
    } 
    if (bool === null || bool === undefined || isNaN) {
        return 0;
    }
    return 0;
}
// радианы из градусов
function rad(deg) {
    return deg*π/180;
}
// градусы из радиан
function deg(rad) {
    return rad/π*180;
}
//длина дуги через arcCOS и скалярное произведение 
function arcC(A, B) {                                                        
    let mod2 = modul(A)*modul(B);                                           
    if (mod2 < ε) {mod2 = ε}
    return Math.acos(scalarProduct(A, B)/(mod2));
}
//длина дуги через arcSIN и расстояние между концами   
function arcS(d) {                                                          
    if (d>2) {d = 2}
    return 2*Math.asin(d/2);
}
// вылет ЮНИТА вверх    
function outFly(x) {                                                       
    let f = (1 - 1/(x + 1));
    if (f > 0.9999) {f = 1}
    return f;
}

function dateFormat(tms) {
  let    days  = Math.trunc(tms/(1000*60*60*24));
  let   hours = Math.trunc(tms/(1000*60*60))- days*24;
  let minutes = Math.trunc(tms/(1000*60)) - hours*60 - days*24*60;
  let seconds = Math.trunc(tms/(1000)) - minutes*60 - hours*60*60 - days*24*60*60;
  let milliseconds = (tms % 1000);
  
  days    = formatN(3, days);
  hours   = formatN(2, hours);
  minutes = formatN(2, minutes);
  seconds = formatN(2, seconds);
  milliseconds = formatN(3, milliseconds);
  
  //return (days + "." + hours + ":" + minutes + ":" + seconds + "." + milliseconds);
  return (hours + ":" + minutes + ":" + seconds);
}

let Δτ;
const Δτ0 = 500;

function format2Digits(n) {
    return n >= 1 && n <= 9 ? `0${n}` : `${n}`;
}

function sign(number) {
    if (number > 0) {
        return "+"; // ДОБАВЛЯЕМ "+"?, потому что по умолчанию он НЕ ПЕЧАТАЕТСЯ
    }
    if (number === 0) {
        return "&nbsp;";
    }
    if (number < 0) {
        return ""; // "-" НЕ ДОБАВЛЯЕМ, потому что по умолчанию он ПЕЧАТАЕТСЯ
    }
}

function signForConsole(Z) {
    if (Z > 0) {
        return "+"; // ДОБАВЛЯЕМ "+"?, потому что по умолчанию он НЕ ПЕЧАТАЕТСЯ
    }
    if (Z === 0) {
        return " ";
    }
    if (Z < 0) {
        return " "; // "-" НЕ ДОБАВЛЯЕМ, потому что по умолчанию он ПЕЧАТАЕТСЯ
    }
}

function format000BP(t) {
    let stringOfNumber = String(Math.abs(t.toFixed(0)));
    if (stringOfNumber.length < 2) {
        stringOfNumber = String.fromCharCode(32) + String.fromCharCode(32) + stringOfNumber;
    }
    if (stringOfNumber.length < 3) {
        stringOfNumber = String.fromCharCode(32) + stringOfNumber;
    }
    return stringOfNumber;
}

function space(number) {
    if (number <  0 &&  number  > -10) {
        result = "  "; 
    }
    if (number <=-10 && number  > -100) {
        result = " "; 
    }
    if (number <=-100 && number > -1000) {
        result = ""; 
    }
    if (number >= 0 && number   < 10) {
        result = "   "; 
    }
    if (number >= 10 && number  < 100) {
        result = "  "; 
    }
    if (number >= 100 && number < 1000) {
        result = " "; 
    }
    return result;
}

function formatN(digit, N) {
    
    const limit = Math.pow(10, digit);
    let pre0 = "";
    
    for (degree = 1; degree <= digit-1; degree++) {
        if (N >=  0 && N < Math.pow(10, degree)) {
            pre0 = pre0 + "0";
        }
    }
    
    N = pre0 + String(N);
    
    return N;
}

function stringInPercents(value) {
    return value*100 + "%";  
}

function stringInRoundPercents(value) {
    return Math.round(value*100) + "%";    
}

function stringInSeconds(value) {
    return value + "s";    
}

function numberLikeFractionDecimal(partOf, whole) {
    return partOf/whole;    
}

function xyToPercentStringFromNumbers(x,y) {
    let xPercent = String(Math.round(x.toFixed(2)*100))+"%";
    let yPercent = String(Math.round(y.toFixed(2)*100))+"%";
    let percentString = xPercent+" "+yPercent;
    return percentString;
}

function xyFromPercentStringToNumbers(positionString) {
    let s1 = positionString.indexOf("%");
    let s2 = positionString.lastIndexOf("%");
                
    let p1 = positionString.substring(     0, s1); // с начала до %, не включая
    let p2 = positionString.substring(s1 + 2, s2); // только со следующего после % и пробела
                
    let x = Number(p1)/100;
    let y = Number(p2)/100;
    
    let gradientPosition = {};
    gradientPosition.x = x;
    gradientPosition.y = y;
    
    return gradientPosition;
}

function getRandomArbitrary(min, max) {
    // любое число в интервале
    return Math.random()*(max - min) + min;
}
    
function getRandomInRange(min, max) {
     // целое число на закрытом отрезке
    return Math.floor(Math.random()*(max - min + 1)) + min;
}

function getRandomItem(set) {
    // переводит набор set в классический массив [0..items.length]
    let items = Array.from(set);     
    // возвращает элемент [от 0 до items.length]
    return items[Math.floor(Math.random()*items.length)]; 
}

function getRandomElement(array) {
    let randomIndex = Math.floor(Math.random() * (array.length - 1));
    // возвращает элемент [от 0 до items.length]
    return array[randomIndex]; 
}