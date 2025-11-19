////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////  Проверка Лодейных лучей на правильную ТОПОЛОГИЮ /////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function validateStarAxeTopology() {
    let errors = [];

    for (let v = 1; v <= 92; v++) {
        if (!starAxe[v] || !Array.isArray(starAxe[v])) continue;

        for (let pathIdx = 1; pathIdx < starAxe[v].length; pathIdx++) {
            const path = starAxe[v][pathIdx];
            if (!Array.isArray(path) || path.length < 2) continue;

            // --- НОВАЯ ПРОВЕРКА: первый элемент луча (после 0) должен быть в next[v] ---
            if (path[0] === 0 && path[1] !== undefined) {
                const firstStep = path[1];
                if (!next[v] || !next[v].has(firstStep)) {
                    errors.push({
                        v,
                        pathIdx,
                        error: `первый ход луча ${pathIdx} (${firstStep}) не в next[${v}]`
                    });
                }
            }

            // Продолжаем проверку троек (i, j, k) только если в луче >= 3 элемента
            if (path.length < 3) continue;

            for (let idx = 1; idx < path.length - 1; idx++) {
                const i = path[idx - 1];
                const j = path[idx];
                const k = path[idx + 1];

                // Исключаем любое участие клетки 0
                if (i === 0 || j === 0 || k === 0) continue;

                if (!next[i] || !next[j] || !next[k]) {
                    errors.push({ v, pathIdx, idx, i, j, k, error: "next не определён" });
                    continue;
                }

                const next_i = next[i];
                const next_j = next[j];
                const next_k = next[k];

                // 1) j должна принадлежать и next[i], и next[k]
                if (!next_i.has(j)) {
                    errors.push({ v, pathIdx, idx, i, j, k, error: `j (${j}) не в next[i] (${i})` });
                }
                if (!next_k.has(j)) {
                    errors.push({ v, pathIdx, idx, i, j, k, error: `j (${j}) не в next[k] (${k})` });
                }

                // 2) у next[k] и next[i] должен быть ТОЛЬКО ОДИН общий элемент = j
                const intersection = new Set([...next_i].filter(x => next_k.has(x)));
                if (intersection.size !== 1 || !intersection.has(j)) {
                    errors.push({
                        v, pathIdx, idx, i, j, k,
                        error: `next[i] ∩ next[k] ≠ {j}. Пересечение: [${Array.from(intersection).join(',')}], j = ${j}`
                    });
                }

                // 3) i не должна принадлежать next[k]
                if (next_k.has(i)) {
                    errors.push({ v, pathIdx, idx, i, j, k, error: `i (${i}) в next[k] (${k})` });
                }

                // 4) k не должна принадлежать next[i]
                if (next_i.has(k)) {
                    errors.push({ v, pathIdx, idx, i, j, k, error: `k (${k}) в next[i] (${i})` });
                }
            }
        }
    }

    if (errors.length === 0) {
        console.log("✅ validateStarAxeTopology: Все лучи starAxe прошли топологическую проверку.");
    } else {
        console.error("❌ validateStarAxeTopology: Найдено ошибок:", errors.length);
        console.table(errors.slice(0, 50));
        if (errors.length > 50) console.log(`... и ещё ${errors.length - 50} ошибок.`);
    }

    return errors;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////  Проверка кластеров типизированной системной модели  /////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function testAxeCluster() {
    for (p = 1; p <= MAX_FIELD_Axe; p++) {
        for (v = 1; v <= MAX_FIELD_Axe; v++) {
            
            if (beamAxe[p][v]!== undefined && beamAxeData[beamAxeIndex[p*(MAX_FIELD_Axe + 1) + v]]=== undefined) {
                // console.log(beamAxe[p][v], beamAxeData[beamAxeIndex[p*(MAX_FIELD_Axe + 1) + v]]); 
                console.log(p, v);  
            }
        }
    }
}

function testPikeCluster() {
    for (p = 1; p <= MAX_FIELD_Pike; p++) {
        for (v = 1; v <= MAX_FIELD_Pike; v++) {
            
            if (beamPike[p][v]!== undefined && beamPikeData[beamPikeIndex[p*(MAX_FIELD_Pike + 1) + v + 0]]=== undefined) {
                // console.log(beamPike[p][v], beamPikeData[beamPikeIndex[p*(MAX_FIELD_Pike + 1) + v]]); 
                console.log(p, v);  
            }
        }
    }
}

function testArrowCluster() {
    for (p = 1; p <= MAX_FIELD_Arrow; p++) {
        for (v = 1; v <= MAX_FIELD_Arrow; v++) {
            
            if (beamArrow[p][v]!== undefined && beamArrowData[beamArrowIndex[p*(MAX_FIELD_Arrow + 1) + v]]=== undefined) {
                // console.log(beamArrow[p][v], beamArrowData[beamArrowIndex[p*(MAX_FIELD_Arrow + 1) + v]]); 
                console.log(p, v);  
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////  Проверка производительности функций формирования пучков и звёзд /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function testTimeGetBeamAxe(p, v) {
    let totalTime = 0;
    for(let i = 0; i < 1000; i++) {
        const start = performance.now();
        getBeamAxe(p, v);
        totalTime += performance.now() - start;
    }
    console.log(`Среднее время: ${totalTime / 1000} мс`);
}

function testTimeMapBeamAxe(p, v) {
    let totalTime = 0;
    for(let i = 0; i < 1000; i++) {
        const start = performance.now();
        mapBeamAxe(p, v);
        totalTime += performance.now() - start;
    }
    console.log(`Среднее время: ${totalTime / 1000} мс`);
}

function testBulkGetBeamAxe(iterations) {
    let totalTime = 0;
    
    // Генерируем массив случайных валидных пар (p, v)
    const testPairs = [];
    for(let i = 0; i < iterations; i++) {
        let p = Math.floor(Math.random() * 93);
        let v = Math.floor(Math.random() * 93);
        
        // Убедимся, что пара валидная
        while(!isAxeRay(p, v)) {
            p = Math.floor(Math.random() * 93);
            v = Math.floor(Math.random() * 93);
        }
        testPairs.push([p, v]);
    }
    
    // Тестируем getBeamAxe
    for(let i = 0; i < iterations; i++) {
        const [p, v] = testPairs[i];
        const start = performance.now();
        getBeamAxe(p, v);
        totalTime += performance.now() - start;
    }
    console.log(`Среднее время getBeamAxe: ${totalTime / iterations} мс`);
}

function testBulkMapBeamAxe(iterations) {
    let totalTime = 0;
    
    // Используем те же пары для честного сравнения
    const testPairs = [];
    for(let i = 0; i < iterations; i++) {
        let p = Math.floor(Math.random() * 93);
        let v = Math.floor(Math.random() * 93);
        
        while(!isAxeRay(p, v)) {
            p = Math.floor(Math.random() * 93);
            v = Math.floor(Math.random() * 93);
        }
        testPairs.push([p, v]);
    }
    
    // Тестируем mapBeamAxe
    for(let i = 0; i < iterations; i++) {
        const [p, v] = testPairs[i];
        const start = performance.now();
        mapBeamAxe(p, v);
        totalTime += performance.now() - start;
    }
    console.log(`Среднее время mapBeamAxe: ${totalTime / iterations} мс`);
}

function testTimeBeamPike(p, v) {
    let totalTime = 0;
    for(let i = 0; i < 1000; i++) {
        const start = performance.now();
        getBeamPike(p, v);
        totalTime += performance.now() - start;
    }
    console.log(`Среднее время: ${totalTime / 1000} мс`);
}

function testTimeStarDart(v) {
    let totalTime = 0;
    for(let i = 0; i < 1000; i++) {
        const start = performance.now();
        getStarDart(v);
        totalTime += performance.now() - start;
    }
    console.log(`Среднее время: ${totalTime / 1000} мс`);
}
