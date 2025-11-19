//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////  ЛОГИРОВАНИЕ  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function logTree(system, depth, logg) {
    // Таймер
    const timeBeginTree = new Date();

    const tree = { depth: 0, activeSide: system[QUEUE], children: [] };

    buildNode(tree, depth, system);

    // Вывод дерева с визуализацией уровней
    console.log(`=== Типизированная системная модель: Tree (depth=${depth}) ===`);
    // 🌳 от move — один раз в начале
    const moveColor = system[QUEUE] === 1 ? lightHTML : darkHTML;
    console.log(`%c 🌳 от хода №%c${system[MOVE]}`,
        `color: #fff; font-weight: bold;`,
        `color: ${moveColor}; font-weight: bold;`
    );

    branchCounter = 0;

    // Таймер
    const timeEndTree = new Date();
    const timeTree = timeEndTree - timeBeginTree;
    console.log("Время построения Дерева: = ", timeTree);

    if (logg) {
        for (const child of tree.children) {
            logNode(child, system[QUEUE]);
        }
    }

    return tree;
}

function logNode(node, deepQueue = system[QUEUE], indent = "", edge = "┌") {
    if (node.depth >= 1) {
        const currentSystem = node.system || system;
    
        const idStr = format2Digits(node.id) + '─';
        const fromStr = format2Digits(node.from);
        const toStr = format2Digits(node.to);
    
        const targetUnitId = node.targetId;
        const targetUnitIdStr = format2Digits(node.targetId) + '─';
        
        const isEmpty = targetUnitId === 0;

        // ✅ ЦВЕТ ФИГУРЫ — ТОЛЬКО ПО ID
        const figureColor = node.id <= 26 ? lightHTML : darkHTML;

        let isEnemy = false;
        let enemySort = "";
        let enemyFigureColor = "";

        if (!isEmpty) {
            // ✅ ЦВЕТ ВРАЖЕСКОЙ ФИГУРЫ — ТОЛЬКО ПО ID
            enemyFigureColor = targetUnitId <= 26 ? lightHTML : darkHTML;
            const enemySortValue = currentSystem[UNIT_SORT + targetUnitId];
            const enemySortConstant = getSortSymbol(enemySortValue);
            enemySort = alignSort(enemySortConstant);
        }
    
        const symbolColor = "#fff";
        const depthMark = `⇩${node.depth}`;
        const isLeaf = node.children.length === 0;
        const isMate = node.status === 'мат';
        const valueToDisplay = isMate || isLeaf ? node.Ω : (node.moveRank !== undefined ? node.moveRank : "N/A");
        const Ωleaf = isMate || isLeaf ? node.Ω : node.rank;
        
        let markΩleaf;
        if (isLeaf) {
            markΩleaf = (Ωleaf === "") ? "" : space(Ωleaf) + signForConsole(Ωleaf) + String(Ωleaf);
        }
        else {
            markΩleaf = (valueToDisplay === "N/A" || valueToDisplay === "") ? "" : space(valueToDisplay) + String(valueToDisplay);
        }
        
        let colorΩleaf;
        const displayValue = valueToDisplay !== "N/A" ? valueToDisplay : 0;
        if (displayValue >   0) {colorΩleaf =   lightHTML}
        if (displayValue === 0) {colorΩleaf = neutralHTML}
        if (displayValue <   0) {colorΩleaf =    darkHTML}
        if (!isLeaf) {colorΩleaf = neutralHTML}
        
        const fromColor = fieldColorNotation(fromStr);
        const toColor = fieldColorNotation(toStr);
        const sortValue = currentSystem[UNIT_SORT + node.id];
        const sortConstant = getSortSymbol(sortValue);
        const alignedSort = alignSort(sortConstant);
    
        // +++ СТРОКА ВЫВОДА РАЗДЕЛЕНА НА ТРИ ВАРИАНТА
        let logLine = '';
        let styles = [];
        
        let stringPrefix = "";
        if (node.depth === 1) {
            branchCounter++;
            stringPrefix = `🌿№${format2Digits(branchCounter)}`;
        } else if (node.children.length === 0) {
            stringPrefix = `🍃№${format2Digits(branchCounter)}`;
        } else {
            stringPrefix = `💢№${format2Digits(branchCounter)}`;
        }
        
        if (node.move === '👣') {
            // Ход на пустое поле
            logLine = `${stringPrefix}%c${indent}%c${edge}%c${alignedSort}%c${idStr} %c${fromStr}${fromColor}` +
                      `%c👣%c${toColor}${toStr}            %c${depthMark}%c${markΩleaf}`;         
    
            styles = [
                `color: #888;`, // stringPrefix
                `color: ${symbolColor}; font-weight: bold;`, // indent
                `color: ${figureColor}; font-weight: bold;`, // alignedSort
                `color: ${figureColor};`, // idStr
                `color: #aaa;`, // fromStr
                `color: ${symbolColor};`, // move
                `color: ${toColor};`, // toStr
                `color: ${figureColor}; font-weight: bold;`,
                `color: ${colorΩleaf};` // markΩleaf
            ];
        } else if (node.move === '☠️') {
            // Взятие фигуры
            logLine = `${stringPrefix}%c${indent}%c${edge}%c${alignedSort}%c${idStr} %c${fromStr}${fromColor}` +
                      `%c☠️%c${toColor}${toStr} %c${enemySort}%c${targetUnitIdStr} %c${depthMark}%c${markΩleaf}`;

            styles = [
                `color: #888;`, 
                `color: ${symbolColor}; font-weight: bold;`,
                `color: ${figureColor}; font-weight: bold;`,
                `color: ${figureColor};`,
                `color: #aaa;`,
                `color: ${symbolColor};`,
                `color: ${toColor};`,
                `color: ${enemyFigureColor}; font-weight: bold;`,
                `color: ${enemyFigureColor};`,
                `color: ${figureColor}; font-weight: bold;`,
                `color: ${colorΩleaf};`
            ];
        } else if (node.move === '👑') {
            
            const viceId = node.targetId;
                
            if (viceId !== 0 && viceId !== node.id) {
                const partnerSortValue = currentSystem[UNIT_SORT + viceId];
                const partnerSortConstant = getSortSymbol(partnerSortValue);
                castlingPartnerSort = alignSort(partnerSortConstant);
                castlingPartnerId = format2Digits(viceId);
                castlingPartnerIdStr = castlingPartnerId + '─';
                // ✅ ЦВЕТ ПАРТНЁРА — ТОЛЬКО ПО ID
                allyFigureColor = viceId <= 26 ? lightHTML : darkHTML;
            } else {
                castlingPartnerSort = "Неизв.?";
                castlingPartnerId = "??";
            }
                
            // Рокировка
            logLine = `${stringPrefix}%c${indent}%c${edge}%c${alignedSort}%c${idStr} %c${fromStr}${fromColor}` +
                      `%c👑%c${toColor}${toStr} %c${castlingPartnerSort}%c${castlingPartnerIdStr} %c${depthMark}%c${markΩleaf}`;
    
            styles = [
                `color: #888;`, 
                `color: ${symbolColor}; font-weight: bold;`,
                `color: ${figureColor}; font-weight: bold;`,
                `color: ${figureColor};`,
                `color: #aaa;`,
                `color: ${symbolColor};`,
                `color: ${toColor};`,
                `color: ${allyFigureColor}; font-weight: bold;`, 
                `color: ${allyFigureColor}; font-weight: bold;`,
                `color: ${figureColor}; font-weight: bold;`,
                `color: ${colorΩleaf};`
            ];
        }
    
        console.log(logLine, ...styles);
    }

    const children = node.children;
    for (let i = 0; i < children.length; i++) {
        const isLast = i === children.length - 1;
        const nextIndent = indent + (" ");
        const nextEdge = "├";
        logNode(children[i], !deepQueue, nextIndent, nextEdge);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// СОЗДАНИЕ слепка системы //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function makeSystem() {
    // Сброс типизированного массива
    system.fill(0);

    // === fieldUnit [0–92] ===
    for (let u = 1; u <= 92; u++) {
        if (field[u].unit === empty) {
            system[FIELD_UNIT + u] = 0;
        } else {
            system[FIELD_UNIT + u] = field[u].unit.index;
        }
    }

    // === unitField, unitPrevios, unitSideQueue, unitSort, unitCastling [1–52] ===
    for (let i = 1; i <= 52; i++) {
        // unitField
        system[UNIT_FIELD + i] = unit[i].alive ? unit[i].field.index : 0;

        // unitPrevios
        system[UNIT_PREV + i] = unit[i].previos.index;

        // unitSideQueue: null → 0, true → 1, false → 2
        system[UNIT_SIDE + i] = unit[i].sideQueue === null ? 0 : unit[i].sideQueue ? 1 : 2;

        // unitSort: преобразуем в числовые значения (априорная ценность)
        switch (unit[i].sort) {
            case helm:   system[UNIT_SORT + i] = C_helm;   break;
            case sword:  system[UNIT_SORT + i] = C_sword;  break;
            case axe:    system[UNIT_SORT + i] = C_axe;    break;
            case pike:   system[UNIT_SORT + i] = C_pike;   break;
            case dart:   system[UNIT_SORT + i] = C_dart;   break;
            case arrow:  system[UNIT_SORT + i] = C_arrow;  break;
            default:     system[UNIT_SORT + i] = 0;        break;
        }

        // unitCastling
        system[UNIT_CASTLING + i] = unit[i].castling ? 1 : 0;
    }

    // === очередь и ход ===
    system[QUEUE] = queue === null ? 0 : queue ? 1 : 2;
    system[MOVE] = move;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// МиниМакс с Alfa-Beta отсечением и iterativeDeepening ////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function MiniMaxAlfaBeta(maxDepth, maxTime) {
    //transpositionTable.clear();// Здесь убрать?

    console.log(" ");
    console.log("MiniMax с αβ отсечением:");
    console.log("глубина дерева вариантов ходов = ", maxDepth, "полуходов");
    console.log("лимит времени на обдумывание   = ", maxTime, "миллисекунд");

    const worker = new Worker('JS/workers/Web-Worker.js');
    let currentBestTree = null;

    makeSystem();

    const message = {
        system: system,
        maxDepth: maxDepth,
        maxTime: maxTime
    };

    // === КЛЮЧ: возвращаем Promise ===
    return new Promise((resolve) => {
        console.log('✅ Создан Promise. Ожидаем финальный onmessage...');
    
        worker.onmessage = function(e) {
            //const { result: bestTree, isFinal } = e.data;
            const { result: bestTree, isFinal, bestTreeΩ } = e.data; // ← добавлено!
    
            // Реагируем ТОЛЬКО на финальный результат
            if (isFinal) {
                console.log('📥 [MiniMax] Получен ФИНАЛЬНЫЙ результат:', bestTree);
                ////////////
                
                if (bestTreeΩ >   0) { colorΩType =   lightHTML }
                if (bestTreeΩ === 0) { colorΩType = neutralHTML }
                if (bestTreeΩ <   0) { colorΩType =    darkHTML }
                
                const Ω_string  = space(bestTreeΩ)   + signForConsole(bestTreeΩ)   + String(bestTreeΩ);
                
                const styles = [
                    `color: ${neutralHTML};`,
                    `color: ${colorΩType};`
                ];
               
                const logLine =`%c🌳 Оценка дерева (Ω) =%c${Ω_string}`;
                
                console.log(logLine, ...styles); // ← ✅ ВЫВОД В КОНСОЛЬ
                
                if (bestTree && bestTree.children?.length > 0) {
                    const maximizing = bestTree.activeSide === 1;
                    let bestChild = bestTree.children[0];
                    for (const child of bestTree.children) {
                        if (maximizing ? (child.Ω > bestChild.Ω) : (child.Ω < bestChild.Ω)) {
                            bestChild = child;
                        }
                    }
                    
                    //////////////////////////////////////////////////////////////////////////////
                    console.log ("📊 Ранг лучшего хода =  ", bestChild.moveRank);
    
                    const move = { id: bestChild.id, to: bestChild.to };
                    console.log('💎 Успешно resolve:', move);
                    resolve(move);
                    
                } else {
                    console.log("⚠️ Нет ходов в финальном результате, используем Situiter(system)");
                    const fallback = Situiter(system);
                    resolve(fallback || null);
                }
    
                worker.terminate();
            }
            ////// ИГНОРИРУЕМ промежуточные isFinal: false
        };
    
        worker.onerror = function(err) {
            console.error('❌  Ошибка Worker:', err);
            worker.terminate();
            const fallback = Situiter(system);
            resolve(fallback || null);
        };
    
        worker.postMessage(message);
    });
}

function Situiter(currentSystem) {
    // Шаг 1: Получаем все легальные ходы
    const allMoves = findAllLegalMoves(system);
    if (!allMoves || allMoves.length === 0) {
        return findAnyLegalMove(system); // финальный резерв
    }

    // Шаг 3: Оцениваем каждый ход через Ωfull
    const scoredMoves = allMoves.map(move => {
        const { id, to } = move;

        // Запоминаем состояние
        const v = currentSystem[UNIT_FIELD + id];
        const victimId = currentSystem[FIELD_UNIT + to];

        // Применяем ход
        applyTestMove(id, to, currentSystem);

        // Оцениваем позицию
        const Ω = Ωfull(currentSystem);

        return { ...move, Ω };
    });

    // Шаг 4: Находим лучшую оценку в зависимости от очереди
    const maximizing = currentSystem[QUEUE] === 1;
    const bestΩ = maximizing
        ? Math.max(...scoredMoves.map(m => m.Ω))
        : Math.min(...scoredMoves.map(m => m.Ω));

    // Фильтруем ходы с наилучшей оценкой
    const bestMoves = scoredMoves.filter(m => m.Ω === bestΩ);
    
    // Возвращаем случайный из лучших
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

//// Любой случайный возможный ход /////////////
function findAnyLegalMove(currentSystem) {
    const activeSide = currentSystem[QUEUE];
    const legalMoves = [];

    for (let i = 1; i <= 52; i++) {
        if (currentSystem[UNIT_FIELD + i] === 0 || currentSystem[UNIT_SIDE + i] !== activeSide) continue;
        const v = currentSystem[UNIT_FIELD + i];
        let cluster = new Set();
        switch (currentSystem[UNIT_SORT + i]) {
            case C_helm:   cluster = typeHelmUnitCluster(v, currentSystem); break;
            case C_sword:  cluster = typeSwordUnitCluster(v, currentSystem); break;
            case C_axe:    cluster = typeAxeUnitCluster(v, currentSystem); break;
            case C_pike:   cluster = typePikeUnitCluster(v, currentSystem); break;
            case C_dart:   cluster = typeDartUnitCluster(v, currentSystem); break;
            case C_arrow:  cluster = typeArrowUnitCluster(v, currentSystem); break;
            default: continue;
        }
        for (const u of cluster) {
            const targetId = currentSystem[FIELD_UNIT + u];
            if (targetId === 0 || currentSystem[UNIT_SIDE + targetId] !== activeSide) {
                legalMoves.push({ id: i, to: u });
            }
        }
    }

    // Если есть ходы — вернуть случайный
    if (legalMoves.length > 0) {
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    return null;
}

/////// ВСЕ возможные ходы /////////////////////
function findAllLegalMoves(currentSystem) {
    const activeSide = currentSystem[QUEUE];
    const legalMoves = [];

    for (let i = 1; i <= 52; i++) {
        if (currentSystem[UNIT_FIELD + i] === 0 || currentSystem[UNIT_SIDE + i] !== activeSide) continue;
        const v = currentSystem[UNIT_FIELD + i];
        let cluster = new Set();
        switch (currentSystem[UNIT_SORT + i]) {
            case C_helm:   cluster = typeHelmUnitCluster(v, currentSystem); break;
            case C_sword:  cluster = typeSwordUnitCluster(v, currentSystem); break;
            case C_axe:    cluster = typeAxeUnitCluster(v, currentSystem); break;
            case C_pike:   cluster = typePikeUnitCluster(v, currentSystem); break;
            case C_dart:   cluster = typeDartUnitCluster(v, currentSystem); break;
            case C_arrow:  cluster = typeArrowUnitCluster(v, currentSystem); break;
            default: continue;
        }
        for (const u of cluster) {
            const targetId = currentSystem[FIELD_UNIT + u];
            if (targetId === 0 || currentSystem[UNIT_SIDE + targetId] !== activeSide) {
                legalMoves.push({ id: i, to: u });
            }
        }
    }   
    return legalMoves.length > 0 ? legalMoves : null;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// Итеративное углубление ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function iterativeDeepening(system, maxDepth, maxTime) {
    let bestTree = null;

    for (let depth = 1; depth <= maxDepth; depth++) {
        const tree = { depth: 0, activeSide: system[QUEUE], children: [] };
        buildNode(tree, depth, system);

        if (tree.children.length > 0) {
            bestTree = tree;
            bestTree.finalDepth = depth;
        }
    }

    return bestTree;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// ХЭШИРОВАНИЕ позиций /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function hashSystem(currentSystem) {
    let hash = 0;
    
    // Проход по всем фигурам
    for (let i = 1; i <= 52; i++) {
        const currentField = currentSystem[FIELD_UNIT + i];
        const previousField = currentSystem[UNIT_PREV + i];
        
        if (currentField !== 0) {
            hash ^= zobristCurrent[i][currentField];
        }
        
        if (previousField !== 0) {
            hash ^= zobristPrevious[i][previousField];
        }
    }
    
    // Дополнительные биты для информации о ходе
    hash ^= currentSystem[QUEUE] << 32;
    hash ^= currentSystem[MOVE] << 33;
    
    return hash;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// === УЗЕЛ === //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Предрасчёт кластеров для узла
function buildNode(node, currentDepth, currentSystem, alpha = -Infinity, beta = +Infinity, maximizing = (currentSystem[QUEUE] === 1), initialDepth = currentDepth) {
    // ---- ПРОВЕРКА: ЕСТЬ ЛИ ХОДЫ У ОЧЕРЕДИ -------------------------------------------------------- //
    const cluster = hasAnyLegalMoves(currentSystem);
    if (!cluster) {
        console.log("МАТ ИЛИ ПАТ НАЙДЕН", currentSystem[MOVE], currentSystem[QUEUE]);
        node.children = [];
        node.Ω = currentSystem[QUEUE] === 1 ? -Infinity : +Infinity;
        return node.Ω;
    }
    // ---------------------------------------------------------------------------------------------- //
    
    if (currentDepth <= 0) {
        node.Ω = Ωfull(currentSystem);
        return node.Ω;
    }
    
    const stateHash = hashSystem(currentSystem);
    
    const cached = transpositionTable.get(stateHash);
    if (cached && cached.depth >= currentDepth) {
        node.children = [...cached.children];
        node.Ω = cached.eval;
        return node.Ω;
    }

    const nodeQueue = currentSystem[QUEUE];
    
    // -------------- ФОРМИРУЕМ underControl ОДИН РАЗ ----------------------------------------------- //
    const underControl = underEnemyControl(currentSystem);
    // ---------------------------------------------------------------------------------------------- //

    // --- СБОР ВСЕХ ХОДОВ И присвоение Rank -------------------------------------------------------- //
    const allMoves = [];
    
    for (let i = 1; i <= 52; i++) {
        if (currentSystem[UNIT_FIELD + i] === 0 || currentSystem[UNIT_SIDE + i] !== nodeQueue) continue;
        const v = currentSystem[UNIT_FIELD + i];
        const iCluster = cluster[i]; // Готовое значение из первого вызова hasAnyLegalMove
        
        if (!iCluster || iCluster.size === 0) continue; // Контролируем существование и размер
       
        for (const u of iCluster) {
            const targetUnitId = currentSystem[FIELD_UNIT + u];
            const isCapture = targetUnitId !== 0 && currentSystem[UNIT_SIDE + targetUnitId] !== currentSystem[UNIT_SIDE + i];
            const isCastling = targetUnitId !== 0 && 
                              currentSystem[UNIT_SIDE + targetUnitId] === currentSystem[UNIT_SIDE + i] && 
                              currentSystem[UNIT_SORT + i] === C_helm;
          
            const rank = getRank(i, u, (isCastling || isCapture) ? targetUnitId : 0, currentSystem, underControl);
            
            allMoves.push({
                id: i,
                v,
                u,
                rank
            });
        }
    }
    
    // ЕСЛИ НЕТ ХОДОВ 
    if (!allMoves || allMoves.length === 0) {
        console.log("НЕТ ХОДОВ");
    }

    // --- ГЛОБАЛЬНАЯ СОРТИРОВКА ПО RANK ------------------------------------------------------------ //
    allMoves.sort((a, b) => b.rank - a.rank);
    
    // Создаем Map для групп
    const groups = new Map();
    
    // Группируем ходы, сохраняя порядок
    for (const move of allMoves) {
        if (!groups.has(move.rank)) {
            groups.set(move.rank, []);
        }
        groups.get(move.rank).push(move);
    }
    
    // Перемешиваем группы, сохраняя порядок рангов
    const ranks = groups.keys();
    for (const rank of ranks) {
        const group = groups.get(rank);
        for (let i = group.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [group[i], group[j]] = [group[j], group[i]];
        }
    }
    
    // Собираем отсортированные ходы обратно в массив
    const shuffledMoves = [];
    for (const group of groups.values()) {
        shuffledMoves.push(...group);
    }

    node.children = [];
    node.Ω = maximizing ? -Infinity : +Infinity;

    for (const { id, v, u, rank } of shuffledMoves) {
        
        const targetUnitId = currentSystem[FIELD_UNIT + u];
        const isCapture = targetUnitId !== 0 && currentSystem[UNIT_SIDE + targetUnitId] !== currentSystem[UNIT_SIDE + id];
        const isCastling = targetUnitId !== 0 && 
                      currentSystem[UNIT_SIDE + targetUnitId] === currentSystem[UNIT_SIDE + id] && 
                      currentSystem[UNIT_SORT + id] === C_helm;
        let move;
        let hypotheticalSystem;
        
        if (isCapture) {
            move = '☠️';
            hypotheticalSystem = applyTreeCapture(id, targetUnitId, u, currentSystem);
        }
        else if (isCastling) {
            move = '👑';
            hypotheticalSystem = applyTreeCastling(id, targetUnitId, currentSystem);
        }
        else {
            move = '👣';
            hypotheticalSystem = applyTreeMove(id, u, currentSystem);
        }
       
        const child = {
            id, from: v, to: u, depth: node.depth + 1, activeSide: hypotheticalSystem[QUEUE],
            move, targetId: targetUnitId || 0, children: [], system: hypotheticalSystem,
            moveRank: rank
        };
        
        const kingInCheck = isKingInCheck(hypotheticalSystem);
        const canMove = hasAnyLegalMoves(hypotheticalSystem);

        if (currentDepth - 1 > 0 && !(kingInCheck && !canMove)) {
            const eval = buildNode(child, currentDepth - 1, hypotheticalSystem, alpha, beta, !maximizing);
            
            if (child.status === 'мат') {
                child.Ω = maximizing ? -Infinity : +Infinity;
            } else {
                child.Ω = eval;
            }
            if (child.status === 'разгром') {
                child.Ω = maximizing ? -Infinity : +Infinity;
            } else {
                child.Ω = eval;
            }
            
            if (maximizing) {
                node.Ω = Math.max(node.Ω, eval);
                alpha = Math.max(alpha, node.Ω);
            } else {
                node.Ω = Math.min(node.Ω, eval);
                beta = Math.min(beta, node.Ω);
            }
            if (beta <= alpha) {
                node.children.push(child);
                break;
            }
        } else {
            
            if (isFullDraw(hypotheticalSystem)) {
                child.status = 'полная_ничья';
                child.Ω = 0;
            } else if (isRazgrom(hypotheticalSystem)) {
                child.status = 'разгром';
                child.Ω = hypotheticalSystem[QUEUE] === 1 ? -Infinity : +Infinity;
            } else if (kingInCheck && !canMove) {
                child.status = 'мат';
                child.Ω = hypotheticalSystem[QUEUE] === 1 ? -Infinity : +Infinity;
            } else if (!kingInCheck && !canMove) {
                child.status = 'пат';
                child.Ω = 0;
            } else {
                child.status = '';
                child.Ω = Ωfull(hypotheticalSystem);
            }
            
            if (maximizing) {
                node.Ω = Math.max(node.Ω, child.Ω);
                alpha = Math.max(alpha, node.Ω);
            } else {
                node.Ω = Math.min(node.Ω, child.Ω);
                beta = Math.min(beta, node.Ω);
            }
        }

        node.children.push(child);
        if (beta <= alpha) break;
    }

    transpositionTable.set(stateHash, {
        depth: currentDepth,
        eval: node.Ω,
        children: [...node.children]
    });

    return node.Ω;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////// === РАНГ === //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getRank(currentUnit, targetField, anotherUnit, currentSystem, underControl) {
    const mySide = currentSystem[UNIT_SIDE + currentUnit]; // 1 или 2
    const enemySide = 3 - mySide;
    const unitSort = currentSystem[UNIT_SORT + currentUnit];
    const targetUnit = anotherUnit || currentSystem[FIELD_UNIT + targetField];
    const targetUnitSort = currentSystem[UNIT_SORT + targetUnit];
    const currentField = currentSystem[UNIT_FIELD + currentUnit];
    
    const isCapture  = targetUnit !== 0 && currentSystem[UNIT_SIDE + targetUnit] === enemySide;
    const isCastling = targetUnit !== 0 && 
                      currentSystem[UNIT_FIELD + targetUnit] === targetField && 
                      currentSystem[UNIT_SIDE  + targetUnit] === mySide;
    const myKingInCheck     = isKingInCheck(currentSystem); 
    const isUnderThreat     = underControl.has(currentField);
    const willBeUnderThreat = underControl.has(targetField);
    const isSave            = !myKingInCheck && isUnderThreat;
    
    const    myKing      = mySide === 1 ? 1 : 27;
    const    myKingField = currentSystem[UNIT_FIELD +    myKing];
    const enemyKing      = enemySide === 1 ? 1 : 27;
    const enemyKingField = currentSystem[UNIT_FIELD + enemyKing];
    
    const degree = 100;
    
    let moveRank     = degree;
    let castlingRank = 0;
    let captureRank  = 0;
    let saveRank     = 0;
    
    if (unitSort === C_arrow) {
        moveRank += targetField <= 12 ? C_arrow_red : C_arrow_ordinary;
    } else if (unitSort === C_pike) {
        moveRank += targetField <= 12 ? C_pike_red : (targetField <= 32 ? C_pike_blue : 0);
    } else if (unitSort === C_axe) {
        moveRank += targetField <= 12 ? C_axe_red : (targetField <= 32 ? C_axe_blue : C_axe_green);
    } else if (unitSort === C_dart) {
        moveRank += C_dart;
    } else if (unitSort === C_helm) {
        moveRank += targetField <= 12 ? C_helm_red : C_helm;
    } else if (unitSort === C_sword) {
        moveRank += C_sword;
    }
    
    ///////// Ход Пешки ///////////////////////////////////////////////////////////////////////////////////////////
    if (unitSort === C_arrow) {
        let bonusDangerKing = 0;
        
        const p = currentSystem[UNIT_PREV  + currentUnit];
        const v = currentSystem[UNIT_FIELD + currentUnit];
        const k = enemyKingField;
            
        startWay = getStartBFS(p,v,k); 
         blueWay = getBlueBFS(p,v,k);  
          redWay = getRedBFS(p,v,k);   
              
        if (startWay !== Infinity) {bonusDangerKing = (5 - startWay)};
        if (blueWay  !== Infinity) {bonusDangerKing = (7 - blueWay)};
        if (redWay   !== Infinity) {bonusDangerKing = (8 - redWay)};
        
        moveRank += bonusDangerKing;
    }
    
    ///////// Ход на пустую клетку под удар ///////////////////////////////////////////////////////////////////////
    if (!isSave && targetUnit === 0 && willBeUnderThreat) {
        moveRank = 0;
    }
    
    //////////////////// СПАСЕНИЕ /////////////////////////////////////////////////////////////////////////////////
    if (isSave) {
        //////////////////// СПАСЕНИЕ под другую угрозу ///////////////////////////////////////////////////////////
        if (willBeUnderThreat) {
            saveRank = 0;
            moveRank = 0;
        }
        //////////////////// СПАСЕНИЕ на пустую клетку ///////////////////////////////////////////////////////////
        else {
            saveRank = degree + C[currentUnit];
        }
    }
    
    //////////////////// ВЗЯТИЕ ///////////////////////////////////////////////////////////////////////////////////
    if (isCapture) {
        const currentDeltaC = targetUnitSort - unitSort;
        // Если текущее взятие выгодно для нас
        if (currentDeltaC > 0) {
            captureRank = degree + 3*currentDeltaC;
        }
        else {
            captureRank = 0;
        }
    }
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const resultRank = moveRank + castlingRank + saveRank + captureRank;
   
    return resultRank;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////// === ОЦЕНКА === //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Ωfull(currentSystem) {
    let ΩL = 0;
    let ΩD = 0;

    // --- определяем клетки под боем ---
    const underThreat = underEnemyThreat(currentSystem);

    // --- оценка каждой фигуры ---
    for (let i = 1; i <= 52; i++) {
        if (currentSystem[UNIT_FIELD + i] === 0) continue;
        
        const v = currentSystem[UNIT_FIELD + i];
        const p = currentSystem[UNIT_PREV + i];
        const unitSide = currentSystem[UNIT_SIDE + i];

        let iMotionCluster = new Set();

        switch (currentSystem[UNIT_SORT + i]) {
            case C_helm:   iMotionCluster = typeHelmUnitCluster(v, currentSystem);  break;
            case C_sword:  iMotionCluster = typeSwordUnitCluster(v, currentSystem); break;
            case C_axe:    iMotionCluster = typeAxeUnitCluster(v, currentSystem);   break;
            case C_pike:   iMotionCluster = typePikeUnitCluster(v, currentSystem);  break;
            case C_dart:   iMotionCluster = typeDartUnitCluster(v, currentSystem);  break;
            case C_arrow:  iMotionCluster = typeArrowUnitCluster(v, currentSystem); break;
            default: continue;
        }

        // --- МОБИЛЬНОСТЬ ---
        let ρi = 0;
        if (iMotionCluster.size > 0) {
            iMotionCluster.forEach(b => {
                const unitTestID = currentSystem[FIELD_UNIT + b];
                if (unitTestID === 0) {
                    const sort = currentSystem[UNIT_SORT + i];
                    let bonus = 1;

                    if (colorType(b) === redType) {
                        switch (sort) {
                            case C_helm:   bonus = MOBILITY_BONUS.helm.red;   break;
                            case C_sword:  bonus = MOBILITY_BONUS.sword.red;  break;
                            case C_axe:    bonus = MOBILITY_BONUS.axe.red;    break;
                            case C_pike:   bonus = MOBILITY_BONUS.pike.red;   break;
                            case C_arrow:  bonus = MOBILITY_BONUS.arrow.red;  break;
                            case C_dart:   bonus = MOBILITY_BONUS.dart.red;   break;
                        }
                    } else if (colorType(b) === blueType) {
                        switch (sort) {
                            case C_helm:   bonus = MOBILITY_BONUS.helm.blue;   break;
                            case C_sword:  bonus = MOBILITY_BONUS.sword.blue;  break;
                            case C_axe:    bonus = MOBILITY_BONUS.axe.blue;    break;
                            case C_pike:   bonus = MOBILITY_BONUS.pike.blue;   break;
                            case C_arrow:  bonus = MOBILITY_BONUS.arrow.blue;  break;
                            case C_dart:   bonus = MOBILITY_BONUS.dart.blue;   break;
                        }
                    } else if (colorType(b) === greenType) {
                        switch (sort) {
                            case C_helm:   bonus = MOBILITY_BONUS.helm.green;   break;
                            case C_sword:  bonus = MOBILITY_BONUS.sword.green;  break;
                            case C_axe:    bonus = MOBILITY_BONUS.axe.green;    break;
                            case C_pike:   bonus = MOBILITY_BONUS.pike.green;   break;
                            case C_arrow:  bonus = MOBILITY_BONUS.arrow.green;  break;
                            case C_dart:   bonus = MOBILITY_BONUS.dart.green;   break;
                        }
                    }
                    ρi += bonus;
                }
            });
        }

        // --- Размен: оценка с точки зрения КАЖДОЙ СТОРОНЫ ---
        let δi = 0;
        if (underThreat.has(v)) {
            const deltaC = getExchange(v, currentSystem, false, 3 - unitSide);
            // Вклад в итоговую оценку:
            // - Только если размен выгоден — учитываем
            // - Отражает "агрессивный потенциал": кто может выгодно начать размен
            if (deltaC > 0) {
                δi -= deltaC;  // минус, потому что размен начинает враг, а наша фигура на v — пассивна 
                //console.log('⚔️', deltaC);
            }
        }

        // --- ИТОГОВАЯ ОЦЕНКА ФИГУРЫ ---
        const αi = C[i];
        
        let βi = 0;
        if (currentSystem[UNIT_SORT + i] === C_helm) {
            const kingField = currentSystem[UNIT_FIELD + i];
            βi =        dangerKing(kingField, currentSystem) 
              +    afarDangerKing(kingField, currentSystem)
              +    jumpDangerKing(kingField, currentSystem)
              + perigeeDangerKing(kingField, currentSystem);
        }
        const Ωi = αi + ρi + δi - βi;

        if (unitSide === 1) {
            ΩL += Ωi;
        } else {
            ΩD += Ωi;
        }
    }

    return ΩL - ΩD;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////// === РАЗМЕН === //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getExchange(u, currentSystem, logg = false, side = null) {
    const targetUnitId = currentSystem[FIELD_UNIT + u];
    
    if (typeof u !== 'number' || u <= 0 || u > 92 || targetUnitId === 0) {
        if (logg) console.warn(`Некорректная клетка u = ${u}`);
        return 0;
    }

    const participants = new Set();
    if (targetUnitId !== 0) {
        participants.add(targetUnitId);
    }

    const pad = (num) => num.toString().padStart(2, '0');

    if (logg) {
        console.log(`\n💀 Фигура на Целевой Клетке ${pad(u)}`);
        console.table(Array.from(participants).map(unitId => ({
            Фигура: unitId,
            Сторона: currentSystem[UNIT_SIDE + unitId],
            Сорт: currentSystem[UNIT_SORT + unitId],
            Клетка: currentSystem[UNIT_FIELD + unitId]
        })));
    }

    //for (const v of starExchange[u]) {
    for (let v of starExchange[u]) {
        const unitId = currentSystem[FIELD_UNIT + v];
        if (v === 0 || v === u) continue;
        const unitSide = currentSystem[UNIT_SIDE + unitId];
        const sort = currentSystem[UNIT_SORT + unitId];
        const p = currentSystem[UNIT_PREV + unitId];

        if (currentSystem[UNIT_FIELD + unitId] === 0 || participants.has(unitId)) continue;

        let cluster = [];
        const targetExists = targetUnitId !== 0;
        const targetIsFriendly = targetExists && 
                              currentSystem[UNIT_SIDE + targetUnitId] === unitSide;

        if (targetIsFriendly) {
            switch (sort) {
                case C_helm:   cluster = typeHelmSupportCluster(v, currentSystem); break;
                case C_sword:  cluster = typeSwordSupportCluster(v, currentSystem); break;
                case C_axe:    cluster = typeAxeSupportCluster(v, currentSystem); break;
                case C_pike:   cluster = typePikeSupportCluster(v, currentSystem); break;
                case C_dart:   cluster = typeDartSupportCluster(v, currentSystem); break;
                case C_arrow:  cluster = typeArrowSupportCluster(v, currentSystem); break;
                default: continue;
            }
        } else {
            switch (sort) {
                case C_helm:   cluster = typeHelmUnitCluster(v, currentSystem); break;
                case C_sword:  cluster = typeSwordUnitCluster(v, currentSystem); break;
                case C_axe:    cluster = typeAxeUnitCluster(v, currentSystem); break;
                case C_pike:   cluster = typePikeUnitCluster(v, currentSystem); break;
                case C_dart:   cluster = typeDartUnitCluster(v, currentSystem); break;
                case C_arrow:  cluster = typeArrowCaptureCluster(v, currentSystem); break;
                default: continue;
            }
        }

        if ((Array.isArray(cluster) && !cluster.includes(u)) ||
            (cluster instanceof Set && !cluster.has(u))) {
            continue;
        }

        const uColor = colorType(u);

        if (sort === C_arrow && distance(u, v) > 1) {
            continue;
        }

        if (sort === C_dart) {
            if (uColor !== greenType) continue;
            if (jumps(u, v) > 1) continue;
        }

        if (sort === C_helm) {
            continue;
        }

        participants.add(unitId);
    }

    const candidates = new Set();

    const directionalTypes = [C_axe, C_pike, C_sword];
    for (let j = 1; j <= 52; j++) {
        const v = currentSystem[UNIT_FIELD + j];
        if (v === 0 || v === u) continue;
        const unitSide = currentSystem[UNIT_SIDE + j];
        const sort = currentSystem[UNIT_SORT + j];
        const p = currentSystem[UNIT_PREV + j];

        if (currentSystem[UNIT_FIELD + j] === 0 || participants.has(j)) continue;
        if (!directionalTypes.includes(sort)) continue;

        let beam = null;
        if (sort === C_axe) beam = getBeamAxe(p, v);
        else if (sort === C_pike) beam = getBeamPike(p, v);
        else if (sort === C_sword) {
            const starAxe = getStarAxe(v);
            const starPike = getStarPike(v);
            if ((starAxe  && Array.from(starAxe ).includes(u)) ||
                (starPike && Array.from(starPike).includes(u))) {
                candidates.add(j);
                continue;
            }
        }
        if (beam && Array.from(beam).includes(u)) {
            candidates.add(j);
        }
    }

    if (logg) {
        console.log(`\n🎓 Дальнобойные Кандидаты на Размен ${pad(u)}`);
        console.table(Array.from(candidates).map(unitId => ({
            Фигура: unitId,
            Сторона: currentSystem[UNIT_SIDE + unitId],
            Сорт: currentSystem[UNIT_SORT + unitId],
            Клетка: currentSystem[UNIT_FIELD + unitId]
        })));
    }

    if (logg) {
        console.log(`\n🌟 Лучи Кандидатов на клетке ${pad(u)}`);
    }
    
    const pathsFromCascade = [];
    
    for (const unitId of candidates) {
        const v = currentSystem[UNIT_FIELD + unitId];
        const p = currentSystem[UNIT_PREV + unitId];
        const sort = currentSystem[UNIT_SORT + unitId];

        let beam = null;
        if (sort === C_axe) beam = getBeamAxe(p, v);
        else if (sort === C_pike) beam = getBeamPike(p, v);
        else if (sort === C_sword) {
            const starAxe = getStarAxe(v);
            const starPike = getStarPike(v);
            if (starAxe && Array.from(starAxe).includes(u)) beam = starAxe;
            else if (starPike && Array.from(starPike).includes(u)) beam = starPike;
        }

        if (!beam) continue;
        const rays = [];
        let current = [];
        for (const cell of beam) {
            if (cell === 0) {
                if (current.length > 0) {
                    rays.push([...current]);
                    current = [];
                }
            } else {
                current.push(cell);
            }
        }
        if (current.length > 0) rays.push(current);

        const targetRay = rays.find(ray => ray.includes(u));
        if (!targetRay) continue;

        const path = [u];
        const indexU = targetRay.indexOf(u);
        if (indexU !== -1) {
            for (let i = indexU - 1; i >= 0; i--) {
                path.push(targetRay[i]);
            }
        }
        path.push(v);
        pathsFromCascade.push(path);

        if (logg) {
            console.log(' → '.repeat(1), path.map(pad).join(' → '));
        }
    }

    if (logg) {
        console.log(`\n📊 Анализ всех лучей от клетки ${pad(u)}`);
    }
    
    for (const path of pathsFromCascade) {
        let states = path.map(cell => {
            const unitOnCell = currentSystem[FIELD_UNIT + cell];
            if (cell === u) return `У${pad(cell)}`;
            else if (unitOnCell === 0) return `О${pad(cell)}`;
            else if (participants.has(unitOnCell)) return `У${pad(cell)}`;
            else if (candidates.has(unitOnCell)) return `К${pad(cell)}`;
            else return `П${pad(cell)}`;
        });

        if (logg) {
            console.log(`\n➠ Каскадное превращение на пути: ${path.map(pad).join(' → ')} `);
        }
        
        if (logg) {
            console.log(' → '.repeat(1), states.join(' → '));
        }
        
        states = path.map(cell => {
            const unitOnCell = currentSystem[FIELD_UNIT + cell];
            if (cell === u) return { cell, state: 'У', unitId: targetUnitId };
            else if (unitOnCell === 0) return { cell, state: 'О', unitId: 0 };
            else if (participants.has(unitOnCell)) return { cell, state: 'У', unitId: unitOnCell };
            else if (candidates.has(unitOnCell)) return { cell, state: 'К', unitId: unitOnCell };
            else return { cell, state: 'П', unitId: unitOnCell };
        });

        let blockActive = false;
        const finalStates = [];
        for (const item of states) {
            if (item.state === 'П') blockActive = true;
            if (item.state === 'К') {
                if (blockActive) finalStates.push({ ...item, state: 'П' });
                else {
                    finalStates.push({ ...item, state: 'У' });
                    participants.add(item.unitId);
                }
            } else finalStates.push(item);
        }

        const output = finalStates.map(item => `${item.state}${pad(item.cell)}`).join(' → ');
        if (logg) {
            console.log(' → '.repeat(1), output);
        }
    }

    // --- ОСНОВНАЯ ЛОГИКА КАСКАДА ВНЕ logg ---
    for (const path of pathsFromCascade) {
        const states = path.map(cell => {
            const unitOnCell = currentSystem[FIELD_UNIT + cell];
            if (cell === u) return { cell, state: 'У', unitId: targetUnitId };
            else if (unitOnCell === 0) return { cell, state: 'О', unitId: 0 };
            else if (participants.has(unitOnCell)) return { cell, state: 'У', unitId: unitOnCell };
            else if (candidates.has(unitOnCell)) return { cell, state: 'К', unitId: unitOnCell };
            else return { cell, state: 'П', unitId: unitOnCell };
        });

        let blockActive = false;
        for (const item of states) {
            if (item.state === 'П') blockActive = true;
            if (item.state === 'К') {
                if (!blockActive) {
                    participants.add(item.unitId);
                }
            }
        }
    }

    if (logg) {
        console.log(`\n⭐Объединённые лучи после каскада `);
        const tableData = [];
        for (const path of pathsFromCascade) {
            let states = path.map(cell => {
                const unitOnCell = currentSystem[FIELD_UNIT + cell];
                if (cell === u) return `У${pad(cell)}`;
                else if (unitOnCell === 0) return `О${pad(cell)}`;
                else if (participants.has(unitOnCell)) return `У${pad(cell)}`;
                else if (candidates.has(unitOnCell)) return `К${pad(cell)}`;
                else return `П${pad(cell)}`;
            });

            states = path.map(cell => {
                const unitOnCell = currentSystem[FIELD_UNIT + cell];
                if (cell === u) return { cell, state: 'У', unitId: targetUnitId };
                else if (unitOnCell === 0) return { cell, state: 'О', unitId: 0 };
                else if (participants.has(unitOnCell)) return { cell, state: 'У', unitId: unitOnCell };
                else if (candidates.has(unitOnCell)) return { cell, state: 'К', unitId: unitOnCell };
                else return { cell, state: 'П', unitId: unitOnCell };
            });

            let blockActive = false;
            const finalStates = [];
            for (const item of states) {
                if (item.state === 'П') blockActive = true;
                if (item.state === 'К') {
                    if (blockActive) finalStates.push({ ...item, state: 'П' });
                    else {
                        finalStates.push({ ...item, state: 'У' });
                    }
                } else finalStates.push(item);
            }

            const output = finalStates.map(item => `${item.state}${pad(item.cell)}`).join(' → ');
            tableData.push({ Путь: output });
        }
        console.table(tableData);
    }

    if (side === null) side = currentSystem[QUEUE];
    const targetSide = currentSystem[UNIT_SIDE + targetUnitId];
    if (targetSide === side) {
        if (logg) console.log("    Целевая фигура — своя. Размен неактуален.");
        return 0;
    }

    participants.delete(targetUnitId);

    const myParticipants = new Set();
    const enemyParticipants = new Set();
    for (const unitId of participants) {
        const unitSide = currentSystem[UNIT_SIDE + unitId];
        if (unitSide === side) myParticipants.add(unitId);
        else if (unitSide !== side) enemyParticipants.add(unitId);
    }

    if (myParticipants.size === 0) {
        if (logg) console.log("    Нет своих фигур для взятия.");
        return 0;
    }

    const getSortedUnits = (unitSet) => {
        return Array.from(unitSet).sort((a, b) => currentSystem[UNIT_SORT + a] - currentSystem[UNIT_SORT + b]);
    };

    let ourLoss = 0;
    let enemyLoss = 0;
    let lastSide = null;

    enemyLoss += currentSystem[UNIT_SORT + targetUnitId];
    lastSide = targetSide;

    // --- СИМУЛЯЦИЯ размена ---
    const myUnitsSim = getSortedUnits(myParticipants);
    const enemyUnitsSim = getSortedUnits(enemyParticipants);
    let myIndex = 0;
    let enemyIndex = 0;

    while (true) {
        if (lastSide !== side && myIndex < myUnitsSim.length) {
            const next = myUnitsSim[myIndex++];
            const cost = currentSystem[UNIT_SORT + next];
            if (enemyIndex < enemyUnitsSim.length) ourLoss += cost;
            lastSide = side;
        }
        else if (lastSide === side && enemyIndex < enemyUnitsSim.length) {
            const next = enemyUnitsSim[enemyIndex++];
            const cost = currentSystem[UNIT_SORT + next];
            if (myIndex < myUnitsSim.length) enemyLoss += cost;
            lastSide = targetSide;
        } else break;
    }

    // --- ТОЛЬКО ВЫВОД ДЛЯ logg ---
    if (logg) {
        console.log(`\n🧮 Симуляция размена на клетке ${pad(u)}`);
        const moves = [];
        moves.push({
            '№': 0,
            Ход: 'враг',
            Фигура: targetUnitId,
            Сорт: currentSystem[UNIT_SORT + targetUnitId],
            Действие: 'снята'
        });
        let moveNumber = 1;
        let simLastSide = targetSide;
        let simMyIndex = 0;
        let simEnemyIndex = 0;
        while (true) {
            if (simLastSide !== side && simMyIndex < myUnitsSim.length) {
                const next = myUnitsSim[simMyIndex++];
                moves.push({
                    '№': moveNumber++,
                    Ход: 'свои',
                    Фигура: next,
                    Сорт: currentSystem[UNIT_SORT + next],
                    Действие: 'берёт'
                });
                simLastSide = side;
            }
            else if (simLastSide === side && simEnemyIndex < enemyUnitsSim.length) {
                const next = enemyUnitsSim[simEnemyIndex++];
                moves.push({
                    '№': moveNumber++,
                    Ход: 'враг',
                    Фигура: next,
                    Сорт: currentSystem[UNIT_SORT + next],
                    Действие: 'берёт'
                });
                simLastSide = targetSide;
            } else break;
        }
        console.table(moves);
   
        console.log(`\n⚖️ Баланс размена `);
        console.table({
            Баланс: { 'ΔС': enemyLoss - ourLoss},
            Потери: { Враг: enemyLoss, Свои: ourLoss }
        });
    }
    
    //////////////////////////////////////
    // Создаём упорядоченный массив частичных сумм
    const partialSums = [0]; // начальная сумма
    
    // Определяем начальную сторону хода (противник начинает с целевой фигуры)
    let nextSide = 3 - currentSystem[UNIT_SIDE + targetUnitId];
    
    // Добавляем стоимость целевой фигуры как первый элемент
    partialSums.push(currentSystem[UNIT_SORT + targetUnitId]);
    
    // Удаляем целевую фигуру из участников
    participants.delete(targetUnitId);
    
    // Формируем последовательность размена
    while (participants.size > 0) {
        // Выбираем фигуры текущей стороны
        const candidates = Array.from(participants).filter(id => currentSystem[UNIT_SIDE + id] === nextSide);
        
        if (candidates.length === 0) break;
        
        // Проверяем доступность для дальнобойных фигур
        const validCandidates = candidates.filter(id => {
            const sort = currentSystem[UNIT_SORT + id];
            if ([C_axe, C_pike, C_sword].includes(sort)) {
                return isCellAvailable(u, currentSystem[UNIT_FIELD + id], currentSystem);
            }
            return true;
        });
        
        if (validCandidates.length === 0) break;
        
        // Выбираем фигуру с минимальной стоимостью
        const chosenId = validCandidates.reduce((minId, id) => 
            currentSystem[UNIT_SORT + id] < currentSystem[UNIT_SORT + minId] ? id : minId
        );
        
        // Добавляем новую частичную сумму
        const delta = currentSystem[UNIT_SIDE + chosenId] === side 
            ? -currentSystem[UNIT_SORT + chosenId] // наша фигура — минус
            : currentSystem[UNIT_SORT + chosenId];  // вражеская — плюс
        
        partialSums.push(partialSums[partialSums.length - 1] + delta);
        
        // Удаляем выбранную фигуру
        participants.delete(chosenId);
        
        // Меняем сторону
        nextSide = 3 - nextSide;
    }
    
    if (logg) {
        console.log("Частичные суммы:", partialSums);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// функции специальных состояний //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function isKingInCheck(currentSystem) {
    const activeSide = currentSystem[QUEUE];
    const kingId = activeSide === 1 ? 1 : 27;

    const vKing = currentSystem[UNIT_FIELD + kingId];
    if (!vKing || currentSystem[UNIT_SORT + kingId] !== C_helm) return false;

    for (let enemyId = 1; enemyId <= 52; enemyId++) {
        if (currentSystem[UNIT_SIDE + enemyId] === activeSide || currentSystem[UNIT_FIELD + enemyId] === 0) continue;

        const vEnemy = currentSystem[UNIT_FIELD + enemyId];
        const cluster = (() => {
            switch (currentSystem[UNIT_SORT + enemyId]) {
                case C_helm:  return typeHelmAutoCheckCluster(vEnemy, currentSystem);
                case C_axe:   return typeAxeAutoCheckCluster(vEnemy, currentSystem);
                case C_pike:  return typePikeAutoCheckCluster(vEnemy, currentSystem);
                case C_dart:  return typeDartAutoCheckCluster(vEnemy, currentSystem);
                case C_sword: return typeSwordAutoCheckCluster(vEnemy, currentSystem);
                case C_arrow: return typeArrowAutoCheckCluster(vEnemy, currentSystem);
                default:      return new Set();
            }
        })();

        if (cluster.has(vKing)) {
            return true; // король под шахом
        }
    }

    return false;
}

function hasAnyLegalMoves(currentSystem) {
    const activeSide = currentSystem[QUEUE];
    const unitCluster = new Array(53); // Массив для хранения кластеров единиц

    let foundMoves = false; // Флаг, чтобы помечать наличие ходов

    for (let i = 1; i <= 52; i++) {
        if (currentSystem[UNIT_FIELD + i] === 0 || currentSystem[UNIT_SIDE + i] !== activeSide) continue;
        const v = currentSystem[UNIT_FIELD + i];
        const sort = currentSystem[UNIT_SORT + i];

        unitCluster[i] = (() => {
            switch (sort) {
                case C_helm:   return typeHelmUnitCluster(v, currentSystem);
                case C_sword:  return typeSwordUnitCluster(v, currentSystem);
                case C_axe:    return typeAxeUnitCluster(v, currentSystem);
                case C_pike:   return typePikeUnitCluster(v, currentSystem);
                case C_dart:   return typeDartUnitCluster(v, currentSystem);
                case C_arrow:  return typeArrowUnitCluster(v, currentSystem);
                default:       return new Set();
            }
        })();

        if (unitCluster[i].size > 0) {
            foundMoves = true; // Устанавливаем флаг, если найдены ходы
        }
    }

    return foundMoves ? unitCluster : false; // Возвращаем полный массив или false
}

function isFullDraw(currentSystem) {
    let lightCount = 0;
    let darkCount = 0;

    for (let i = 1; i <= 52; i++) {
        if (currentSystem[UNIT_FIELD + i] === 0) continue;

        const side = currentSystem[UNIT_SIDE + i];
        if (currentSystem[UNIT_SORT + i] === C_helm) continue;

        if (side === 1) lightCount++;
        else if (side === 2) darkCount++;
    }

    return lightCount === 0 && darkCount === 0;
}

function isRazgrom(currentSystem) {
    const activeSide = currentSystem[QUEUE];
    let count = 0;

    for (let i = 1; i <= 52; i++) {
        if (currentSystem[UNIT_FIELD + i] === 0) continue;
        if (currentSystem[UNIT_SIDE + i] === activeSide && currentSystem[UNIT_SORT + i] !== C_helm) {
            count++;
        }
    }

    return count === 0;
}

function underEnemyThreat(currentSystem) {
    const underThreat = new Set();

    for (let i = 1; i <= 52; i++) {
        if (currentSystem[UNIT_FIELD + i] === 0) continue;

        const v = currentSystem[UNIT_FIELD + i];
        const side = currentSystem[UNIT_SIDE + i];
        const sort = currentSystem[UNIT_SORT + i];

        let attackCluster = new Set();

        switch (sort) {
            case C_helm:   attackCluster = typeHelmUnitCluster(v, currentSystem); break;
            case C_sword:  attackCluster = typeSwordUnitCluster(v, currentSystem); break;
            case C_axe:    attackCluster = typeAxeUnitCluster(v, currentSystem); break;
            case C_pike:   attackCluster = typePikeUnitCluster(v, currentSystem); break;
            case C_dart:   attackCluster = typeDartUnitCluster(v, currentSystem); break;
            case C_arrow:  attackCluster = typeArrowUnitCluster(v, currentSystem); break;
            default: continue;
        }

        for (const u of attackCluster) {
            const targetId = currentSystem[FIELD_UNIT + u];
            if (targetId !== 0 && currentSystem[UNIT_SIDE + targetId] !== side) {
                underThreat.add(u);
            }
        }
    }
    
    return underThreat;
}

function underEnemyControl(currentSystem) {
    const underControl = new Set();
    
    for (let enemy = 1; enemy <= 52; enemy++) {
        if (currentSystem[UNIT_FIELD + enemy] === 0) continue;
        const side = currentSystem[UNIT_SIDE + enemy];
        if (side === currentSystem[QUEUE]) continue; // не противник
        const v = currentSystem[UNIT_FIELD + enemy];
        let attackCluster = new Set();
    
        switch (currentSystem[UNIT_SORT + enemy]) {
            case C_helm:   attackCluster = typeHelmUnitCluster(v, currentSystem); break;
            case C_sword:  attackCluster = typeSwordUnitCluster(v, currentSystem); break;
            case C_axe:    attackCluster = typeAxeUnitCluster(v, currentSystem); break;
            case C_pike:   attackCluster = typePikeUnitCluster(v, currentSystem); break;
            case C_dart:   attackCluster = typeDartUnitCluster(v, currentSystem); break;
            case C_arrow:  attackCluster = typeArrowControlCluster(v, currentSystem); break;
            default: continue;
        }
        
        switch (currentSystem[UNIT_SORT + enemy]) {
            case C_helm:   supportCluster = typeHelmSupportCluster(v, currentSystem); break;
            case C_sword:  supportCluster = typeSwordSupportCluster(v, currentSystem); break;
            case C_axe:    supportCluster = typeAxeSupportCluster(v, currentSystem); break;
            case C_pike:   supportCluster = typePikeSupportCluster(v, currentSystem); break;
            case C_dart:   supportCluster = typeDartSupportCluster(v, currentSystem); break;
            case C_arrow:  supportCluster = typeArrowSupportCluster(v, currentSystem); break;
            default: continue;
        }
    
        for (const u of attackCluster) {
            const targetId = currentSystem[FIELD_UNIT + u];
            underControl.add(u);
        }
        
        for (const u of supportCluster) {
            const targetId = currentSystem[FIELD_UNIT + u];
            underControl.add(u);
        }
    }
    
    return underControl;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// === ТИПЫ ХОДОВ === ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function applyTreeMove(unitId, targetField, currentSystem) {
    const oldField = currentSystem[UNIT_FIELD + unitId];

    // Создаём копию типизированного массива
    const newSystem = new Uint8Array(currentSystem);

    // Освобождаем старое поле
    newSystem[FIELD_UNIT + oldField] = 0;
    // Занимаем новое поле
    newSystem[FIELD_UNIT + targetField] = unitId;
    // Обновляем позицию фигуры
    newSystem[UNIT_FIELD + unitId] = targetField;
    // Обновляем предыдущее поле
    newSystem[UNIT_PREV + unitId] = oldField;
    
    // === ФУНДАМЕНТАЛЬНОЕ: СМЕНА ОЧЕРЕДИ ===
    newSystem[QUEUE] = 3 - currentSystem[QUEUE];
    // =============================================

    return newSystem;
}

function applyTreeCapture(unitId, targetUnitId, targetField, currentSystem) {
    const oldField = currentSystem[UNIT_FIELD + unitId];

    // Создаём копию типизированного массива
    const newSystem = new Uint8Array(currentSystem);
    const enemyOldField = newSystem[UNIT_FIELD + targetUnitId];

    // Освобождаем старое поле атакующего
    newSystem[FIELD_UNIT + oldField] = 0;

    // Убираем фигуру противника с доски
    newSystem[FIELD_UNIT + enemyOldField] = 0;
    newSystem[UNIT_FIELD + targetUnitId] = 0; // делаем фигуру "мертвой"

    // Размещаем атакующего на новом поле
    newSystem[FIELD_UNIT + targetField] = unitId;
    newSystem[UNIT_FIELD + unitId] = targetField;
    newSystem[UNIT_PREV + unitId] = oldField;
    
    // === ФУНДАМЕНТАЛЬНОЕ: СМЕНА ОЧЕРЕДИ ===
    newSystem[QUEUE] = 3 - currentSystem[QUEUE];
    // =============================================

    return newSystem;
}

function applyTreeCastling(kingId, viceId, currentSystem) {
    const kingOldField = currentSystem[UNIT_FIELD + kingId];
    const viceOldField = currentSystem[UNIT_FIELD + viceId];

    const newSystem = new Uint8Array(currentSystem);

    // Освобождаем старые поля
    newSystem[FIELD_UNIT + kingOldField] = 0;
    newSystem[FIELD_UNIT + viceOldField] = 0;

    // Обмениваемся позициями
    newSystem[UNIT_FIELD + kingId] = viceOldField;
    newSystem[UNIT_FIELD + viceId] = kingOldField;

    // Занимаем новые поля
    newSystem[FIELD_UNIT + viceOldField] = kingId;
    newSystem[FIELD_UNIT + kingOldField] = viceId;

    // Обновляем previos для короля
    newSystem[UNIT_PREV + kingId] = kingOldField;
    // Обновляем previos для партнёра
    newSystem[UNIT_PREV + viceId] = viceOldField;

    // После рокировки партнер уже не может рокироваться снова
    newSystem[UNIT_CASTLING + viceId] = 0;
    
    // === ФУНДАМЕНТАЛЬНОЕ: СМЕНА ОЧЕРЕДИ ===
    newSystem[QUEUE] = 3 - currentSystem[QUEUE];
    // =============================================

    return newSystem;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// === typeXXXUnitCluster === ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function typeHelmUnitCluster(v, currentSystem) {
    let result  = new Set();
    let usual   = new Set();
    let special = new Set();
    
    // Чтение из currentSystem
    const vUnitId = currentSystem[FIELD_UNIT + v];
    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2
    
    let starUsual = getStarHelm(v);
    usual = processList(vUnitId, starUsual, currentSystem, ownSide, true);
    let starSpecial = getStarOfCastling (v);
    special = processCastlingList(vUnitId, starSpecial, currentSystem, ownSide, true);
    
    // Объединяем кластеры
    result = new Set([...usual, ...special]);

    return result;
}

function typeDartUnitCluster(v, currentSystem) {
    let result = new Set();

    // Чтение из currentSystem
    const vUnitId = currentSystem[FIELD_UNIT + v];
    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2

    // Использование старой логики для star и processList
    const star = getStarDart(v);
    
    result = processList(vUnitId, star, currentSystem, ownSide, true);
    
    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function typeSwordUnitCluster(v, currentSystem) {
    let result = new Set();

    const vUnitId = currentSystem[FIELD_UNIT + v];
    if (!vUnitId) return result;

    const pikeSet = typeSectionCluster(v, C_pike, currentSystem);
    const axeSet  = typeSectionCluster(v, C_axe,  currentSystem);

    // Объединяем кластеры
    result = new Set([...pikeSet, ...axeSet]);

    return result;
}

function typeSectionCluster(v, sort, currentSystem) {
    let result = new Set();
    let section;

    const vUnitId = currentSystem[FIELD_UNIT + v];
    if (!vUnitId) return result;

    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2

    if (sort === C_axe) {
        section = getStarAxe(v);
    }
    if (sort === C_pike) {
        section = getStarPike(v);
    }

    result = processRay(vUnitId, section, currentSystem, ownSide, true);

    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function typeAxeUnitCluster(v, currentSystem) {
    let result = new Set();

    const vUnitId = currentSystem[FIELD_UNIT + v];
    if (!vUnitId) return result;
    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2
    const p = currentSystem[UNIT_PREV + vUnitId];

    let beam = getBeamAxe(p, v);
    if (!p || !beam) return result;
    result = processRay(vUnitId, beam, currentSystem, ownSide, true);

    return result;
}

function typePikeUnitCluster(v, currentSystem) {
    let result = new Set();

    const vUnitId = currentSystem[FIELD_UNIT + v];
    if (!vUnitId) return result;
    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2
    const p = currentSystem[UNIT_PREV + vUnitId];

    let beam = getBeamPike(p, v);
    if (!p || !beam) return result;
    result = processRay(vUnitId, beam, currentSystem, ownSide, true);

    return result;
}

function typeArrowUnitCluster(v, currentSystem) {
    let result = new Set();

    const vUnitId = currentSystem[FIELD_UNIT + v];
    if (!vUnitId) return result;
    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2
    const p = currentSystem[UNIT_PREV + vUnitId];

    const stepZero = (
        (ownSide === 1 && p === 1 && !lSet.has(v)) ||
        (ownSide === 2 && p === 2 && !dSet.has(v))
    );

    if (stepZero) {
        let firstMove = processMoveList(vUnitId, getFirstMoveArrow(p, v), currentSystem, ownSide, true);
        let firstCapture = processCaptureList(vUnitId, getFirstCaptureArrow(p, v), currentSystem, ownSide, true);

        result = new Set([...firstMove, ...firstCapture]);
    } else {
        let usualMove = processMoveList(vUnitId, getMoveArrow(p, v), currentSystem, ownSide, true);
        let usualCapture = processCaptureList(vUnitId, getCaptureArrow(p, v), currentSystem, ownSide, true);

        result = new Set([...usualMove, ...usualCapture]);
    }

    return result;
}

function typeArrowCaptureCluster(v, currentSystem) {
    let result = new Set();

    const vUnitId = currentSystem[FIELD_UNIT + v];
    if (!vUnitId) return result;
    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2
    const p = currentSystem[UNIT_PREV + vUnitId];

    const stepZero = (
        (ownSide === 1 && p === 1 && !lSet.has(v)) ||
        (ownSide === 2 && p === 2 && !dSet.has(v))
    );

    if (stepZero) {
        let firstCapture = processCaptureList(vUnitId, getFirstCaptureArrow(p, v), currentSystem, ownSide, true);

        result = firstCapture;
    } else {
        let usualCapture = processCaptureList(vUnitId, getCaptureArrow(p, v), currentSystem, ownSide, true);

        result = usualCapture;
    }

    return result;
}

function typeArrowSupportCluster(v, currentSystem) {
    let result = new Set();

    const vUnitId = currentSystem[FIELD_UNIT + v];
    if (!vUnitId) return result;
    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2
    const p = currentSystem[UNIT_PREV + vUnitId];

    const stepZero = (
        (ownSide === 1 && p === 1 && !lSet.has(v)) ||
        (ownSide === 2 && p === 2 && !dSet.has(v))
    );

    if (stepZero) {
        let firstCapture = processSupportList(vUnitId, getFirstCaptureArrow(p, v), currentSystem, ownSide, true);

        result = firstCapture;
    } else {
        let usualCapture = processSupportList(vUnitId, getCaptureArrow(p, v), currentSystem, ownSide, true);

        result = usualCapture;
    }

    return result;
}

function typeArrowControlCluster(v, currentSystem) {
    let result = new Set();

    const vUnitId = currentSystem[FIELD_UNIT + v];
    if (!vUnitId) return result;
    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2
    const p = currentSystem[UNIT_PREV + vUnitId];

    const stepZero = (
        (ownSide === 1 && p === 1 && !lSet.has(v)) ||
        (ownSide === 2 && p === 2 && !dSet.has(v))
    );

    if (stepZero) {
        let firstMove = processMoveList(vUnitId, getFirstMoveArrow(p, v), currentSystem, ownSide, true);
        let firstCapture = processControlList(vUnitId, getFirstCaptureArrow(p, v), currentSystem, ownSide, true);

        result = new Set([...firstMove, ...firstCapture]);
    } else {
        let usualMove = processMoveList(vUnitId, getMoveArrow(p, v), currentSystem, ownSide, true);
        let usualCapture = processControlList(vUnitId, getCaptureArrow(p, v), currentSystem, ownSide, true);

        result = new Set([...usualMove, ...usualCapture]);
    }

    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// === typeXXXSupportCluster === /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function typeHelmSupportCluster(v, currentSystem) {
    let result  = new Set();
    let usual   = new Set();
    
    // Чтение из currentSystem
    const vUnitId = currentSystem[FIELD_UNIT + v];
    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2
    
    let starUsual = getStarHelm(v);
    usual = supportList(vUnitId, starUsual, currentSystem, ownSide);
    
    // Объединяем кластеры
    result = usual;

    return result;
}

function typeDartSupportCluster(v, currentSystem) {
    let result = new Set();

    // Чтение из currentSystem
    const vUnitId = currentSystem[FIELD_UNIT + v];
    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2

    // Использование старой логики для star и processList
    const star = getStarDart(v);
    
    result = supportList(vUnitId, star, currentSystem, ownSide);
    
    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function typeSwordSupportCluster(v, currentSystem) {
    let result = new Set();

    const vUnitId = currentSystem[FIELD_UNIT + v];
    if (!vUnitId) return result;

    const pikeSet = typeSectionSupportCluster(v, C_pike, currentSystem);
    const axeSet  = typeSectionSupportCluster(v, C_axe,  currentSystem);

    // Объединяем кластеры
    // SUPPORT учитывает только гипотетические взятия на клетки, где убьют нашего
    result = new Set([...pikeSet, ...axeSet]);

    return result;
}

function typeSectionSupportCluster(v, sort, currentSystem) {
    let result = new Set();
    let section;

    const vUnitId = currentSystem[FIELD_UNIT + v];
    if (!vUnitId) return result;

    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2

    if (sort === C_axe) {
        section = getStarAxe(v);
    }
    if (sort === C_pike) {
        section = getStarPike(v);
    }
    // SUPPORT учитывает только гипотетические взятия на клетки, где убьют нашего
    result = supportRay(vUnitId, section, currentSystem, ownSide, true);

    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function typeAxeSupportCluster(v, currentSystem) {
    let result = new Set();

    const vUnitId = currentSystem[FIELD_UNIT + v];
    if (!vUnitId) return result;
    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2
    const p = currentSystem[UNIT_PREV + vUnitId];

    let beam = getBeamAxe(p, v);
    if (!p || !beam) return result;
    // SUPPORT учитывает только гипотетические взятия на клетки, где убьют нашего
    result = supportRay(vUnitId, beam, currentSystem, ownSide);

    return result;
}

function typePikeSupportCluster(v, currentSystem) {
    let result = new Set();

    const vUnitId = currentSystem[FIELD_UNIT + v];
    if (!vUnitId) return result;
    const ownSide = currentSystem[UNIT_SIDE + vUnitId]; // 1 или 2
    const p = currentSystem[UNIT_PREV + vUnitId];
     
    let beam = getBeamPike(p, v);
    if (!p || !beam) return result;
    // SUPPORT учитывает только гипотетические взятия на клетки, где убьют нашего
    result = supportRay(vUnitId, beam, currentSystem, ownSide);

    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////// typeTestAutoCheck  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function typeTestAutoCheck(unitId, targetField, currentSystem) {
    const hypotheticalSystem = applyTestMove(unitId, targetField, currentSystem);
    const mySide = currentSystem[UNIT_SIDE + unitId]; // 1 или 2
    const kingId = mySide === 1 ? 1 : 27;
    const kingField = hypotheticalSystem[UNIT_FIELD + kingId];
    let nextField, star, star1, star2;

    for (let enemyUnitId = 1; enemyUnitId <= 52; enemyUnitId++) {
        if (hypotheticalSystem[UNIT_SIDE + enemyUnitId] === mySide) continue;
        if (hypotheticalSystem[UNIT_FIELD + enemyUnitId] === 0) continue;

        const enemySort = hypotheticalSystem[UNIT_SORT + enemyUnitId];
        const enemyField = hypotheticalSystem[UNIT_FIELD + enemyUnitId];

        let autoCheckCluster = new Set();

        if (enemySort === C_helm) {
            nextField = getStarHelm(kingField);
            if (nextField.includes(enemyField)) {
                return true;
            }
        }
        if (enemySort === C_axe) {
            star = getStarAxe(kingField);
            if (star.includes(enemyField)) {
                autoCheckCluster = typeAxeAutoCheckCluster(enemyField, hypotheticalSystem);
            }
        }
        if (enemySort === C_pike && kingField <= 32) {
            star = getStarPike(kingField);
            if (star.includes(enemyField)) {
                autoCheckCluster = typePikeAutoCheckCluster(enemyField, hypotheticalSystem);
            }
        }
        if (enemySort === C_sword) {
            star1 = getStarAxe(kingField);
            star2 = getStarPike(kingField);
            if (star1.includes(enemyField) || star2.includes(enemyField)) {
                autoCheckCluster = typeSwordAutoCheckCluster(enemyField, hypotheticalSystem);
            }
        }
        if (enemySort === C_dart && kingField > 32) {
            star = getStarDart(kingField);
            if (star.includes(enemyField)) {
                return true;
            }
        }
        if (enemySort === C_arrow) {
            nextField = getStarHelm(kingField);
            if (nextField.includes(enemyField)) {
                autoCheckCluster = typeArrowAutoCheckCluster(enemyField, hypotheticalSystem);
            }
        }
        if (autoCheckCluster.has(kingField)) {
            return true;
        }
    }

    return false;
}

function applyTestMove(unitId, targetField, currentSystem) {
    const newSystem = new Uint8Array(currentSystem);

    const oldField = newSystem[UNIT_FIELD + unitId];
    const targetUnitId = newSystem[FIELD_UNIT + targetField]; // фигура на целевом поле

    // +++ УДАЛЕНИЕ ВРАЖЕСКОЙ ФИГУРЫ (ЕСЛИ ЕСТЬ)
    if (targetUnitId !== 0) {
        newSystem[UNIT_FIELD + targetUnitId] = 0; // делаем фигуру "мёртвой"
    }

    // Освобождаем старое поле
    newSystem[FIELD_UNIT + oldField] = 0;
    // Занимаем новое поле
    newSystem[FIELD_UNIT + targetField] = unitId;
    // Обновляем позицию фигуры
    newSystem[UNIT_FIELD + unitId] = targetField;
    // Обновляем предыдущее поле
    newSystem[UNIT_PREV + unitId] = oldField;
    
    // 
    newSystem[QUEUE] = 3 - currentSystem[QUEUE];

    return newSystem;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// === typeXXXAutoCheckCluster === /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function typeHelmAutoCheckCluster(w, currentSystem) {
    let result  = new Set();
    let usual   = new Set();
    
    // Чтение из currentSystem
    const wUnitId = currentSystem[FIELD_UNIT + w];
    const ownSide = currentSystem[UNIT_SIDE + wUnitId]; // 1 или 2
    
    let starUsual = getStarHelm(w);
    usual = processList(wUnitId, starUsual, currentSystem, ownSide, false);
    
    result = usual;
    
    return result;
}

function typeDartAutoCheckCluster(w, currentSystem) {
    let result = new Set();
    
    const wUnitId = currentSystem[FIELD_UNIT + w];
    const ownSide = currentSystem[UNIT_SIDE + wUnitId]; // 1 или 2
    
    let star = getStarDart(w);
    result = processList(wUnitId, star, currentSystem, ownSide, false);
     
    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function typeSwordAutoCheckCluster(w, currentSystem) {
    let result = new Set();

    const wUnitId = currentSystem[FIELD_UNIT + w];
    if (!wUnitId) return result;

    const pikeSet = typeSectionAutoCheckCluster(w, C_pike, currentSystem);
    const axeSet  = typeSectionAutoCheckCluster(w, C_axe,  currentSystem);

    // Объединяем кластеры
    result = new Set([...pikeSet, ...axeSet]);

    return result;
}

function typeSectionAutoCheckCluster(w, sort, currentSystem) {
    let result = new Set();
    let section;

    const wUnitId = currentSystem[FIELD_UNIT + w];
    if (!wUnitId) return result;

    const ownSide = currentSystem[UNIT_SIDE + wUnitId]; // 1 или 2

    if (sort === C_axe) {
        section = getStarAxe(w);
    }
    if (sort === C_pike) {
        section = getStarPike(w);
    }

    result = processRay(wUnitId, section, currentSystem, ownSide, false);

    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function typeAxeAutoCheckCluster(w, currentSystem) {
    let result = new Set();

    const wUnitId = currentSystem[FIELD_UNIT + w];
    if (!wUnitId) return result;
    const ownSide = currentSystem[UNIT_SIDE + wUnitId]; // 1 или 2
    const p = currentSystem[UNIT_PREV + wUnitId];

    let beam = getBeamAxe(p, w);
    if (!p || !beam) return result;
    result = processRay(wUnitId, beam, currentSystem, ownSide, false);

    return result;
}

function typePikeAutoCheckCluster(w, currentSystem) {
    let result = new Set();

    const wUnitId = currentSystem[FIELD_UNIT + w];
    if (!wUnitId) return result;
    const ownSide = currentSystem[UNIT_SIDE + wUnitId]; // 1 или 2
    const p = currentSystem[UNIT_PREV + wUnitId];

    let beam = getBeamPike(p, w);
    if (!p || !beam) return result;
    result = processRay(wUnitId, beam, currentSystem, ownSide, false);

    return result;
}

function typeArrowAutoCheckCluster(w, currentSystem) {
    let result = new Set();

    const wUnitId = currentSystem[FIELD_UNIT + w];
    if (!wUnitId) return result;
    const ownSide = currentSystem[UNIT_SIDE + wUnitId]; // 1 или 2
    const p = currentSystem[UNIT_PREV + wUnitId];

    const stepZero = (
        (ownSide === 1 && p === 1 && !lSet.has(w)) ||
        (ownSide === 2 && p === 2 && !dSet.has(w))
    );

    if (stepZero) {
        let firstMove = processMoveList(wUnitId, getFirstMoveArrow(p, w), currentSystem, ownSide, false);
        let firstCapture = processCaptureList(wUnitId, getFirstCaptureArrow(p, w), currentSystem, ownSide, false);

        result = new Set([...firstMove, ...firstCapture]);
    } else {
        let usualMove = processMoveList(wUnitId, getMoveArrow(p, w), currentSystem, ownSide, false);
        let usualCapture = processCaptureList(wUnitId, getCaptureArrow(p, w), currentSystem, ownSide, false);

        result = new Set([...usualMove, ...usualCapture]);
    }

    return result;
}

/////////////////////////// ВСПОМОГАТЕЛЬНЫЕ process //////////////////////////////////////////////////////////////////////////////////////////////////////////
function processRay(vUnitId, ray, currentSystem, originalSide, testAuto) {
    const result = new Set();
    let i = 0;
    const len = ray.length;

    while (i < len) {
        const field = ray[i];

        if (field === 0) { // Начало луча — сбрасываем, переходим дальше
            i++;
            continue;
        }

        // Поле не ноль
        const unitId = currentSystem[FIELD_UNIT + field];

        if (unitId === 0) { // Пустое поле — добавляем и идём дальше
            if (testAuto) {
                if (!typeTestAutoCheck(vUnitId, field, currentSystem)) {
                    result.add(field);
                }
            } else {
                result.add(field);
            }
            i++;
        } else {
            const unitSide = currentSystem[UNIT_SIDE + unitId]; // 1 или 2

            if (unitSide === originalSide) { // Своя фигура — НЕ добавляем, ПРОСТО СРАЗУ пролистываем до следующего 0 или конца
                i++;
                while (i < len && ray[i] !== 0) i++;
            } else { // Чужая фигура — добавляем, затем пролистываем до следующего 0 или конца
                if (testAuto) {
                    if (!typeTestAutoCheck(vUnitId, field, currentSystem)) {
                        result.add(field);
                    }
                } else {
                    result.add(field);
                }
                i++;
                while (i < len && ray[i] !== 0) i++;
            }
        }
    }

    return result;
}

function processList(vUnitId, list, currentSystem, originalSide, testAuto) {
    const result = new Set();
    let i = 0;
    const len = list.length;

    while (i < len) {
        const field = list[i];
        const unitId = currentSystem[FIELD_UNIT + field]; // Чтение из currentSystem
        
        if (unitId === 0) { // Пустое поле — добавляем и идём дальше
            if (testAuto) {
                if (!typeTestAutoCheck(vUnitId, field, currentSystem)) {
                    result.add(field);
                }
            }
            else {
                result.add(field);
            }
            i++;
        } else {
            
            const unitSide = currentSystem[UNIT_SIDE + unitId]; // 1 или 2

            if (unitSide === originalSide) { // Своя фигура — НЕ добавляем
                i++;
            } else { // Чужая фигура — добавляем
                if (testAuto) {
                    if (!typeTestAutoCheck(vUnitId, field, currentSystem)) { 
                        result.add(field);
                    }
                }
                else {
                    result.add(field);
                }
                i++;
            }
        }
        
    }

    return result;
}

function processMoveList(vUnitId, list, currentSystem, originalSide, testAuto) {
    const result = new Set();
    let i = 0;
    const len = list.length;

    while (i < len) {
        const field = list[i];
        const unitId = currentSystem[FIELD_UNIT + field]; // Чтение из system

        if (unitId === 0) { // Пустое поле — добавляем и идём дальше
            if (testAuto) {
                if (!typeTestAutoCheck(vUnitId, field, currentSystem)) {
                    result.add(field);
                }
            } else {
                result.add(field);
            }
        }
        i++;
    }

    return result;
}

function processCaptureList(vUnitId, list, currentSystem, originalSide, testAuto) {
    const result = new Set();
    let i = 0;
    const len = list.length;

    while (i < len) {
        const field = list[i];
        const unitId = currentSystem[FIELD_UNIT + field]; // Чтение из system

        if (unitId !== 0) {
            const unitSide = currentSystem[UNIT_SIDE + unitId]; // 1 или 2

            if (unitSide !== originalSide) { // Чужая фигура — добавляем
                if (testAuto) {
                    if (!typeTestAutoCheck(vUnitId, field, currentSystem)) {
                        result.add(field);
                    }
                } else {
                    result.add(field);
                }
            }
        }
        i++;
    }

    return result;
}

function processSupportList(vUnitId, list, currentSystem, originalSide, testAuto) {
    const result = new Set();
    let i = 0;
    const len = list.length;

    while (i < len) {
        const field = list[i];
        const unitId = currentSystem[FIELD_UNIT + field]; // Чтение из system

        if (unitId !== 0) {
            const unitSide = currentSystem[UNIT_SIDE + unitId]; // 1 или 2

            if (unitSide === originalSide) { // Чужая фигура — добавляем
                if (testAuto) {
                    if (!typeTestAutoCheck(vUnitId, field, currentSystem)) {
                        result.add(field);
                    }
                } else {
                    result.add(field);
                }
            }
        }
        i++;
    }

    return result;
}

function processControlList(vUnitId, list, currentSystem, originalSide, testAuto) {
    const result = new Set();
    let i = 0;
    const len = list.length;

    while (i < len) {
        const field = list[i];
        const unitId = currentSystem[FIELD_UNIT + field]; // Чтение из system
        const unitSide = currentSystem[UNIT_SIDE + unitId]; // 1 или 2

        if (unitId === 0 || unitSide !== originalSide) { // Если Пусто или Чужая фигура — добавляем
            if (testAuto) {
                if (!typeTestAutoCheck(vUnitId, field, currentSystem)) {
                    result.add(field);
                }
            } else {
                result.add(field);
            }
        }
        
        i++;
    }

    return result;
}

function processCastlingList(vUnitId, list, currentSystem, originalSide, testAuto) {
    const result = new Set();
    let i = 0;
    const len = list.length;
    
    while (i < len) {
        const field = list[i];
        const unitId = currentSystem[FIELD_UNIT + field]; // Чтение из currentSystem

        if (unitId !== 0) {
            const unitSide     = currentSystem[UNIT_SIDE + unitId]; // 1 или 2
            const unitSort     = currentSystem[UNIT_SORT + unitId];
            const unitCastling = currentSystem[UNIT_CASTLING + unitId];

            if (unitSide === originalSide && (unitSort === C_sword || unitSort === C_pike || unitSort === C_axe) && unitCastling === 1) { // Свой Король
                if (testAuto) {
                    if (!typeTestAutoCheck(vUnitId, field, currentSystem)) {
                        result.add(field);
                    }
                }
                else {
                    result.add(field);
                }
            }
        }
        i++;
    }
    
    return result;
} 

/////////////////////////// ВСПОМОГАТЕЛЬНЫЕ support //////////////////////////////////////////////////////////////////////////////////////////////////////////
function supportRay(vUnitId, ray, currentSystem, originalSide) {
    const result = new Set();
    let i = 0;
    const len = ray.length;

    while (i < len) {
        const field = ray[i];

        if (field === 0) { // Начало луча — сбрасываем, переходим дальше
            i++;
            continue;
        }

        // Поле не ноль
        const unitId = currentSystem[FIELD_UNIT + field];

        if (unitId === 0) { // Пустое поле — НЕ добавляем, а идём дальше
            i++;
        } else {
            const unitSide = currentSystem[UNIT_SIDE + unitId]; // 1 или 2

            if (unitSide === originalSide) { // Своя фигура — добавляем, и пролистываем до следующего 0 или конца
                result.add(field);
                i++;
                while (i < len && ray[i] !== 0) i++;
            } else { // 2b) Чужая фигура — НЕ добавляем, а пролистываем до следующего 0 или конца
                i++;
                while (i < len && ray[i] !== 0) i++;
            }
        }
    }

    return result;
}

function supportList(vUnitId, list, currentSystem, originalSide) {
    const result = new Set();
    let i = 0;
    const len = list.length;

    while (i < len) {
        const field = list[i];
        const unitId = currentSystem[FIELD_UNIT + field]; // Чтение из currentSystem
        
        if (unitId === 0) { // Пустое поле — НЕ добавляем, а просто идём дальше
            i++;
        } else {
            
            const unitSide = currentSystem[UNIT_SIDE + unitId]; // 1 или 2

            if (unitSide === originalSide) { // Своя фигура — добавляем и идём дальше
                result.add(field);
                i++;
            } else { // Чужая фигура —  НЕ добавляем, а просто идём дальше
                i++;
            }
        }
        
    }

    return result;
}

function supportCaptureList(vUnitId, list, currentSystem, originalSide) {
    const result = new Set();
    let i = 0;
    const len = list.length;

    while (i < len) {
        const field = list[i];
        const unitId = currentSystem[FIELD_UNIT + field]; // Чтение из system

        if (unitId !== 0) {
            const unitSide = currentSystem[UNIT_SIDE + unitId]; // 1 или 2

            if (unitSide === originalSide) { // Своя фигура — добавляем
                result.add(field);
            }
        }
        i++;
    }

    return result;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////