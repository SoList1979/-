////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// ВКЛЮЧЕНИЕ ПОЛЕЙ В КЛАСТЕРЫ юнитов ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function helmUnitCluster(v, grahics, opacity, color) {
    let cluster = new Set();
    let vUnit = field[v].unit;
    let s = starHelm[v];
    let u;
    
    s.forEach((u) => {
        const currentUnit = field[u].unit;
        const isEmpty = currentUnit === empty;
        const isEnemy = !isEmpty && currentUnit.side !== vUnit.side;
    
        if (isEmpty || isEnemy) {
            cluster.add(u);
            if (grahics) {
                const shape = isEmpty ? circ : torSmall;
                fieldGraphic(u, shape, color, opacity);
            }
        }
    });
    if (v <= 12) {
        s = starOfCastling[v];
        s.forEach((u, uAgain, s) => {
            if (field[u].unit !== empty           && // Если клетка НЕ ПУСТА
                field[u].unit.side === vUnit.side && // Если на клетке СВОЙ Юнит
                field[u].unit.castling === true) {   // Если юнит-партнёр не исчерпал свою рокировку
                // Если МОЖНО
                cluster.add(u);
                pent_or_hex(field[u].unit);
                if (grahics) { //
                    fieldGraphic(u, torΨ, white, opacity);
                }
            }
        });
    }
    cluster.forEach((u, uAgain, cluster) => {
        if (typeof u === "number" && 
            testAutoCheck(field[v].unit, field[u].unit, field[v], field[u]) &&
            cluster.has(u)) {
            // ЕСЛИ в результате ХОДА/ВЗЯТИЯ будет ШАХ от ВРАГА, то НЕЛЬЗЯ!!!
            if (grahics) {
                fieldGraphic(u, circ, black, 0);
            }
            cluster.delete(u);
        }
    });
    
    return cluster; 
}
function dartUnitCluster(v, grahics, opacity, color) {
    let cluster = new Set(); // коллекция для Кластера ТЕКУЩЕГО юнита
    let vUnit = field[v].unit;
    let s = starDart[v];
    let u;
    
    s.forEach((u) => {
        const currentUnit = field[u].unit;
        const isEmpty = currentUnit === empty;
        const isEnemy = !isEmpty && currentUnit.side !== vUnit.side;
        // Общая обработка пустых и вражеских клеток
        if (isEmpty || isEnemy) {
            cluster.add(u);
            if (grahics) {
                fieldGraphic(u, isEmpty ? circ : torSmall, color, opacity);
            }
        }
        // Проверка на шах
        if (typeof u === "number" && 
            cluster.has(u) && 
            testAutoCheck(field[v].unit, currentUnit, field[v], field[u])) {
            if (grahics) {
                fieldGraphic(u, circ, black, 0);
            }
            cluster.delete(u);
        }
    });
    return cluster; 
}
////////////////////////////////////////////////////////////////
function swordUnitCluster(v, grahics, opacity, color) {
    let pikeSet = new Set();
    pikeSet = sectionCluster(v, pike, grahics, opacity, color, false);
    let axeSet = new Set();
    axeSet =  sectionCluster(v, axe, grahics, opacity, color, false);
    
    let cluster = new Set([...pikeSet, ...axeSet]);
    
    return cluster; 
}
function sectionCluster(v, sort, grahics, opacity, color) {
    let cluster = new Set(); // коллекция для Кластера ТЕКУЩЕГО юнита
    let vUnit = field[v].unit;
    let p = vUnit.previos.index;
    let section;
    
    if (sort === axe) {
        section = starAxe[v];
    }
    if (sort === pike) {
        section = starPike[v];
    }
    
    for (i = 1; i <= section.length - 1; i++) {
        let jFix = section[i].length - 1;

        for (let j = jFix; j >= 1; j--) {
        //for (let j = 1; j <= jFix; j++) {
            let u = section[i][j];

            if (field[u].unit !== empty && field[u].unit.side !== vUnit.side) {
                jFix = j; // чужая включается в кластер
            }
            if (field[u].unit !== empty && field[u].unit.side === vUnit.side) {
                jFix = j - 1; // своя исключается из кластера
            }
        }
        for (j = 1; j <= jFix; j++) {
            let u = section[i][j];

            if (field[u].unit === empty) {
                field[u].geometry = circ; // Диск + Кольцо = Обозначение Пустой Клетки
            }
            if (field[u].unit !== empty) {
                field[u].geometry = torSmall; // Кольцо = Обозначение Занятой Вражеской Клетки
            }
            
            cluster.add(u);
            if (grahics) { //
                fieldGraphic(u, field[u].geometry, color, opacity);
            }
        }
    }
    cluster.forEach((u, uAgain, cluster) => {
        if (typeof u === "number" &&
            testAutoCheck(field[v].unit, field[u].unit, field[v], field[u]) &&
            cluster.has(u)) {
            // ЕСЛИ в результате ХОДА/ВЗЯТИЯ будет ШАХ от ВРАГА, то НЕЛЬЗЯ!!!
            if (grahics) {
                fieldGraphic(u, circ, black, 0);
            }
            cluster.delete(u);
        }
    });
    
    return cluster; 
}
////////////////////////////////////////////////////////////////
function axeUnitCluster(v, grahics, opacity, color) {
    let cluster = new Set(); // коллекция для Кластера ТЕКУЩЕГО юнита
    let vUnit = field[v].unit;
    let p = vUnit.previos.index;
  
    for (i = 0; i <= beamAxe[p][v].length - 1; i++) {
        let jFix = beamAxe[p][v][i].length - 1;

        for (let j = jFix; j >= 1; j--) {
        //for (let j = 1; j <= jFix; j++) {
            let u = beamAxe[p][v][i][j];

            if (field[u].unit !== empty && field[u].unit.side !== vUnit.side) {
                jFix = j; // чужая включается в кластер
            }
            if (field[u].unit !== empty && field[u].unit.side === vUnit.side) {
                jFix = j - 1; // своя исключается из кластера
            }
        }
        for (j = 1; j <= jFix; j++) {
            let u = beamAxe[p][v][i][j];

            if (field[u].unit === empty) {
                field[u].geometry = circ; // Диск + Кольцо = Обозначение Пустой Клетки
            }
            if (field[u].unit !== empty) {
                field[u].geometry = torSmall; // Кольцо = Обозначение Занятой Вражеской Клетки
            }
            
            cluster.add(u);
            if (grahics) { //
                fieldGraphic(u, field[u].geometry, color, opacity);
            }
        }
    }
    cluster.forEach((u, uAgain, cluster) => {
        if (typeof u === "number" &&
            testAutoCheck(field[v].unit, field[u].unit, field[v], field[u]) &&
            cluster.has(u)) {
            // ЕСЛИ в результате ХОДА/ВЗЯТИЯ будет ШАХ от ВРАГА, то НЕЛЬЗЯ!!!
            if (grahics) {
                fieldGraphic(u, circ, black, 0);
            }
            cluster.delete(u);
        }
    });
    
    return cluster; 
}
function pikeUnitCluster(v, grahics, opacity, color) {
    let cluster = new Set(); // коллекция для Кластера ТЕКУЩЕГО юнита
    let vUnit = field[v].unit;
    let p = vUnit.previos.index;
  
    for (i = 0; i <= beamPike[p][v].length - 1; i++) {
        let jFix = beamPike[p][v][i].length - 1;

        for (let j = jFix; j >= 1; j--) {
        //for (let j = 1; j <= jFix; j++) {
            let u = beamPike[p][v][i][j];
            if (field[u].unit !== empty && field[u].unit.side !== vUnit.side) {
                jFix = j; // чужая включается в кластер
            }
            if (field[u].unit !== empty && field[u].unit.side === vUnit.side) {
                jFix = j - 1; // своя исключается из кластера
            }
        }
        for (j = 1; j <= jFix; j++) {
            let u = beamPike[p][v][i][j];

            if (field[u].unit === empty) {
                field[u].geometry = circ; // Диск + Кольцо = Обозначение Пустой Клетки
            }
            if (field[u].unit !== empty) {
                field[u].geometry = torSmall; // Кольцо = Обозначение Занятой Вражеской Клетки
            }
            
            cluster.add(u);
            if (grahics && field[u].unit.side !== vUnit.side) { //
                fieldGraphic(u, field[u].geometry, color, opacity);
            }
        }
    }
    cluster.forEach((u, uAgain, cluster) => {
        if (typeof u === "number" &&
            testAutoCheck(field[v].unit, field[u].unit, field[v], field[u]) && // ЕСЛИ в результате ХОДА/ВЗЯТИЯ будет ШАХ от ВРАГА, то НЕЛЬЗЯ!!!
            cluster.has(u)) {
            if (grahics) {
                fieldGraphic(u, circ, black, 0);
            }
            cluster.delete(u);
        }
    });
    
    return cluster;
}
function arrowUnitCluster(v, grahics, opacity, color) {
    let cluster = new Set(); // коллекция для Кластера ТЕКУЩЕГО юнита
    let vUnit = field[v].unit;
    let p = vUnit.previos.index;
    let s = starArrow[v];
    let u;
    
    s.forEach((u, uAgain, s) => {
        if (vUnit.step === 0) {
            if (firstMoveArrow[p][v].has(u) &&
                field[u].unit === empty && 
                !cluster.has(u)) {
                cluster.add(u);
                if (grahics) {
                    fieldGraphic(u, circ, color, opacity);
                }
            }
            if (firstCaptureArrow[p][v].has(u) &&
                field[u].unit !== empty && 
                field[u].unit.side !== vUnit.side && // Если на клетке ЧУЖОЙ Юнит
                !cluster.has(u)) {
                cluster.add(u);
                if (grahics) {
                    fieldGraphic(u, torSmall, color, opacity);
                }
            }
        }
        if (vUnit.step !== 0) {
            if (moveArrow[p][v].has(u) &&
                field[u].unit === empty && 
                !cluster.has(u)) {
                cluster.add(u);
                if (grahics) {
                    fieldGraphic(u, circ, color, opacity);
                }
            }
            if (captureArrow[p][v].has(u) &&
                field[u].unit !== empty && 
                field[u].unit.side !== vUnit.side && // Если на клетке ЧУЖОЙ Юнит
                !cluster.has(u)) {
                cluster.add(u);
                if (grahics) {
                    fieldGraphic(u, torSmall, color, opacity);
                }
            }
        }
        if (typeof u === "number" &&
            testAutoCheck(field[v].unit, field[u].unit, field[v], field[u]) && // ЕСЛИ в результате ХОДА/ВЗЯТИЯ будет ШАХ от ВРАГА, то НЕЛЬЗЯ!!!
            cluster.has(u)) {
            if (grahics) {
                fieldGraphic(u, circ, black, 0);
            }
            cluster.delete(u);
        }
    });
    
    return cluster;
}
//////////////////////////////////////////////////////////////
///////// определение КЛЕТКИ Короля по его СТОРОНЕ ///////////
//////////////////////////////////////////////////////////////
function ownKingField(side) {
    let numberKingField;
    
    if (side == lightSide) {
        // Если взятие или ход Светлых
        numberKingField = unit[01].field.index; // ПРОВЕРЯЕМ Светлого
    }
    if (side == darkSide) {
        // Если взятие или ход Тёмных
        numberKingField = unit[27].field.index; // ПРОВЕРЯЕМ Тёмного
    }
    
    return numberKingField;
}
////////////////////////////////////////////////////////////////////////////////////////////////
//////// removeTestUnit/returnTestUnit  === "упрощённое" forwardMoving/backwardMoving //////////
////////////////////////////////////////////////////////////////////////////////////////////////
function removeTestUnit(currentUnit, targetUnit, currentField, targetField) {
    const { x: xa, y: ya, z: za } = currentField.position;
    const { x: xb, y: yb, z: zb } = targetField.position;
    
    displacement(currentUnit, xa, ya, za, xb, yb, zb);
    currentUnit.direction = orientation(xa, ya, za, xb, yb, zb);
    
    currentUnit.field = targetField;
    targetField.unit = currentUnit;
    currentField.unit = empty;
    targetUnit.field = field[0];
    
    if (targetUnit !== empty) {
        targetUnit.alive = false;
    }
}
function returnTestUnit(currentUnit, targetUnit, currentField, targetField) {
    const { x: xa, y: ya, z: za } = currentField.position;
    const { x: xb, y: yb, z: zb } = targetField.position;
    const previousField = currentUnit.previos;
    const { x: xp, y: yp, z: zp } = previousField.position;
    
    displacement(currentUnit, xb, yb, zb, xa, ya, za);
    currentUnit.direction = orientation(xp, yp, zp, xa, ya, za);
    
    currentUnit.field = currentField;
    currentField.unit = currentUnit;
    targetUnit.field = targetField;
    targetField.unit = targetUnit;
    
    if (targetUnit !== empty) {
        targetUnit.alive = true;
    } else {
        targetField.unit = empty;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////
//////// Проверка СВОЕГО Короля на ШАХ, после перемещения СВОЕЙ фигуры /////////////////////////
////////        ЗАПРЕТИТЬ ПОДСТАВЛЕНИЕ СВОЕГО КОРОЛЯ ПОД ШАХ           /////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function testAutoCheck(currentUnit, targetUnit, currentField, targetField) {
    removeTestUnit(currentUnit, targetUnit, currentField, targetField);
    let isCheck = false;
    let v = ownKingField(currentUnit.side);

    for (m = 1; m <= nUnits; m++) {
        // ЗДЕСЬ перебираются юниты
        if (unit[m].side !== currentUnit.side) {
            let w = unit[m].field.index; // берётся индекс ПОЛЯ перебираемого ЮНИТА
            // НО ШАХ ВОЗМОЖЕН от ВРАГА (поэтому стороны разные)
            switch (unit[m].alive) { // только если ЖИВОЙ
                case true:
                    switch (unit[m].sort) {
                        case axe:
                            if (axeCheckCluster(w).has(v)) {
                                isCheck = true;
                            }
                            break; // Ладья  = Топор
                        case pike:
                            if (pikeCheckCluster(w).has(v)) {
                                isCheck = true;
                            }
                            break; // Слон   = Пика
                        case arrow:
                            if (arrowCheckCluster(w).has(v)) {
                                isCheck = true;
                            }
                            break; // пешка  = Стрела
                        case dart:
                            if (dartCheckCluster(w).has(v)) {
                                isCheck = true;
                            }
                            break; // Конь   = Дротик
                        case sword:
                            if (swordCheckCluster(w).has(v)) {
                                isCheck = true;
                            }
                            break; // Ферзь  = Меч
                        case helm:
                            if (helmCheckCluster(w).has(v)) {
                                isCheck = true;
                            }
                            break; // Король = Шлем (С Рокировкой)
                    }
                    break;
            }
        }
    }
    returnTestUnit(currentUnit, targetUnit, currentField, targetField);
    
    return isCheck;
}
////////////////////////////////////////////////////////////////////////////////////////////////
/////////// Определение кластеров фигур определённой стороны ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function helmCheckCluster(w) {
    let checkCluster = new Set();
    let unit = field[w].unit;
    let s = starHelm[w];
    let u;
    
    s.forEach((u, uAgain, s) => {
        checkCluster.add(u);
    });
    
    return checkCluster; 
}
function dartCheckCluster(w) {
    let checkCluster = new Set();
    let unit = field[w].unit;
    let s = starDart[w];
    let u;
    
    s.forEach((u, uAgain, s) => {
        checkCluster.add(u);
    });
    
    return checkCluster;
}
//////////////////////////////////////
function swordCheckCluster(w) {
    let pikeSet = pikePartCheckCluster(w);
    let axeSet  = axePartCheckCluster(w);
    let checkCluster = new Set([...pikeSet, ...axeSet]);
    
    return checkCluster;
}
///////////////////////////////////////
function axePartCheckCluster(w) {
    let checkCluster = new Set();
    let wUnit = field[w].unit;
    
    for (i = 0; i <= starAxe[w].length - 1; i++) {
        if (starAxe[w][i] !== null) {
            let jFix = starAxe[w][i].length - 1;
    
            for (let j = jFix; j >= 1; j--) {
            //for (let j = 1; j <= jFix; j++) {
                let u = starAxe[w][i][j];
    
                if (field[u].unit !== empty && field[u].unit.side !== field[w].unit.side) {
                    jFix = j;
                }
                if (field[u].unit !== empty && field[u].unit.side === field[w].unit.side) {
                    jFix = j; // подстраховка, свой идёт как чужой в кластер, чтобы туда не мог ходить вражеский Король
                }
                if (field[u].unit !== empty &&
                    field[u].unit.side !== field[w].unit.side &&
                    field[u].unit.sort === helm &&
                    field[u].index > 12 
                    // ЕСЛИ это не поставить, ТО здесь глючит.
                    // ПОТОМУ ЧТО за красным полем нет для Ладьи "продолжения прямой", нет клетки – есть тупик.
                ) {
                    if (j <= 6) { // почему было 5 — не понимаю
                        // радиус кластера Топора (Ладьи) = 7 [от №0 до №7] ЗНАЧИТ НЕ ДАЛЬШЕ = №7 
                        jFix = j + 1;
                      // чтобы поле ЗА Королём тоже попало в Cluster, так как он не может туда отступить !!! 
                    } // НО !!!  j+1 не должно быть > 7
                }
            }
    
            for (j = 1; j <= jFix; j++) {
                let u = starAxe[w][i][j];
                checkCluster.add(u);
            }
        }
    }
    
    return checkCluster;
}
function pikePartCheckCluster(w) {
    let checkCluster = new Set();
    let wUnit = field[w].unit;
    
    for (i = 0; i <= starPike[w].length - 1; i++) {
        if (starPike[w][i] !== null) {
            let jFix = starPike[w][i].length - 1;
            
            for (let j = jFix; j >= 1; j--) {
            //for (let j = 1; j <= jFix; j++) {
                let u = starPike[w][i][j];
    
                if (field[u].unit !== empty && field[u].unit.side !== field[w].unit.side) {
                    jFix = j;
                }
                if (field[u].unit !== empty && field[u].unit.side === field[w].unit.side) {
                    jFix = j - 1; 
                }
            }
    
            for (j = 1; j <= jFix; j++) {
                let u = starPike[w][i][j];
                checkCluster.add(u);
            }
        }
    }
    
    return checkCluster;
}
//////////////////////////////////////
function axeCheckCluster(w) {
    let checkCluster = new Set();
    let wUnit = field[w].unit;
    let p = wUnit.previos.index;
    
    for (i = 0; i <= beamAxe[p][w].length - 1; i++) {
        let jFix = beamAxe[p][w][i].length - 1;

        for (let j = jFix; j >= 1; j--) {
        //for (let j = 1; j <= jFix; j++) {
            let u = beamAxe[p][w][i][j];

            if (field[u].unit !== empty && field[u].unit.side !== field[w].unit.side) {
                jFix = j;
            }
            if (field[u].unit !== empty && field[u].unit.side === field[w].unit.side) {
                jFix = j; // подстраховка, свой идёт как чужой в кластер, чтобы туда не мог ходить вражеский Король
            }
            if (field[u].unit !== empty &&
                field[u].unit.side !== field[w].unit.side &&
                field[u].unit.sort === helm &&
                field[u].index > 12 
                // ЕСЛИ это не поставить, ТО здесь глючит.
                // ПОТОМУ ЧТО за красным полем нет для Ладьи "продолжения прямой", нет клетки – есть тупик.
            ) {
                if (j <= 6) { // почему было 5 — не понимаю
                    // радиус кластера Топора (Ладьи) = 7 [от №0 до №7] ЗНАЧИТ НЕ ДАЛЬШЕ = №7 
                    jFix = j + 1;
                  // чтобы поле ЗА Королём тоже попало в Cluster, так как он не может туда отступить !!! 
                } // НО !!!  j+1 не должно быть > 7
            }
        }

        for (j = 1; j <= jFix; j++) {
            let u = beamAxe[p][w][i][j];
            checkCluster.add(u);
        }
    }
    
    return checkCluster;
}
function pikeCheckCluster(w) {
    let checkCluster = new Set();
    let wUnit = field[w].unit;
    let p = wUnit.previos.index;
    
    for (i = 0; i <= beamPike[p][w].length - 1; i++) {
        let jFix = beamPike[p][w][i].length - 1;

        for (let j = jFix; j >= 1; j--) {
        //for (let j = 1; j <= jFix; j++) {
            let u = beamPike[p][w][i][j];

            if (field[u].unit !== empty && field[u].unit.side !== field[w].unit.side) {
                jFix = j;
            }
            if (field[u].unit !== empty && field[u].unit.side === field[w].unit.side) {
                jFix = j - 1; 
            }
        }

        for (j = 1; j <= jFix; j++) {
            let u = beamPike[p][w][i][j];
            checkCluster.add(u);
        }
    }
    
    return checkCluster;
}
function arrowCheckCluster(w) {
    let checkCluster = new Set();
    let wUnit = field[w].unit;
    let s = starArrow[w];
    let p = wUnit.previos.index;
    let u;
    
    s.forEach((u, uAgain, s) => {
        if (wUnit.step === 0) {
            if (firstMoveArrow[p][w].has(u) &&
                field[u].unit === empty && 
                !checkCluster.has(u)) {
                checkCluster.add(u);
            }
            if (firstCaptureArrow[p][w].has(u) &&
                field[u].unit !== empty && 
                field[u].unit.side !== wUnit.side && // Если на клетке ЧУЖОЙ Юнит
                !checkCluster.has(u)) {
                checkCluster.add(u);
            }
        }
        if (wUnit.step !== 0) {
            if (moveArrow[p][w].has(u) &&
                field[u].unit === empty && 
                !checkCluster.has(u)) {
                checkCluster.add(u);
            }
            if (captureArrow[p][w].has(u) &&
                field[u].unit !== empty && 
                field[u].unit.side !== wUnit.side && // Если на клетке ЧУЖОЙ Юнит
                !checkCluster.has(u)) {
                checkCluster.add(u);
            }
        }
    });
    
    return checkCluster;
}