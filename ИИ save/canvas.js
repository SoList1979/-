function wholeObject(part) {
    switch (part) {
        case unit[01].tor1:
        case unit[01].tor2:
        case unit[01].tor3:
            whole = unit[01];
            break;
        case unit[27].tor1:
        case unit[27].tor2:
        case unit[27].tor3:
            whole = unit[27];
            break;
        case unit[02].ball:
            whole = unit[02];
            break;
        case unit[28].ball:
            whole = unit[28];
            break;
        default:
            whole = part;
            break;
    }
    // console.log(whole.name);
    return whole;
}

function pent_or_hex(unit) {
    if (unit.field.index <= 12) {
        torΨ = new THREE.TorusGeometry(fR - 0.03, 0.015, 3, 5);
    }
    if (unit.field.index > 12) {
        torΨ = new THREE.TorusGeometry(fR - 0.03, 0.015, 3, 6);
    }
}

function fieldGraphic(index, geometry, color, opacity) {
    field[index].geometry = geometry;          // геометрия    поля
    field[index].material.color.setHex(color); // цвет         поля
    field[index].material.opacity = opacity;   // прозрачность поля
}

function clearGraphicsOfUnitCluster(unit) {
    // ПРОЗРАЧНОСТЬ поля текущего юнита ОБНУЛЯЕТСЯ
    unit.field.material.opacity = 0; 
    // ЦВЕТ поля текущего юнита на ИСХОДНЫЕ
    unit.field.material.color.setHex(unit.field.paint); 
    unit.field.geometry = torSmall;
    lightUnit.color.setHex(0x000000);
    // Очистить графически КЛАСТЕР активного юнита
    let v = unit.field.index; 

    switch (unit.sort) {
        case axe:
            starAxeCleanGraphics(v);
            break; // Ладья  = Топор
        case pike:
            starPikeCleanGraphics(v);
            break; // Слон   = Пика
        case arrow:
            starArrowCleanGraphics(v);
            break; // пешка  = Стрела
        case dart:
            starDartCleanGraphics(v);
            break; // Конь   = Дротик
        case sword:
            starSwordCleanGraphics(v);
            break; // Ферзь  = Меч
        case helm:
            starHelmCleanGraphics(v);
            break; // Король = Шлем (С Рокировкой)
    }    
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// ГРАФИЧЕСКАЯ ОЧИСТКА всех КЛАСТЕРОВ //////////////////////////////////////////////////////
////////////////////////////// Обращение к этим функциям идёт из главного модуля icogon  ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function starHelmCleanGraphics(v) {
    // Очистка КЛАСТЕРА ШЛЕМА
    let s = starHelm[v];
    s.forEach(function(u) {
        fieldGraphic(u, circ, black, 0);
    });
    if (v <= 12) {
        let s = starOfCastling[v];
        s.forEach(function(u) {
            fieldGraphic(u, circ, black, 0);
        });
    }
}
function starSwordCleanGraphics(v) {
    starPikeCleanGraphics(v);
    starAxeCleanGraphics(v);
}
function starAxeCleanGraphics(v) {
    // Очистка КЛАСТЕРА ТОПОРА
    for (i = 1; i <= starAxe[v].length - 1; i++) {
        for (j = 1; j <= starAxe[v][i].length - 1; j++) {
            let u = starAxe[v][i][j];
            fieldGraphic(u, circ, black, 0);
        }
    }
}
function starDartCleanGraphics(v) {
    // Очистка КЛАСТЕРА ДРОТИКА
    let s = starDart[v];
    s.forEach(function (u) {
        fieldGraphic(u, circ, black, 0);
    });
}
function starPikeCleanGraphics(v) {
    // Очистка КЛАСТЕРА ПИКИ
    for (i = 1; i <= starPike[v].length - 1; i++) {
        for (j = 1; j <= starPike[v][i].length - 1; j++) {
            let u = starPike[v][i][j];
            fieldGraphic(u, circ, black, 0);
        }
    }
}
function starArrowCleanGraphics(v) {
    // Очистка КЛАСТЕРА СТРЕЛЫ
    let s = starArrow[v];
    s.forEach(function (u) {
        fieldGraphic(u, circ, black, 0);
    });
}

animate = () => {
    /////////////////// Ориентировка юнита ///////////////////////////
    for (i = 1; i <= nUnits; i++) {
        unit[i].lookAt(
            unit[i].position.x - unit[i].direction.x, // направление Вперёд
            unit[i].position.y - unit[i].direction.y,
            unit[i].position.z - unit[i].direction.z
        );
        unit[i].up.set(
            unit[i].position.x, // направление Вверх
            unit[i].position.y,
            unit[i].position.z
        );
        unit[i].updateMatrix();
        ///////////////////  Отображение МЁРТВЫХ над Доской ///////////
        if (unit[i].alive === false) {
            let h0 = unit[i].h;  // очередь в высоте
            let t0 = unit[i].t;  // время взятия
            let x0 = unit[i].xd; // место взятия
            let y0 = unit[i].yd; // место взятия
            let z0 = unit[i].zd; // место взятия
            let s = 0.8 + 0.18 * h0;
            let τ = t - t0;
            let k = 0.05;
            let st = s * outFly(k * τ);
            let s0 = 1;
            unit[i].position.x = x0 * (s0 + st);
            unit[i].position.y = y0 * (s0 + st);
            unit[i].position.z = z0 * (s0 + st);
            unit[i].material.opacity = weakOpacity/2;

            switch (i) {
                case 01:
                case 27:
                    unit[i].tor1.material.opacity = weakOpacity/2;
                    unit[i].tor2.material.opacity = weakOpacity/2;
                    unit[i].tor3.material.opacity = weakOpacity/2;
                    break;
                case 02:
                case 28:
                    unit[i].ball.material.opacity = weakOpacity/2;
                    break;
            }
        }
    }
    /////////////////// МЕТАМОРФОЗЫ объектов как f(t) ///////////////////////
    if (play) {
        if (CONDITION === CONTINUE  ||
            CONDITION === CHECK) {
            
            if (timer) {   
                timeEnd = new Date();
                timeTurn = timeEnd - timeBegin;
                    
                if (queue) {
                    ΔTime = timeLimit - (timeLight + timeTurn);
                    showTime(ΔTime);
                }
                if (!queue) {
                    ΔTime = timeLimit - (timeDark + timeTurn);
                    showTime(ΔTime);
                }
                if (statusTime(true)) {
                    timeIsUp = true;
                }
            }
            else {
                ΔTime = "ВЫКЛ";
                showTime(ΔTime);
            }
        }
        t += dt;
    }
    if ((side === null && 
         play === null) ||
         timeIsUp) {
        t += dt;
    }
    
    tChangeArrowGeometry(5*ω0); // периодическое изменение геометрии пешки
    tChangeKingGeometry (4*ω0); // периодическое изменение геометрии Короля
    tChangeQueenGeometry(3*ω0); // периодическое изменение геометрии Ферзя
    
    let k0;
    if (Ψ.side === lightSide) {
        k0 =  1;
    }
    if (Ψ.side === darkSide) {
        k0 = -1;
    }
    Ψ.field.rotation.z = k0*2*ω0*t; // вращение поля под активным юнитом
    
    if (Ψ.sort === helm) {
        let kingCluster = defineUnitCluster(Ψ, false);
        for (i = 1; i <= 12; i++) {
            if (field[i].unit !== empty && kingCluster.has(field[i].index)) {
                field[i].rotation.z = k0*5*ω0*t; // вращение поля под юнитом рокировки
            }
        }
    }
    ////////////// Движение ОСВЕЩЕНИЯ //////////////
     lightLeft.position.set(-rOfLight*Math.sin(5*ω0*t),rOfLight*Math.cos(5*ω0*t), 0);
    lightRight.position.set(rOfLight*Math.sin(5*ω0*t),rOfLight*Math.cos(5*ω0*t), 0);
     lightDown.position.set(0,-rOfLight*Math.sin(5*ω0*t),-rOfLight*Math.cos(5*ω0*t));
       lightUp.position.set(0,rOfLight*Math.sin(5*ω0*t),rOfLight*Math.cos(5*ω0*t));
    /////////// КАДР ///////////
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

changeRotation = () => {
    controls.autoRotate = true;
    
    if (controls.autoRotate) {
        if (mouse.x > 0) {
            controls.autoRotateSpeed = rotationAuto;   
        }
        if (mouse.x < 0) {
            controls.autoRotateSpeed =-rotationAuto;   
        }
    }
};

function cameraOrientation(object) {
    let xcam = camera.position.x; 
    let ycam = camera.position.y; 
    let zcam = camera.position.z; 
    let rcam = dist3D(xcam, ycam, zcam);
    let xObject = object.position.x; 
    let yObject = object.position.y; 
    let zObject = object.position.z;
    let x, y, z;
    
    x = xObject*rcam; 
    y = yObject*rcam; 
    z = zObject*rcam;
    
    // Здесь, ввиду НЕабсолютной точности, 
    // увеличивается радиус удаления камеры, из раза в раз, 
    // и его нужно вернуть обратно
    let r = dist3D(x, y, z); 
    
    if (r > rcam) {
        x = x/r*rcam;
        y = y/r*rcam;
        z = z/r*rcam;
    }
    
    camera.position.set(x, y, z);
    camera.up.set( // Вперёд для юнита = Вверх для Камеры
        object.position.x - object.direction.x, 
        object.position.y - object.direction.y,
        object.position.z - object.direction.z
    );
    camera.lookAt(0, 0, 0);
    camera.updateMatrix();
    camera.updateProjectionMatrix();
}
// сброс камеры при глюках графики
function resetCamera() {
    camera.position.set(0, rCamera * 1.5, rCamera * 3);
    camera.lookAt(0, 0, 0);
    controls.update();
}