// "конкатенация" двух геометрий
function summGeoms(geom1, geom2) {
    let summ = new THREE.Geometry();

    let mesh1 = new THREE.Mesh(geom1);
    let mesh2 = new THREE.Mesh(geom2);

    mesh1.updateMatrix();
    mesh2.updateMatrix();

    summ.merge(geom1, mesh1.matrix);
    summ.merge(geom2, mesh2.matrix);

    return summ;
}

////////////////////////////////// ОСНОВНЫЕ ОБЪЕКТЫ 3JS:  canvas, renderer, scene /////////////////////////////////////////////////
const
canvas = document.getElementById("canvasicogon");
canvas.setAttribute("width", innerWidth);
canvas.setAttribute("height", innerHeight);

const
renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
});
renderer.physicallyCorrectLights = true;
renderer.setClearColor(0x000000, 0);

const 
scene     = new THREE.Scene(),
mouse     = new THREE.Vector2(),
raycaster = new THREE.Raycaster();

setCamera = () => {
    camera = new THREE.PerspectiveCamera(
        cameraFovy,
        innerWidth / innerHeight,
        0.01,
        500
    );
    
    let xCamera =  getRandomArbitrary(-1, 1);
    let yCamera =  getRandomArbitrary(-1, 1);
    let zCamera =  getRandomArbitrary(-1, 1);
    let dNorm = dist3D(xCamera, yCamera, zCamera);
    let portret = window.innerHeight/window.innerWidth;
    
    if (DetectDevice() && portret < 1){
        xCamera = xCamera/dNorm*rCameraAlbom;
        yCamera = yCamera/dNorm*rCameraAlbom;
        zCamera = zCamera/dNorm*rCameraAlbom;
    }
    else if (DetectDevice() && portret > 1){
        xCamera = xCamera/dNorm*rCameraPortret;
        yCamera = yCamera/dNorm*rCameraPortret;
        zCamera = zCamera/dNorm*rCameraPortret;
    }
    else {
        xCamera = xCamera/dNorm*rCameraMid;
        yCamera = yCamera/dNorm*rCameraMid;
        zCamera = zCamera/dNorm*rCameraMid;
    }
    camera.position.set(xCamera, yCamera, zCamera);

    /////// Определяем какие Контрол: Астро ///////
    // этот Orbitcontrols СТОПОРИТСЯ на ПОЛЮСАХ
    //controls = new THREE.OrbitControls(camera, renderer.domElement); 
    // а этот, AstroControls немного глючит ИНОГДА при нажатии на северный или южный полюс
    controls = new THREE.AstroControls(camera, renderer.domElement);    
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.noPan = true; // !!!!! КАМЕРА НЕ перемещается, А ТОЛЬКО поворачивается
    controls.minDistance = rCameraMin;
    controls.maxDistance = rCameraMax;
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 3.0;
    controls.panSpeed = 1.8;
    controls.noZoom = false;
    //controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.autoRotate = true; // автовращение на старте
    // controls.autoRotateSpeed = 0;
    controls.autoRotateSpeed = getRandomItem([-rotationAuto, rotationAuto]);
};

setObjects = () => {
    ////////////////////////////////////////////////// ДОСКА /////////////////////////////////////////////////////////////////////
    ico = new THREE.Mesh(geometryRGB, icoMat);
    ico.name = "ico";
    ico.position.x = 0;
    ico.position.y = 0;
    ico.position.z = 0;
    rotateAroundObjectAxis(ico, new THREE.Vector3(1, 0, 0), rad(-90)); // Поворот ДОСКИ ico под Сетку и Землю
    ////////////////////////////////////////////////// ПОЛЯ //////////////////////////////////////////////////////////////////////
    fieldMat[0] = new THREE.MeshStandardMaterial({
        // Вспомогательная ВИРТУАЛЬНАЯ Клетка №0 в ЦЕНТРЕ
        metalness: 0.6,
        roughness: 0.4,
        transparent: true,
        opacity: 0,
        side: THREE.FrontSide,
    });
    field[0] = new THREE.Mesh(circ, fieldMat[0]);
    field[0].material.color.setHex(0x000000);
    field[0].paint = black;
    field[0].color = "none";
    color[0] = field[0].color;
    field[0].index = 0;
    field[0].position.x = 0;
    field[0].position.y = 0;
    field[0].position.z = 0;
    field[0].φ = 0;
    field[0].θ = 0;
        φ[0] = field[0].φ;
        θ[0] = field[0].θ;
    field[0].type = fieldType;
    field[0].name = "field №0";
    field[0].unit = null;
    field[0].deadUnits = 0;

    for (j = 1; j <= nFields; j++) {
        fieldMat[j] = new THREE.MeshStandardMaterial({
            metalness: 0.6,
            roughness: 0.4,
            transparent: true,
            alphaTest: 0.5, // Палочка-выручалочка при КОСЯКАХ ПРОЗРАЧНОСТИ  !!! ЛУЧШЕ ВКЛЮЧИТЬ
            opacity: 0,
            side: THREE.DoubleSide,
        });

        if (j >=  1 && j <= 12) {
            field[j] = new THREE.Mesh(circ, fieldMat[j]);
            field[j].material.color.setHex(0xff0000);
            field[j].paint = red;
            field[j].color = "red";
        }

        if (j > 12 && j <= 32) {
            field[j] = new THREE.Mesh(circ, fieldMat[j]);
            field[j].material.color.setHex(0x0000ff);
            field[j].paint = blue;
            field[j].color = "blue";
        }

        if (j > 32 && j <= 92) {
            field[j] = new THREE.Mesh(circ, fieldMat[j]);
            field[j].material.color.setHex(0x00ff00);
            field[j].paint = green;
            field[j].color = "green";
        }

        let x = icoVertices[j * 3 - 1 + 1];
        let y = icoVertices[j * 3 - 1 + 2];
        let z = icoVertices[j * 3 - 1 + 3];
        
        field[j].position.x = x;
        field[j].position.y = y;
        field[j].position.z = z;
        
        // "направление" для поля
        field[j].direction = orientation(x, y, z, 0, 1, 0);
        
        field[j].rotation.x = π;
        field[j].rotation.y = π;
        field[j].rotation.z = π;

        field[j].lookAt(0, 0, 0);
        field[j].up.set(0, 1, 0);

        field[j].updateMatrix();
        field[j].type = fieldType;
        field[j].unit = empty;
        field[j].name = fieldName[j];
        field[j].index = j;
        field[j].deadUnits = 0;

        let geoPos = geoSpheric(x, y, z);
        field[j].φ = geoPos.x;
        field[j].θ = geoPos.y;
        φ[j] = field[j].φ;
        θ[j] = field[j].θ;
        color[j] = field[j].color;

        rotateAroundWorldAxis(field[j], new THREE.Vector3(1, 0, 0), rad(-90)); // Поворот СЕТКИ под иллюстрацию Земли
        field[j].updateMatrix();
    }
    
    // field[1].position.x =  ε;
    // field[2].position.y =  1;
    // field[1].position.z =  ε;
    
    // field[2].position.x = -ε;
    // field[2].position.y = -1;
    // field[2].position.z = -ε;
    
    field[1].position.x =  0;
    field[2].position.y =  1;
    field[1].position.z =  0;
    
    field[2].position.x = -0;
    field[2].position.y = -1;
    field[2].position.z = -0;
    
    /////////////////////////////////////////////////// ЮНИТЫ //////////////////////////////////////////////////////////////
    unitMat[0] = new THREE.MeshPhysicalMaterial({
        // Материал ВИРТУАЛЬНОГО Юнита
        vertexColors: THREE.VertexColors,
        metalness: 0.2,
        roughness: 0.5,
        clearcoat: 0.7,
        side: THREE.FrontSide,
    });
    unit[0] = new THREE.Mesh(new THREE.SphereGeometry(1, 5, 5), unitMat[0]); // ВИРТУАЛЬНЫЙ Юнит
    unit[0].side = undefined;
    unit[0].sideColor = gray;
    unit[0].sort = "";
    unit[0].index = 0;
    unit[0].alive = false;
    unit[0].castling = false;
    unit[0].name = "";
    unit[0].field = field[0];
    unit[0].previos = field[0];
    unit[0].position.x = 0;
    unit[0].position.y = 0;
    unit[0].position.z = 0;
    Ψ = unit[0];
    Ψ.field = field[0]; // Вспомогательный ТЕКУЩИЙ ВИРТУАЛЬНЫЙ Юнит №0
    field[0].unit = Ψ;
    C[0] =  0;
    
    helmGeometry();
    swordGeometry();
    pikeGeometry();
    axeGeometry();
    dartGeometry();
    arrowGeometry();

    for (i = 1; i <= nUnits; i++) {
        unitMat[i] = new THREE.MeshPhysicalMaterial({
            vertexColors: THREE.VertexColors,
            metalness: 0.2,
            roughness: 0.5,
            clearcoat: 0.7,
            side: THREE.FrontSide,
            transparent: true,
            opacity: strongOpacity,
        });
        if (i === 1) {
            unitMat[i] = helmLightMat;
            
            unit[i] = new THREE.Mesh(helmLightGeom, unitMat[i]);
            unit[i].side = lightSide;
            unit[i].sideColor = light;
            unit[i].sideFieldColor = lightField;
            unit[i].sideQueue = true;
            unit[i].sort = helm;
            unit[i].num = " ";
            unit[i].castling = false;
            unit[i].underCheck = false;
            unit[i].underMate = false;
            C[i] = C_helm;
            unit[i].tor1 = new THREE.Mesh(torLightGeom1, torLightMat);
            unit[i].tor2 = new THREE.Mesh(torLightGeom2, torLightMat);
            unit[i].tor3 = new THREE.Mesh(torLightGeom3, torLightMat);
            unit[i].tor1.alive = true;
            unit[i].tor2.alive = true;
            unit[i].tor3.alive = true;
            unit[i].tor1.mark = false;
            unit[i].tor2.mark = false;
            unit[i].tor3.mark = false;
            unit[i].tor1.name = "tor1";
            unit[i].tor2.name = "tor2";
            unit[i].tor3.name = "tor3";
            unit[i].tor1.type = unitType;
            unit[i].tor2.type = unitType;
            unit[i].tor3.type = unitType;
            unit[i].tor1.sort = helm;
            unit[i].tor2.sort = helm;
            unit[i].tor3.sort = helm;
            unit[i].tor1.side = lightSide;
            unit[i].tor2.side = lightSide;
            unit[i].tor3.side = lightSide;
            unit[i].tor1.sideQueue = true;
            unit[i].tor2.sideQueue = true;
            unit[i].tor3.sideQueue = true;
        }
        if (i === 2) {
            unit[i] = new THREE.Mesh(swordLightGeom, unitMat[i]);
            unit[i].side = lightSide;
            unit[i].sideColor = light;
            unit[i].sideFieldColor = lightField;
            unit[i].sideQueue = true;
            unit[i].sort = sword;
            unit[i].ball = new THREE.Mesh(helmLightGeom, ballLightMat);
            unit[i].ball.alive = true;
            unit[i].ball.name = "ball";
            unit[i].ball.type = unitType;
            unit[i].ball.sort = sword;
            unit[i].num = " ";
            unit[i].ball.side = lightSide;
            unit[i].ball.sideQueue = true;
            unit[i].ball.castling = true;
            C[i] = C_sword;
        }
        if (i >= 3 && i <= 6) {
            unit[i] = new THREE.Mesh(axeLightGeom, unitMat[i]);
            unit[i].side = lightSide;
            unit[i].sideColor = light;
            unit[i].sideFieldColor = lightField;
            unit[i].sideQueue = true;
            unit[i].sort = axe;
            unit[i].num = i - 2;
            C[i] = C_axe;
        }
        if (i >= 7 && i <= 11) {
            unit[i] = new THREE.Mesh(dartLightGeom, unitMat[i]);
            unit[i].side = lightSide;
            unit[i].sideColor = light;
            unit[i].sideFieldColor = lightField;
            unit[i].sideQueue = true;
            unit[i].sort = dart;
            unit[i].num = i - 6;
            C[i] = C_dart;
        }
        if (i >= 12 && i <= 16) {
            unit[i] = new THREE.Mesh(pikeLightGeom, unitMat[i]);
            unit[i].side = lightSide;
            unit[i].sideColor = light;
            unit[i].sideFieldColor = lightField;
            unit[i].sideQueue = true;
            unit[i].sort = pike;
            unit[i].num = i - 11;
            C[i] = C_pike;
        }
        if (i >= 17 && i <= 26) {
            unit[i] = new THREE.Mesh(arrowLightGeom, unitMat[i]);
            unit[i].side = lightSide;
            unit[i].sideColor = light;
            unit[i].sideFieldColor = lightField;
            unit[i].sideQueue = true;
            unit[i].sort = arrow;
            unit[i].num = i - 16;
            C[i] = C_arrow;
        }
        if (i === 27) {
            unitMat[i] = helmDarkMat;
            unit[i] = new THREE.Mesh(helmDarkGeom, unitMat[i]);
            unit[i].side = darkSide;
            unit[i].sideColor = dark;
            unit[i].sideFieldColor = darkField;
            unit[i].sideQueue = false;
            unit[i].sort = helm;
            unit[i].num = " ";
            unit[i].castling = false;
            unit[i].underCheck = false;
            unit[i].underMate = false;
            unit[i].tor1 = new THREE.Mesh(torDarkGeom1, torDarkMat);
            unit[i].tor2 = new THREE.Mesh(torDarkGeom2, torDarkMat);
            unit[i].tor3 = new THREE.Mesh(torDarkGeom3, torDarkMat);
            unit[i].tor1.alive = true;
            unit[i].tor2.alive = true;
            unit[i].tor3.alive = true;
            unit[i].tor1.mark = false;
            unit[i].tor2.mark = false;
            unit[i].tor3.mark = false;
            unit[i].tor1.name = "tor1";
            unit[i].tor2.name = "tor2";
            unit[i].tor3.name = "tor3";
            unit[i].tor1.type = unitType;
            unit[i].tor2.type = unitType;
            unit[i].tor3.type = unitType;
            unit[i].tor1.sort = helm;
            unit[i].tor2.sort = helm;
            unit[i].tor3.sort = helm;
            unit[i].tor1.side = darkSide;
            unit[i].tor2.side = darkSide;
            unit[i].tor3.side = darkSide;
            unit[i].tor1.sideQueue = false;
            unit[i].tor2.sideQueue = false;
            unit[i].tor3.sideQueue = false;
            C[i] = C_helm;
        }
        if (i === 28) {
            unit[i] = new THREE.Mesh(swordDarkGeom, unitMat[i]);
            unit[i].side = darkSide;
            unit[i].sideColor = dark;
            unit[i].sideFieldColor = darkField;
            unit[i].sideQueue = false;
            unit[i].sort = sword;
            unit[i].ball = new THREE.Mesh(helmDarkGeom, ballDarkMat);
            unit[i].ball.alive = true;
            unit[i].ball.name = "ball";
            unit[i].ball.type = unitType;
            unit[i].ball.sort = sword;
            unit[i].num = " ";
            unit[i].ball.side = darkSide;
            unit[i].ball.sideQueue = false;
            unit[i].ball.castling = true;
            C[i] = C_sword;
        }
        if (i >= 29 && i <= 32) {
            unit[i] = new THREE.Mesh(axeDarkGeom, unitMat[i]);
            unit[i].side = darkSide;
            unit[i].sideColor = dark;
            unit[i].sideFieldColor = darkField;
            unit[i].sideQueue = false;
            unit[i].sort = axe;
            unit[i].num = i - 28;
            C[i] = C_axe;
        }
        if (i >= 33 && i <= 37) {
            unit[i] = new THREE.Mesh(dartDarkGeom, unitMat[i]);
            unit[i].side = darkSide;
            unit[i].sideColor = dark;
            unit[i].sideFieldColor = darkField;
            unit[i].sideQueue = false;
            unit[i].sort = dart;
            unit[i].num = i - 32;
            C[i] = C_dart;
        }
        if (i >= 38 && i <= 42) {
            unit[i] = new THREE.Mesh(pikeDarkGeom, unitMat[i]);
            unit[i].side = darkSide;
            unit[i].sideColor = dark;
            unit[i].sideFieldColor = darkField;
            unit[i].sideQueue = false;
            unit[i].sort = pike;
            unit[i].num = i - 37;
            C[i] = C_pike;
        }
        if (i >= 43 && i <= 52) {
            unit[i] = new THREE.Mesh(arrowDarkGeom, unitMat[i]);
            unit[i].side = darkSide;
            unit[i].sideColor = dark;
            unit[i].sideFieldColor = darkField;
            unit[i].sideQueue = false;
            unit[i].sort = arrow;
            unit[i].num = i - 42;
            C[i] = C_arrow;
        }
        
        //let bufferField;
        //unit[i].buffer = bufferField;

        let p0 = 0;
        if (unit[i].side == lightSide) {
            p0 = 1;
            unit[i].previos = field[1];
            unit[i].buffer  = field[1];
        } // Светлых всех с ТОЧКИ СЕВЕРНОГО ПОЛЮСА отправляем на своё field[j]
        if (unit[i].side == darkSide) {
            p0 = 2;
            unit[i].previos = field[2];
            unit[i].buffer  = field[2];
        } // Тёмных  всех с ТОЧКИ    ЮЖНОГО ПОЛЮСА отправляем на своё field[j]
        
        unit[i].position.x = icoVertices[p0 * 3 - 1 + 1]*kH;      
        unit[i].position.y = icoVertices[p0 * 3 - 1 + 2]*kH;
        unit[i].position.z = icoVertices[p0 * 3 - 1 + 3]*kH;
        rotateAroundWorldAxis(unit[i], new THREE.Vector3(1, 0, 0), rad(-90)); // Подcтройка под иллюстрацию Земли
        let iPosition = unitPreviosStart[i]; // Начальная позиция
        let xA = unit[iPosition].position.x;
        let yA = unit[iPosition].position.y;
        let zA = unit[iPosition].position.z;
        let jPosition = unitFieldStart[i];
        field[jPosition].unit = unit[i];
        let xB = field[jPosition].position.x; // Всех отправляем на своё field
        let yB = field[jPosition].position.y; // Всех отправляем на своё field
        let zB = field[jPosition].position.z; // Всех отправляем на своё field

        unit[i].direction = new THREE.Vector3(0, 0, 0);
        unit[i].step  = 0;
        unit[i].mdead = 0;
        
        // Правильное перемещение фигуры на доске 
        // обеспечиывается только ОБОИМИ этими функциями
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

        unit[i].field = field[jPosition];
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
        
        let cluster = new Set();
        unit[i].cluster = cluster;
        let underScope = new Set();
        unit[i].underScope = underScope;
        let exhange = C[i];
        unit[i].exhange = exhange;
        
        unit[i].updateMatrix();
    }
  
    unit[ 1].name = unit[ 1].sort;
    unit[ 2].name = unit[ 2].sort;

    unit[ 3].name = unit[ 3].sort + ' "'+ 'B' + '"';
    unit[ 4].name = unit[ 4].sort + ' "'+ 'M' + '"';
    unit[ 5].name = unit[ 5].sort + ' "'+ 'E' + '"';
    unit[ 6].name = unit[ 6].sort + ' "'+ 'K' + '"';

    unit[07].name = unit[07].sort + ' "'+ 'A' + '"';
    unit[08].name = unit[08].sort + ' "'+ 'B' + '"';
    unit[09].name = unit[09].sort + ' "'+ 'E' + '"';
    unit[10].name = unit[10].sort + ' "'+ 'M' + '"';
    unit[11].name = unit[11].sort + ' "'+ 'K' + '"';

    unit[12].name = unit[12].sort + ' "'+ 'X' + '"';
    unit[13].name = unit[13].sort + ' "'+ 'H' + '"';
    unit[14].name = unit[14].sort + ' "'+ 'Y' + '"';
    unit[15].name = unit[15].sort + ' "'+ 'T' + '"';
    unit[16].name = unit[16].sort + ' "'+ 'P' + '"';

    unit[27].name = unit[27].sort;
    unit[28].name = unit[28].sort;

    unit[29].name = unit[29].sort + ' "'+ 'P' + '"';
    unit[30].name = unit[30].sort + ' "'+ 'Y' + '"';
    unit[31].name = unit[31].sort + ' "'+ 'H' + '"';
    unit[32].name = unit[32].sort + ' "'+ 'X' + '"';

    unit[33].name = unit[33].sort + ' "'+ 'X' + '"';
    unit[34].name = unit[34].sort + ' "'+ 'Y' + '"';
    unit[35].name = unit[35].sort + ' "'+ 'T' + '"';
    unit[36].name = unit[36].sort + ' "'+ 'P' + '"';
    unit[37].name = unit[37].sort + ' "'+ 'H' + '"';

    unit[38].name = unit[38].sort + ' "'+ 'B' + '"';
    unit[39].name = unit[39].sort + ' "'+ 'A' + '"';
    unit[40].name = unit[40].sort + ' "'+ 'E' + '"';
    unit[41].name = unit[41].sort + ' "'+ 'K' + '"';
    unit[42].name = unit[42].sort + ' "'+ 'M' + '"';
};

setLight = () => {
    lightCommon = new THREE.AmbientLight(0xffffff, 10);

    lightCentre = new THREE.PointLight(0xffffff, 10);
    lightCentre.position.set(0, 0, 0);
    lightCentre.distance = 2;
    lightCentre.power = 2000;

    lightDown = new THREE.DirectionalLight(0xff0000);
    lightDown.target.position.set(0, 0, 0);

    lightUp = new THREE.DirectionalLight(0x00ff00);
    lightUp.target.position.set(0, 0, 0);

    lightRight = new THREE.DirectionalLight(0xffff00);
    lightRight.target.position.set(0, 0, 0);

    lightLeft = new THREE.DirectionalLight(0x0000ff);
    lightLeft.target.position.set(0, 0, 0);

    lightUnit = new THREE.SpotLight(black, 1500);
    lightUnit.penumbra = 0.1;
    lightUnit.distance = 0.4;
};

addObjects = () => {
    scene.add(ico);

    for (i = 1; i <= nFields; i++) {
        scene.add(field[i]);
    }
    for (i = 1; i <= nUnits; i++) {
        scene.add(unit[i]);
    }

    scene.add(unit[ 1].tor1);
    scene.add(unit[ 1].tor2);
    scene.add(unit[ 1].tor3);
    scene.add(unit[27].tor1);
    scene.add(unit[27].tor2);
    scene.add(unit[27].tor3);
    scene.add(unit[ 2].ball);
    scene.add(unit[28].ball);
};

addLight = () => {
    scene.add(lightCommon);
    //scene.add(lightCentre);
    scene.add(lightDown);
    scene.add(lightDown.target);
    scene.add(lightUp);
    scene.add(lightUp.target);
    scene.add(lightRight);
    scene.add(lightRight.target);
    scene.add(lightLeft);
    scene.add(lightLeft.target);
    scene.add(lightUnit);
    scene.add(lightUnit.target);
};

///////////////////////////////   ДОСКА полиэдр Гольдберга   //////////////////////////////
const icoVertices = [
/*    0   0    */   0.000000,   0.000000,   0.000000,   /*     0    0    0    */     
/*    1   1    */   0.000000,   0.000000,   1.000000,   /*   255    0    0    */ 
/*    1   2    */   0.000000,   0.000000,  -1.000000,   /*   255    0    0    */ 
/*    1   3    */  -0.894427,   0.000000,   0.447214,   /*   255    0    0    */ 
/*    1   4    */  -0.723607,  -0.525731,  -0.447214,   /*   255    0    0    */ 
/*    1   5    */  -0.276393,  -0.850651,   0.447214,   /*   255    0    0    */ 
/*    1   6    */   0.276393,  -0.850651,  -0.447214,   /*   255    0    0    */ 
/*    1   7    */   0.723607,  -0.525731,   0.447214,   /*   255    0    0    */ 
/*    1   8    */   0.894427,   0.000000,  -0.447214,   /*   255    0    0    */ 
/*    1   9    */   0.723607,   0.525731,   0.447214,   /*   255    0    0    */ 
/*    1  10    */   0.276393,   0.850651,  -0.447214,   /*   255    0    0    */ 
/*    1  11    */  -0.276393,   0.850651,   0.447214,   /*   255    0    0    */ 
/*    1  12    */  -0.723607,   0.525731,  -0.447214,   /*   255    0    0    */ 
/*    1  13    */  -0.491123,  -0.356822,   0.794654,   /*     0    0  255    */ 
/*    1  14    */  -0.491123,   0.356822,   0.794654,   /*     0    0  255    */ 
/*    1  15    */   0.187592,  -0.577350,   0.794654,   /*     0    0  255    */ 
/*    1  16    */   0.607062,   0.000000,   0.794654,   /*     0    0  255    */ 
/*    1  17    */   0.187592,   0.577350,   0.794654,   /*     0    0  255    */ 
/*    1  18    */  -0.187592,  -0.577350,  -0.794654,   /*     0    0  255    */ 
/*    1  19    */  -0.607062,   0.000000,  -0.794654,   /*     0    0  255    */ 
/*    1  20    */   0.491123,  -0.356822,  -0.794654,   /*     0    0  255    */ 
/*    1  21    */   0.491123,   0.356822,  -0.794654,   /*     0    0  255    */ 
/*    1  22    */  -0.187592,   0.577350,  -0.794654,   /*     0    0  255    */ 
/*    1  23    */  -0.794654,  -0.577350,   0.187592,   /*     0    0  255    */ 
/*    1  24    */  -0.982247,   0.000000,  -0.187592,   /*     0    0  255    */ 
/*    1  25    */  -0.794654,   0.577350,   0.187592,   /*     0    0  255    */ 
/*    1  26    */  -0.303531,  -0.934172,  -0.187592,   /*     0    0  255    */ 
/*    1  27    */   0.303531,  -0.934172,   0.187592,   /*     0    0  255    */ 
/*    1  28    */   0.794654,  -0.577350,  -0.187592,   /*     0    0  255    */ 
/*    1  29    */   0.982247,   0.000000,   0.187592,   /*     0    0  255    */ 
/*    1  30    */   0.794654,   0.577350,  -0.187592,   /*     0    0  255    */ 
/*    1  31    */   0.303531,   0.934172,   0.187592,   /*     0    0  255    */ 
/*    1  32    */  -0.303531,   0.934172,  -0.187592,   /*     0    0  255    */ 
/*    1  33    */  -0.354684,   0.000000,   0.934986,   /*     0  255    0    */ 
/*    1  34    */  -0.109603,  -0.337325,   0.934986,   /*     0  255    0    */ 
/*    1  35    */  -0.109603,   0.337325,   0.934986,   /*     0  255    0    */ 
/*    1  36    */   0.286946,  -0.208478,   0.934986,   /*     0  255    0    */ 
/*    1  37    */   0.286946,   0.208478,   0.934986,   /*     0  255    0    */ 
/*    1  38    */  -0.286946,  -0.208478,  -0.934986,   /*     0  255    0    */ 
/*    1  39    */   0.109603,  -0.337325,  -0.934986,   /*     0  255    0    */ 
/*    1  40    */  -0.286946,   0.208478,  -0.934986,   /*     0  255    0    */ 
/*    1  41    */   0.354684,   0.000000,  -0.934986,   /*     0  255    0    */ 
/*    1  42    */   0.109603,   0.337325,  -0.934986,   /*     0  255    0    */ 
/*    1  43    */  -0.677657,   0.000000,   0.735378,   /*     0  255    0    */ 
/*    1  44    */  -0.787261,  -0.337325,   0.516171,   /*     0  255    0    */ 
/*    1  45    */  -0.787261,   0.337325,   0.516171,   /*     0  255    0    */ 
/*    1  46    */  -0.964603,  -0.208478,   0.161487,   /*     0  255    0    */ 
/*    1  47    */  -0.964603,   0.208478,   0.161487,   /*     0  255    0    */ 
/*    1  48    */  -0.548236,  -0.398317,  -0.735378,   /*     0  255    0    */ 
/*    1  49    */  -0.438633,  -0.735642,  -0.516171,   /*     0  255    0    */ 
/*    1  50    */  -0.835182,  -0.189839,  -0.516171,   /*     0  255    0    */ 
/*    1  51    */  -0.902921,  -0.398317,  -0.161487,   /*     0  255    0    */ 
/*    1  52    */  -0.657840,  -0.735642,  -0.161487,   /*     0  255    0    */ 
/*    1  53    */  -0.209408,  -0.644490,   0.735378,   /*     0  255    0    */ 
/*    1  54    */  -0.564092,  -0.644490,   0.516171,   /*     0  255    0    */ 
/*    1  55    */   0.077538,  -0.852969,   0.516171,   /*     0  255    0    */ 
/*    1  56    */  -0.496353,  -0.852969,   0.161487,   /*     0  255    0    */ 
/*    1  57    */  -0.099804,  -0.981815,   0.161487,   /*     0  255    0    */ 
/*    1  58    */   0.209408,  -0.644490,  -0.735378,   /*     0  255    0    */ 
/*    1  59    */  -0.077538,  -0.852969,  -0.516171,   /*     0  255    0    */ 
/*    1  60    */   0.564092,  -0.644490,  -0.516171,   /*     0  255    0    */ 
/*    1  61    */   0.099804,  -0.981815,  -0.161487,   /*     0  255    0    */ 
/*    1  62    */   0.496353,  -0.852969,  -0.161487,   /*     0  255    0    */ 
/*    1  63    */   0.548236,  -0.398317,   0.735378,   /*     0  255    0    */ 
/*    1  64    */   0.438633,  -0.735642,   0.516171,   /*     0  255    0    */ 
/*    1  65    */   0.835182,  -0.189839,   0.516171,   /*     0  255    0    */ 
/*    1  66    */   0.657840,  -0.735642,   0.161487,   /*     0  255    0    */ 
/*    1  67    */   0.902921,  -0.398317,   0.161487,   /*     0  255    0    */ 
/*    1  68    */   0.677657,   0.000000,  -0.735378,   /*     0  255    0    */ 
/*    1  69    */   0.787261,  -0.337325,  -0.516171,   /*     0  255    0    */ 
/*    1  70    */   0.787261,   0.337325,  -0.516171,   /*     0  255    0    */ 
/*    1  71    */   0.964603,  -0.208478,  -0.161487,   /*     0  255    0    */ 
/*    1  72    */   0.964603,   0.208478,  -0.161487,   /*     0  255    0    */ 
/*    1  73    */   0.548236,   0.398317,   0.735378,   /*     0  255    0    */ 
/*    1  74    */   0.835182,   0.189839,   0.516171,   /*     0  255    0    */ 
/*    1  75    */   0.438633,   0.735642,   0.516171,   /*     0  255    0    */ 
/*    1  76    */   0.902921,   0.398317,   0.161487,   /*     0  255    0    */ 
/*    1  77    */   0.657840,   0.735642,   0.161487,   /*     0  255    0    */ 
/*    1  78    */   0.209408,   0.644490,  -0.735378,   /*     0  255    0    */ 
/*    1  79    */   0.564092,   0.644490,  -0.516171,   /*     0  255    0    */ 
/*    1  80    */  -0.077538,   0.852969,  -0.516171,   /*     0  255    0    */ 
/*    1  81    */   0.496353,   0.852969,  -0.161487,   /*     0  255    0    */ 
/*    1  82    */   0.099804,   0.981815,  -0.161487,   /*     0  255    0    */ 
/*    1  83    */  -0.209408,   0.644490,   0.735378,   /*     0  255    0    */ 
/*    1  84    */  -0.564092,   0.644490,   0.516171,   /*     0  255    0    */ 
/*    1  85    */   0.077538,   0.852969,   0.516171,   /*     0  255    0    */ 
/*    1  86    */  -0.496353,   0.852969,   0.161487,   /*     0  255    0    */ 
/*    1  87    */  -0.099804,   0.981815,   0.161487,   /*     0  255    0    */ 
/*    1  88    */  -0.548236,   0.398317,  -0.735378,   /*     0  255    0    */ 
/*    1  89    */  -0.835182,   0.189839,  -0.516171,   /*     0  255    0    */ 
/*    1  90    */  -0.438633,   0.735642,  -0.516171,   /*     0  255    0    */ 
/*    1  91    */  -0.902921,   0.398317,  -0.161487,   /*     0  255    0    */ 
/*    1  92    */  -0.657840,   0.735642,  -0.161487,   /*     0  255    0    */ 
/*    0  93    */  -0.158634,  -0.115254,   0.980587,   /*   100  100  100    */ 
/*    0  94    */  -0.158634,   0.115254,   0.980587,   /*   100  100  100    */ 
/*    0  95    */   0.060593,  -0.186485,   0.980587,   /*   100  100  100    */ 
/*    0  96    */   0.060593,   0.186485,   0.980587,   /*   100  100  100    */ 
/*    0  97    */   0.196082,   0.000000,   0.980587,   /*   100  100  100    */ 
/*    0  98    */  -0.060593,  -0.186485,  -0.980587,   /*   100  100  100    */ 
/*    0  99    */  -0.196082,   0.000000,  -0.980587,   /*   100  100  100    */ 
/*    0 100    */   0.158634,  -0.115254,  -0.980587,   /*   100  100  100    */ 
/*    0 101    */  -0.060593,   0.186485,  -0.980587,   /*   100  100  100    */ 
/*    0 102    */   0.158634,   0.115254,  -0.980587,   /*   100  100  100    */ 
/*    0 103    */  -0.806121,  -0.115254,   0.580418,   /*   100  100  100    */ 
/*    0 104    */  -0.806121,   0.115254,   0.580418,   /*   100  100  100    */ 
/*    0 105    */  -0.904162,  -0.186485,   0.384336,   /*   100  100  100    */ 
/*    0 106    */  -0.904162,   0.186485,   0.384336,   /*   100  100  100    */ 
/*    0 107    */  -0.964755,   0.000000,   0.263151,   /*   100  100  100    */ 
/*    0 108    */  -0.584421,  -0.567069,  -0.580418,   /*   100  100  100    */ 
/*    0 109    */  -0.719910,  -0.380583,  -0.580418,   /*   100  100  100    */ 
/*    0 110    */  -0.621869,  -0.682323,  -0.384336,   /*   100  100  100    */ 
/*    0 111    */  -0.841096,  -0.380583,  -0.384336,   /*   100  100  100    */ 
/*    0 112    */  -0.780503,  -0.567069,  -0.263151,   /*   100  100  100    */ 
/*    0 113    */  -0.358718,  -0.731051,   0.580418,   /*   100  100  100    */ 
/*    0 114    */  -0.139492,  -0.802282,   0.580418,   /*   100  100  100    */ 
/*    0 115    */  -0.456759,  -0.802282,   0.384336,   /*   100  100  100    */ 
/*    0 116    */  -0.102043,  -0.917536,   0.384336,   /*   100  100  100    */ 
/*    0 117    */  -0.298126,  -0.917536,   0.263151,   /*   100  100  100    */ 
/*    0 118    */   0.139492,  -0.802282,  -0.580418,   /*   100  100  100    */ 
/*    0 119    */   0.358718,  -0.731051,  -0.580418,   /*   100  100  100    */ 
/*    0 120    */   0.102043,  -0.917536,  -0.384336,   /*   100  100  100    */ 
/*    0 121    */   0.456759,  -0.802282,  -0.384336,   /*   100  100  100    */ 
/*    0 122    */   0.298126,  -0.917536,  -0.263151,   /*   100  100  100    */ 
/*    0 123    */   0.584421,  -0.567069,   0.580418,   /*   100  100  100    */ 
/*    0 124    */   0.719910,  -0.380583,   0.580418,   /*   100  100  100    */ 
/*    0 125    */   0.621869,  -0.682323,   0.384336,   /*   100  100  100    */ 
/*    0 126    */   0.841096,  -0.380583,   0.384336,   /*   100  100  100    */ 
/*    0 127    */   0.780503,  -0.567069,   0.263151,   /*   100  100  100    */ 
/*    0 128    */   0.806121,  -0.115254,  -0.580418,   /*   100  100  100    */ 
/*    0 129    */   0.806121,   0.115254,  -0.580418,   /*   100  100  100    */ 
/*    0 130    */   0.904162,  -0.186485,  -0.384336,   /*   100  100  100    */ 
/*    0 131    */   0.904162,   0.186485,  -0.384336,   /*   100  100  100    */ 
/*    0 132    */   0.964755,   0.000000,  -0.263151,   /*   100  100  100    */ 
/*    0 133    */   0.719910,   0.380583,   0.580418,   /*   100  100  100    */ 
/*    0 134    */   0.584421,   0.567069,   0.580418,   /*   100  100  100    */ 
/*    0 135    */   0.841096,   0.380583,   0.384336,   /*   100  100  100    */ 
/*    0 136    */   0.621869,   0.682323,   0.384336,   /*   100  100  100    */ 
/*    0 137    */   0.780503,   0.567069,   0.263151,   /*   100  100  100    */ 
/*    0 138    */   0.358718,   0.731051,  -0.580418,   /*   100  100  100    */ 
/*    0 139    */   0.139492,   0.802282,  -0.580418,   /*   100  100  100    */ 
/*    0 140    */   0.456759,   0.802282,  -0.384336,   /*   100  100  100    */ 
/*    0 141    */   0.102043,   0.917536,  -0.384336,   /*   100  100  100    */ 
/*    0 142    */   0.298126,   0.917536,  -0.263151,   /*   100  100  100    */ 
/*    0 143    */  -0.358718,   0.731051,   0.580418,   /*   100  100  100    */ 
/*    0 144    */  -0.139492,   0.802282,   0.580418,   /*   100  100  100    */ 
/*    0 145    */  -0.456759,   0.802282,   0.384336,   /*   100  100  100    */ 
/*    0 146    */  -0.102043,   0.917536,   0.384336,   /*   100  100  100    */ 
/*    0 147    */  -0.298126,   0.917536,   0.263151,   /*   100  100  100    */ 
/*    0 148    */  -0.719910,   0.380583,  -0.580418,   /*   100  100  100    */ 
/*    0 149    */  -0.584421,   0.567069,  -0.580418,   /*   100  100  100    */ 
/*    0 150    */  -0.841096,   0.380583,  -0.384336,   /*   100  100  100    */ 
/*    0 151    */  -0.621869,   0.682323,  -0.384336,   /*   100  100  100    */ 
/*    0 152    */  -0.780503,   0.567069,  -0.263151,   /*   100  100  100    */ 
/*    0 153    */  -0.327802,  -0.238162,   0.914234,   /*   100  100  100    */ 
/*    0 154    */  -0.521790,  -0.122212,   0.844274,   /*   100  100  100    */ 
/*    0 155    */  -0.277473,  -0.458486,   0.844274,   /*   100  100  100    */ 
/*    0 156    */  -0.671119,  -0.238162,   0.702053,   /*   100  100  100    */ 
/*    0 157    */  -0.631052,  -0.458486,   0.625750,   /*   100  100  100    */ 
/*    0 158    */  -0.433893,  -0.564676,   0.702053,   /*   100  100  100    */ 
/*    0 159    */  -0.327802,   0.238162,   0.914234,   /*   100  100  100    */ 
/*    0 160    */  -0.521790,   0.122212,   0.844274,   /*   100  100  100    */ 
/*    0 161    */  -0.277473,   0.458486,   0.844274,   /*   100  100  100    */ 
/*    0 162    */  -0.671119,   0.238162,   0.702053,   /*   100  100  100    */ 
/*    0 163    */  -0.631052,   0.458486,   0.625750,   /*   100  100  100    */ 
/*    0 164    */  -0.433893,   0.564676,   0.702053,   /*   100  100  100    */ 
/*    0 165    */   0.125209,  -0.385354,   0.914234,   /*   100  100  100    */ 
/*    0 166    */  -0.045011,  -0.534018,   0.844274,   /*   100  100  100    */ 
/*    0 167    */   0.350303,  -0.405572,   0.844274,   /*   100  100  100    */ 
/*    0 168    */   0.019119,  -0.711868,   0.702053,   /*   100  100  100    */ 
/*    0 169    */   0.241041,  -0.741846,   0.625750,   /*   100  100  100    */ 
/*    0 170    */   0.402958,  -0.587151,   0.702053,   /*   100  100  100    */ 
/*    0 171    */   0.405186,   0.000000,   0.914234,   /*   100  100  100    */ 
/*    0 172    */   0.493972,  -0.207829,   0.844274,   /*   100  100  100    */ 
/*    0 173    */   0.493972,   0.207829,   0.844274,   /*   100  100  100    */ 
/*    0 174    */   0.682935,  -0.201796,   0.702053,   /*   100  100  100    */ 
/*    0 175    */   0.780023,   0.000000,   0.625750,   /*   100  100  100    */ 
/*    0 176    */   0.682935,   0.201796,   0.702053,   /*   100  100  100    */ 
/*    0 177    */   0.125209,   0.385354,   0.914234,   /*   100  100  100    */ 
/*    0 178    */  -0.045011,   0.534018,   0.844274,   /*   100  100  100    */ 
/*    0 179    */   0.350303,   0.405572,   0.844274,   /*   100  100  100    */ 
/*    0 180    */   0.402958,   0.587151,   0.702053,   /*   100  100  100    */ 
/*    0 181    */   0.241041,   0.741846,   0.625750,   /*   100  100  100    */ 
/*    0 182    */   0.019119,   0.711868,   0.702053,   /*   100  100  100    */ 
/*    0 183    */  -0.125209,  -0.385354,  -0.914234,   /*   100  100  100    */ 
/*    0 184    */  -0.350303,  -0.405572,  -0.844274,   /*   100  100  100    */ 
/*    0 185    */   0.045011,  -0.534018,  -0.844274,   /*   100  100  100    */ 
/*    0 186    */  -0.402958,  -0.587151,  -0.702053,   /*   100  100  100    */ 
/*    0 187    */  -0.241041,  -0.741846,  -0.625750,   /*   100  100  100    */ 
/*    0 188    */  -0.019119,  -0.711868,  -0.702053,   /*   100  100  100    */ 
/*    0 189    */  -0.405186,   0.000000,  -0.914234,   /*   100  100  100    */ 
/*    0 190    */  -0.493972,  -0.207829,  -0.844274,   /*   100  100  100    */ 
/*    0 191    */  -0.493972,   0.207829,  -0.844274,   /*   100  100  100    */ 
/*    0 192    */  -0.682935,  -0.201796,  -0.702053,   /*   100  100  100    */ 
/*    0 193    */  -0.780023,   0.000000,  -0.625750,   /*   100  100  100    */ 
/*    0 194    */  -0.682935,   0.201796,  -0.702053,   /*   100  100  100    */ 
/*    0 195    */   0.327802,  -0.238162,  -0.914234,   /*   100  100  100    */ 
/*    0 196    */   0.277473,  -0.458486,  -0.844274,   /*   100  100  100    */ 
/*    0 197    */   0.521790,  -0.122212,  -0.844274,   /*   100  100  100    */ 
/*    0 198    */   0.433893,  -0.564676,  -0.702053,   /*   100  100  100    */ 
/*    0 199    */   0.631052,  -0.458486,  -0.625750,   /*   100  100  100    */ 
/*    0 200    */   0.671119,  -0.238162,  -0.702053,   /*   100  100  100    */ 
/*    0 201    */   0.327802,   0.238162,  -0.914234,   /*   100  100  100    */ 
/*    0 202    */   0.521790,   0.122212,  -0.844274,   /*   100  100  100    */ 
/*    0 203    */   0.277473,   0.458486,  -0.844274,   /*   100  100  100    */ 
/*    0 204    */   0.671119,   0.238162,  -0.702053,   /*   100  100  100    */ 
/*    0 205    */   0.631052,   0.458486,  -0.625750,   /*   100  100  100    */ 
/*    0 206    */   0.433893,   0.564676,  -0.702053,   /*   100  100  100    */ 
/*    0 207    */  -0.125209,   0.385354,  -0.914234,   /*   100  100  100    */ 
/*    0 208    */  -0.350303,   0.405572,  -0.844274,   /*   100  100  100    */ 
/*    0 209    */   0.045011,   0.534018,  -0.844274,   /*   100  100  100    */ 
/*    0 210    */  -0.019119,   0.711868,  -0.702053,   /*   100  100  100    */ 
/*    0 211    */  -0.241041,   0.741846,  -0.625750,   /*   100  100  100    */ 
/*    0 212    */  -0.402958,   0.587151,  -0.702053,   /*   100  100  100    */ 
/*    0 213    */  -0.873711,  -0.385354,   0.296868,   /*   100  100  100    */ 
/*    0 214    */  -0.735012,  -0.534018,   0.417830,   /*   100  100  100    */ 
/*    0 215    */  -0.911802,  -0.405572,   0.064251,   /*   100  100  100    */ 
/*    0 216    */  -0.808144,  -0.587151,  -0.046449,   /*   100  100  100    */ 
/*    0 217    */  -0.667485,  -0.741846,   0.064251,   /*   100  100  100    */ 
/*    0 218    */  -0.636485,  -0.711868,   0.296868,   /*   100  100  100    */ 
/*    0 219    */  -0.998921,   0.000000,   0.046449,   /*   100  100  100    */ 
/*    0 220    */  -0.976053,  -0.207829,  -0.064251,   /*   100  100  100    */ 
/*    0 221    */  -0.976053,   0.207829,  -0.064251,   /*   100  100  100    */ 
/*    0 222    */  -0.933353,  -0.201796,  -0.296868,   /*   100  100  100    */ 
/*    0 223    */  -0.908525,   0.000000,  -0.417830,   /*   100  100  100    */ 
/*    0 224    */  -0.933353,   0.201796,  -0.296868,   /*   100  100  100    */ 
/*    0 225    */  -0.873711,   0.385354,   0.296868,   /*   100  100  100    */ 
/*    0 226    */  -0.735012,   0.534018,   0.417830,   /*   100  100  100    */ 
/*    0 227    */  -0.911802,   0.405572,   0.064251,   /*   100  100  100    */ 
/*    0 228    */  -0.636485,   0.711868,   0.296868,   /*   100  100  100    */ 
/*    0 229    */  -0.667485,   0.741846,   0.064251,   /*   100  100  100    */ 
/*    0 230    */  -0.808144,   0.587151,  -0.046449,   /*   100  100  100    */ 
/*    0 231    */  -0.480342,  -0.825313,  -0.296868,   /*   100  100  100    */ 
/*    0 232    */  -0.280750,  -0.864059,  -0.417830,   /*   100  100  100    */ 
/*    0 233    */  -0.499274,  -0.864059,  -0.064251,   /*   100  100  100    */ 
/*    0 234    */  -0.308683,  -0.950030,   0.046449,   /*   100  100  100    */ 
/*    0 235    */  -0.103960,  -0.992504,  -0.064251,   /*   100  100  100    */ 
/*    0 236    */  -0.096502,  -0.950030,  -0.296868,   /*   100  100  100    */ 
/*    0 237    */   0.096502,  -0.950030,   0.296868,   /*   100  100  100    */ 
/*    0 238    */   0.280750,  -0.864059,   0.417830,   /*   100  100  100    */ 
/*    0 239    */   0.103960,  -0.992504,   0.064251,   /*   100  100  100    */ 
/*    0 240    */   0.308683,  -0.950030,  -0.046449,   /*   100  100  100    */ 
/*    0 241    */   0.499274,  -0.864059,   0.064251,   /*   100  100  100    */ 
/*    0 242    */   0.480342,  -0.825313,   0.296868,   /*   100  100  100    */ 
/*    0 243    */   0.636485,  -0.711868,  -0.296868,   /*   100  100  100    */ 
/*    0 244    */   0.735012,  -0.534018,  -0.417830,   /*   100  100  100    */ 
/*    0 245    */   0.667485,  -0.741846,  -0.064251,   /*   100  100  100    */ 
/*    0 246    */   0.808144,  -0.587151,   0.046449,   /*   100  100  100    */ 
/*    0 247    */   0.911802,  -0.405572,  -0.064251,   /*   100  100  100    */ 
/*    0 248    */   0.873711,  -0.385354,  -0.296868,   /*   100  100  100    */ 
/*    0 249    */   0.933353,  -0.201796,   0.296868,   /*   100  100  100    */ 
/*    0 250    */   0.908525,   0.000000,   0.417830,   /*   100  100  100    */ 
/*    0 251    */   0.976053,  -0.207829,   0.064251,   /*   100  100  100    */ 
/*    0 252    */   0.998921,   0.000000,  -0.046449,   /*   100  100  100    */ 
/*    0 253    */   0.976053,   0.207829,   0.064251,   /*   100  100  100    */ 
/*    0 254    */   0.933353,   0.201796,   0.296868,   /*   100  100  100    */ 
/*    0 255    */   0.873711,   0.385354,  -0.296868,   /*   100  100  100    */ 
/*    0 256    */   0.735012,   0.534018,  -0.417830,   /*   100  100  100    */ 
/*    0 257    */   0.911802,   0.405572,  -0.064251,   /*   100  100  100    */ 
/*    0 258    */   0.808144,   0.587151,   0.046449,   /*   100  100  100    */ 
/*    0 259    */   0.667485,   0.741846,  -0.064251,   /*   100  100  100    */ 
/*    0 260    */   0.636485,   0.711868,  -0.296868,   /*   100  100  100    */ 
/*    0 261    */   0.480342,   0.825313,   0.296868,   /*   100  100  100    */ 
/*    0 262    */   0.280750,   0.864059,   0.417830,   /*   100  100  100    */ 
/*    0 263    */   0.499274,   0.864059,   0.064251,   /*   100  100  100    */ 
/*    0 264    */   0.308683,   0.950030,  -0.046449,   /*   100  100  100    */ 
/*    0 265    */   0.103960,   0.992504,   0.064251,   /*   100  100  100    */ 
/*    0 266    */   0.096502,   0.950030,   0.296868,   /*   100  100  100    */ 
/*    0 267    */  -0.096502,   0.950030,  -0.296868,   /*   100  100  100    */ 
/*    0 268    */  -0.280750,   0.864059,  -0.417830,   /*   100  100  100    */ 
/*    0 269    */  -0.103960,   0.992504,  -0.064251,   /*   100  100  100    */ 
/*    0 270    */  -0.308683,   0.950030,   0.046449,   /*   100  100  100    */ 
/*    0 271    */  -0.499274,   0.864059,  -0.064251,   /*   100  100  100    */ 
/*    0 272    */  -0.480342,   0.825313,  -0.296868,   /*   100  100  100    */ 
]
const icoFaces    = [
/*   №     0   */   0,    0,    0, 
/*   №     1   */   1,   97,   95, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №     2   */   1,   95,   93, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №     3   */   1,   93,   94, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №     4   */   1,   94,   96, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №     5   */   1,   96,   97, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №     6   */  97,   96,   37, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №     7   */  97,   37,  171, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №     8   */  97,  171,   36, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №     9   */  97,   36,   95, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    10   */  95,   36,  165, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    11   */  95,  165,   34, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    12   */  95,   34,   93, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    13   */  93,   34,  153, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    14   */  93,  153,   33, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    15   */  93,   33,   94, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    16   */  94,   33,  159, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    17   */  94,  159,   35, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    18   */  94,   35,   96, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    19   */  96,   35,  177, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    20   */  96,  177,   37, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    21   */  37,  177,  179, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    22   */  37,  179,  173, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    23   */  37,  173,  171, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    24   */ 171,  173,   16, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №    25   */ 171,   16,  172, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №    26   */ 171,  172,   36, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    27   */  36,  172,  167, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    28   */  36,  167,  165, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    29   */ 165,  167,   15, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №    30   */ 165,   15,  166, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №    31   */ 165,  166,   34, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    32   */  34,  166,  155, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    33   */  34,  155,  153, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    34   */ 153,  155,   13, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №    35   */ 153,   13,  154, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №    36   */ 153,  154,   33, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    37   */  33,  154,  160, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    38   */  33,  160,  159, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    39   */ 159,  160,   14, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №    40   */ 159,   14,  161, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №    41   */ 159,  161,   35, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    42   */  35,  161,  178, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    43   */  35,  178,  177, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    44   */ 177,  178,   17, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №    45   */ 177,   17,  179, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №    46   */ 179,   17,  180, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №    47   */ 179,  180,   73, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    48   */ 179,   73,  173, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    49   */ 173,   73,  176, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    50   */ 173,  176,   16, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №    51   */  16,  176,  175, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    52   */  16,  175,  174, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    53   */  16,  174,  172, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    54   */ 172,  174,   63, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    55   */ 172,   63,  167, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    56   */ 167,   63,  170, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    57   */ 167,  170,   15, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №    58   */  15,  170,  169, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    59   */  15,  169,  168, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    60   */  15,  168,  166, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    61   */ 166,  168,   53, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    62   */ 166,   53,  155, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    63   */ 155,   53,  158, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    64   */ 155,  158,   13, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №    65   */  13,  158,  157, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    66   */  13,  157,  156, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    67   */  13,  156,  154, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    68   */ 154,  156,   43, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    69   */ 154,   43,  160, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    70   */ 160,   43,  162, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    71   */ 160,  162,   14, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №    72   */  14,  162,  163, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    73   */  14,  163,  164, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    74   */  14,  164,  161, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    75   */ 161,  164,   83, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    76   */ 161,   83,  178, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    77   */ 178,   83,  182, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    78   */ 178,  182,   17, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №    79   */  17,  182,  181, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    80   */  17,  181,  180, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №    81   */ 180,  181,   75, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    82   */ 180,   75,  134, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    83   */ 180,  134,   73, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    84   */  73,  134,  133, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    85   */  73,  133,  176, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    86   */ 176,  133,   74, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    87   */ 176,   74,  175, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    88   */ 175,   74,  250, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    89   */ 175,  250,   65, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    90   */ 175,   65,  174, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    91   */ 174,   65,  124, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    92   */ 174,  124,   63, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    93   */  63,  124,  123, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    94   */  63,  123,  170, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №    95   */ 170,  123,   64, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    96   */ 170,   64,  169, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    97   */ 169,   64,  238, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №    98   */ 169,  238,   55, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №    99   */ 169,   55,  168, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   100   */ 168,   55,  114, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   101   */ 168,  114,   53, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   102   */  53,  114,  113, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   103   */  53,  113,  158, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   104   */ 158,  113,   54, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   105   */ 158,   54,  157, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   106   */ 157,   54,  214, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   107   */ 157,  214,   44, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   108   */ 157,   44,  156, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   109   */ 156,   44,  103, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   110   */ 156,  103,   43, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   111   */  43,  103,  104, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   112   */  43,  104,  162, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   113   */ 162,  104,   45, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   114   */ 162,   45,  163, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   115   */ 163,   45,  226, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   116   */ 163,  226,   84, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   117   */ 163,   84,  164, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   118   */ 164,   84,  143, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   119   */ 164,  143,   83, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   120   */  83,  143,  144, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   121   */  83,  144,  182, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   122   */ 182,  144,   85, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   123   */ 182,   85,  181, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   124   */ 181,   85,  262, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   125   */ 181,  262,   75, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   126   */  75,  262,  261, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   127   */  75,  261,  136, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   128   */  75,  136,  134, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   129   */ 134,  136,    9, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   130   */ 134,    9,  133, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   131   */ 133,    9,  135, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   132   */ 133,  135,   74, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   133   */  74,  135,  254, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   134   */  74,  254,  250, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   135   */ 250,  254,   29, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   136   */ 250,   29,  249, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   137   */ 250,  249,   65, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   138   */  65,  249,  126, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   139   */  65,  126,  124, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   140   */ 124,  126,    7, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   141   */ 124,    7,  123, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   142   */ 123,    7,  125, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   143   */ 123,  125,   64, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   144   */  64,  125,  242, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   145   */  64,  242,  238, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   146   */ 238,  242,   27, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   147   */ 238,   27,  237, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   148   */ 238,  237,   55, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   149   */  55,  237,  116, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   150   */  55,  116,  114, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   151   */ 114,  116,    5, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   152   */ 114,    5,  113, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   153   */ 113,    5,  115, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   154   */ 113,  115,   54, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   155   */  54,  115,  218, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   156   */  54,  218,  214, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   157   */ 214,  218,   23, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   158   */ 214,   23,  213, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   159   */ 214,  213,   44, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   160   */  44,  213,  105, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   161   */  44,  105,  103, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   162   */ 103,  105,    3, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   163   */ 103,    3,  104, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   164   */ 104,    3,  106, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   165   */ 104,  106,   45, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   166   */  45,  106,  225, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   167   */  45,  225,  226, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   168   */ 226,  225,   25, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   169   */ 226,   25,  228, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   170   */ 226,  228,   84, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   171   */  84,  228,  145, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   172   */  84,  145,  143, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   173   */ 143,  145,   11, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   174   */ 143,   11,  144, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   175   */ 144,   11,  146, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   176   */ 144,  146,   85, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   177   */  85,  146,  266, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   178   */  85,  266,  262, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   179   */ 262,  266,   31, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   180   */ 262,   31,  261, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   181   */ 261,   31,  263, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   182   */ 261,  263,   77, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   183   */ 261,   77,  136, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   184   */ 136,   77,  137, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   185   */ 136,  137,    9, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   186   */   9,  137,  135, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   187   */ 135,  137,   76, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   188   */ 135,   76,  254, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   189   */ 254,   76,  253, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   190   */ 254,  253,   29, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   191   */  29,  253,  252, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   192   */  29,  252,  251, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   193   */  29,  251,  249, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   194   */ 249,  251,   67, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   195   */ 249,   67,  126, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   196   */ 126,   67,  127, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   197   */ 126,  127,    7, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   198   */   7,  127,  125, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   199   */ 125,  127,   66, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   200   */ 125,   66,  242, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   201   */ 242,   66,  241, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   202   */ 242,  241,   27, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   203   */  27,  241,  240, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   204   */  27,  240,  239, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   205   */  27,  239,  237, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   206   */ 237,  239,   57, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   207   */ 237,   57,  116, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   208   */ 116,   57,  117, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   209   */ 116,  117,    5, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   210   */   5,  117,  115, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   211   */ 115,  117,   56, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   212   */ 115,   56,  218, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   213   */ 218,   56,  217, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   214   */ 218,  217,   23, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   215   */  23,  217,  216, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   216   */  23,  216,  215, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   217   */  23,  215,  213, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   218   */ 213,  215,   46, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   219   */ 213,   46,  105, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   220   */ 105,   46,  107, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   221   */ 105,  107,    3, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   222   */   3,  107,  106, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   223   */ 106,  107,   47, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   224   */ 106,   47,  225, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   225   */ 225,   47,  227, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   226   */ 225,  227,   25, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   227   */  25,  227,  230, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   228   */  25,  230,  229, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   229   */  25,  229,  228, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   230   */ 228,  229,   86, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   231   */ 228,   86,  145, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   232   */ 145,   86,  147, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   233   */ 145,  147,   11, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   234   */  11,  147,  146, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   235   */ 146,  147,   87, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   236   */ 146,   87,  266, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   237   */ 266,   87,  265, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   238   */ 266,  265,   31, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   239   */  31,  265,  264, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   240   */  31,  264,  263, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   241   */ 263,  264,   81, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   242   */ 263,   81,  259, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   243   */ 263,  259,   77, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   244   */  77,  259,  258, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   245   */  77,  258,  137, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   246   */ 137,  258,   76, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   247   */  76,  258,  257, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   248   */  76,  257,  253, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   249   */ 253,  257,   72, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   250   */ 253,   72,  252, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   251   */ 252,   72,  132, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   252   */ 252,  132,   71, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   253   */ 252,   71,  251, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   254   */ 251,   71,  247, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   255   */ 251,  247,   67, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   256   */  67,  247,  246, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   257   */  67,  246,  127, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   258   */ 127,  246,   66, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   259   */  66,  246,  245, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   260   */  66,  245,  241, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   261   */ 241,  245,   62, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   262   */ 241,   62,  240, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   263   */ 240,   62,  122, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   264   */ 240,  122,   61, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   265   */ 240,   61,  239, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   266   */ 239,   61,  235, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   267   */ 239,  235,   57, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   268   */  57,  235,  234, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   269   */  57,  234,  117, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   270   */ 117,  234,   56, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   271   */  56,  234,  233, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   272   */  56,  233,  217, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   273   */ 217,  233,   52, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   274   */ 217,   52,  216, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   275   */ 216,   52,  112, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   276   */ 216,  112,   51, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   277   */ 216,   51,  215, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   278   */ 215,   51,  220, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   279   */ 215,  220,   46, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   280   */  46,  220,  219, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   281   */  46,  219,  107, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   282   */ 107,  219,   47, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   283   */  47,  219,  221, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   284   */  47,  221,  227, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   285   */ 227,  221,   91, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   286   */ 227,   91,  230, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   287   */ 230,   91,  152, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   288   */ 230,  152,   92, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   289   */ 230,   92,  229, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   290   */ 229,   92,  271, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   291   */ 229,  271,   86, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   292   */  86,  271,  270, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   293   */  86,  270,  147, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   294   */ 147,  270,   87, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   295   */  87,  270,  269, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   296   */  87,  269,  265, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   297   */ 265,  269,   82, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   298   */ 265,   82,  264, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   299   */ 264,   82,  142, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   300   */ 264,  142,   81, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   301   */  81,  142,  140, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   302   */  81,  140,  260, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   303   */  81,  260,  259, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   304   */ 259,  260,   30, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   305   */ 259,   30,  258, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   306   */ 258,   30,  257, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   307   */ 257,   30,  255, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   308   */ 257,  255,   72, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   309   */  72,  255,  131, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   310   */  72,  131,  132, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   311   */ 132,  131,    8, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   312   */ 132,    8,  130, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   313   */ 132,  130,   71, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   314   */  71,  130,  248, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   315   */  71,  248,  247, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   316   */ 247,  248,   28, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   317   */ 247,   28,  246, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   318   */ 246,   28,  245, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   319   */ 245,   28,  243, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   320   */ 245,  243,   62, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   321   */  62,  243,  121, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   322   */  62,  121,  122, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   323   */ 122,  121,    6, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   324   */ 122,    6,  120, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   325   */ 122,  120,   61, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   326   */  61,  120,  236, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   327   */  61,  236,  235, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   328   */ 235,  236,   26, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   329   */ 235,   26,  234, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   330   */ 234,   26,  233, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   331   */ 233,   26,  231, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   332   */ 233,  231,   52, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   333   */  52,  231,  110, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   334   */  52,  110,  112, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   335   */ 112,  110,    4, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   336   */ 112,    4,  111, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   337   */ 112,  111,   51, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   338   */  51,  111,  222, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   339   */  51,  222,  220, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   340   */ 220,  222,   24, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   341   */ 220,   24,  219, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   342   */ 219,   24,  221, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   343   */ 221,   24,  224, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   344   */ 221,  224,   91, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   345   */  91,  224,  150, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   346   */  91,  150,  152, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   347   */ 152,  150,   12, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   348   */ 152,   12,  151, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   349   */ 152,  151,   92, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   350   */  92,  151,  272, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   351   */  92,  272,  271, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   352   */ 271,  272,   32, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   353   */ 271,   32,  270, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   354   */ 270,   32,  269, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   355   */ 269,   32,  267, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   356   */ 269,  267,   82, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   357   */  82,  267,  141, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   358   */  82,  141,  142, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   359   */ 142,  141,   10, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   360   */ 142,   10,  140, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   361   */ 140,   10,  138, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   362   */ 140,  138,   79, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   363   */ 140,   79,  260, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   364   */ 260,   79,  256, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   365   */ 260,  256,   30, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   366   */  30,  256,  255, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   367   */ 255,  256,   70, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   368   */ 255,   70,  131, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   369   */ 131,   70,  129, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   370   */ 131,  129,    8, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   371   */   8,  129,  128, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   372   */   8,  128,  130, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   373   */ 130,  128,   69, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   374   */ 130,   69,  248, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   375   */ 248,   69,  244, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   376   */ 248,  244,   28, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   377   */  28,  244,  243, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   378   */ 243,  244,   60, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   379   */ 243,   60,  121, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   380   */ 121,   60,  119, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   381   */ 121,  119,    6, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   382   */   6,  119,  118, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   383   */   6,  118,  120, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   384   */ 120,  118,   59, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   385   */ 120,   59,  236, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   386   */ 236,   59,  232, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   387   */ 236,  232,   26, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   388   */  26,  232,  231, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   389   */ 231,  232,   49, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   390   */ 231,   49,  110, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   391   */ 110,   49,  108, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   392   */ 110,  108,    4, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   393   */   4,  108,  109, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   394   */   4,  109,  111, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   395   */ 111,  109,   50, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   396   */ 111,   50,  222, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   397   */ 222,   50,  223, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   398   */ 222,  223,   24, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   399   */  24,  223,  224, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   400   */ 224,  223,   89, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   401   */ 224,   89,  150, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   402   */ 150,   89,  148, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   403   */ 150,  148,   12, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   404   */  12,  148,  149, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   405   */  12,  149,  151, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   406   */ 151,  149,   90, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   407   */ 151,   90,  272, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   408   */ 272,   90,  268, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   409   */ 272,  268,   32, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   410   */  32,  268,  267, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   411   */ 267,  268,   80, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   412   */ 267,   80,  141, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   413   */ 141,   80,  139, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   414   */ 141,  139,   10, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   415   */  10,  139,  138, /* 255,    0,    0,    100,  100,  100,    100,  100,  100, */
/*   №   416   */ 138,  139,   78, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   417   */ 138,   78,  206, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   418   */ 138,  206,   79, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   419   */  79,  206,  205, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   420   */  79,  205,  256, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   421   */ 256,  205,   70, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   422   */  70,  205,  204, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   423   */  70,  204,  129, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   424   */ 129,  204,   68, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   425   */ 129,   68,  128, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   426   */ 128,   68,  200, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   427   */ 128,  200,   69, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   428   */  69,  200,  199, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   429   */  69,  199,  244, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   430   */ 244,  199,   60, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   431   */  60,  199,  198, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   432   */  60,  198,  119, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   433   */ 119,  198,   58, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   434   */ 119,   58,  118, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   435   */ 118,   58,  188, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   436   */ 118,  188,   59, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   437   */  59,  188,  187, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   438   */  59,  187,  232, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   439   */ 232,  187,   49, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   440   */  49,  187,  186, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   441   */  49,  186,  108, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   442   */ 108,  186,   48, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   443   */ 108,   48,  109, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   444   */ 109,   48,  192, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   445   */ 109,  192,   50, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   446   */  50,  192,  193, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   447   */  50,  193,  223, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   448   */ 223,  193,   89, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   449   */  89,  193,  194, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   450   */  89,  194,  148, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   451   */ 148,  194,   88, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   452   */ 148,   88,  149, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   453   */ 149,   88,  212, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   454   */ 149,  212,   90, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   455   */  90,  212,  211, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   456   */  90,  211,  268, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   457   */ 268,  211,   80, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   458   */  80,  211,  210, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   459   */  80,  210,  139, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   460   */ 139,  210,   78, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   461   */  78,  210,  209, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   462   */  78,  209,  203, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   463   */  78,  203,  206, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   464   */ 206,  203,   21, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   465   */ 206,   21,  205, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   466   */ 205,   21,  204, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   467   */ 204,   21,  202, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   468   */ 204,  202,   68, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   469   */  68,  202,  197, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   470   */  68,  197,  200, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   471   */ 200,  197,   20, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   472   */ 200,   20,  199, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   473   */ 199,   20,  198, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   474   */ 198,   20,  196, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   475   */ 198,  196,   58, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   476   */  58,  196,  185, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   477   */  58,  185,  188, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   478   */ 188,  185,   18, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   479   */ 188,   18,  187, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   480   */ 187,   18,  186, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   481   */ 186,   18,  184, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   482   */ 186,  184,   48, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   483   */  48,  184,  190, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   484   */  48,  190,  192, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   485   */ 192,  190,   19, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   486   */ 192,   19,  193, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   487   */ 193,   19,  194, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   488   */ 194,   19,  191, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   489   */ 194,  191,   88, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   490   */  88,  191,  208, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   491   */  88,  208,  212, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   492   */ 212,  208,   22, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   493   */ 212,   22,  211, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   494   */ 211,   22,  210, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   495   */ 210,   22,  209, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   496   */ 209,   22,  207, /* 100,  100,  100,      0,    0,  255,    100,  100,  100, */
/*   №   497   */ 209,  207,   42, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   498   */ 209,   42,  203, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   499   */ 203,   42,  201, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   500   */ 203,  201,   21, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   501   */  21,  201,  202, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   502   */ 202,  201,   41, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   503   */ 202,   41,  197, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   504   */ 197,   41,  195, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   505   */ 197,  195,   20, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   506   */  20,  195,  196, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   507   */ 196,  195,   39, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   508   */ 196,   39,  185, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   509   */ 185,   39,  183, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   510   */ 185,  183,   18, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   511   */  18,  183,  184, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   512   */ 184,  183,   38, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   513   */ 184,   38,  190, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   514   */ 190,   38,  189, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   515   */ 190,  189,   19, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   516   */  19,  189,  191, /*   0,    0,  255,    100,  100,  100,    100,  100,  100, */
/*   №   517   */ 191,  189,   40, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   518   */ 191,   40,  208, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   519   */ 208,   40,  207, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   520   */ 207,   40,  101, /* 100,  100,  100,      0,  255,    0,    100,  100,  100, */
/*   №   521   */ 208,  207,   22, /* 100,  100,  100,    100,  100,  100,      0,    0,  255, */
/*   №   522   */ 207,  101,   42, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   523   */  42,  101,  102, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   524   */  42,  102,  201, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   525   */ 201,  102,   41, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   526   */  41,  102,  100, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   527   */  41,  100,  195, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   528   */ 195,  100,   39, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   529   */  39,  100,   98, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   530   */  39,   98,  183, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   531   */ 183,   98,   38, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   532   */  38,   98,   99, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   533   */  38,   99,  189, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   534   */ 189,   99,   40, /* 100,  100,  100,    100,  100,  100,      0,  255,    0, */
/*   №   535   */  40,   99,  101, /*   0,  255,    0,    100,  100,  100,    100,  100,  100, */
/*   №   536   */ 101,   99,    2, /* 100,  100,  100,    100,  100,  100,    255,    0,    0, */
/*   №   537   */ 101,    2,  102, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   538   */ 102,    2,  100, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   539   */ 100,    2,   98, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
/*   №   540   */  98,    2,   99, /* 100,  100,  100,    255,    0,    0,    100,  100,  100, */
];
    
geometryRGB = new THREE.PolyhedronGeometry(icoVertices, icoFaces, 1, 0);
geometryRGB.computeVertexNormals();  // ГЛАДКОСТЬ ЦВЕТА

////////////////////////////// Разные расцветки Гольдбергов ////////////////////////////
paintAllIcoFaces = () => {
    const p = [0, 12, 32, 92];
    
    for ( i = 1; i <= 540; i++) {
        for ( k = 1; k <= 3; k++) {
                    
            if (icoFaces[i*3-1+ 1] > p[k-1] && 
                icoFaces[i*3-1+ 1] <= p[k]) {
                geometryRGB.faces[i-1].vertexColors[1-1] = new THREE.Color(colors[0]); 
                geometryRGB.faces[i-1].vertexColors[2-1] = new THREE.Color(colors[0]); 
                geometryRGB.faces[i-1].vertexColors[3-1] = new THREE.Color(colors[k]);
            }
                        
            if (icoFaces[i*3-1+ 2] > p[k-1] && 
                icoFaces[i*3-1+ 2] <= p[k]) {
                geometryRGB.faces[i-1].vertexColors[1-1] = new THREE.Color(colors[k]); 
                geometryRGB.faces[i-1].vertexColors[2-1] = new THREE.Color(colors[0]); 
                geometryRGB.faces[i-1].vertexColors[3-1] = new THREE.Color(colors[0]);
            }
                        
            if (icoFaces[i*3-1+ 3] > p[k-1] &&  
                icoFaces[i*3-1+ 3] <= p[k]) {
                geometryRGB.faces[i-1].vertexColors[1-1] = new THREE.Color(colors[0]); 
                geometryRGB.faces[i-1].vertexColors[2-1] = new THREE.Color(colors[k]); 
                geometryRGB.faces[i-1].vertexColors[3-1] = new THREE.Color(colors[0]);
            }
        }
    }
};
    
arrowGeometry = () => {
    let arrowVert =   
    [  0,   0,   0,  // 0
       0,  -7,  19,  // 1
       0,  -5,  -3,  // 2
      10,  0,   0,  // 3
     -10,  0,   0,  // 4
       0,   0,  40,  // 5
       0,  -7, -10,  // 6
       5,   5,   5,  // 7
       5,   5,  -5,  // 8
      -5,   5,   5,  // 9
      -5,   5,  -5,  //10
       0,  10,   2,  //11
       2,  10,   0,  //12
       0,  10,  -2,  //13
      -2,  10,   0,  //14
       0,  11,   0,  //15
      20,  0,  -7,  //16
     -20,  0,  -7,  //17
      23,  0,  -2,  //18
     -23,  0,  -2,  //19
       5,  0,  20,  //20
      -5,  0,  20,  //21
      10,  0,  15,  //22
     -10,  0,  15   //23
    ];
                    
    let scale = 0.0038; 
    scale *= kScale;
    let up = +0.04;
  
    arrowLightGeom = new THREE.Geometry();
    for ( i = 0; i <=23; i++) {
        arrowLightGeom.vertices.push(new THREE.Vector3
            (scale*arrowVert[i*3+1-1],
             scale*arrowVert[i*3+2-1]+up,
             scale*arrowVert[i*3+3-1]-up));
    }
    
    arrowDarkGeom = new THREE.Geometry();
    for ( i = 0; i <=23; i++) {
        arrowDarkGeom.vertices.push(new THREE.Vector3
            (scale*arrowVert[i*3+1-1],
             scale*arrowVert[i*3+2-1]+up,
             scale*arrowVert[i*3+3-1]-up));
    }
      
    arrowLightGeom.faces.push(
        new THREE.Face3( 0, 0, 0),  // 0 
        new THREE.Face3( 3, 1, 2),  // 1 
        new THREE.Face3( 2, 1, 4),  // 2
        new THREE.Face3( 1, 5, 4),  // 3
        new THREE.Face3( 3, 5, 1),  // 4
        new THREE.Face3( 4, 6, 2),  // 5
        new THREE.Face3( 2, 6, 3),  // 6
        new THREE.Face3( 5, 7, 9),  // 7
        new THREE.Face3( 5, 3, 7),  // 8
        new THREE.Face3( 7, 3, 8),  // 9
        new THREE.Face3( 8, 3, 6),  // 10
        new THREE.Face3( 8, 6,10),  // 11
        new THREE.Face3( 6, 4,10),  // 12
        new THREE.Face3(10, 4, 9),  // 13
        new THREE.Face3( 9, 4, 5),  // 14
        new THREE.Face3(11, 7,12),  // 15
        new THREE.Face3(12, 7, 8),  // 16
        new THREE.Face3(12, 8,13),  // 17
        new THREE.Face3(13, 8,10),  // 18
        new THREE.Face3(13,10,14),  // 19
        new THREE.Face3(14,10, 9),  // 20
        new THREE.Face3(14, 9,11),  // 21
        new THREE.Face3(11, 9, 7),  // 22
        new THREE.Face3(15,11,12),  // 23
        new THREE.Face3(15,12,13),  // 24
        new THREE.Face3(15,13,14),  // 25
        new THREE.Face3(15,14,11),  // 26
        new THREE.Face3( 8, 7,16),  // 27
        new THREE.Face3( 9,10,17),  // 28
        new THREE.Face3( 6, 8,16),  // 29
        new THREE.Face3(10, 6,17),  // 30
        new THREE.Face3( 6,16, 3),  // 31
        new THREE.Face3( 4,17, 6),  // 32
        new THREE.Face3(16, 7, 3),  // 33
        new THREE.Face3(17, 4, 9),  // 34
        new THREE.Face3( 7,18,16),  // 35
        new THREE.Face3( 9,17,19),  // 36
        new THREE.Face3( 9,19, 4),  // 37
        new THREE.Face3( 3,18, 7),  // 38
        new THREE.Face3( 4,19,17),  // 39
        new THREE.Face3(16,18, 3),  // 40
        new THREE.Face3(21,23, 4),  // 41
        new THREE.Face3(22,20, 3),  // 42
        new THREE.Face3(23,21, 9),  // 43
        new THREE.Face3(20,22, 7),  // 44
        new THREE.Face3( 9, 4,23),  // 45
        new THREE.Face3( 3, 7,22)   // 46
    );
    
     arrowDarkGeom.faces.push(
        new THREE.Face3( 0, 0, 0),  // 0 
        new THREE.Face3( 3, 1, 2),  // 1 
        new THREE.Face3( 2, 1, 4),  // 2
        new THREE.Face3( 1, 5, 4),  // 3
        new THREE.Face3( 3, 5, 1),  // 4
        new THREE.Face3( 4, 6, 2),  // 5
        new THREE.Face3( 2, 6, 3),  // 6
        new THREE.Face3( 5, 7, 9),  // 7
        new THREE.Face3( 5, 3, 7),  // 8
        new THREE.Face3( 7, 3, 8),  // 9
        new THREE.Face3( 8, 3, 6),  // 10
        new THREE.Face3( 8, 6,10),  // 11
        new THREE.Face3( 6, 4,10),  // 12
        new THREE.Face3(10, 4, 9),  // 13
        new THREE.Face3( 9, 4, 5),  // 14
        new THREE.Face3(11, 7,12),  // 15
        new THREE.Face3(12, 7, 8),  // 16
        new THREE.Face3(12, 8,13),  // 17
        new THREE.Face3(13, 8,10),  // 18
        new THREE.Face3(13,10,14),  // 19
        new THREE.Face3(14,10, 9),  // 20
        new THREE.Face3(14, 9,11),  // 21
        new THREE.Face3(11, 9, 7),  // 22
        new THREE.Face3(15,11,12),  // 23
        new THREE.Face3(15,12,13),  // 24
        new THREE.Face3(15,13,14),  // 25
        new THREE.Face3(15,14,11),  // 26
        new THREE.Face3( 8, 7,16),  // 27
        new THREE.Face3( 9,10,17),  // 28
        new THREE.Face3( 6, 8,16),  // 29
        new THREE.Face3(10, 6,17),  // 30
        new THREE.Face3( 6,16, 3),  // 31
        new THREE.Face3( 4,17, 6),  // 32
        new THREE.Face3(16, 7, 3),  // 33
        new THREE.Face3(17, 4, 9),  // 34
        new THREE.Face3( 7,18,16),  // 35
        new THREE.Face3( 9,17,19),  // 36
        new THREE.Face3( 9,19, 4),  // 37
        new THREE.Face3( 3,18, 7),  // 38
        new THREE.Face3( 4,19,17),  // 39
        new THREE.Face3(16,18, 3),  // 40
        new THREE.Face3(21,23, 4),  // 41
        new THREE.Face3(22,20, 3),  // 42
        new THREE.Face3(23,21, 9),  // 43
        new THREE.Face3(20,22, 7),  // 44
        new THREE.Face3( 9, 4,23),  // 45
        new THREE.Face3( 3, 7,22)   // 46
    );
    
    arrowLightGeom.computeVertexNormals();
    
    for ( i = 0; i <= 46; i++) {
        arrowLightGeom.faces[i].vertexColors[1-1] = new THREE.Color(light);
        arrowLightGeom.faces[i].vertexColors[2-1] = new THREE.Color(light); 
        arrowLightGeom.faces[i].vertexColors[3-1] = new THREE.Color(light); 
    }
   
    arrowLightGeom.faces[ 7].vertexColors[1-1] = new THREE.Color(dark);
    arrowLightGeom.faces[ 8].vertexColors[1-1] = new THREE.Color(dark);
    arrowLightGeom.faces[14].vertexColors[3-1] = new THREE.Color(dark);
    arrowLightGeom.faces[11].vertexColors[2-1] = new THREE.Color(dark);
    arrowLightGeom.faces[29].vertexColors[1-1] = new THREE.Color(dark);
    arrowLightGeom.faces[30].vertexColors[2-1] = new THREE.Color(dark);
    
    arrowDarkGeom.computeVertexNormals();
    
    for ( i = 0; i <= 46; i++) {
        arrowDarkGeom.faces[i].vertexColors[1-1] = new THREE.Color(dark);
        arrowDarkGeom.faces[i].vertexColors[2-1] = new THREE.Color(dark); 
        arrowDarkGeom.faces[i].vertexColors[3-1] = new THREE.Color(dark); 
    }
    
    arrowDarkGeom.faces[ 7].vertexColors[1-1] = new THREE.Color(light);
    arrowDarkGeom.faces[ 8].vertexColors[1-1] = new THREE.Color(light);
    arrowDarkGeom.faces[14].vertexColors[3-1] = new THREE.Color(light);
    arrowDarkGeom.faces[11].vertexColors[2-1] = new THREE.Color(light);
    arrowDarkGeom.faces[29].vertexColors[1-1] = new THREE.Color(light);
    arrowDarkGeom.faces[30].vertexColors[2-1] = new THREE.Color(light);
};

function tChangeArrowGeometry(ω){
    let b_ = 3;                          // коэффициенты
    let a_ = 10 + b_;                    // коэффициенты
    let p11Y = a_-b_*Math.sin(ω*t);  // изменяемые точки
    let p12Y = a_-b_*Math.sin(ω*t);  // изменяемые точки
    let p13Y = a_-b_*Math.sin(ω*t);  // изменяемые точки
    let p14Y = a_-b_*Math.sin(ω*t);  // изменяемые точки
    let d_ = 1;                          // коэффициенты
    let c_ = 1 + d_;                     // коэффициенты
    let p11Z = c_ +d_*Math.sin(ω*t); // изменяемые точки
    let p12X = c_ +d_*Math.sin(ω*t); // изменяемые точки
    let p13Z =-c_ -d_*Math.sin(ω*t); // изменяемые точки
    let p14X =-c_ -d_*Math.sin(ω*t); // изменяемые точки
    let f_ = 7;                          // коэффициенты
    let e_ = 10 + f_;                    // коэффициенты
    let p15Y = e_+ f_*Math.sin(ω*t); // изменяемые точки 
                
    let tArrow =   
    [   0,   0,   0,  // 0
        0,  -7,  19,  // 1
        0,  -5,  -3,  // 2
       10,   0,   0,  // 3
      -10,   0,   0,  // 4
        0,   0,  40,  // 5
        0,  -7, -10,  // 6
        5,   5,   5,  // 7
        5,   5,  -5,  // 8
       -5,   5,   5,  // 9
       -5,   5,  -5,  //10
        0,p11Y, p11Z, //11
     p12X,p12Y,   0,  //12
        0,p13Y, p13Z, //13
     p14X,p14Y,   0,  //14
        0,p15Y,   0,  //15
       20,   0,  -7,  //16
      -20,   0,  -7,  //17
       23,   0,  -2,  //18
      -23,   0,  -2,  //19
        5,   0,  20,  //20
       -5,   0,  20,  //21
       10,   0,  15,  //22
      -10,   0,  15   //23
    ]; 

    let scale = 0.0038; 
    scale *= kScale;
    let up = +0.04;
      
    let tArrowLightGeom = new THREE.Geometry();
    for ( i = 0; i <=23; i++) {
        tArrowLightGeom.vertices.push(new THREE.Vector3
            (scale*tArrow[i*3+1-1],
             scale*tArrow[i*3+2-1]+up,
             scale*tArrow[i*3+3-1]-up));
        }
            
    let tArrowDarkGeom = new THREE.Geometry();
    for ( i = 0; i <=23; i++) {
        tArrowDarkGeom.vertices.push(new THREE.Vector3
            (scale*tArrow[i*3+1-1],
             scale*tArrow[i*3+2-1]+up,
             scale*tArrow[i*3+3-1]-up));
    }
            
    tArrowLightGeom.faces.push(
        new THREE.Face3( 0, 0, 0),  // 0 
        new THREE.Face3( 3, 1, 2),  // 1 
        new THREE.Face3( 2, 1, 4),  // 2
        new THREE.Face3( 1, 5, 4),  // 3
        new THREE.Face3( 3, 5, 1),  // 4
        new THREE.Face3( 4, 6, 2),  // 5
        new THREE.Face3( 2, 6, 3),  // 6
        new THREE.Face3( 5, 7, 9),  // 7
        new THREE.Face3( 5, 3, 7),  // 8
        new THREE.Face3( 7, 3, 8),  // 9
        new THREE.Face3( 8, 3, 6),  // 10
        new THREE.Face3( 8, 6,10),  // 11
        new THREE.Face3( 6, 4,10),  // 12
        new THREE.Face3(10, 4, 9),  // 13
        new THREE.Face3( 9, 4, 5),  // 14
        new THREE.Face3(11, 7,12),  // 15
        new THREE.Face3(12, 7, 8),  // 16
        new THREE.Face3(12, 8,13),  // 17
        new THREE.Face3(13, 8,10),  // 18
        new THREE.Face3(13,10,14),  // 19
        new THREE.Face3(14,10, 9),  // 20
        new THREE.Face3(14, 9,11),  // 21
        new THREE.Face3(11, 9, 7),  // 22
        new THREE.Face3(15,11,12),  // 23
        new THREE.Face3(15,12,13),  // 24
        new THREE.Face3(15,13,14),  // 25
        new THREE.Face3(15,14,11),  // 26
        new THREE.Face3( 8, 7,16),  // 27
        new THREE.Face3( 9,10,17),  // 28
        new THREE.Face3( 6, 8,16),  // 29
        new THREE.Face3(10, 6,17),  // 30
        new THREE.Face3( 6,16, 3),  // 31
        new THREE.Face3( 4,17, 6),  // 32
        new THREE.Face3(16, 7, 3),  // 33
        new THREE.Face3(17, 4, 9),  // 34
        new THREE.Face3( 7,18,16),  // 35
        new THREE.Face3( 9,17,19),  // 36
        new THREE.Face3( 9,19, 4),  // 37
        new THREE.Face3( 3,18, 7),  // 38
        new THREE.Face3( 4,19,17),  // 39
        new THREE.Face3(16,18, 3),  // 40
        new THREE.Face3(21,23, 4),  // 41
        new THREE.Face3(22,20, 3),  // 42
        new THREE.Face3(23,21, 9),  // 43
        new THREE.Face3(20,22, 7),  // 44
        new THREE.Face3( 9, 4,23),  // 45
        new THREE.Face3( 3, 7,22)   // 46
    );
            
    tArrowDarkGeom.faces.push(
        new THREE.Face3( 0, 0, 0),  // 0 
        new THREE.Face3( 3, 1, 2),  // 1 
        new THREE.Face3( 2, 1, 4),  // 2
        new THREE.Face3( 1, 5, 4),  // 3
        new THREE.Face3( 3, 5, 1),  // 4
        new THREE.Face3( 4, 6, 2),  // 5
        new THREE.Face3( 2, 6, 3),  // 6
        new THREE.Face3( 5, 7, 9),  // 7
        new THREE.Face3( 5, 3, 7),  // 8
        new THREE.Face3( 7, 3, 8),  // 9
        new THREE.Face3( 8, 3, 6),  // 10
        new THREE.Face3( 8, 6,10),  // 11
        new THREE.Face3( 6, 4,10),  // 12
        new THREE.Face3(10, 4, 9),  // 13
        new THREE.Face3( 9, 4, 5),  // 14
        new THREE.Face3(11, 7,12),  // 15
        new THREE.Face3(12, 7, 8),  // 16
        new THREE.Face3(12, 8,13),  // 17
        new THREE.Face3(13, 8,10),  // 18
        new THREE.Face3(13,10,14),  // 19
        new THREE.Face3(14,10, 9),  // 20
        new THREE.Face3(14, 9,11),  // 21
        new THREE.Face3(11, 9, 7),  // 22
        new THREE.Face3(15,11,12),  // 23
        new THREE.Face3(15,12,13),  // 24
        new THREE.Face3(15,13,14),  // 25
        new THREE.Face3(15,14,11),  // 26
        new THREE.Face3( 8, 7,16),  // 27
        new THREE.Face3( 9,10,17),  // 28
        new THREE.Face3( 6, 8,16),  // 29
        new THREE.Face3(10, 6,17),  // 30
        new THREE.Face3( 6,16, 3),  // 31
        new THREE.Face3( 4,17, 6),  // 32
        new THREE.Face3(16, 7, 3),  // 33
        new THREE.Face3(17, 4, 9),  // 34
        new THREE.Face3( 7,18,16),  // 35
        new THREE.Face3( 9,17,19),  // 36
        new THREE.Face3( 9,19, 4),  // 37
        new THREE.Face3( 3,18, 7),  // 38
        new THREE.Face3( 4,19,17),  // 39
        new THREE.Face3(16,18, 3),  // 40
        new THREE.Face3(21,23, 4),  // 41
        new THREE.Face3(22,20, 3),  // 42
        new THREE.Face3(23,21, 9),  // 43
        new THREE.Face3(20,22, 7),  // 44
        new THREE.Face3( 9, 4,23),  // 45
        new THREE.Face3( 3, 7,22)   // 46
    );
            
    tArrowLightGeom.computeVertexNormals();
    tArrowDarkGeom.computeVertexNormals();
            
    for ( i = 0; i <= 46; i++) {
        tArrowLightGeom.faces[i].vertexColors[1-1] = new THREE.Color(light);
        tArrowLightGeom.faces[i].vertexColors[2-1] = new THREE.Color(light); 
        tArrowLightGeom.faces[i].vertexColors[3-1] = new THREE.Color(light); 
    }
           
    tArrowLightGeom.faces[ 7].vertexColors[1-1] = new THREE.Color(dark);
    tArrowLightGeom.faces[ 8].vertexColors[1-1] = new THREE.Color(dark);
    tArrowLightGeom.faces[14].vertexColors[3-1] = new THREE.Color(dark);
    tArrowLightGeom.faces[11].vertexColors[2-1] = new THREE.Color(dark);
    tArrowLightGeom.faces[29].vertexColors[1-1] = new THREE.Color(dark);
    tArrowLightGeom.faces[30].vertexColors[2-1] = new THREE.Color(dark);
            
    for ( i = 0; i <= 46; i++) {
        tArrowDarkGeom.faces[i].vertexColors[1-1] = new THREE.Color(dark);
        tArrowDarkGeom.faces[i].vertexColors[2-1] = new THREE.Color(dark); 
        tArrowDarkGeom.faces[i].vertexColors[3-1] = new THREE.Color(dark); 
    }
            
    tArrowDarkGeom.faces[ 7].vertexColors[1-1] = new THREE.Color(light);
    tArrowDarkGeom.faces[ 8].vertexColors[1-1] = new THREE.Color(light);
    tArrowDarkGeom.faces[14].vertexColors[3-1] = new THREE.Color(light);
    tArrowDarkGeom.faces[11].vertexColors[2-1] = new THREE.Color(light);
    tArrowDarkGeom.faces[29].vertexColors[1-1] = new THREE.Color(light);
    tArrowDarkGeom.faces[30].vertexColors[2-1] = new THREE.Color(light);
            
    for ( i = 17; i <= 26; i++) {
        unit[i].geometry = tArrowLightGeom;
    }
            
    for ( i = 43; i <= 52; i++) {
        unit[i].geometry = tArrowDarkGeom;
    }
}

axeGeometry = () => {
    let axeVert =   
    [  0,   0,   0,  // 0
      -3,   0,  14,  // 1
       3,   0,  14,  // 2
      -2,   1,  13,  // 3
       2,   1,  13,  // 4
      -6,   2,   7,  // 5
       6,   2,   7,  // 6
      -4,   4,   5,  // 7
       4,   4,   5,  // 8
      -7,   0,   4,  // 9
       7,   0,   4,  // 10
      -7,   2,   2,  // 11
       7,   2,   2,  // 12
      -5,   4,  -4,  // 13
       5,   4,  -4,  // 14
      -1,   4,  -6,  // 15
       1,   4,  -6,  // 16
      -1,   6,  -1,  // 17
       1,   6,  -1,  // 18
      -1,   6,   1,  // 19
       1,   6,   1,  // 20 
      -3,   1,   5,  // 21
       3,   1,   5,  // 22
       0,   0,   7,  // 23
       0,   4,  -4,  // 24
       0,   4,  -7,  // 25
       3,   2,  -6,  // 26
      -3,   2,  -6,  // 27
     0.5, 6.5,   0,  // 28
       0,   7,-0.5,  // 29
    -0.5, 6.5,   0,  // 30
       0,   7, 0.5   // 31 
    ];
                    
    let scale = 0.01; 
    scale *= kScale;
    let up = +0.04; 
    let delta = -0.03;
  
    axeLightGeom = new THREE.Geometry();
    for ( i = 0; i <=31; i++) {
        axeLightGeom.vertices.push(new THREE.Vector3
            (scale*axeVert[i*3+1-1],
             scale*axeVert[i*3+2-1]+up,
             scale*axeVert[i*3+3-1]+delta));
    }
    
    axeDarkGeom = new THREE.Geometry();
    for ( i = 0; i <=31; i++) {
        axeDarkGeom.vertices.push(new THREE.Vector3
            (scale*axeVert[i*3+1-1],
             scale*axeVert[i*3+2-1]+up,
             scale*axeVert[i*3+3-1]+delta));
    }
        
    axeLightGeom.faces.push(
        new THREE.Face3( 0, 0, 0),  // 0 
        new THREE.Face3( 1, 3, 5),  // 1 
        new THREE.Face3( 2, 6, 4),  // 2
        new THREE.Face3( 3, 7, 5),  // 3
        new THREE.Face3( 4, 6, 8),  // 4
        new THREE.Face3( 5, 7, 9),  // 5
        new THREE.Face3( 6,10, 8),  // 6
        new THREE.Face3( 9, 7,11),  // 7
        new THREE.Face3( 8,10,12),  // 8
        new THREE.Face3(11, 7,13),  // 9
        new THREE.Face3( 8,12,14),  // 10
        new THREE.Face3(13,17,15),  // 11
        new THREE.Face3(16,18,14),  // 12
        new THREE.Face3(19,17,13),  // 13
        new THREE.Face3(20,14,18),  // 14
        new THREE.Face3( 7,19,13),  // 15
        new THREE.Face3( 8,14,20),  // 16
        new THREE.Face3( 7,21,19),  // 17
        new THREE.Face3( 8,20,22),  // 18
        new THREE.Face3(21,23,19),  // 19
        new THREE.Face3(23,22,20),  // 20
        new THREE.Face3(23,20,19),  // 21
        new THREE.Face3(17,18,24),  // 22
        new THREE.Face3(17,24,15),  // 23
        new THREE.Face3(18,16,24),  // 24
        new THREE.Face3(15,24,25),  // 25
        new THREE.Face3(16,25,24),  // 26
        new THREE.Face3(15,25,27),  // 27
        new THREE.Face3(16,26,25),  // 28
        new THREE.Face3(19,20,31),  // 29
        new THREE.Face3(20,18,28),  // 30
        new THREE.Face3(18,17,29),  // 31
        new THREE.Face3(30,17,19),  // 32
        new THREE.Face3(31,29,30),  // 33
        new THREE.Face3(31,28,29),  // 34
        new THREE.Face3(31,20,28),  // 35
        new THREE.Face3(28,18,29),  // 36
        new THREE.Face3(29,17,30),  // 37
        new THREE.Face3(31,30,19),  // 38
        new THREE.Face3(27,26,23),  // 39
        new THREE.Face3( 9,27,21),  // 40
        new THREE.Face3(10,22,26),  // 41
        new THREE.Face3( 9,13,27),  // 42
        new THREE.Face3(10,26,14),  // 43
        new THREE.Face3(13,15,27),  // 44
        new THREE.Face3(14,26,16),  // 45
        new THREE.Face3( 9,11,13),  // 46
        new THREE.Face3(10,14,12),  // 47
        new THREE.Face3( 3,21, 7),  // 48
        new THREE.Face3( 4, 8,22),  // 49
        new THREE.Face3( 1, 9, 7),  // 50
        new THREE.Face3( 2, 8,10),  // 51
        new THREE.Face3( 1, 5, 9),  // 52
        new THREE.Face3( 2,10, 6),  // 53
        new THREE.Face3(23,21,22),  // 54
        new THREE.Face3(21,27,23),  // 55
        new THREE.Face3(23,26,22),  // 56
        new THREE.Face3( 1,21, 3),  // 57
        new THREE.Face3( 2, 4,22),  // 58
        new THREE.Face3( 1, 9,21),  // 59
        new THREE.Face3( 2,22,10),  // 60
        new THREE.Face3(27,25,26)   // 61
    );
    
    axeDarkGeom.faces.push(
        new THREE.Face3( 0, 0, 0),  // 0 
        new THREE.Face3( 1, 3, 5),  // 1 
        new THREE.Face3( 2, 6, 4),  // 2
        new THREE.Face3( 3, 7, 5),  // 3
        new THREE.Face3( 4, 6, 8),  // 4
        new THREE.Face3( 5, 7, 9),  // 5
        new THREE.Face3( 6,10, 8),  // 6
        new THREE.Face3( 9, 7,11),  // 7
        new THREE.Face3( 8,10,12),  // 8
        new THREE.Face3(11, 7,13),  // 9
        new THREE.Face3( 8,12,14),  // 10
        new THREE.Face3(13,17,15),  // 11
        new THREE.Face3(16,18,14),  // 12
        new THREE.Face3(19,17,13),  // 13
        new THREE.Face3(20,14,18),  // 14
        new THREE.Face3( 7,19,13),  // 15
        new THREE.Face3( 8,14,20),  // 16
        new THREE.Face3( 7,21,19),  // 17
        new THREE.Face3( 8,20,22),  // 18
        new THREE.Face3(21,23,19),  // 19
        new THREE.Face3(23,22,20),  // 20
        new THREE.Face3(23,20,19),  // 21
        new THREE.Face3(17,18,24),  // 22
        new THREE.Face3(17,24,15),  // 23
        new THREE.Face3(18,16,24),  // 24
        new THREE.Face3(15,24,25),  // 25
        new THREE.Face3(16,25,24),  // 26
        new THREE.Face3(15,25,27),  // 27
        new THREE.Face3(16,26,25),  // 28
        new THREE.Face3(19,20,31),  // 29
        new THREE.Face3(20,18,28),  // 30
        new THREE.Face3(18,17,29),  // 31
        new THREE.Face3(30,17,19),  // 32
        new THREE.Face3(31,29,30),  // 33
        new THREE.Face3(31,28,29),  // 34
        new THREE.Face3(31,20,28),  // 35
        new THREE.Face3(28,18,29),  // 36
        new THREE.Face3(29,17,30),  // 37
        new THREE.Face3(31,30,19),  // 38
        new THREE.Face3(27,26,23),  // 39
        new THREE.Face3( 9,27,21),  // 40
        new THREE.Face3(10,22,26),  // 41
        new THREE.Face3( 9,13,27),  // 42
        new THREE.Face3(10,26,14),  // 43
        new THREE.Face3(13,15,27),  // 44
        new THREE.Face3(14,26,16),  // 45
        new THREE.Face3( 9,11,13),  // 46
        new THREE.Face3(10,14,12),  // 47
        new THREE.Face3( 3,21, 7),  // 48
        new THREE.Face3( 4, 8,22),  // 49
        new THREE.Face3( 1, 9, 7),  // 50
        new THREE.Face3( 2, 8,10),  // 51
        new THREE.Face3( 1, 5, 9),  // 52
        new THREE.Face3( 2,10, 6),  // 53
        new THREE.Face3(23,21,22),  // 54
        new THREE.Face3(21,27,23),  // 55
        new THREE.Face3(23,26,22),  // 56
        new THREE.Face3( 1,21, 3),  // 57
        new THREE.Face3( 2, 4,22),  // 58
        new THREE.Face3( 1, 9,21),  // 59
        new THREE.Face3( 2,22,10),  // 60
        new THREE.Face3(27,25,26)   // 61
    );
    
    axeLightGeom.computeVertexNormals();
    
    for ( i = 0; i <= 61; i++) {
        axeLightGeom.faces[i].vertexColors[1-1] = new THREE.Color(light);
        axeLightGeom.faces[i].vertexColors[2-1] = new THREE.Color(light); 
        axeLightGeom.faces[i].vertexColors[3-1] = new THREE.Color(light); 
    }
    
    axeLightGeom.faces[ 1].vertexColors[1-1] = new THREE.Color(dark);
    axeLightGeom.faces[ 1].vertexColors[2-1] = new THREE.Color(dark);
    axeLightGeom.faces[ 2].vertexColors[1-1] = new THREE.Color(dark);
    axeLightGeom.faces[ 2].vertexColors[3-1] = new THREE.Color(dark);
    axeLightGeom.faces[19].vertexColors[2-1] = new THREE.Color(dark);
    axeLightGeom.faces[20].vertexColors[1-1] = new THREE.Color(dark);
    axeLightGeom.faces[21].vertexColors[1-1] = new THREE.Color(dark);
    axeLightGeom.faces[27].vertexColors[2-1] = new THREE.Color(dark);
    axeLightGeom.faces[27].vertexColors[3-1] = new THREE.Color(dark);
    axeLightGeom.faces[28].vertexColors[2-1] = new THREE.Color(dark);
    axeLightGeom.faces[28].vertexColors[3-1] = new THREE.Color(dark);
    axeLightGeom.faces[25].vertexColors[3-1] = new THREE.Color(dark);
    axeLightGeom.faces[26].vertexColors[2-1] = new THREE.Color(dark);
    
    axeDarkGeom.computeVertexNormals();
    
    for ( i = 0; i <= 61; i++) {
        axeDarkGeom.faces[i].vertexColors[1-1] = new THREE.Color(dark);
        axeDarkGeom.faces[i].vertexColors[2-1] = new THREE.Color(dark); 
        axeDarkGeom.faces[i].vertexColors[3-1] = new THREE.Color(dark); 
    }
    
    axeDarkGeom.faces[ 1].vertexColors[1-1] = new THREE.Color(light);
    axeDarkGeom.faces[ 1].vertexColors[2-1] = new THREE.Color(light);
    axeDarkGeom.faces[ 2].vertexColors[1-1] = new THREE.Color(light);
    axeDarkGeom.faces[ 2].vertexColors[3-1] = new THREE.Color(light);
    axeDarkGeom.faces[19].vertexColors[2-1] = new THREE.Color(light);
    axeDarkGeom.faces[20].vertexColors[1-1] = new THREE.Color(light);
    axeDarkGeom.faces[21].vertexColors[1-1] = new THREE.Color(light);
    axeDarkGeom.faces[27].vertexColors[2-1] = new THREE.Color(light);
    axeDarkGeom.faces[27].vertexColors[3-1] = new THREE.Color(light);
    axeDarkGeom.faces[28].vertexColors[2-1] = new THREE.Color(light);
    axeDarkGeom.faces[28].vertexColors[3-1] = new THREE.Color(light);
    axeDarkGeom.faces[25].vertexColors[3-1] = new THREE.Color(light);
    axeDarkGeom.faces[26].vertexColors[2-1] = new THREE.Color(light);
};

dartGeometry = () => {
    let dartVert =  
    [  0,    0,    0,  // 0
       0,    7,    0,  // 1
       0,  3.5, 0.75,  // 2
       0,  0.5, 1.10,  // 3
       0, -2.0,    0,  // 4
    0.25,  4.5, 0.25,  // 5
   -0.25,  4.5, 0.25,  // 6
    0.75,  3.5,    0,  // 7
   -0.75,  3.5,    0,  // 8
    0.55,  2.5, 0.55,  // 9
   -0.55,  2.5, 0.55,  // 10
       1,    0, 0.45,  // 11
      -1,    0, 0.45,  // 12
    0.50,   -1, 0.50,  // 13
   -0.50,   -1, 0.50,  // 14
       2,    3, 0.25,  // 15
      -2,    3, 0.25,  // 16
     2.5,    4, 0.00,  // 17
    -2.5,    4, 0.00,  // 18
     2.5,    1, 0.00,  // 19
    -2.5,    1, 0.00,  // 20
       1,    2, 0.65,  // 21
      -1,    2, 0.65,  // 22 
    0.25,  4.5,-0.25,  // 23
   -0.25,  4.5,-0.25,  // 24
    0.75,  3.5,    0,  // 25
   -0.75,  3.5,    0,  // 26
       0,  3.5,-0.75,  // 27
    0.55,  2.5,-0.55,  // 28
   -0.55,  2.5,-0.55,  // 29
       0,  3.5,-0.75,  // 30
    0.55,  2.5,-0.55,  // 31
   -0.55,  2.5,-0.55,  // 32
       1,    2,-0.65,  // 33
      -1,    2,-0.65,  // 34
       1,    0,-0.45,  // 35
      -1,    0,-0.45,  // 36
     2.5,    4,-0.00,  // 37
    -2.5,    4,-0.00,  // 38
     2.5,    1,-0.00,  // 39
    -2.5,    1,-0.00,  // 40
       2,    3,-0.25,  // 41
      -2,    3,-0.25,  // 42
    ];
                  
    let scale  =  0.023; 
    scale *= kScale;
    let up     = +0.040;
    let back   = -0.070;
    const nPoints    = 42; 
    const nTriangles = 66;
    
    dartLightGeom = new THREE.Geometry();
    for ( i = 0; i <= nPoints; i++) {
        dartLightGeom.vertices.push(new THREE.Vector3
            (scale*dartVert[i*3+1-1]+0,
             scale*dartVert[i*3+2-1]+0,
             scale*dartVert[i*3+3-1]+0));
    }
    
    dartDarkGeom = new THREE.Geometry();
    for ( i = 0; i <= nPoints; i++) {
        dartDarkGeom.vertices.push(new THREE.Vector3
            (scale*dartVert[i*3+1-1]+0,
             scale*dartVert[i*3+2-1]+0,
             scale*dartVert[i*3+3-1]+0));
    }
        
    dartLightGeom.faces.push(
        new THREE.Face3( 0, 0, 0),  // 0 
        new THREE.Face3( 1, 2, 5),  // 1
        new THREE.Face3( 1, 6, 2),  // 2
        new THREE.Face3( 1, 5, 7),  // 3
        new THREE.Face3( 1, 8, 6),  // 4
        new THREE.Face3( 5, 9, 7),  // 5
        new THREE.Face3( 6, 8,10),  // 6
        new THREE.Face3( 5, 2, 9),  // 7
        new THREE.Face3( 6,10, 2),  // 8
        new THREE.Face3( 2,10, 3),  // 9
        new THREE.Face3( 2, 3, 9),  //10 
        new THREE.Face3(10,22, 3),  //11
        new THREE.Face3( 9, 3,21),  //12
        new THREE.Face3(22,12, 3),  //13
        new THREE.Face3(21, 3,11),  //14
        new THREE.Face3(16,12,22),  //15
        new THREE.Face3(15,21,11),  //16
        new THREE.Face3(16,20,12),  //17
        new THREE.Face3(15,11,19),  //18
        new THREE.Face3(18,20,16),  //19
        new THREE.Face3(17,15,19),  //20
        new THREE.Face3(12,14, 3),  //21
        new THREE.Face3(11, 3,13),  //22
        new THREE.Face3( 3,14, 4),  //23
        new THREE.Face3( 3, 4,13),  //24
        new THREE.Face3( 1, 7,23),  //25
        new THREE.Face3( 1,24, 8),  //26
        new THREE.Face3( 1,23,27),  //27
        new THREE.Face3( 1,27,24),  //28
        new THREE.Face3(23, 7,31),  //29
        new THREE.Face3(24,32, 8),  //30
        new THREE.Face3(31,30,23),  //31
        new THREE.Face3(32,24,30),  //32
        new THREE.Face3(31, 4,32),  //33
        new THREE.Face3(30,31,32),  //34
        new THREE.Face3(13, 4,31),  //35
        new THREE.Face3(14,32, 4),  //36
        new THREE.Face3( 7, 9,21),  //37
        new THREE.Face3( 8,22,10),  //38
        new THREE.Face3(33,31,21),  //39
        new THREE.Face3(31, 7,21),  //40
        new THREE.Face3(34,22,32),  //41
        new THREE.Face3(32,22, 8),  //42
        new THREE.Face3(37,39,41),  //43
        new THREE.Face3(39,35,41),  //44
        new THREE.Face3(38,42,40),  //45
        new THREE.Face3(40,42,36),  //46
        new THREE.Face3(33,41,35),  //47
        new THREE.Face3(34,36,42),  //48
        new THREE.Face3(33,35,31),  //49
        new THREE.Face3(34,32,36),  //50
        new THREE.Face3(35,13,31),  //51
        new THREE.Face3(36,32,14),  //52
        new THREE.Face3(11,35,39),  //53
        new THREE.Face3(12,40,36),  //54
        new THREE.Face3(39,19,11),  //55
        new THREE.Face3(40,12,20),  //56
        new THREE.Face3(11,13,35),  //57
        new THREE.Face3(12,36,14),  //58
        new THREE.Face3(17,37,15),  //59
        new THREE.Face3(18,16,38),  //60
        new THREE.Face3(15,37,41),  //61
        new THREE.Face3(16,42,38),  //62
        new THREE.Face3(15,41,33),  //63
        new THREE.Face3(16,34,42),  //64
        new THREE.Face3(15,33,21),  //65
        new THREE.Face3(16,22,34)   //66
    );
    
    dartDarkGeom.faces.push(
        new THREE.Face3( 0, 0, 0),  // 0 
        new THREE.Face3( 1, 2, 5),  // 1
        new THREE.Face3( 1, 6, 2),  // 2
        new THREE.Face3( 1, 5, 7),  // 3
        new THREE.Face3( 1, 8, 6),  // 4
        new THREE.Face3( 5, 9, 7),  // 5
        new THREE.Face3( 6, 8,10),  // 6
        new THREE.Face3( 5, 2, 9),  // 7
        new THREE.Face3( 6,10, 2),  // 8
        new THREE.Face3( 2,10, 3),  // 9
        new THREE.Face3( 2, 3, 9),  //10 
        new THREE.Face3(10,22, 3),  //11
        new THREE.Face3( 9, 3,21),  //12
        new THREE.Face3(22,12, 3),  //13
        new THREE.Face3(21, 3,11),  //14
        new THREE.Face3(16,12,22),  //15
        new THREE.Face3(15,21,11),  //16
        new THREE.Face3(16,20,12),  //17
        new THREE.Face3(15,11,19),  //18
        new THREE.Face3(18,20,16),  //19
        new THREE.Face3(17,15,19),  //20
        new THREE.Face3(12,14, 3),  //21
        new THREE.Face3(11, 3,13),  //22
        new THREE.Face3( 3,14, 4),  //23
        new THREE.Face3( 3, 4,13),  //24
        new THREE.Face3( 1, 7,23),  //25
        new THREE.Face3( 1,24, 8),  //26
        new THREE.Face3( 1,23,27),  //27
        new THREE.Face3( 1,27,24),  //28
        new THREE.Face3(23, 7,31),  //29
        new THREE.Face3(24,32, 8),  //30
        new THREE.Face3(31,30,23),  //31
        new THREE.Face3(32,24,30),  //32
        new THREE.Face3(31, 4,32),  //33
        new THREE.Face3(30,31,32),  //34
        new THREE.Face3(13, 4,31),  //35
        new THREE.Face3(14,32, 4),  //36
        new THREE.Face3( 7, 9,21),  //37
        new THREE.Face3( 8,22,10),  //38
        new THREE.Face3(33,31,21),  //39
        new THREE.Face3(31, 7,21),  //40
        new THREE.Face3(34,22,32),  //41
        new THREE.Face3(32,22, 8),  //42
        new THREE.Face3(37,39,41),  //43
        new THREE.Face3(39,35,41),  //44
        new THREE.Face3(38,42,40),  //45
        new THREE.Face3(40,42,36),  //46
        new THREE.Face3(33,41,35),  //47
        new THREE.Face3(34,36,42),  //48
        new THREE.Face3(33,35,31),  //49
        new THREE.Face3(34,32,36),  //50
        new THREE.Face3(35,13,31),  //51
        new THREE.Face3(36,32,14),  //52
        new THREE.Face3(11,35,39),  //53
        new THREE.Face3(12,40,36),  //54
        new THREE.Face3(39,19,11),  //55
        new THREE.Face3(40,12,20),  //56
        new THREE.Face3(11,13,35),  //57
        new THREE.Face3(12,36,14),  //58
        new THREE.Face3(17,37,15),  //59
        new THREE.Face3(18,16,38),  //60
        new THREE.Face3(15,37,41),  //61
        new THREE.Face3(16,42,38),  //62
        new THREE.Face3(15,41,33),  //63
        new THREE.Face3(16,34,42),  //64
        new THREE.Face3(15,33,21),  //65
        new THREE.Face3(16,22,34)   //66
    );
  
    dartLightGeom.computeVertexNormals();
    
    for ( i = 0; i <=nTriangles; i++) {
        dartLightGeom.faces[i].vertexColors[1-1] = new THREE.Color(light);
        dartLightGeom.faces[i].vertexColors[2-1] = new THREE.Color(light); 
        dartLightGeom.faces[i].vertexColors[3-1] = new THREE.Color(light); 
    }
    
    dartLightGeom.faces[ 1].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[ 2].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[ 3].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[ 4].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[20].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[20].vertexColors[2-1] = new THREE.Color(dark);
    dartLightGeom.faces[19].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[19].vertexColors[3-1] = new THREE.Color(dark);
    dartLightGeom.faces[18].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[17].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[16].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[15].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[25].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[26].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[27].vertexColors[1-1] = new THREE.Color(dark);
    dartLightGeom.faces[28].vertexColors[1-1] = new THREE.Color(dark);
    
    dartDarkGeom.computeVertexNormals();
    
    for ( i = 0; i <=nTriangles; i++) {
        dartDarkGeom.faces[i].vertexColors[1-1] = new THREE.Color(dark);
        dartDarkGeom.faces[i].vertexColors[2-1] = new THREE.Color(dark); 
        dartDarkGeom.faces[i].vertexColors[3-1] = new THREE.Color(dark); 
    }
    
    dartDarkGeom.faces[ 1].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[ 2].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[ 3].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[ 4].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[20].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[20].vertexColors[2-1] = new THREE.Color(light);
    dartDarkGeom.faces[19].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[19].vertexColors[3-1] = new THREE.Color(light);
    dartDarkGeom.faces[18].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[17].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[16].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[15].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[25].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[26].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[27].vertexColors[1-1] = new THREE.Color(light);
    dartDarkGeom.faces[28].vertexColors[1-1] = new THREE.Color(light);

    let cylDarkGeom  = new THREE.CylinderGeometry(0.03*scale, 0.25*scale, 10.0*scale, 4);
    let cylLightGeom = new THREE.CylinderGeometry(0.03*scale, 0.25*scale, 10.0*scale, 4);
    
    cylDarkGeom. computeVertexNormals();
    cylLightGeom.computeVertexNormals();
   
    // раскраска КОНЧИКОВ конусов на крыльях //  "-1"  иначе ошибка 
    for ( i = 0; (i <=  cylDarkGeom.faces.length-1) && (i <= cylLightGeom.faces.length-1); i++) {
        let point_A_Dark  = cylDarkGeom. faces[i].a;
        let point_B_Dark  = cylDarkGeom. faces[i].b; 
        let point_C_Dark  = cylDarkGeom. faces[i].c;
        let point_A_Light = cylLightGeom.faces[i].a;
        let point_B_Light = cylLightGeom.faces[i].b; 
        let point_C_Light = cylLightGeom.faces[i].c;
        let xA_Dark = cylDarkGeom. vertices [point_A_Dark].x;
        let yA_Dark = cylDarkGeom. vertices [point_A_Dark].y;
        let zA_Dark = cylDarkGeom. vertices [point_A_Dark].z;
        let xB_Dark = cylDarkGeom. vertices [point_B_Dark].x;
        let yB_Dark = cylDarkGeom. vertices [point_B_Dark].y;
        let zB_Dark = cylDarkGeom. vertices [point_B_Dark].z;
        let xC_Dark = cylDarkGeom. vertices [point_C_Dark].x;
        let yC_Dark = cylDarkGeom. vertices [point_C_Dark].y;
        let zC_Dark = cylDarkGeom. vertices [point_C_Dark].z;
        let xA_Light= cylLightGeom.vertices[point_A_Light].x;
        let yA_Light= cylLightGeom.vertices[point_A_Light].y;
        let zA_Light= cylLightGeom.vertices[point_A_Light].z;
        let xB_Light= cylLightGeom.vertices[point_B_Light].x;
        let yB_Light= cylLightGeom.vertices[point_B_Light].y;
        let zB_Light= cylLightGeom.vertices[point_B_Light].z;
        let xC_Light= cylLightGeom.vertices[point_C_Light].x;
        let yC_Light= cylLightGeom.vertices[point_C_Light].y;
        let zC_Light= cylLightGeom.vertices[point_C_Light].z;
        
        if (yA_Dark  >  0) {cylDarkGeom.faces[i]. vertexColors[1-1] = new THREE.Color(light)} 
        if (yA_Dark  <= 0) {cylDarkGeom.faces[i]. vertexColors[1-1] = new THREE.Color(dark)}
        if (yB_Dark  >  0) {cylDarkGeom.faces[i]. vertexColors[2-1] = new THREE.Color(light)} 
        if (yB_Dark  <= 0) {cylDarkGeom.faces[i]. vertexColors[2-1] = new THREE.Color(dark)}
        if (yC_Dark  >  0) {cylDarkGeom.faces[i]. vertexColors[3-1] = new THREE.Color(light)}
        if (yC_Dark  <= 0) {cylDarkGeom.faces[i]. vertexColors[3-1] = new THREE.Color(dark)}
        if (yA_Light >  0) {cylLightGeom.faces[i].vertexColors[1-1] = new THREE.Color(dark)} 
        if (yA_Light <= 0) {cylLightGeom.faces[i].vertexColors[1-1] = new THREE.Color(light)}
        if (yB_Light >  0) {cylLightGeom.faces[i].vertexColors[2-1] = new THREE.Color(dark)} 
        if (yB_Light <= 0) {cylLightGeom.faces[i].vertexColors[2-1] = new THREE.Color(light)}
        if (yC_Light >  0) {cylLightGeom.faces[i].vertexColors[3-1] = new THREE.Color(dark)}
        if (yC_Light <= 0) {cylLightGeom.faces[i].vertexColors[3-1] = new THREE.Color(light)}
    }
    
    dartLightGeom = changeDartGeometry(dartLightGeom, cylLightGeom);        // корректировка геометрии ДРОТИКОВ
    dartDarkGeom  = changeDartGeometry(dartDarkGeom,  cylDarkGeom );        // корректировка геометрии ДРОТИКОВ
};    
    
function changeDartGeometry(drtGeom, cylGeom) {  // корректировка геометрии ДРОТИКОВ
    let geomScale = 0.050;
    geomScale *= kScale;
    let sglGeom =  new THREE.Geometry();
    let drtMesh  = new THREE.Mesh(drtGeom);
    let cyl1Mesh = new THREE.Mesh(cylGeom); //  берётся  из файла triang
    let cyl2Mesh = new THREE.Mesh(cylGeom); //  берётся  из файла triang
    cyl1Mesh.position.x =+1.1*geomScale;
    cyl1Mesh.position.y = geomScale;
    cyl2Mesh.position.x =-1.1*geomScale;
    cyl2Mesh.position.y = geomScale;
    rotateAroundObjectAxis(cyl1Mesh, new THREE.Vector3(1,0,0), rad( 90));
    rotateAroundObjectAxis(cyl2Mesh, new THREE.Vector3(1,0,0), rad( 90));
    drtMesh.position.y += geomScale;
    drtMesh.position.z -= 0.07;
    rotateAroundObjectAxis( drtMesh, new THREE.Vector3(1,0,0), rad( 90));
    cyl1Mesh.updateMatrix(); // as needed
    cyl2Mesh.updateMatrix(); // as needed
    drtMesh.updateMatrix();  // as needed
    sglGeom.merge( drtMesh.geometry,  drtMesh.matrix);
    sglGeom.merge(cyl1Mesh.geometry, cyl1Mesh.matrix);
    sglGeom.merge(cyl2Mesh.geometry, cyl2Mesh.matrix);
        
    return sglGeom;
}

helmGeometry = () => {
    const nIcoPoints    = 272;
    const nIcoTriangles = (nIcoPoints - 2)*2; 
    const p = [0, 12, 32, 92];
                
    let scale = 0.06; 
    scale *= kScale;
    let up = 0.0;
    let c0 = 1.0;
    let w0 = 0.10;
    let w1 = c0 + 1*w0;
    let w2 = c0 + 3*w0;
    let w3 = c0 + 5*w0;
  
    helmLightGeom = new THREE.Geometry();
    for (i = 0; i <=nIcoPoints; i++) {
        helmLightGeom.vertices.push(new THREE.Vector3
            (scale*icoVertices[i*3+1-1],
             scale*icoVertices[i*3+2-1]+up,
             scale*icoVertices[i*3+3-1]));
    }
    
    helmDarkGeom = new THREE.Geometry();
    for (i = 0; i <=nIcoPoints; i++) {
        helmDarkGeom.vertices.push(new THREE.Vector3
            (scale*icoVertices[i*3+1-1],
             scale*icoVertices[i*3+2-1]+up,
             scale*icoVertices[i*3+3-1]));
    }
    
    let helmColors = [0x000000, 
                  dark,  light,  light, 
                  light,  dark,  dark];
     
    for (i = 1; i <= nIcoTriangles; i++) {
            helmLightGeom.faces.push( 
            new THREE.Face3(icoFaces[i*3-1+ 1],
                            icoFaces[i*3-1+ 2],
                            icoFaces[i*3-1+ 3]));  
            helmDarkGeom.faces.push( 
            new THREE.Face3(icoFaces[i*3-1+ 1],
                            icoFaces[i*3-1+ 2],
                            icoFaces[i*3-1+ 3]));  
    }
    
    helmLightGeom.computeVertexNormals();
    helmDarkGeom. computeVertexNormals();
    let helmGeoms   = [null, helmLightGeom, helmDarkGeom];
        
    for ( j = 1; j <= 2; j++) {
        for ( i = 1; i <= nIcoTriangles; i++) {
            for ( k = 1; k <= 3; k++) {
                if (icoFaces[i*3-1 +1] > p[k-1] && icoFaces[i*3-1 +1] <= p[k]) {
                    helmGeoms[j].faces[i-1].vertexColors[1-1] = new THREE.Color(helmColors[(j-1)*3+k]); 
                    helmGeoms[j].faces[i-1].vertexColors[2-1] = new THREE.Color(helmColors[0]); 
                    helmGeoms[j].faces[i-1].vertexColors[3-1] = new THREE.Color(helmColors[0]);
                }
                if (icoFaces[i*3-1 +2] > p[k-1] && icoFaces[i*3-1 +2] <= p[k]) {
                    helmGeoms[j].faces[i-1].vertexColors[1-1] = new THREE.Color(helmColors[0]); 
                    helmGeoms[j].faces[i-1].vertexColors[2-1] = new THREE.Color(helmColors[(j-1)*3+k]); 
                    helmGeoms[j].faces[i-1].vertexColors[3-1] = new THREE.Color(helmColors[0]);
                }
                if (icoFaces[i*3-1 +3] > p[k-1] && icoFaces[i*3-1 +3] <= p[k]) {
                    helmGeoms[j].faces[i-1].vertexColors[1-1] = new THREE.Color(helmColors[0]); 
                    helmGeoms[j].faces[i-1].vertexColors[2-1] = new THREE.Color(helmColors[0]); 
                    helmGeoms[j].faces[i-1].vertexColors[3-1] = new THREE.Color(helmColors[(j-1)*3+k]);
                }
            }
        }
    }

    torDarkGeom1  = new THREE.TorusGeometry(w1*scale,w0*scale,30,40);
    torDarkGeom2  = new THREE.TorusGeometry(w2*scale,w0*scale,30,40);
    torDarkGeom3  = new THREE.TorusGeometry(w3*scale,w0*scale,30,40);
    torLightGeom1 = new THREE.TorusGeometry(w1*scale,w0*scale,30,40);
    torLightGeom2 = new THREE.TorusGeometry(w2*scale,w0*scale,30,40);
    torLightGeom3 = new THREE.TorusGeometry(w3*scale,w0*scale,30,40);
    torDarkGeom1. computeVertexNormals();
    torDarkGeom2. computeVertexNormals();
    torDarkGeom3. computeVertexNormals();
    torLightGeom1.computeVertexNormals();
    torLightGeom2.computeVertexNormals();
    torLightGeom3.computeVertexNormals(); 
                                                   //  "-1"  иначе ошибка
    for (i = 0; (i <= torDarkGeom1. faces.length-1) && (i <= torLightGeom1.faces.length-1); i++) {
        torLightGeom1.faces[i].vertexColors[1-1] = new THREE.Color(light);
        torLightGeom2.faces[i].vertexColors[1-1] = new THREE.Color(light); 
        torLightGeom3.faces[i].vertexColors[1-1] = new THREE.Color(light); 
        torDarkGeom1. faces[i].vertexColors[1-1] = new THREE.Color(dark) ;
        torDarkGeom2. faces[i].vertexColors[1-1] = new THREE.Color(dark) ;
        torDarkGeom3. faces[i].vertexColors[1-1] = new THREE.Color(dark) ;
        torLightGeom1.faces[i].vertexColors[2-1] = new THREE.Color(light); 
        torLightGeom2.faces[i].vertexColors[2-1] = new THREE.Color(light); 
        torLightGeom3.faces[i].vertexColors[2-1] = new THREE.Color(light); 
        torDarkGeom1. faces[i].vertexColors[2-1] = new THREE.Color(dark) ;
        torDarkGeom2. faces[i].vertexColors[2-1] = new THREE.Color(dark) ;
        torDarkGeom3. faces[i].vertexColors[2-1] = new THREE.Color(dark) ; 
        torLightGeom1.faces[i].vertexColors[3-1] = new THREE.Color(light);
        torLightGeom2.faces[i].vertexColors[3-1] = new THREE.Color(light); 
        torLightGeom3.faces[i].vertexColors[3-1] = new THREE.Color(light); 
        torDarkGeom1. faces[i].vertexColors[3-1] = new THREE.Color(dark) ;
        torDarkGeom2. faces[i].vertexColors[3-1] = new THREE.Color(dark) ;
        torDarkGeom3. faces[i].vertexColors[3-1] = new THREE.Color(dark) ; 
    }
};    
        
function tChangeKingGeometry(ω){
    let Δω = 0, k0;
    
    for (i = 1; i<=27; i += 26){
        if (i ==  1){
            k0 = 1;
        }
        if (i == 27){
            k0 =-1;
        }
            
        unit[i].rotation.x = 1.5*getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t - rad(90);
        unit[i].rotation.y = 1.5*getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t;
        unit[i].rotation.z = 1.5*getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t;
        unit[i].tor1.rotation.x = getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t - rad(90);
        unit[i].tor1.rotation.y = getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t;
        unit[i].tor1.rotation.z = getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t;
        unit[i].tor1.position.x = unit[i].position.x;
        unit[i].tor1.position.y = unit[i].position.y;
        unit[i].tor1.position.z = unit[i].position.z;
        unit[i].tor2.rotation.x = getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t;
        unit[i].tor2.rotation.y = getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t - rad(90);
        unit[i].tor2.rotation.z = getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t;
        unit[i].tor2.position.x = unit[i].position.x;
        unit[i].tor2.position.y = unit[i].position.y;
        unit[i].tor2.position.z = unit[i].position.z;
        unit[i].tor3.rotation.x = getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t;
        unit[i].tor3.rotation.y = getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t;
        unit[i].tor3.rotation.z = getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t - rad(90);
        unit[i].tor3.position.x = unit[i].position.x;
        unit[i].tor3.position.y = unit[i].position.y;
        unit[i].tor3.position.z = unit[i].position.z;
    }    
}

pikeGeometry = () => {
    let pikeVert = 
    [  0,   0,   0,  // 0
       0,  -2,  14,  // 1
       0,   1,  13,  // 2
       0,   5,   0,  // 3
       0,   5,  -6,  // 4
       0,   0, -10,  // 5
      -1,   2,  11,  // 6
       1,   2,  11,  // 7
      -4,   1,   9,  // 8
       4,   1,   9,  // 9
      -2,   2,   9,  // 10
       2,   2,   9,  // 11
      -2,   4,  -2,  // 12
       2,   4,  -2,  // 13
      -4,   3,   2,  // 14
       4,   3,   2,  // 15
      -6,   0,   6,  // 16
       6,   0,   6,  // 17
      -7,  -1,  -6,  // 18
       7,  -1,  -6,  // 19
      -3,   0, -10,  // 20 
       3,   0, -10,  // 21 
      -4,   2,  -7,  // 22 
       4,   2,  -7,  // 23
      -4,   1,   2,  // 24
       4,   1,   2,  // 25
      -6,  -4,   6,  // 26
       6,  -4,   6,  // 27
      -7,  -2,  -6,  // 28
       7,  -2,  -6,  // 29
    -1.2,   0,11.5,  // 30
     1.2,   0,11.5,  // 31
      -2,   0,   9,  // 32
       2,   0,   9,  // 33
      -4,   0,   3,  // 34
       4,   0,   3,  // 35
    -2.5,   0,  -5,  // 36
     2.5,   0,  -5   // 37
    ];
                
    let scale = 0.009; 
    scale *= kScale; 
    let up = +0.04;
    
    pikeLightGeom = new THREE.Geometry();
    for ( i = 0; i <= 37; i++) {
        pikeLightGeom.vertices.push(new THREE.Vector3
            (scale*pikeVert[i*3+1-1],
             scale*pikeVert[i*3+2-1]+up,
             scale*pikeVert[i*3+3-1]));
    }
    
    pikeDarkGeom = new THREE.Geometry();
    for ( i = 0; i <= 37; i++) {
        pikeDarkGeom.vertices.push(new THREE.Vector3
            (scale*pikeVert[i*3+1-1],
             scale*pikeVert[i*3+2-1]+up,
             scale*pikeVert[i*3+3-1]));
    }
        
    pikeLightGeom.faces.push(
        new THREE.Face3( 0, 0, 0),  // 0 
        new THREE.Face3( 6, 1, 2),  // 1 
        new THREE.Face3( 1, 7, 2),  // 2
        new THREE.Face3( 6, 2, 7),  // 3
        new THREE.Face3( 6, 7, 3),  // 4
        new THREE.Face3( 6,10, 8),  // 5
        new THREE.Face3( 7, 9,11),  // 6
        new THREE.Face3( 6,12,10),  // 7
        new THREE.Face3( 7,11,13),  // 8
        new THREE.Face3( 6, 3,12),  // 9
        new THREE.Face3( 7,13, 3),  // 10
        new THREE.Face3(12, 3, 4),  // 11
        new THREE.Face3( 3,13, 4),  // 12
        new THREE.Face3(12, 4, 5),  // 13
        new THREE.Face3(13, 5, 4),  // 14
        new THREE.Face3(10,12,14),  // 15
        new THREE.Face3(11,15,13),  // 16
        new THREE.Face3(16,14,18),  // 17
        new THREE.Face3(17,19,15),  // 18
        new THREE.Face3(14,12,18),  // 19
        new THREE.Face3(15,19,13),  // 20
        new THREE.Face3(12,22,18),  // 21
        new THREE.Face3(13,19,23),  // 22
        new THREE.Face3(18,22,20),  // 23
        new THREE.Face3(19,21,23),  // 24
        new THREE.Face3(16,18,26),  // 25
        new THREE.Face3(17,27,19),  // 26
        new THREE.Face3(18,20,26),  // 27
        new THREE.Face3(27,21,19),  // 28
        new THREE.Face3(30,31, 1),  // 29
        new THREE.Face3(30, 1, 6),  // 30
        new THREE.Face3( 7, 1,31),  // 31
        new THREE.Face3( 8,30, 6),  // 32
        new THREE.Face3( 9, 7,31),  // 33
        new THREE.Face3( 8,30,10),  // 34
        new THREE.Face3( 9,11,31),  // 35
        new THREE.Face3(31,30, 5),  // 36
        new THREE.Face3(32,30, 8),  // 37
        new THREE.Face3(31,33, 9),  // 38
        new THREE.Face3(34,14,16),  // 39
        new THREE.Face3(17,15,35),  // 40
        new THREE.Face3(34,16,26),  // 41
        new THREE.Face3(35,27,17),  // 42
        new THREE.Face3(26,20,34),  // 43
        new THREE.Face3(35,21,27),  // 44
        new THREE.Face3( 8,10,32),  // 45
        new THREE.Face3(11, 9,33),  // 46
        new THREE.Face3( 5,30,32),  // 47
        new THREE.Face3( 5,33,31),  // 48
        new THREE.Face3(32,34, 5),  // 49
        new THREE.Face3(33, 5,35),  // 50
        new THREE.Face3(14,34,10),  // 51
        new THREE.Face3(15,11,35),  // 52
        new THREE.Face3(34,32,10),  // 53
        new THREE.Face3(11,33,35),  // 54
        new THREE.Face3(34,20,36),  // 55
        new THREE.Face3(35,37,21),  // 56
        new THREE.Face3(34,36, 5),  // 57
        new THREE.Face3(37,35, 5),  // 58
        new THREE.Face3(12,36,22),  // 59
        new THREE.Face3(13,23,37),  // 60
        new THREE.Face3(12, 5,36),  // 61
        new THREE.Face3(13,37, 5),  // 62
        new THREE.Face3(36,20,22),  // 63
        new THREE.Face3(37,23,21)   // 64
    );
    
      pikeDarkGeom.faces.push(
        new THREE.Face3( 0, 0, 0),  // 0 
        new THREE.Face3( 6, 1, 2),  // 1 
        new THREE.Face3( 1, 7, 2),  // 2
        new THREE.Face3( 6, 2, 7),  // 3
        new THREE.Face3( 6, 7, 3),  // 4
        new THREE.Face3( 6,10, 8),  // 5
        new THREE.Face3( 7, 9,11),  // 6
        new THREE.Face3( 6,12,10),  // 7
        new THREE.Face3( 7,11,13),  // 8
        new THREE.Face3( 6, 3,12),  // 9
        new THREE.Face3( 7,13, 3),  // 10
        new THREE.Face3(12, 3, 4),  // 11
        new THREE.Face3( 3,13, 4),  // 12
        new THREE.Face3(12, 4, 5),  // 13
        new THREE.Face3(13, 5, 4),  // 14
        new THREE.Face3(10,12,14),  // 15
        new THREE.Face3(11,15,13),  // 16
        new THREE.Face3(16,14,18),  // 17
        new THREE.Face3(17,19,15),  // 18
        new THREE.Face3(14,12,18),  // 19
        new THREE.Face3(15,19,13),  // 20
        new THREE.Face3(12,22,18),  // 21
        new THREE.Face3(13,19,23),  // 22
        new THREE.Face3(18,22,20),  // 23
        new THREE.Face3(19,21,23),  // 24
        new THREE.Face3(16,18,26),  // 25
        new THREE.Face3(17,27,19),  // 26
        new THREE.Face3(18,20,26),  // 27
        new THREE.Face3(27,21,19),  // 28
        new THREE.Face3(30,31, 1),  // 29
        new THREE.Face3(30, 1, 6),  // 30
        new THREE.Face3( 7, 1,31),  // 31
        new THREE.Face3( 8,30, 6),  // 32
        new THREE.Face3( 9, 7,31),  // 33
        new THREE.Face3( 8,30,10),  // 34
        new THREE.Face3( 9,11,31),  // 35
        new THREE.Face3(31,30, 5),  // 36
        new THREE.Face3(32,30, 8),  // 37
        new THREE.Face3(31,33, 9),  // 38
        new THREE.Face3(34,14,16),  // 39
        new THREE.Face3(17,15,35),  // 40
        new THREE.Face3(34,16,26),  // 41
        new THREE.Face3(35,27,17),  // 42
        new THREE.Face3(26,20,34),  // 43
        new THREE.Face3(35,21,27),  // 44
        new THREE.Face3( 8,10,32),  // 45
        new THREE.Face3(11, 9,33),  // 46
        new THREE.Face3( 5,30,32),  // 47
        new THREE.Face3( 5,33,31),  // 48
        new THREE.Face3(32,34, 5),  // 49
        new THREE.Face3(33, 5,35),  // 50
        new THREE.Face3(14,34,10),  // 51
        new THREE.Face3(15,11,35),  // 52
        new THREE.Face3(34,32,10),  // 53
        new THREE.Face3(11,33,35),  // 54
        new THREE.Face3(34,20,36),  // 55
        new THREE.Face3(35,37,21),  // 56
        new THREE.Face3(34,36, 5),  // 57
        new THREE.Face3(37,35, 5),  // 58
        new THREE.Face3(12,36,22),  // 59
        new THREE.Face3(13,23,37),  // 60
        new THREE.Face3(12, 5,36),  // 61
        new THREE.Face3(13,37, 5),  // 62
        new THREE.Face3(36,20,22),  // 63
        new THREE.Face3(37,23,21)   // 64
    );
    
    pikeLightGeom.computeVertexNormals();
    
    for ( i = 0; i <= 64; i++) {
        pikeLightGeom.faces[i].vertexColors[1-1] = new THREE.Color(light);
        pikeLightGeom.faces[i].vertexColors[2-1] = new THREE.Color(light); 
        pikeLightGeom.faces[i].vertexColors[3-1] = new THREE.Color(light); 
    }
    
    pikeLightGeom.faces[ 1].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 1].vertexColors[2-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 1].vertexColors[3-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 2].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 2].vertexColors[2-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 2].vertexColors[3-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 3].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 3].vertexColors[3-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 3].vertexColors[2-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 4].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 4].vertexColors[2-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 5].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 6].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 7].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 8].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[ 9].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[10].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[29].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[30].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[30].vertexColors[2-1] = new THREE.Color(dark);
    pikeLightGeom.faces[30].vertexColors[3-1] = new THREE.Color(dark);
    pikeLightGeom.faces[31].vertexColors[1-1] = new THREE.Color(dark);
    pikeLightGeom.faces[31].vertexColors[2-1] = new THREE.Color(dark);
    pikeLightGeom.faces[31].vertexColors[3-1] = new THREE.Color(dark);
    pikeLightGeom.faces[32].vertexColors[3-1] = new THREE.Color(dark);
    pikeLightGeom.faces[33].vertexColors[2-1] = new THREE.Color(dark);
    
    pikeDarkGeom.computeVertexNormals();
    
    for ( i = 0; i <= 64; i++) {
        pikeDarkGeom.faces[i].vertexColors[1-1] = new THREE.Color(dark);
        pikeDarkGeom.faces[i].vertexColors[2-1] = new THREE.Color(dark); 
        pikeDarkGeom.faces[i].vertexColors[3-1] = new THREE.Color(dark); 
    }
    
    pikeDarkGeom.faces[ 1].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 1].vertexColors[2-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 1].vertexColors[3-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 2].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 2].vertexColors[2-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 2].vertexColors[3-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 3].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 3].vertexColors[3-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 3].vertexColors[2-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 4].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 4].vertexColors[2-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 5].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 6].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 7].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 8].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[ 9].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[10].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[29].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[30].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[30].vertexColors[2-1] = new THREE.Color(light);
    pikeDarkGeom.faces[30].vertexColors[3-1] = new THREE.Color(light);
    pikeDarkGeom.faces[31].vertexColors[1-1] = new THREE.Color(light);
    pikeDarkGeom.faces[31].vertexColors[2-1] = new THREE.Color(light);
    pikeDarkGeom.faces[31].vertexColors[3-1] = new THREE.Color(light);
    pikeDarkGeom.faces[32].vertexColors[3-1] = new THREE.Color(light);
    pikeDarkGeom.faces[33].vertexColors[2-1] = new THREE.Color(light);
};

swordGeometry = () => {
    let swordVert = 
    [  0,   0,   0,  // 0
      20,   0,   0,  // 1
      10,   0,  15,  // 2
       5,   2,  25,  // 3
       0,   0,  30,  // 4
      -5,   2,  25,  // 5
     -10,   0,  15,  // 6
     -20,   0,   0,  // 7
     -13,   0,  -9,  // 8
      -5,   0, -15,  // 9
       5,   0, -15,  //10
      13,   0,  -9,  //11
      14,   4,   2,  //12
      10,   6,  10,  //13
       0,   4,  18,  //14
       0,   6,  14.142,  //15
     -10,   6,  10,  //16
     -14,   4,   2,  //17
     -14.142,   6,   0,  //18
     -10,   6, -10,  //19
       0,   6, -14.142,  //20
      10,   6, -10,  //21
     14.142,   6,   0,  //22
      14,  -4,   2,  //23
      10,  -6,  10,  //24
       0,  -4,  18,  //25
       0,  -6,  14.142,  //26
     -10,  -6,  10,  //27
     -14,  -4,   2,  //28
    -14.142,  -6,   0,  //29
     -10,  -6, -10,  //30
       0,  -6, -14.142,  //31
      10,  -6, -10,  //32
     14.142,  -6,   0,  //33
       5,  -2,  25,  //34
      -5,  -2,  25   //35
    ];
                
    let scale  =  0.0057; 
    scale *= kScale;
    let up     = +0.0000;
    const swordN = Math.round(swordVert.length/3) - 1;
  
    swordLightGeom = new THREE.Geometry();
    for (i = 0; i <=swordN; i++) {
        swordLightGeom.vertices.push(new THREE.Vector3
            (scale*swordVert[i*3+1-1],
             scale*swordVert[i*3+2-1]+up,
             scale*swordVert[i*3+3-1]));
    }
    
    swordDarkGeom = new THREE.Geometry();
    for (i = 0; i <=swordN; i++) {
        swordDarkGeom.vertices.push(new THREE.Vector3
            (scale*swordVert[i*3+1-1],
             scale*swordVert[i*3+2-1]+up,
             scale*swordVert[i*3+3-1]));
    }
      
    swordLightGeom.faces.push(
        new THREE.Face3( 0, 0, 0),  // 0
        new THREE.Face3(22,24,13),  // 26
        new THREE.Face3(22,33,24),  // 27
        new THREE.Face3(13,24,15),  // 28
        new THREE.Face3(15,24,26),  // 29
        new THREE.Face3(15,26,27),  // 30
        new THREE.Face3(15,27,16),  // 31
        new THREE.Face3(27,18,16),  // 32
        new THREE.Face3(27,29,18),  // 33
        new THREE.Face3(29,30,18),  // 34
        new THREE.Face3(18,30,19),  // 35
        new THREE.Face3(30,20,19),  // 36
        new THREE.Face3(30,31,20),  // 37
        new THREE.Face3(31,32,20),  // 38
        new THREE.Face3(20,32,21),  // 39
        new THREE.Face3(21,32,22),  // 40
        new THREE.Face3(32,33,22),  // 41
        new THREE.Face3( 5,35, 4),  // 43
        new THREE.Face3(34, 3, 4),  // 44
        new THREE.Face3( 5, 6,35),  // 45
        new THREE.Face3(34, 2, 3),  // 46
        new THREE.Face3( 1,12, 2),  // 1 
        new THREE.Face3(12,13, 2),  // 2
        new THREE.Face3(12,22,13),  // 3
        new THREE.Face3(13,15, 2),  // 4
        new THREE.Face3( 2,15,14),  // 5
        new THREE.Face3( 2,14, 3),  // 6
        new THREE.Face3(14, 5, 3),  // 7
        new THREE.Face3( 3, 5, 4),  // 8
        new THREE.Face3(14, 6, 5),  // 9
        new THREE.Face3(14,15, 6),  // 10
        new THREE.Face3(15,16, 6),  // 11
        new THREE.Face3( 6,16,17),  // 12
        new THREE.Face3( 6,17, 7),  // 13
        new THREE.Face3(16,18,17),  // 14
        new THREE.Face3(18, 8,17),  // 15
        new THREE.Face3(17, 8, 7),  // 16
        new THREE.Face3(18,19, 8),  // 17
        new THREE.Face3(19, 9, 8),  // 18
        new THREE.Face3(19,20, 9),  // 19
        new THREE.Face3( 9,20,10),  // 20
        new THREE.Face3(10,20,21),  // 21
        new THREE.Face3(10,21,11),  // 22
        new THREE.Face3(11,21,22),  // 23
        new THREE.Face3(11,22,12),  // 24
        new THREE.Face3(11,12, 1),  // 25
        new THREE.Face3( 1, 2,23),  // 1 
        new THREE.Face3(24,23, 2),  // 2
        new THREE.Face3(33,23,24),  // 3
        new THREE.Face3(26,24, 2),  // 4
        new THREE.Face3( 2,25,26),  // 5
        new THREE.Face3( 2,34,25),  // 6
        new THREE.Face3(25,34,35),  // 7
        new THREE.Face3(35,34, 4),  // 8
        new THREE.Face3( 6,25,35),  // 9
        new THREE.Face3(26,25, 6),  // 10
        new THREE.Face3(27,26, 6),  // 11
        new THREE.Face3( 6,28,27),  // 12
        new THREE.Face3( 6, 7,28),  // 13
        new THREE.Face3(29,27,28),  // 14
        new THREE.Face3(28, 8,29),  // 15
        new THREE.Face3( 8,28, 7),  // 16
        new THREE.Face3(30,29, 8),  // 17
        new THREE.Face3(30, 8, 9),  // 18
        new THREE.Face3(31,30, 9),  // 19
        new THREE.Face3( 9,10,31),  // 20
        new THREE.Face3(10,32,31),  // 21
        new THREE.Face3(11,32,10),  // 22
        new THREE.Face3(11,33,32),  // 23
        new THREE.Face3(23,33,11),  // 24
        new THREE.Face3(23,11, 1)   // 25
    );
    swordDarkGeom.faces.push(
        new THREE.Face3( 0, 0, 0),  // 0 
        new THREE.Face3(22,24,13),  // 26
        new THREE.Face3(22,33,24),  // 27
        new THREE.Face3(13,24,15),  // 28
        new THREE.Face3(15,24,26),  // 29
        new THREE.Face3(15,26,27),  // 30
        new THREE.Face3(15,27,16),  // 31
        new THREE.Face3(27,18,16),  // 32
        new THREE.Face3(27,29,18),  // 33
        new THREE.Face3(29,30,18),  // 34
        new THREE.Face3(18,30,19),  // 35
        new THREE.Face3(30,20,19),  // 36
        new THREE.Face3(30,31,20),  // 37
        new THREE.Face3(31,32,20),  // 38
        new THREE.Face3(20,32,21),  // 39
        new THREE.Face3(21,32,22),  // 40
        new THREE.Face3(32,33,22),  // 41
        new THREE.Face3( 5,35, 4),  // 43
        new THREE.Face3(34, 3, 4),  // 44
        new THREE.Face3( 5, 6,35),  // 45
        new THREE.Face3(34, 2, 3),  // 46
        new THREE.Face3( 1,12, 2),  // 1 
        new THREE.Face3(12,13, 2),  // 2
        new THREE.Face3(12,22,13),  // 3
        new THREE.Face3(13,15, 2),  // 4
        new THREE.Face3( 2,15,14),  // 5
        new THREE.Face3( 2,14, 3),  // 6
        new THREE.Face3(14, 5, 3),  // 7
        new THREE.Face3( 3, 5, 4),  // 8
        new THREE.Face3(14, 6, 5),  // 9
        new THREE.Face3(14,15, 6),  // 10
        new THREE.Face3(15,16, 6),  // 11
        new THREE.Face3( 6,16,17),  // 12
        new THREE.Face3( 6,17, 7),  // 13
        new THREE.Face3(16,18,17),  // 14
        new THREE.Face3(18, 8,17),  // 15
        new THREE.Face3(17, 8, 7),  // 16
        new THREE.Face3(18,19, 8),  // 17
        new THREE.Face3(19, 9, 8),  // 18
        new THREE.Face3(19,20, 9),  // 19
        new THREE.Face3( 9,20,10),  // 20
        new THREE.Face3(10,20,21),  // 21
        new THREE.Face3(10,21,11),  // 22
        new THREE.Face3(11,21,22),  // 23
        new THREE.Face3(11,22,12),  // 24
        new THREE.Face3(11,12, 1),  // 25
        new THREE.Face3( 1, 2,23),  // 1 
        new THREE.Face3(24,23, 2),  // 2
        new THREE.Face3(33,23,24),  // 3
        new THREE.Face3(26,24, 2),  // 4
        new THREE.Face3( 2,25,26),  // 5
        new THREE.Face3( 2,34,25),  // 6
        new THREE.Face3(25,34,35),  // 7
        new THREE.Face3(35,34, 4),  // 8
        new THREE.Face3( 6,25,35),  // 9
        new THREE.Face3(26,25, 6),  // 10
        new THREE.Face3(27,26, 6),  // 11
        new THREE.Face3( 6,28,27),  // 12
        new THREE.Face3( 6, 7,28),  // 13
        new THREE.Face3(29,27,28),  // 14
        new THREE.Face3(28, 8,29),  // 15
        new THREE.Face3( 8,28, 7),  // 16
        new THREE.Face3(30,29, 8),  // 17
        new THREE.Face3(30, 8, 9),  // 18
        new THREE.Face3(31,30, 9),  // 19
        new THREE.Face3( 9,10,31),  // 20
        new THREE.Face3(10,32,31),  // 21
        new THREE.Face3(11,32,10),  // 22
        new THREE.Face3(11,33,32),  // 23
        new THREE.Face3(23,33,11),  // 24
        new THREE.Face3(23,11, 1)   // 25
    );
    
    const swordNTr = 71;
    swordLightGeom.computeVertexNormals();
    swordDarkGeom. computeVertexNormals();
    
    for (i = 0; i <= swordNTr-1; i++) {         //  "-1"  иначе ошибка 
        swordLightGeom.faces[i].vertexColors[1-1] = new THREE.Color(light);
        swordLightGeom.faces[i].vertexColors[2-1] = new THREE.Color(light); 
        swordLightGeom.faces[i].vertexColors[3-1] = new THREE.Color(light); 
        swordDarkGeom. faces[i].vertexColors[1-1] = new THREE.Color(dark);
        swordDarkGeom. faces[i].vertexColors[2-1] = new THREE.Color(dark); 
        swordDarkGeom. faces[i].vertexColors[3-1] = new THREE.Color(dark); 
    }
};
    
function tChangeQueenGeometry(ω){
    let Δω = 0, k0;
        
    for (i = 2; i <= 28; i += 26){
        if (i == 2){
            k0 = 1;
        }
        if (i == 28){
            k0 =-1;
        }
            
        unit[i].ball.position.x = unit[i].position.x;
        unit[i].ball.position.y = unit[i].position.y;
        unit[i].ball.position.z = unit[i].position.z;
        unit[i].ball.rotation.x = getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t - rad(90);
        unit[i].ball.rotation.y = getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t;
        unit[i].ball.rotation.z = getRandomArbitrary(k0*ω-Δω, k0*ω+Δω)*t;
    }    
}