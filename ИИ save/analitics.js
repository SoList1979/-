
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Определение кластеров и сетов ОБЪЕКТОВ //////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
defineAllSets = () => {
    for (let unitIndex = 1; unitIndex <= nUnits; unitIndex++) {
        const currentUnit = unit[unitIndex];
        const { sideQueue, alive, field } = currentUnit;

        if (!alive) {
            currentUnit.cluster.clear();
            sideQueue ? lightOwners.delete(unitIndex) : darkOwners.delete(unitIndex);
            continue;
        }

        currentUnit.cluster = defineUnitCluster(currentUnit, false);
        const hasValidCluster = currentUnit.cluster.size > 0;
        const ownerSet = sideQueue ? lightOwners : darkOwners;

        if (hasValidCluster) {
            ownerSet.add(unitIndex);
        } else {
            ownerSet.delete(unitIndex);
        }
    }
};
function redefineSets(unit) {
    const { index: unitIndex, sideQueue, alive } = unit;
    const ownerSet = sideQueue ? lightOwners : darkOwners;

    if (!alive) {
        let cluster0 = new Set();
        unit.cluster = cluster0;
        ownerSet.delete(unitIndex);
        return;
    }

    defineUnitCluster(unit, false);
    if (!unit.cluster || unit.cluster.size === 0) {
        ownerSet.delete(unitIndex);
    }
}
function owners(queue) {
    return queue ? lightOwners : darkOwners;
}
function defineUnitCluster(unit, graphics) {
    // Часть 1: Графические эффекты
    if (graphics) {
        applyUnitGraphics(unit);
    }
    // Часть 2: Определение кластера
    const { index: unitIndex, field, sort, sideQueue } = unit;
    const fieldIndex = field.index;
    const clusterParams = {
        graphics,
        opacity: strongOpacity,
        color: unit.sideFieldColor
    };
    const cluster = getUnitCluster(sort, fieldIndex, clusterParams);
    unit.cluster = cluster;
    // Часть 3: Обновление owners
    updateOwners(unit, cluster);
    return cluster;
}

///////////////////////////////////////////////////////////////
///////////////////// Вспомогательные функции /////////////////
///////////////////////////////////////////////////////////////
function applyUnitGraphics(unit) {
    const { field, position, sort, side } = unit;
    // Настройка цвета и прозрачности
    field.material.color.setHex(field.paint);
    field.material.opacity = strongOpacity;
    pent_or_hex(unit);
    field.geometry = torΨ;
    // Настройка ПОДСВЕТКИ юнита
    lightUnit.color.setHex(side === lightSide ? orange : violet);
    const lightPos = position.clone().multiplyScalar(1.1 * 0.96);
    lightUnit.position.copy(lightPos);
    lightUnit.target.position.copy(position);
    lightUnit.angle = rad((sort === helm || sort === sword) ? 32 : 58);
}
function getUnitCluster(unitType, fieldIndex, params) {
    const { graphics, opacity, color } = params;
    switch (unitType) {
        // case axe:   return axeUnitCluster(fieldIndex, ζAxe, graphics, opacity, color);
        // case pike:  return pikeUnitCluster(fieldIndex, ζPike, graphics, opacity, color);
        case axe:   return axeUnitCluster(fieldIndex, graphics, opacity, color);
        case pike:  return pikeUnitCluster(fieldIndex, graphics, opacity, color);
        case arrow: return arrowUnitCluster(fieldIndex, graphics, opacity, color);
        case dart:  return dartUnitCluster(fieldIndex, graphics, opacity, color);
        case sword: return swordUnitCluster(fieldIndex, graphics, opacity, color);
        case helm:  return helmUnitCluster(fieldIndex, graphics, opacity, color);
        default:    return new Set();
    }
}
function updateOwners(unit, cluster) {
    if (cluster.size === 0) return;
    const owners = unit.sideQueue ? lightOwners : darkOwners;
    owners.add(unit.index);
}

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////      ТРИ вида ходов        ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
// function forwardMoving(currentUnit, currentField, targetField) {
//     currentUnit.buffer = currentUnit.previos;
//     currentUnit.previos = currentUnit.field;
   
//     currentUnit.step++;
//     currentField.unit = empty;
//     currentUnit.field = targetField;
//     targetField.unit = currentUnit;
    
//     const { x: xa, y: ya, z: za } = currentField.position;
//     const { x: xb, y: yb, z: zb } = targetField.position;
    
//     displacement(currentUnit, xa, ya, za, xb, yb, zb);
//     currentUnit.direction = orientation(xa, ya, za, xb, yb, zb);
// }
// function backwardMoving(currentUnit, currentField, targetField) {
//     currentUnit.previos = currentUnit.buffer;
    
//     currentUnit.step--;
//     currentField.unit = currentUnit;
//     currentUnit.field = currentField;
//     targetField.unit = empty;
    
//     const { x: xa, y: ya, z: za } = currentField.position;
//     const { x: xb, y: yb, z: zb } = targetField.position;
//     const previousField = currentUnit.previos;
//     const { x: xp, y: yp, z: zp } = previousField.position;
    
//     displacement(currentUnit, xb, yb, zb, xa, ya, za);
//     currentUnit.direction = orientation(xp, yp, zp, xa, ya, za);
// }
// function forwardCastling(currentUnit, targetUnit, currentField, targetField) {
//     forwardMoving(currentUnit, currentField, targetField);
//     forwardMoving(targetUnit, targetField, currentField);
    
//     currentUnit.field = targetField;
//     targetField.unit = currentUnit;
//     targetUnit.field = currentField;
//     currentField.unit = targetUnit;
// }
// function backwardCastling(currentUnit, targetUnit, currentField, targetField) {
//     backwardMoving(currentUnit, currentField, targetField);
//     backwardMoving(targetUnit, targetField, currentField);
    
//     const previousFieldCurrent = currentUnit.previos;
//     const previousFieldTarget = targetUnit.previos;
    
//     targetUnit.field = targetField;
//     targetField.unit = targetUnit;
//     currentUnit.field = currentField;
//     currentField.unit = currentUnit;
// }
// function forwardCapturing(currentUnit, targetUnit, currentField, targetField) {
//     forwardMoving(currentUnit, currentField, targetField);
    
//     targetUnit.alive = false;
//     targetUnit.h = targetUnit.field.deadUnits + 1;
//     targetUnit.xd = targetUnit.position.x;
//     targetUnit.yd = targetUnit.position.y;
//     targetUnit.zd = targetUnit.position.z;
    
//     const kDown = 1.08; // коэффициент понижения для королей и ферзей
//     const capturedUnitIndex = targetUnit.index;
    
//     if ([1, 27, 2, 28].includes(capturedUnitIndex)) {
//         targetUnit.xd /= kDown;
//         targetUnit.yd /= kDown;
//         targetUnit.zd /= kDown;
//     }
// }
// function backwardCapturing(currentUnit, targetUnit, currentField, targetField) {
//     backwardMoving(currentUnit, currentField, targetField);
    
//     const { x: xa, y: ya, z: za } = currentField.position;
//     const { x: xb, y: yb, z: zb } = targetField.position;
//     const previousField = currentUnit.previos;
    
//     currentUnit.field = currentField;
//     currentField.unit = currentUnit;
//     targetUnit.field = targetField;
//     targetField.unit = targetUnit;
//     targetUnit.alive = true;
//     targetUnit.position.set(xb, yb, zb);
    
//     const kUp = 1.1; // коэффициент повышения для королей и ферзей
//     const capturedUnitIndex = targetUnit.index;
    
//     if ([1, 2, 27, 28].includes(capturedUnitIndex)) {
//         targetUnit.position.x *= kUp;
//         targetUnit.position.y *= kUp;
//         targetUnit.position.z *= kUp;
//     }
    
//     targetUnit.material.opacity = strongOpacity;
    
//     if (capturedUnitIndex === 2 || capturedUnitIndex === 28) {
//         targetUnit.ball.alive = true;
//         targetUnit.ball.material.opacity = strongOpacity;
//     } else if (capturedUnitIndex === 1 || capturedUnitIndex === 27) {
//         targetUnit.tor1.alive = true;
//         targetUnit.tor1.material.opacity = strongOpacity;
//         targetUnit.tor2.alive = true;
//         targetUnit.tor2.material.opacity = strongOpacity;
//         targetUnit.tor3.alive = true;
//         targetUnit.tor3.material.opacity = strongOpacity;
//     }
    
//     targetUnit.h = 0;
// }