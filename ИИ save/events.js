$(document).ready(function() {
    // window.onload = function () {
    window.addEventListener("resize",    onWindowResize,      false); // RESIZE
    window.addEventListener("click", onClick, false);
    window.addEventListener("dblclick", onDblClick, false);
    
    setCamera();
    setObjects();
    setLight();
    addObjects();
    defineAllSets();
    addLight();
    paintAllIcoFaces();
    reload();
    dataStatic(CSV);
    dataChanges(CSV);
    self(CSV);
    animate();
});

onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    
    camera.updateProjectionMatrix();
    camera.updateMatrix();
    camera.lookAt(0, 0, 0);
    
    renderer.setSize(window.innerWidth, window.innerHeight);
};

function onDblClick(event) {
    mouse.x =  (event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    controls.autoRotateSpeed = 0;
    
    let iray = 0;
    // object === СИСТЕМНОЕ свойство 3JS
    CLICK = intersects[iray].object;
    if ((CLICK.type === unitType && CLICK.alive) ||
        (CLICK.type === fieldType)) {
        CLICK = wholeObject(CLICK);
        cameraOrientation(CLICK);
    }
}

function onClick(event) {
    mouse.x =  (event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //console.log("");
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    // если ИГРА и моя очередь или если тренировка
    if ((GAME && queue === uQueue) || (!GAME && (!multiAuto && !singleAuto))) {
        if (!play) {
            if (intersects.length === 0) {     // если ни в один объект не попал указкой
                changeRotation();  // обратить вращение
                clearGraphicsOfUnitCluster(Ψ); // очистить Кластер взятого ПОЛЬЗОВАТЕЛЕМ Юнита
            }
        }
        if (play) {
            if (intersects.length > 0) {
                controls.autoRotateSpeed = 0;
                //console.log(CLICK.name); // Если надо узнать по кому кликнул
                let iray = 0;
                // object === СИСТЕМНОЕ свойство 3JS
                CLICK = intersects[iray].object;
                // пока луч не пересечёт ЖИВОГО (CLICK.alive) юнита
                while (CLICK.type  === unitType &&
                      !CLICK.alive) {
                    iray ++;
                    CLICK = intersects[iray].object;
                }
                let fixCondition = defineCondition(true);
                
                /////////////////////////////////////////////////////////////////////////////
                /////////////////// ПОСЛЕ АКТИВАЦИИ ЮНИТА ///////////////////////////////////
                ///// Ход, Рокировка или Взятие: только если Ψ.type == unitType /////////////
                /////////////////////////////////////////////////////////////////////////////
                if (fixCondition) {
                    //////////////////// ХОД  //////////////////////////////////////////
                    if (CLICK.type  === fieldType && // ХОД на Клетку
                        CLICK.unit  === empty     && // ХОД на ПУСТУЮ Клетку
                        Ψ.sideQueue === queue) {
                        
                        let motion = false; // важная строка на ЗАПРЕТ хода, чтобы потом РАЗРЕШИТЬ ЕГО на УСЛОВИЯХ
                
                        if (ΨCluster.has(CLICK.index)) {
                            motion = true;
                            ΨCluster.clear();
                            clearGraphicsOfUnitCluster(Ψ);
                        }
                        if (motion === true) {
                            unitMoving(Ψ, CLICK);
                            Ψ = unit[0];
                        }
                    }
                    /////////////////// РОКИРОВКА //////////////////////////////////////
                    else if 
                       (Ψ.sort         === helm     &&
                        Ψ.field.index     <= 12     && 
                        CLICK.type     === unitType &&
                        CLICK.side     === Ψ.side   &&
                        CLICK.castling === true) {
                        // если CLICK делается по дополнительным частям Ферзя, то CLICK === Ферзь
                        Φ = wholeObject(CLICK);
                        let change = false; // важная строка на ЗАПРЕТ хода, чтобы потом РАЗРЕШИТЬ ЕГО на УСЛОВИЯХ
                            
                        if (ΨCluster.has(Φ.field.index) &&
                            Φ.field.index <= 12) {
                            change = true;
                            ΨCluster.clear();
                            clearGraphicsOfUnitCluster(Ψ);
                        }
                        if (change) {
                            unitCastling(Ψ, Φ);
                            Ψ = unit[0];
                        } 
                    }
                    //////////////////// ВЗЯТИЕ ////////////////////////////////////////
                    else if 
                       (Ψ.sideQueue === queue    &&
                        CLICK.type  === unitType &&
                        CLICK.alive              &&
                        CLICK.side !== Ψ.side    &&
                        CLICK      !== Ψ         && //  "Самострел"
                        CLICK      !== Ψ.ball    && //  "Самострел" Ферзя
                        CLICK      !== Ψ.tor1    && //  "Самострел" Короля
                        CLICK      !== Ψ.tor2    && //  "Самострел" Короля
                        CLICK      !== Ψ.tor3) {
                            // если CLICK делается по дополнительным частям Ферзя или Короля, 
                            // то CLICK === Ферзь или Король
                            Φ = wholeObject(CLICK);
                            let capture = false; // важная строка на ЗАПРЕТ хода, чтобы потом РАЗРЕШИТЬ ЕГО на УСЛОВИЯХ
                
                            if (ΨCluster.has(Φ.field.index) &&
                                             Φ.sort !== helm) { // НЕЛЬЗЯ ЕСТЬ КОРОЛЯ
                                capture = true;
                                ΨCluster.clear();
                                clearGraphicsOfUnitCluster(Ψ);
                            }
                            if (capture) {
                                unitCapturing(Ψ, Φ);
                                Ψ = unit[0];
                            } 
                        }
                    ////////////////////////////////////////////////////////////////////
                    else {     // если ни в один объект не попал указкой
                        controls.autoRotateSpeed = 0;
                    }
                } 
                /////////////////////////////////////////////////////////////////////////////
                //////////////////////// ДО АКТИВАЦИИ ЮНИТА /////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////
                conditionDecoration(Ψ);
                ////////////////////// нажатие на МЁРТВЫЙ ЮНИТ //////////////////////////////
                if (CLICK.type === unitType && 
                   !CLICK.alive) {
                    console.log("       мёртвый юнит №", CLICK.index); 
                    let deadUnit;
                    deadUnit = CLICK;
                    deadUnit = wholeObject(CLICK);
                    
                    showUnit(deadUnit);
                    showMove(move);
                    showCondition();
                }
                ///////////////////// нажатие на КЛЕТКУ  ///////////////////////////// плохо работает
                else if (CLICK.type === fieldType) {
                    console.log("             клетка №", CLICK.index); 
                    showField(CLICK);
                    showUnit (CLICK.unit);
                    showMove (move);
                    showCondition();
                }
                /////////////////// нажатие на СВОЙ юнит = АКТИВАЦИЯ ЮНИТА //////////////////
                // Смена активности при нажатии на ЮНИТ или ДВИЖУЩИЕСЯ ЧАСТИ
                else if (CLICK.type === unitType &&   // Если клик по юниту
                         CLICK.alive &&               // Если юнит жив
                         CLICK.sideQueue === queue) { // Если юнит ТОГО цвета
                    clearGraphicsOfUnitCluster(Ψ);
                    Ψ = wholeObject(CLICK);
                    //// выравнивание строк в консоли ////
                    let space;
                    if (Ψ.index < 10) {space = " "}
                    else {space = ""}
                    console.log("");
                    console.log("ВРУЧНУЮ: фигура" + space + "№", Ψ.index," на клетке №", Ψ.field.index);
                    /////////////////////////////////////
                    Ψ.mark = true;
                    cameraOnUnit = true;
                        
                    if (Ψ.sideQueue === queue) {
                        ΨCluster = defineUnitCluster(Ψ, true); // показывать кластер юнита, только при очереди его цвета
                    }
                    else if (queue !== Ψ.sideQueue) { 
                        clearGraphicsOfUnitCluster(Ψ);
                    }
                        
                    showField(Ψ.field);
                    showUnit(Ψ);
                    showMove(move);
                    showCondition();
                }
                else if (CLICK.type === unitType &&   // Если клик по юниту
                         CLICK.alive &&               // Если юнит жив
                         CLICK.sideQueue !== queue) { // Если юнит НЕ ТОГО цвета
                    let Ψp = {};   // НЕ ТОГО цвета
                    Ψp = wholeObject(CLICK);
                    //// выравнивание строк в консоли ////
                    let space;
                    if (Ψp.index < 10) {space = " "}
                    else {space = ""}
                    console.log("юнит" + space + "№", Ψp.index," на клетке №", Ψp.field.index);
                            
                    showField(Ψp.field);
                    showUnit(Ψp);
                    showMove(move);
                    showCondition();
                }
            }   // если во что-нибудь попал указкой
            else if (intersects.length === 0) {
                changeRotation(); // обратить вращение
            }
        }
    }
}

$("begin").on("click", function(){
    play = true;
    clearGraphicsOfUnitCluster(Ψ); // очистить кластер юнита, взятого Человеком
    pause();
    table0(); // inputS = js
    inputDepthLevel = document.getElementById("DepthLevel");
    inputDepthLevel.value = DepthLevel;
    inputTimeLimit = document.getElementById("timeLimit");
    inputTimeLimit.value = timeLimit/1000/60;
    inputTimer = document.getElementById("on-off");
    inputTimer.checked = timer;
    reload();
    $("#modal-window").css({"display": "flex"});
    $("begin").css({"display": "none"});
    $("end").css({"display": "flex" });
    $(".in-form" ).css({"display": "flex"});
    $(".settings").css({"display": "none"});  
    $(".description" ).css({"display": "flex" });
    $(".game" ).css({"display": "flex"});
    $(".test" ).css({"display": "none"});
    play = false;
    GAME = true;
    updateHelpElements(); // ← Добавь эту строку // DeepSeek
    bindHelpElements();   // ← И эту  // DeepSeek
    $("select-csv").css({"display": "block"});
    if (CSV === 0) {
       CSV = getRandomInRange(1,3); 
    }
    
    self(CSV);
    chooseCSVplaySign(CSV);
    CONDITION = CONTINUE;
});

/////////////////////////////////////////////////////////////////////////////////////////
$("set-button").on("click", function(){
    table0();
    
    if (timer) {
        $("#rangeValueTime").css({"filter" : "grayscale( 0%) blur(0vh)"});
        $("#timeLimit").css({"filter" : "grayscale( 0%) blur(0vh)"});
        $("#minutes"  ).css({"filter" : "grayscale( 0%) blur(0vh)"});
        $("#percents" ).css({"filter" : "grayscale( 0%) blur(0vh)"});
        $("#timeLimit").css({"pointer-events": "auto"});
        $("#minutes"  ).css({"pointer-events": "auto"});
        $("#percents" ).css({"pointer-events": "auto"});
    }
    else if (!timer) {
        $("#rangeValueTime").css({"filter" : "grayscale(50%) blur(1vh)"});
        $("#timeLimit").css({"filter" : "grayscale(50%) blur(1vh)"});
        $("#minutes"  ).css({"filter" : "grayscale(50%) blur(1vh)"});
        $("#timeLimit").css({"pointer-events": "none"});
        $("#minutes"  ).css({"pointer-events": "none"});
    }
    if (!GAME) {
        $("select-color").css({"display" : "none"});
        $("select-heuristics").css({"display" : "flex"});
        $("select-timelimit").css({"display" : "none"});
        $(".color").css({"display" : "none"});
        $(".heuristics").css({"display" : "flex"});
        $(".time").css({"display" : "none"});
        $("select-csv").css({"display" : "none"});
        $(".time").css({"display" : "none"});
        $(".color").css({"display" : "none"});
        $(".heuristics").css({"display" : "flex"});
    }
    // игра уже началась
    if (GAME && (timeLight + timeDark) !== 0) {
        $("select-color").css({"display" : "flex"});
        $("select-heuristics").css({"display" : "flex"});
        $("select-timelimit").css({"display" : "flex"});
        $(".color").css({"display" : "flex"});
        $(".heuristics").css({"display" : "flex"});
        $(".time").css({"display" : "flex"});
        $("#light").css({"pointer-events": "none"});
        $("#light").css({ "filter": gs80});
        $("#dark").css({"pointer-events": "none"});
        $("#dark").css({ "filter": gs80});
        $("#DepthLevel").css({"pointer-events": "none"});
        $("#DepthLevel").css({ "filter": gs80});
        $("#on-off").css({"pointer-events": "none"});
        $("#on-off").css({ "filter": gs80});
        $("#timeLimit").css({"pointer-events": "none"});
        if (timer) {
            $("#rangeValueTime").css({"filter" : "grayscale(80%) blur(0vh)"});
            $(".select-time").css({"color": "#00ffff"});
            $("#timeLimit").css({"filter" : "grayscale(80%) blur(0vh)"});
            $("#minutes"  ).css({"filter" : "grayscale(80%) blur(0vh)"});
            $("#minutes"  ).css({"pointer-events": "none"});
        }
        else {
            $("#rangeValueTime").css({"filter" : "grayscale(80%) blur(1vh)"});
            $(".select-time").css({"color": "#999999"});
            $("#timeLimit").css({"filter" : "grayscale(80%) blur(1vh)"});
            $("#minutes"  ).css({"filter" : "grayscale(80%) blur(1vh)"});
            $("#minutes"  ).css({"pointer-events": "none"});
        }
    }
    
    // игра ещё не началась
    if (GAME && (timeLight + timeDark) === 0) {
        $("select-color").css({"display" : "flex"});
        $("select-heuristics").css({"display" : "flex"});
        $("select-timelimit").css({"display" : "flex"});
        $(".color").css({"display" : "flex"});
        $(".heuristics").css({"display" : "flex"});
        $(".time").css({"display" : "flex"});
        $("#light").css({"pointer-events": "auto"});
        $("#light").css({ "filter": nogs});
        $("#dark").css({"pointer-events": "auto"});
        $("#dark").css({ "filter": nogs});
        $("#DepthLevel").css({"pointer-events": "auto"});
        $("#DepthLevel").css({ "filter": nogs});
        $("#on-off").css({"pointer-events": "auto"});
        $("#on-off").css({ "filter": nogs});
        $("#timeLimit").css({"pointer-events": "auto"});
        $("#timeLimit").css({ "filter": nogs});
        // если игра ещё не началачь эти элементы зависят от timer true/false
        if (timer) {
            $("#rangeValueTime").css({"filter" : "grayscale( 0%) blur(0vh)"});
            $(".select-time").css({"color": "#00ffff"});
            $("#timeLimit").css({"filter" : "grayscale( 0%) blur(0vh)"});
            $("#minutes"  ).css({"filter" : "grayscale( 0%) blur(0vh)"});
            $("#timeLimit").css({"pointer-events": "auto"});
            $("#minutes"  ).css({"pointer-events": "auto"});
        }
        else {
            $("#rangeValueTime").css({"filter" : "grayscale(80%) blur(1vh)"});
            $(".select-time").css({"color": "#999999"});
            $("#timeLimit").css({"filter" : "grayscale(80%) blur(1vh)"});
            $("#minutes"  ).css({"filter" : "grayscale(80%) blur(1vh)"});
            $("#timeLimit").css({"pointer-events": "none"});
            $("#minutes"  ).css({"pointer-events": "none"});
        }
    }
    $("#modal-window").css({"display": "flex"});
    $(".settings").css({"display": "flex"});
    $(".in-form" ).css({"display": "flex"});
    $(".description" ).css({"display": "none"});
    
    inputDepthLevel = document.getElementById("DepthLevel");
    inputDepthLevel.value = DepthLevel*1;
});

/////////////////////////////////////////////////////////////////////////////////////////
$("help-button").on("click", function(){
    $("#modal-window").css({"display": "flex" });
    $(".in-form" ).css({"display": "flex"});
    $(".description" ).css({"display": "flex" });
    $(".settings" ).css({"display": "none" });
});

bindHelpElements(); // DeepSeek

/////////////////////////////////////////////////////////////////////////////////////////
$("end").on("click", function(){
    play = true;
    timer = false; // в режиме тренировки таймер выключен
    clearGraphicsOfUnitCluster(Ψ); // очистить кластер юнита, взятого Человеком
    pause();
    table0(); 
    inputDepthLevel = document.getElementById("DepthLevel");
    inputDepthLevel.value = DepthLevel;
    inputTimeLimit = document.getElementById("timeLimit");
    inputTimeLimit.value = timeLimit/1000/60;
    inputTimer = document.getElementById("on-off");
    inputTimer.checked = timer;
    reload();
    $("#modal-window").css({"display": "flex"});
    $("begin").css({"display": "flex"});
    $("end").css({"display": "none"});
    $(".in-form" ).css({"display": "flex"});
    $(".settings").css({"display": "none"});  
    $(".description" ).css({"display": "flex" });
    $(".game" ).css({"display": "none"});
    $(".test" ).css({"display": "flex"});
    CSV = 0;  
    self(CSV);
    chooseCSVplaySign(CSV);
    play = true;
    pause();
    GAME = false;
    updateHelpElements(); // ← Добавь эту строку // DeepSeek
    bindHelpElements();   // ← И эту // DeepSeek
    $("select-csv").css({"display": "none"});
    CONDITION = CONTINUE;
});

/////////////////////////////////////////////////////////////////////////////////////////
$("update-button").on ("click", function(){
    reload(); // местная неполная перезагрузка
    availability("set-button",  true);
    availability("help-button", true);
}); 

/////////////////////////////////////////////////////////////////////////////////////////
tableElements.forEach(tableElement => {
    if (!tableElement) return;

    tableElement.addEventListener("click", (event) => {
        event.stopPropagation();
        
        if (tableElement === elemTime) {
            timerView = !timerView;
        }
        
        tableElement.style.color = "#ff0000";
        tableElement.style.backgroundColor = "#0000ff55";
        tableElement.innerHTML = tableElement.default;
    });
});

$("pause").on("click", function () {
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0;
    if (queue) {
       $("d"               ).css({ "border-color": "rgba(0,0,0,0)"});
       $("l")               .css({ "border-color": lightHTML});
    }
    if (!queue) {
       $("l"               ).css({ "border-color": "rgba(0,0,0,0)"});
       $("d")               .css({ "border-color": darkHTML });
    }
    pause();
});

$("l").on("click", function () {
    if (!GAME && play) {
        singleAuto = true;
        
        if (queue) {
            (async () => {
                const currentMove = await MiniMaxAlfaBeta(Depth, TimeMove);
                if (currentMove) {
                    resultingMove(unit[currentMove.id], field[currentMove.to]);
                }
            })();
        }
    }
});

$("d").on("click", function () {
    if (!GAME && play) {
        singleAuto = true;
        
        if (!queue) {
            (async () => {
                const currentMove = await MiniMaxAlfaBeta(Depth, TimeMove);
                if (currentMove) {
                    resultingMove(unit[currentMove.id], field[currentMove.to]);
                }
            })();
        }
    }
});

$("auto-button").on ("click", function(){
    if (!GAME && play) {
        multiAuto = !multiAuto;
    }
    
    if (multiAuto) {
        (async () => {
            const currentMove = await MiniMaxAlfaBeta(Depth, TimeMove);
            if (currentMove) {
                resultingMove(unit[currentMove.id], field[currentMove.to]);
            }
        })();
    }
}); 

$(".vo").on("click",function () {
    CSV = 1;
    console.log("CSV: ", CSV);
    self(CSV);
}); 
$(".bv").on("click",function () {
    CSV = 2;
    console.log("CSV: ", CSV);
    self(CSV);
});
$(".og").on("click",function () {
    CSV = 3;
    console.log("CSV: ", CSV);    
    self(CSV);
});

/////////////////////////////////////////////////////////////////////////////////////////
///// Когда пользователь нажимает на кнопку closeButton, модальное окно закрывается /////
/////////////////////////////////////////////////////////////////////////////////////////
$("#close-button-game").on("click", function(){
    $("#modal-window").css({"display": "none" });
    $("#help-window").css({"display": "none" });
});
$("#close-button-test").on("click", function(){
    $("#modal-window").css({"display": "none" });
    $("#help-window").css({"display": "none" });
});
$("#close-button-game-set").on("click", function(){
    $("#modal-window").css({"display": "none" });
    $("#help-window").css({"display": "none" });
});
$("#close-button-test-set").on("click", function(){
    $("#modal-window").css({"display": "none" });
    $("#help-window").css({"display": "none" });
});

function chooseCSVplaySign(CSV) {
    for (count = 0; count <= 3; count++) {
        if (count === CSV) {
            $(".small-picture-play-" +count).css({"display": "flex"}); 
            $(".small-picture-pause-"+count).css({"display": "none"});
            $(".s-picture-play-" +count).css({"display": "flex"}); 
            $(".s-picture-pause-"+count).css({"display": "none"});
        }
        if (count !== CSV) {
            $(".small-picture-pause-"+count).css({"display": "none"});
            $(".small-picture-play-" +count).css({"display": "none"});
            $(".s-picture-pause-"+count).css({"display": "none"});
            $(".s-picture-play-" +count).css({"display": "none"});
        }
    }
}

function chooseCSVpauseSign(CSV) {
    for (count = 0; count <= 3; count++) {
        if (count === CSV) {
            $(".small-picture-pause-" +count).css({"display": "flex"}); 
            $(".small-picture-play-"  +count).css({"display": "none"});
            $(".s-picture-pause-" +count).css({"display": "flex"}); 
            $(".s-picture-play-"  +count).css({"display": "none"});
        }
        if (count !== CSV) {
            $(".small-picture-pause-"+count).css({"display": "none"});
            $(".small-picture-play-" +count).css({"display": "none"});
            $(".s-picture-pause-"+count).css({"display": "none"});
            $(".s-picture-play-" +count).css({"display": "none"});
        }
    }
}

function time0() {
    timeLight    = 0;
    timeDark     = 0;
    timePause    = 0;
    timeStop     = new Date(); 
    timeGo       = new Date();
    timeBegin    = new Date(); 
    timeEnd      = new Date();
    timeTurn     = timeEnd - timeBegin;
}

pause = () => {    
    play = !play;
    
    if (!play) {
        timePause = 0;
        chooseCSVplaySign(CSV);
        small_block();
        // РАЗблокировка настроек и помощи на паузе
        if (GAME) {
            availability("set",  true);
            availability("help", true);
        }
        
        multiAuto  = false;
        singleAuto = false;
        finalAuto  = false;
        timeStop   = new Date();
    }
    
    if (play) {
        chooseCSVpauseSign(CSV);
        small_unblock();
        // блокировка настроек и помощи ВНЕ паузы
        if (GAME) {
            availability("set",  false);
            availability("help", false);
        }
        
        timeGo    = new Date();
        timePause = timeGo - timeStop;
        
        if (queue) {
            timeLight -= timePause;
            timePause = 0;
        }
        if (!queue) {
            timeDark  -= timePause;
            timePause = 0;
        }
        
        defineCondition(false);
        conditionDecoration(Ψ);   // вот это нужно для показа времени первого хода светлых
        
        availability("d", !queue);
        availability("l",  queue);
        
        //////// Автозапуск ЕСЛИ ИИ === светлые ///////////////////////////////////////
        if (GAME && timeTurn === 0 && queue && move === 1 && !uQueue) { 
            (async () => {
                const currentMove = await MiniMaxAlfaBeta(Depth, TimeMove);
                
                time0();
                
                if (currentMove) {
                    resultingMove(unit[currentMove.id], field[currentMove.to]);
                }
            })();
        }
        ///////////////////////////////////////////////////////////////////////////////
        
        if (timeTurn === 0 && queue && move === 1) { 
            
            time0();
        }
    }
    
    if (GAME) {
        // блокировка АВТОХОДОВ
        $("l").css({"pointer-events": "none"});
        $("d").css({"pointer-events": "none"});
    }
};

function resultingMove(unitA, fieldB) {
    defineUnitCluster(unitA, true);
    showUnit(unitA);
    showMove(move);
    cameraOrientation(unitA.field);
    setTimeout(onDesk, timeDelay, unitA, fieldB);
}

function onDesk(unitA, fieldB) {
    clearGraphicsOfUnitCluster(unitA);
    //////////////////// ХОД  //////////////////////////////////////////
    if (fieldB.unit === empty) {
        
        unitMoving(unitA, fieldB);
    }
    ////////////////// РОКИРОВКА ///////////////////////////////////////
    if (fieldB.unit      !== empty       &&  
        fieldB.unit.side === unitA.side  &&
        unitA.sort       === helm        &&
        unitA.field.index <= 12          &&
        fieldB.index     <= 12           &&
        fieldB.unit.castling === true) {
        
        unitCastling(unitA, fieldB.unit);
    }
    ////////////////////// ВЗЯТИЕ  /////////////////////////////////////
    if (fieldB.unit       !== empty      && 
        fieldB.unit.alive === true       && 
        fieldB.unit.side  !== unitA.side &&
        fieldB.unit.sort  !== helm) {
        
        unitCapturing(unitA, fieldB.unit);
    }
}

function unitMoving(movingUnit, movingField) {
    let player = '';
   
    let xa = movingUnit.position.x;
    let ya = movingUnit.position.y;
    let za = movingUnit.position.z;
    let xb = movingField.position.x;
    let yb = movingField.position.y;
    let zb = movingField.position.z;
    
    displacement(movingUnit, xa, ya, za, xb, yb, zb);
    movingUnit.direction = orientation(xa, ya, za, xb, yb, zb);
    
    let fA = movingUnit.field;
    let fB = movingField;
    movingUnit.previos      = fA;
    movingUnit.previos.unit = empty;
    movingUnit.field        = fB;
    movingUnit.field.unit   = movingUnit;
    movingUnit.step  ++;
    movingUnit.alive = true;
    movingField.unit  = movingUnit;
    movingUnit.mark = false;

    console.log(
        player+"ход №"+move+" "+movingUnit.side+ " "+
        movingUnit.name+
        "(№"+
        movingUnit.index+
        "):"+
        movingUnit.previos.name+
        "(№"+
        movingUnit.previos.index+
        ")👣"+ 
        movingUnit.field.name+
        "(№"+
        movingUnit.field.index+
        ")"
    );
    
    fA.geometry         = circ;
    fA.material.opacity = 0;
    fB.geometry         = circ;
    fB.material.opacity = 0;
    
    endOfTurn(movingUnit);
}

function unitCastling(movingUnitA, movingUnitB) {
    let player = '';
    
    let xa = movingUnitA.position.x;
    let ya = movingUnitA.position.y;
    let za = movingUnitA.position.z;
    let xb = movingUnitB.position.x;
    let yb = movingUnitB.position.y;
    let zb = movingUnitB.position.z;
    
    displacement(movingUnitA, xa, ya, za, xb, yb, zb);
    displacement(movingUnitB, xb, yb, zb, xa, ya, za);
    
    movingUnitA.direction = orientation(xa, ya, za, xb, yb, zb);
    movingUnitB.direction = orientation(xb, yb, zb, xa, ya, za);
    
    let fieldA = movingUnitA.field;
    let fieldB = movingUnitB.field;
    movingUnitA.field = fieldB;
    movingUnitB.field = fieldA;
    movingUnitA.previos = fieldA;
    movingUnitB.previos = fieldB;
    movingUnitA.field.unit = movingUnitA;
    movingUnitB.field.unit = movingUnitB;
    movingUnitA.step ++;
    movingUnitB.step ++; 
    movingUnitA.mark     = false;
    movingUnitB.mark     = false;
    movingUnitB.castling = false;
    // если Король рокируется с Ферзём
    switch (movingUnitB.index) {
        case  2:
        case 28:
            movingUnitB.ball.castling = false;
            break;
    }
    
    console.log(player+"ход №"+move+" "+movingUnitA.side+ " "+
        movingUnitA.name+
        "(№"+
        movingUnitA.index+
        "):"+
        movingUnitA.previos.name+
        "(№"+
        movingUnitA.previos.index+
        ")👑"+
        movingUnitB.name+
        "(№"+
        movingUnitB.index+
        "):"+
        movingUnitB.previos.name+
        "(№"+
        movingUnitB.previos.index+
        ")"
    );
    
    fieldA.geometry         = circ;
    fieldA.material.opacity = 0;
    fieldB.geometry         = circ;
    fieldB.material.opacity = 0;
    
    endOfTurn(movingUnitA);
}

function unitCapturing(movingUnitA, movingUnitB) {
    let player = '';
    
    let xa = movingUnitA.position.x;
    let ya = movingUnitA.position.y;
    let za = movingUnitA.position.z;
    let xb = movingUnitB.position.x;
    let yb = movingUnitB.position.y;
    let zb = movingUnitB.position.z;
    
    displacement(movingUnitA, xa, ya, za, xb, yb, zb);
    movingUnitA.direction = orientation(xa, ya, za, xb, yb, zb);
    
    let fieldA = movingUnitA.field;
    let fieldB = movingUnitB.field;
    movingUnitA.field = fieldB;
    movingUnitB.field = fieldB;
    movingUnitA.previos = fieldA;
    movingUnitA.field.unit = movingUnitA;
    movingUnitA.step ++;
    movingUnitA.mark = false;
    movingUnitB.mark = false;
    movingUnitB.field.deadUnits ++;
    movingUnitB.h     = movingUnitB.field.deadUnits;
    movingUnitB.t     = t;
    movingUnitB.alive = false;
    movingUnitB.mdead = move;
    
    switch (movingUnitB.index) {
        case  2:
        case 28:
            movingUnitB.ball.alive = false;
            break;
        case  1:
        case 27:
            movingUnitB.tor1.alive = false;
            movingUnitB.tor2.alive = false;
            movingUnitB.tor3.alive = false;
            break;
    }
    
    movingUnitB.xd   = movingUnitB.position.x;
    movingUnitB.yd   = movingUnitB.position.y;
    movingUnitB.zd   = movingUnitB.position.z;
    
    let kDown = 1.08; // корректировочный коэффициент понижения короля и ферзя над доской
    switch (movingUnitB.index) {
        case  1:
        case 27:
        case  2:
        case 28:
            movingUnitB.xd /= kDown;
            movingUnitB.yd /= kDown;
            movingUnitB.zd /= kDown;
        break;
    }
 
    console.log(player+"ход №"+move+" "+movingUnitA.side+ " "+
        movingUnitA.name+
        "(№"+
        movingUnitA.index+
        "):"+
        fieldA.name+
        "(№"+
        fieldA.index+
        ")☠️"+ 
        movingUnitB.name+
        "(№"+
        movingUnitB.index+
        "):"+
        fieldB.name+
        "(№"+
        fieldB.index+
        ")"
    );
    
    fieldA.unit             = empty;
    fieldA.geometry         = circ;
    fieldB.geometry         = circ;
    fieldA.material.opacity = 0;
    fieldB.material.opacity = 0;
    
    endOfTurn(movingUnitA);
}

function endOfTurn(unitA) {
    timeEnd    = new Date();
    timeTurn   = timeEnd - timeBegin;
    console.log("timeTurn: ", timeTurn);
        
    if (queue) {
        timeLight += timeTurn;
    }
    if (!queue) {
        timeDark  += timeTurn;
    }
     
    let fixCondition = defineCondition(true);
    
    conditionDecoration(unitA);
    
    if (!fixCondition) {
        unblock();
        final_block();
    }
    if (fixCondition) {
        queue = !queue;
        if (queue) {
            move++;
        }
    }
    
    clearGraphicsOfUnitCluster(Ψ);
    clearGraphicsOfUnitCluster(unitA);
    clearGraphicsOfUnitCluster(unit[1]);
    clearGraphicsOfUnitCluster(unit[27]);
    
    defineAllSets();    
    
    makeSystem();
    showTargetFunction(Ωfull(system));
    
    const Ω_number = Ωfull(system);
    
    if (Ω_number >   0) { colorΩType =   lightHTML }
    if (Ω_number === 0) { colorΩType = neutralHTML }
    if (Ω_number <   0) { colorΩType =    darkHTML }
    
    const Ω_string  = space(Ω_number)   + signForConsole(Ω_number)   + String(Ω_number);
    
    const styles = [
        `color: ${neutralHTML};`,
        `color: ${colorΩType};`
    ];
    
    const logLine =`%c🍀 Текущая оценка (Ω) =%c${Ω_string}`;
    
    console.log(logLine, ...styles);
    
    transpositionTable.clear();
    
    let timeOut = timeTurn;
    timeTurn  = 0;
    timeBegin = new Date();
    timeEnd   = new Date();
    timePause = 0;
    timeStop  = new Date(); // ВРОДЕ ЭТО ЛЕЧЕНИЕ БАГА  -timePause
    timeGo    = new Date(); // ВРОДЕ ЭТО ЛЕЧЕНИЕ БАГА  -timePause
    
    if (singleAuto) {
        singleAuto = false;
    }
    
    availability("d", !queue);
    availability("l",  queue);
    
    if (GAME) {
        $("l").css({"pointer-events": "none" });
        $("d").css({"pointer-events": "none" });
    }
    if (queue) {
      $("d").css({ "border-color": "rgba(0,0,0,0)"});
      $("l").css({ "border-color": lightHTML});
    }
    if (!queue) {
      $("l").css({ "border-color": "rgba(0,0,0,0)"});
      $("d").css({ "border-color": darkHTML });
    }
    
    processTurn();
}

async function processTurn() {
    if (!queue && uQueue && GAME) {
        const currentMove = await MiniMaxAlfaBeta(Depth, TimeMove);
        
        if (currentMove) {
            resultingMove(unit[currentMove.id], field[currentMove.to]);
        }
        return; // выход после хода
    }
    
    if (queue && !uQueue && GAME) {
        const currentMove = await MiniMaxAlfaBeta(Depth, TimeMove);
        
        if (currentMove) {
            resultingMove(unit[currentMove.id], field[currentMove.to]);
        }
        return;
    }
    
    let fixCondition = defineCondition(true);
        
    if (multiAuto && fixCondition) {
        //const currentMove = Situiter(system);
        
        const currentMove = await MiniMaxAlfaBeta(Depth, TimeMove);
        
        if (currentMove) {
            resultingMove(unit[currentMove.id], field[currentMove.to]);
        }
        return;
    }
}


///// ШАХ ////////////
function statusCheck() {
    let   lightKingField = unit[nLUBegin].field.index;
    let    darkKingField = unit[nDUBegin].field.index;
    let              now = false;
    let       checkLight = false;
    let        checkDark = false;

    for (k = nDUBegin; k <= 52; k++) {
        // ЗДЕСЬ перебираются ВСЕ юниты
        let w = unit[k].field.index; // берётся индекс ПОЛЯ перебираемого ЮНИТА
        switch (unit[k].alive) { // только если ЖИВОЙ
            case true:
                switch (unit[k].sort) {
                    case axe:
                        if (axeCheckCluster(w).has(lightKingField)) {
                            checkLight = true;
                        }
                        break; // Ладья  = Топор
                    case pike:
                        if (pikeCheckCluster(w).has(lightKingField)) {
                            checkLight = true;
                        }
                        break; // Слон   = Пика
                    case arrow:
                        if (arrowCheckCluster(w).has(lightKingField)) {
                            checkLight = true;
                        }
                        break; // пешка  = Стрела
                    case dart:
                        if (dartCheckCluster(w).has(lightKingField)) {
                            checkLight = true;
                        }
                        break; // Конь   = Дротик
                    case sword:
                        if (swordCheckCluster(w).has(lightKingField)) {
                            checkLight = true;
                        }
                        break; // Ферзь  = Меч
                    case helm:
                        if (helmCheckCluster(w).has(lightKingField)) {
                            checkLight = true;
                        }
                        break; // Король = Шлем (С Рокировкой)
                }
                break;
        }
    }
    
    for (k = nLUBegin; k <= 26; k++) {
        // ЗДЕСЬ перебираются ВСЕ юниты
        let w = unit[k].field.index; // берётся индекс ПОЛЯ перебираемого ЮНИТА
        switch (unit[k].alive) { // только если ЖИВОЙ
            case true:
                switch (unit[k].sort) {
                    case axe:
                        if (axeCheckCluster(w).has(darkKingField)) {
                            checkDark = true;
                        }
                        break; // Ладья  = Топор
                    case pike:
                        if (pikeCheckCluster(w).has(darkKingField)) {
                            checkDark = true;
                        }
                        break; // Слон   = Пика
                    case arrow:
                        if (arrowCheckCluster(w).has(darkKingField)) {
                            checkDark = true;
                        }
                        break; // пешка  = Стрела
                    case dart:
                        if (dartCheckCluster(w).has(darkKingField)) {
                            checkDark = true;
                        }
                        break; // Конь   = Дротик
                    case sword:
                        if (swordCheckCluster(w).has(darkKingField)) {
                            checkDark = true;
                        }
                        break; // Ферзь  = Меч
                    case helm:
                        if (helmCheckCluster(w).has(darkKingField)) {
                            checkDark = true;
                        }
                        break; // Король = Шлем (С Рокировкой)
                }
                break;
        }
    }
    
    if (checkLight) {
        
        STATUSCOLOR = lightHTML;
        CONDITION   = CHECK;
        unit[nLUBegin].underCheck = true;
        console.log("ШАХ Светлым, Ход № =", move);
        elemCheckMate.innerHTML   = CONDITION;
        pent_or_hex(unit[nLUBegin]);
        field[lightKingField].material.opacity = strongOpacity;
        field[lightKingField].geometry = tor;
        field[lightKingField].material.color.setHex(darkField); // подсветить кольцо вокруг короля вражеским цветом
    }  
    if (checkDark) {
        
        STATUSCOLOR = darkHTML;
        CONDITION   = CHECK;
        unit[nDUBegin].underCheck = true;
        console.log("ШАХ  Тёмным, Ход № =", move);
        elemCheckMate.innerHTML   = CONDITION;
        pent_or_hex(unit[nDUBegin]);
        field[darkKingField].material.opacity = strongOpacity;
        field[darkKingField].geometry = tor;
        field[darkKingField].material.color.setHex(lightField); // подсветить кольцо вокруг короля вражеским цветом
    } 
    
    if (checkLight || checkDark) {
        now = true;
    }
    if (!checkLight && !checkDark) {
        now = false;
       
        if (queue === true) {
            CONDITION   = CONTINUE;
            elemCheckMate.innerHTML   = CONDITION;
            STATUSCOLOR = lightHTML;
            elemCheckMate.style.color = lightHTML;
        }
        if (queue === false) {
            CONDITION   = CONTINUE;
            elemCheckMate.innerHTML   = CONDITION;
            STATUSCOLOR = darkHTML;
            elemCheckMate.style.color = darkHTML;
        }
        unit[nLUBegin].underCheck = false;
        unit[nDUBegin].underCheck = false;
        field[lightKingField].material.opacity = 0;
        field[ darkKingField].material.opacity = 0;
    }
    return now;
};

///// МАТ ////////////
function statusCheckMate() {
    let i;
    lightKingField = unit[nLUBegin].field.index;
    darkKingField  = unit[nDUBegin].field.index;
    let now = false;
    let Σ = 0;
    let cluster = [];
    let iBegin, iEnd, iSide, toSide, word0;

    if (STATUSCOLOR === lightHTML) {
        iBegin = nLUBegin;
        iEnd = nLUEnd;
        iSide = lightSide;
        toSide = "Cветлым";
        word0  = "Cветлых ";
    }
    if (STATUSCOLOR === darkHTML) {
        iBegin = nDUBegin;
        iEnd   = nDUEnd;
        iSide  = darkSide;
        toSide = "Тёмным ";
        word0  = "Тёмных ";
    }
    for (i = iBegin; i <= iEnd; i++) {
        cluster[i] = 0;
        let v = unit[i].field.index;
        switch (unit[i].alive) {
            case true:
                switch (unit[i].side) {
                    case iSide:
                        switch (unit[i].sort) {
                            case axe:
                                cluster[i] = axeUnitCluster(v, false, 0, black).size;
                                break; // Ладья  = Топор
                            case pike:
                                cluster[i] = pikeUnitCluster(v, false, 0, black).size;
                                break; // Слон   = Пика
                            case arrow:
                                cluster[i] = arrowUnitCluster(v, false, 0, black).size;
                                break; // пешка  = Стрела , ζmin, ζmax
                            case dart:
                                cluster[i] = dartUnitCluster(v, false, 0, black).size;
                                break; // Конь   = Дротик
                            case sword:
                                cluster[i] = swordUnitCluster(v, false, 0, black).size;
                                break; // Ферзь  = Меч
                            case helm:
                                cluster[i] = helmUnitCluster(v, false, 0, black).size;
                                break; // Король = Шлем (С Рокировкой)
                        }
                        break;
                }
                break;
        }
        if (cluster[i] > 0) {
            //console.log("Вариантов для защиты = " + cluster[i] + " даёт " + unit[i].name);
            Σ += cluster[i];
        }
    }
    if (Σ > 0) {
        //console.log("Вариантов хода у " + word0 + " = " + Σ);
    }
    if ((Σ === 0 && unit[nLUBegin].underCheck === true) || 
        (Σ === 0 && unit[nDUBegin].underCheck === true)) {
        now = true;
        
        CONDITION   = MATE;
        console.log("МАТ " + toSide + "!!! Ход № =", move);
        elemCheckMate.innerHTML = CONDITION;
           
        if (STATUSCOLOR === lightHTML) {
            elemCheckMate.style.color = lightHTML;
            pent_or_hex(unit[nLUBegin]);
            field[lightKingField].material.opacity = strongOpacity;
            field[lightKingField].geometry = tor;
            field[lightKingField].material.color.setHex(darkField);
            cameraOrientation (unit[nLUBegin]);
        }
        if (STATUSCOLOR === darkHTML) {
            elemCheckMate.style.color = darkHTML;
            pent_or_hex(unit[nDUBegin]);
            field[darkKingField].material.opacity = strongOpacity;
            field[darkKingField].geometry = tor;
            field[darkKingField].material.color.setHex(lightField);
            cameraOrientation (unit[nDUBegin]);
        }
    }
    return now;
}

///// ПАТ ////////////
function statusStaleMate() {
    let i;
    lightKingField = unit[nLUBegin].field.index;
    darkKingField  = unit[nDUBegin].field.index;
    let now = false;
    let Σ = 0;
    let cluster = [];
    let iBegin, iEnd, iSide, toSide, word0, word1;

    if (queue) {
        iBegin = nLUBegin;
        iEnd = nLUEnd;
        iSide = lightSide;
        toSide = "на Cветлых";
    } else if (!queue) {
        iBegin = nDUBegin;
        iEnd   = nDUEnd;
        iSide  = darkSide;
        toSide  = "на Тёмных ";
    } else {
        iBegin = 0;
        iEnd = 0;
        iSide = side;
        word0 = "";
        word1 = "";
        Σ = -1;
    }
    for (i = iBegin; i <= iEnd; i++) {
        cluster[i] = 0;
        let v = unit[i].field.index;
        let s = 0;
        let c = black;
        switch (unit[i].alive) {
            case true:
                switch (unit[i].side) {
                    case iSide:
                        switch (unit[i].sort) {
                            case axe:
                                cluster[i] = axeUnitCluster(v, false, s, c).size;
                                break; // Ладья  = Топор
                            case pike:
                                cluster[i] = pikeUnitCluster(v, false, s, c).size;
                                break; // Слон   = Пика
                            case arrow:
                                cluster[i] = arrowUnitCluster(v, false, s, c).size;
                                break; // пешка  = Стрела , ζmin, ζmax
                            case dart:
                                cluster[i] = dartUnitCluster(v, false, s, c).size;
                                break; // Конь   = Дротик
                            case sword:
                                cluster[i] = swordUnitCluster(v, false, s, c).size;
                                break; // Ферзь  = Меч
                            case helm:
                                cluster[i] = helmUnitCluster(v, false, s, c).size;
                                break; // Король = Шлем (С Рокировкой)
                        }
                        break;
                }
                break;
        }
        if (cluster[i] > 0) {
            //console.log('Вариантов для защиты = ' + cluster[i] + ' даёт ' + unit[i].name)
            Σ += cluster[i];
        }
    }
    if (Σ > 0) {
        now = false;
        // console.log("Вариантов хода у " + word0 + " = " + Σ);
    }
    if (Σ === 0) {
        now = true;
        
        CONDITION   = STALEMATE;
        STATUSCOLOR = brightHTML;
        console.log("ПАТ " + toSide + "!!! Ход № =", move);
        elemCheckMate.innerHTML   = CONDITION;
           
        if (STATUSCOLOR === brightHTML) {
            elemCheckMate.style.color = brightHTML;
        }
        if (queue) {
            pent_or_hex(unit[nLUBegin]);
            field[lightKingField].material.opacity = strongOpacity;
            field[lightKingField].geometry = tor;
            field[lightKingField].material.color.setHex(neutralField);
            cameraOrientation (unit[nLUBegin]); // камера разворачивается на ПАТ только в режиме ДЕМО
        }
        if (!queue) {
            pent_or_hex(unit[nDUBegin]);
            field[darkKingField].material.opacity = strongOpacity;
            field[darkKingField].geometry = tor;
            field[darkKingField].material.color.setHex(neutralField);
            cameraOrientation (unit[nDUBegin]); // камера разворачивается на ПАТ
        }
    }
    return now;
}

///// ПУСТАЯ НИЧЬЯ ////////////
function statusDraw() {
    let now = false;
    let aliveUnits = new Set(); // коллекция для номеров ЖИВЫХ ЮНИТОВ
    
    for (count = 1; count <= nUnits; count++) {
        if (unit[count].alive === true) {
            if (unit[count].alive === true) {
                aliveUnits.add(unit[count].index);
            }    
        }
    }
    // ОГРАНИЧЕНИЕ для БИТВЫ БОТОВ
    if (aliveUnits.size <= 2) { 
        now = true;
       
        CONDITION   = DRAW;
        STATUSCOLOR = brightHTML;
        console.log("ПОЛНАЯ НИЧЬЯ " + "!!! Ход № =", move);
        elemCheckMate.innerHTML   = CONDITION;
     
        if (STATUSCOLOR === brightHTML) {
            if (LOGIN !== null) {
                elemCheckMate.style.color = brightHTML;
            }
        }
    }
    return now;
}

///// РАЗГРОМ  ////////////
function statusCrash() {
    let now = false;
    lightKingField = unit[nLUBegin].field.index;
    darkKingField  = unit[nDUBegin].field.index;
    let crashLight = false;
    let crashDark  = false;
    let aliveLight = new Set(); // коллекция для номеров ЖИВЫХ ЮНИТОВ
    let aliveDark  = new Set(); // коллекция для номеров ЖИВЫХ ЮНИТОВ
    let iBegin, iEnd, iSide, toSide, word0;

    if (STATUSCOLOR === lightHTML) {
        iBegin = nLUBegin;
        iEnd = nLUEnd;
        iSide = lightSide;
        toSide = "Cветлому ";
        word0  = "Cветлому ";
    }
    if (STATUSCOLOR === darkHTML) {
        iBegin = nDUBegin;
        iEnd   = nDUEnd;
        iSide  = darkSide;
        toSide = "Тёмному ";
        word0  = "Тёмному ";
    }
    
    for (count = 1; count <= nUnits; count++) {
        if (unit[count].alive === true) {
            if (unit[count].sideQueue === true) {
                aliveLight.add(unit[count].index);
            } 
            if (unit[count].sideQueue === false) {
                aliveDark.add(unit[count].index);
            }    
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////
    crashLight = (aliveLight.size === 1 && aliveDark.size  >= 1);
    crashDark  = (aliveDark.size  === 1 && aliveLight.size >= 1);
    ////////////////////////////////////////////////////////////////////////////////////////////
    if (crashLight || crashDark) {
        now = true;     
        
        CONDITION = CRASH;
        console.log("РАЗГРОМ " + toSide + "!!! Ход № =", move);
        elemCheckMate.innerHTML = CONDITION;
        
        if (crashLight) {    
            elemCheckMate.style.color = lightHTML;
            pent_or_hex(unit[nLUBegin]);
            field[lightKingField].material.opacity = strongOpacity;
            field[lightKingField].geometry = tor;
            field[lightKingField].material.color.setHex(darkField);
            cameraOrientation (unit[nLUBegin]);
        }
        if (crashDark) {
            elemCheckMate.style.color = darkHTML;
            pent_or_hex(unit[nDUBegin]);
            field[darkKingField].material.opacity = strongOpacity;
            field[darkKingField].geometry = tor;
            field[darkKingField].material.color.setHex(lightField);
            cameraOrientation (unit[nDUBegin]); 
        }
    }
    
    return now;
}

///// ВРЕМЯ ////////////
function statusTime() {
    let now = false;
    
    if (ΔTime <= 0 || timeIsUp) { 
        now = true;
        
        CONDITION = TIME;
        elemCheckMate.innerHTML = CONDITION;
        multiAuto  = false;
        singleAuto = false;
            
        if (queue) {
            timeLight += timeTurn;
            if (timeLight >= timeLimit) {
                elemCheckMate.style.color = lightHTML;
                STATUSCOLOR === lightHTML
                console.log("Время Светлых вышло!");
            }
        }
        if (!queue) {
            timeDark += timeTurn;
            if (timeDark  >= timeLimit) {
                elemCheckMate.style.color = darkHTML;
                STATUSCOLOR === darkHTML
                console.log("Время Тёмных вышло!");
            }
        }
    }
    return now;
}

// ... Определить состояние
function defineCondition() {
    let result;
    
    if (statusCheck()) {
        if (statusCheckMate()) {
            result = false;
        }
        else {
            result = true;
        }
    }
    else if (statusStaleMate()) {
        result = false
    }
    else if (statusDraw()) {
        result = false
    }
    else if (statusCrash()) {
        result = false
    }
    else if (statusTime()) {
        result = false
    }
    else {
        result = true;
    }

    /////////УСЛОВИЯ НА СТОПОР КАРТИНКИ //////////////////
    if (!result) {
        unblock();
        final_block();
    } 
    
    return result;
}