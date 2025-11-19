function DetectDevice() {
    let isMobile = window.matchMedia || window.msMatchMedia;
    if(isMobile) {
        let match_mobile = isMobile("(pointer:coarse)");
        return match_mobile.matches;
    }
    return true;
}

function processTime() {
    console.time();
    console.timeEnd();  
}

var modal = document.getElementById('modal-window');
var help = document.getElementById('help-window');
// Когда пользователь нажимает в любом месте за пределами модального, оно закрывается. 
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
    if (event.target === help) {
        help.style.display = "none";
    }
};

const rangeDepthLevel = document.getElementById("DepthLevel");
const rangeTime = document.getElementById("timeLimit");

const rangeValueDepthLevel = document.getElementById("rangeValueDepthLevel");
const rangeValueTime = document.getElementById("rangeValueTime");

updateRangeValueDepthLevel = () => {
    const percent = (rangeDepthLevel.value - rangeDepthLevel.min)/(rangeDepthLevel.max - rangeDepthLevel.min)*100;
    rangeValueDepthLevel.textContent = rangeDepthLevel.value;
    let p = percent/100;   
    // Позиционируем значение над ползунком
    const thumbPosition = percent;
    /*Ползунок Возможности*/
    rangeValueDepthLevel.style.left  = `calc(0% + ${thumbPosition}%)`;
    rangeValueDepthLevel.style.color = "rgba("+ String(255*(2*p)) + ", " + String(255*(2-2*p)) + ", " + String(255*(2*p)) + ", " + String(1) + ")";
};

updateRangeValueTime = () => {
    const percent = (rangeTime.value - rangeTime.min)/(rangeTime.max - rangeTime.min)*100;
    rangeValueTime.textContent = rangeTime.value;
    let p = percent/100;    
    // Позиционируем значение над ползунком
    const thumbPosition = percent;
    /*Ползунок Таймера = наоборот: по сложности, длинная игра — самая простая*/
    rangeValueTime.style.left  = `calc(100% - ${thumbPosition}%)`;
    rangeValueTime.style.color = "rgba("+ String(255*(2-2*p)) + ", " + String(255*(2*p)) + ", " + String(255*(1-2*p)) + ", " + String(1) + ")";
};
                        
// Инициализация и обработка событий
updateRangeValueDepthLevel();
updateRangeValueTime();

rangeDepthLevel.addEventListener("input", updateRangeValueDepthLevel);
rangeTime.addEventListener("input", updateRangeValueTime);

/*Ползунок Таймера = наоборот: по сложности, длинная игра — самая простая*/
$(function() {
  $("rangeValueTime").text($("#timeLimit").val());
  
  $("#timeLimit").on('change input', function() {
    $("rangeValueTime").text($(this).val());
  });
});

function dataStatic(CSV) { 
    const
    μ  = 255, 
    σ  =  30,
    μ0 = 100, 
    σ0 =   6;
    csv            = [],
    grad           = [],
    shadow         = [],
    menu_shadow    = [],
    deep_1_0       = [],
    deep_0_p4_1    = [],
    deep_0_p10_1   = [],
    deep_n4_p4_1   = [],
    deep_n10_p10_1 = [],
    deep_p4_p4_1   = [],
    deep_p10_p10_1 = [],
    deep_n4_0_1    = [],
    deep_n10_0_1   = [],
    deep_p4_0_1    = [],
    deep_p10_0_1   = [],
    deep_0_n4_1    = [],
    deep_0_n10_1   = [],
    ic0            = [],
    ic0_CLICK_deep = [],
    ic0deep        = [];
                
    for (i = 0; i <= 3; i++) {
        csv[i] = {}; 
        ic0[i] = {};
        csv[i].main  = [];
        csv[i].grad  = [];
        csv[i].head  = [];
        csv[i].menu  = [];
        csv[i].deep  = [];
        csv[i].enter = [];
        ic0[i].deep  = [];
    }
    
    csv[0].main[ 1] = "#555555";    csv[1].main[ 1] = "#9900ff";    csv[2].main[ 1] = "#00dddd";    csv[3].main[ 1] = "#ff3300";
    csv[0].main[ 2] = "#ffffff";    csv[1].main[ 2] = "#ff3300";    csv[2].main[ 2] = "#5555ff";    csv[3].main[ 2] = "#00ff33";
                
    csv[0].grad[ 1] = "#999999";    csv[1].grad[ 1] = "#5500ff";    csv[2].grad[ 1] = "#00ffcc";    csv[3].grad[ 1] = "#ffbb00";
    csv[0].grad[ 2] = "#ffffff";    csv[1].grad[ 2] = "#bb00bb";    csv[2].grad[ 2] = "#5555ff";    csv[3].grad[ 2] = "#ff0000";
    
    csv[0].head[ 1] = "#ffffff";    csv[1].head[ 1] = "#ff9900";    csv[2].head[ 1] = "#cc00ff";    csv[3].head[ 1] = "#00ee00";
    csv[0].head[ 2] = "#777777";    csv[1].head[ 2] = "#ff0000";    csv[2].head[ 2] = "#0055ff";    csv[3].head[ 2] = "#0077ff";
    
    csv[0].menu[ 1] = "#ffffff";    csv[1].menu[ 1] = "#9900ff";    csv[2].menu[ 1] = "#009999";    csv[3].menu[ 1] = "#ff3300";
    csv[0].menu[ 2] = "#555555";    csv[1].menu[ 2] = "#5500ff";    csv[2].menu[ 2] = "#00aadd";    csv[3].menu[ 2] = "#ff0000";
                
    csv[0].deep[ 0] = "#ffffff";    csv[1].deep[ 0] = "#330077";    csv[2].deep[ 0] = "#003333";    csv[3].deep[ 0] = "#210700";
    csv[0].deep[ 1] = "#ffffff";    csv[1].deep[ 1] = "#aa00ff";    csv[2].deep[ 1] = "#00dddd";    csv[3].deep[ 1] = "#ff3300";
    csv[0].deep[ 2] = "#eeeeee";    csv[1].deep[ 2] = "#a000f0";    csv[2].deep[ 2] = "#00c9c9";    csv[3].deep[ 2] = "#eb2f00";
    csv[0].deep[ 3] = "#dddddd";    csv[1].deep[ 3] = "#9600e0";    csv[2].deep[ 3] = "#00b5b5";    csv[3].deep[ 3] = "#d72b00";
    csv[0].deep[ 4] = "#cccccc";    csv[1].deep[ 4] = "#8c00d4";    csv[2].deep[ 4] = "#00a1a1";    csv[3].deep[ 4] = "#c32700";
    csv[0].deep[ 5] = "#bbbbbb";    csv[1].deep[ 5] = "#8300c4";    csv[2].deep[ 5] = "#008d8d";    csv[3].deep[ 5] = "#af2300";
    csv[0].deep[ 6] = "#aaaaaa";    csv[1].deep[ 6] = "#7700b3";    csv[2].deep[ 6] = "#007979";    csv[3].deep[ 6] = "#9b1f00";
    csv[0].deep[ 7] = "#999999";    csv[1].deep[ 7] = "#6d00a3";    csv[2].deep[ 7] = "#006565";    csv[3].deep[ 7] = "#871b00";
    csv[0].deep[ 8] = "#888888";    csv[1].deep[ 8] = "#640096";    csv[2].deep[ 8] = "#005151";    csv[3].deep[ 8] = "#731700";
    csv[0].deep[ 9] = "#777777";    csv[1].deep[ 9] = "#5a0087";    csv[2].deep[ 9] = "#003d3d";    csv[3].deep[ 9] = "#5f1300";
    csv[0].deep[10] = "#666666";    csv[1].deep[10] = "#500078";    csv[2].deep[10] = "#002929";    csv[3].deep[10] = "#4a0f00";
    
    const
    ri = [μ, μ, μ, 0], 
    gi = [μ, 2*σ, 0, μ], 
    bi = [μ, 0, μ, 2*σ], 
    nk = 20;
    
    for (i = 0; i <= 3; i++) {
        for (j =  0; j <= nk; j++) {    
            let r = j*ri[i]/nk;
            let g = j*gi[i]/nk;
            let b = j*bi[i]/nk;    
            ic0[i].deep[j] = "rgb(" + r + "," + g + "," + b + ")";
        }
    }
    
    csv[0].enter[1] = "#ffffff";    csv[1].enter[1] = "#ff3300";    csv[2].enter[1] = "#dd00ff";    csv[3].enter[1] = "#00ff33";
    csv[0].enter[2] = "#444444";    csv[1].enter[2] = "#440700";    csv[2].enter[2] = "#550077";    csv[3].enter[2] = "#004422";
    csv[0].enter[3] = "#888888b3";  csv[1].enter[3] = "#aa00ffb3";  csv[2].enter[3] = "#00ddddb3";  csv[3].enter[3] = "#ff3300b3";
    csv[0].enter[4] = "#44444477";  csv[1].enter[4] = "#55008877";  csv[2].enter[4] = "#00777777";  csv[3].enter[4] = "#88220077";
    
    csv[0].updown   = "#444444";    csv[1].updown   = "#330077";    csv[2].updown   = "#003333";    csv[3].updown   = "#331100";
    csv[0].column   = "#444444";    csv[1].column   = "#110033";    csv[2].column   = "#002222";    csv[3].column   = "#150500";
    csv[0].nav      = "#ffffff";    csv[1].nav      = "#ff3300";    csv[2].nav      = "#dd00ff";    csv[3].nav      = "#00ff33";
    
    for (i = 0; i <= 3; i++) {
            grad[i]     =   "radial-gradient(ellipse closest-side at 50% 50%," + csv[i].grad[1] + ", " + csv[i].grad[2];
          shadow[i]     =   "#000000  0 0 0, " + 
                            "#000000 calc( 100vw / 1200 * 4) calc( 100vw / 1200 * 4) calc( 100vw / 1200 * 4)," +
                            "#000000 calc( 100vw / 1200 * 5) calc( 100vw / 1200 * 5) calc( 100vw / 1200 * 5)," +
                            csv[i].head[1] +" calc(-100vw / 1200 * 6) calc(-100vw / 1200 * 6) calc( 100vw / 1200 * 6)," +
                            csv[i].head[1] +" calc( 100vw / 1200 * 6) calc( 100vw / 1200 * 6) calc( 100vw / 1200 * 6)," +
                            csv[i].head[2] +" calc(-100vw / 1200 *12) calc(-100vw / 1200 *12) calc( 100vw / 1200 *12)," +
                            csv[i].head[2] +" calc( 100vw / 1200 *12) calc( 100vw / 1200 *12) calc( 100vw / 1200 *12)";
                        
        menu_shadow[i]  =   "#000000 0 0 0, " +
                            "#000000 calc( 100vw / 1200 * 2) calc( 100vw / 1200 * 2) calc( 100vw / 1200 * 2)," +
                            csv[i].menu[1] +" calc(-100vw / 1200 * 3) calc(-100vw / 1200 * 3) calc( 100vw / 1200 * 3)," +
                            csv[i].menu[1] +" calc( 100vw / 1200 * 3) calc( 100vw / 1200 * 3) calc( 100vw / 1200 * 3)," +
                            csv[i].menu[2] +" calc(-100vw / 1200 * 6) calc(-100vw / 1200 * 6) calc( 100vw / 1200 * 6)," +
                            csv[i].menu[2] +" calc( 100vw / 1200 * 6) calc( 100vw / 1200 * 6) calc( 100vw / 1200 * 6)";
                            
              deep_1_0[i] = "";  
          
          deep_0_p10_1[i] = "";
        deep_n10_p10_1[i] = "";
        deep_p10_p10_1[i] = "";
           
           deep_0_p4_1[i] = "";
          deep_n4_p4_1[i] = "";
          deep_p4_p4_1[i] = "";
          
          deep_n10_0_1[i] = "";
          deep_p10_0_1[i] = "";
          deep_0_n10_1[i] = "";
          
          deep_n4_0_1[i] = "";
          deep_p4_0_1[i] = "";
          deep_0_n4_1[i] = "";
          
          deep_1_0[i] = csv[i].deep[1] + " 0  0  3vh, inset " + csv[i].deep[0] + " 0.3vh 0.3vh 1.3vh,";  
        
        ic0deep[i] = ""; 
        for (j = 1; j <= 20; j++) {
            ic0deep[i]        += ic0[i].deep[j] + " calc(40vh/1200*" + 0 + ") calc(40vh/1200 *" + 2*j + "/1.3) calc(40vh/1200 *1)";
            if (j < 20) { 
                ic0deep[i] += ",";
            } 
        }
        // !!!!!!!!!!!!!!!!!!!!!!!
        ic0_CLICK_deep[i] = ""; 
        for (j = 1; j <= 10; j++) {
            ic0_CLICK_deep[i] += ic0[i].deep[j] + "calc(40vh/1200 *" + 0 + ") calc(40vh/ 1200 *" + (2*j + 0) + "/1.3) calc(40vh/1200 *1)";
            if (j < 10) { 
                ic0_CLICK_deep[i] += ",";
            } 
        }
        // ВНИМАТЕЛЬНО НА ЦИФРЫ ВЫШЕ h2:active можно оставить в CSS 
        let step = 0.1;
        for (j = 1; j <= 10; j++) {
            deep_0_p10_1[i]   += csv[i].deep[ j]+" calc(       0*" + step + "vh) calc(  "+  j +"*" + step + "vh) calc( 1*" + step + "vh)";
            deep_n10_p10_1[i] += csv[i].deep[ j]+" calc("+(-j)+"*" + step + "vh) calc(  "+  j +"*" + step + "vh) calc( 1*" + step + "vh)";
            deep_p10_p10_1[i] += csv[i].deep[ j]+" calc("+(+j)+"*" + step + "vh) calc(  "+  j +"*" + step + "vh) calc( 1*" + step + "vh)";
            
            deep_n10_0_1[i]   += csv[i].deep[ j]+" calc("+(-j)+"*" + step + "vh) calc(  "+  0 +"*" + step + "vh) calc( 1*" + step + "vh)";
            deep_p10_0_1[i]   += csv[i].deep[ j]+" calc("+(+j)+"*" + step + "vh) calc(  "+  0 +"*" + step + "vh) calc( 1*" + step + "vh)";
            deep_0_n10_1[i]   += csv[i].deep[ j]+" calc("+  0 +"*" + step + "vh) calc(  "+(-j)+"*" + step + "vh) calc( 1*" + step + "vh)";
            
            if (j < 10) { 
                  deep_0_p10_1[i] +=  ",";
                deep_n10_p10_1[i] +=  ",";
                deep_p10_p10_1[i] +=  ",";
                
                deep_n10_0_1[i]   +=  ",";
                deep_p10_0_1[i]   +=  ",";
                deep_0_n10_1[i]   +=  ",";
            };
        } 
        
        for (j = 1; j <= 4; j++) {
            deep_0_p4_1[i]   += csv[i].deep[ j]+" calc(       0*" + step + "vh) calc(  "+  j +"*" + step + "vh) calc( 1*" + step + "vh)";
            deep_n4_p4_1[i]  += csv[i].deep[ j]+" calc("+(-j)+"*" + step + "vh) calc(  "+  j +"*" + step + "vh) calc( 1*" + step + "vh)";
            deep_p4_p4_1[i]  += csv[i].deep[ j]+" calc("+(+j)+"*" + step + "vh) calc(  "+  j +"*" + step + "vh) calc( 1*" + step + "vh)";
            
            deep_n4_0_1[i]   += csv[i].deep[ j]+" calc("+(-j)+"*" + step + "vh) calc(  "+  0 +"*" + step + "vh) calc( 1*" + step + "vh)";
            deep_p4_0_1[i]   += csv[i].deep[ j]+" calc("+(+j)+"*" + step + "vh) calc(  "+  0 +"*" + step + "vh) calc( 1*" + step + "vh)";
            deep_0_n4_1[i]   += csv[i].deep[ j]+" calc("+  0 +"*" + step + "vh) calc(  "+(-j)+"*" + step + "vh) calc( 1*" + step + "vh)";
            
            if (j < 4) { 
                  deep_0_p4_1[i]  +=  ",";
                  deep_n4_p4_1[i] +=  ",";
                  deep_p4_p4_1[i] +=  ",";
                  
                  deep_n4_0_1[i]  +=  ",";
                  deep_p4_0_1[i]  +=  ",";
                  deep_0_n4_1[i]  +=  ",";
            };
        }
    }
}

function dataChanges(CSV) {
    //////////////////////////////////////////// для ГРАДИЕНТА ////////////////////////////////////////
    const
    μ  = 255, 
    σ  =  30,
    μ0 = 100, 
    σ0 =   6;
    
    const 
    Λ = [], λ = [];
    Λ[0] = "F0", λ[0] = "f0",
    Λ[1] = "VO", λ[1] = "vo",
    Λ[2] = "BV", λ[2] = "bv",
    Λ[3] = "OG", λ[3] = "og";
    
    CS = [], cs = [], mico = [], mICO = [], DM = [], dm = [];
    const
    nM     = 200,      // число кадров циклической анимации
    nC     = nM/2,     // число кадров переходной анимации
    x0     = 0.5,
    y0     = 0.5,
    r0     = 0.4,
    Tm     = 8,        // период циклической анимации
    Tm_h2  = Tm/1.2,
    Tm_b_e = Tm/2.0,
    Tc     = Tm/2,     // время анимации перехода
    Tr     = Tc/2,
    TcF     = numberLikeFractionDecimal(Tc, Tm), // время-число в долях полного времени анимации 0.12 0.45 0.45 и т.д.
    TcP     = stringInPercents(TcF),             // время-строка в процентах полного времени анимации "35.56573%" "67.56%" и т.д.
    TcRP    = stringInRoundPercents(TcF),        // время-строка в ОКРУГЛЁННЫХ процентах полного времени анимации "35%" "67%" и т.д.
    TcS     = stringInSeconds(Tc);               // время-строка в секундах анимации "1.12s" "5s" "3.7s" и т.д.
    TrS     = stringInSeconds(Tr);               // время-строка в секундах анимации "1.12s" "5s" "3.7s" и т.д.
    TmS     = stringInSeconds(Tm);               // время-строка в секундах анимации "1.12s" "5s" "3.7s" и т.д.
    TmS_h2  = stringInSeconds(Tm_h2);            // время-строка в секундах анимации "1.12s" "5s" "3.7s" и т.д.
    TmS_b_e = stringInSeconds(Tm_b_e);           // время-строка в секундах анимации "1.12s" "5s" "3.7s" и т.д.
    
    F0 = "rgb(" + μ + "," + μ + "," + μ + ")", f0 = "rgb(" + σ + "," + σ + "," + σ + ")",
    VO = "rgb(" + μ + "," + 0 + "," + μ + ")", vo = "rgb(" + σ + "," + 0 + "," + μ + ")",
    BV = "rgb(" + 0 + "," + μ + "," + μ + ")", bv = "rgb(" + 0 + "," + σ + "," + μ + ")",
    OG = "rgb(" + μ + "," + μ + "," + 0 + ")", og = "rgb(" + μ + "," + σ + "," + 0 + ")",
    
    D0m= "rgb(" + μ + "," + μ + "," + μ + ")", d0m= "rgb(" + σ + "," + σ + "," + σ + ")",
    D1m= "rgb(" + μ + "," + μ + "," + 0 + ")", d1m= "rgb(" + μ + "," + σ + "," + 0 + ")",
    D2m= "rgb(" + μ + "," + 0 + "," + μ + ")", d2m= "rgb(" + σ + "," + 0 + "," + μ + ")",
    D3m= "rgb(" + μ + "," + μ + "," + 0 + ")", d3m= "rgb(" + 0 + "," + μ + "," + σ + ")",
    
    mOpacity = 0.7;
    mICO[0] = "rgba(" + μ0 + "," + μ0 + "," + μ0 + "," + mOpacity +")", mico[0] = "rgba(" + σ0 + "," + σ0 + "," + σ0 + "," + mOpacity +")",
    mICO[1] = "rgba(" + μ0 + "," +  0 + "," + μ0 + "," + mOpacity +")", mico[1] = "rgba(" + σ0 + "," +  0 + "," + μ0 + "," + mOpacity +")",
    mICO[2] = "rgba(" +  0 + "," + μ0 + "," + μ0 + "," + mOpacity +")", mico[2] = "rgba(" +  0 + "," + σ0 + "," + μ0 + "," + mOpacity +")",
    mICO[3] = "rgba(" + μ0 + "," + μ0 + "," +  0 + "," + mOpacity +")", mico[3] = "rgba(" + μ0 + "," + σ0 + "," +  0 + "," + mOpacity +")",
    
    CS[0] = F0, CS[1] = VO, CS[2] = BV, CS[3] = OG, cs[0] = f0, cs[1] = vo, cs[2] = bv, cs[3] = og, 
    DM[0] =D0m, DM[1] =D1m, DM[2] =D2m, DM[3] =D3m, dm[0] =d0m, dm[1] =d1m, dm[2] =d2m, dm[3] =d3m, 
    
    xg = [], 
    yg = [], 
    
    F0_VO = [], VO_F0 = [], F0_BV = [], BV_F0 = [], F0_OG = [], OG_F0 = [], VO_OG = [], OG_VO = [], VO_BV = [], BV_VO = [], BV_OG = [], OG_BV = [], 
    f0_vo = [], vo_f0 = [], f0_bv = [], bv_f0 = [], f0_og = [], og_f0 = [], vo_og = [], og_vo = [], vo_bv = [], bv_vo = [], bv_og = [], og_bv = [];
    
    let positionTouch;
    let positionGet;
    let mayChange = true;
    let timeAnimation;
    let traectory;
    //traectory = "circle";
     traectory = "lemniscata";
    let trigger =  false;
    
    for (k = 0; k <= nC; k++) {
        let r, g, b;
        
        r = μ;
        g = μ - (μ/nC)*k;
        b = μ;
        F0_VO[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = μ;
        g = (μ/nC)*k;
        b = μ;
        VO_F0[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = μ - (μ/nC)*k;
        g = μ;
        b = μ;
        F0_BV[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = (μ/nC)*k;
        g = μ;
        b = μ;
        BV_F0[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = μ;
        g = μ;
        b = μ - (μ/nC)*k;
        F0_OG[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = μ;
        g = μ;
        b = (μ/nC)*k;
        OG_F0[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = μ;
        g = (μ/nC)*k;
        b = μ - g;
        VO_OG[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = μ;
        b = (μ/nC)*k;
        g = μ - b;
        OG_VO[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        b = μ;
        r = (μ/nC)*k;
        g = μ - r;
        BV_VO[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        b = μ;
        g = (μ/nC)*k;
        r = μ - g;
        VO_BV[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        g = μ;
        b = (μ/nC)*k;
        r = μ - b;
        OG_BV[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        g = μ;
        r = (μ/nC)*k;
        b = μ - r;
        BV_OG[k] = "rgb(" + r + "," + g + "," + b + ")";
    
        r = σ;
        g = σ - (σ/nC)*k;
        b = σ + k*(μ - σ)/nC;
        f0_vo[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = σ;
        g = (σ/nC)*k;
        b = μ - k*(μ - σ)/nC;
        vo_f0[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = σ - (σ/nC)*k;
        g = σ;
        b = σ + k*(μ - σ)/nC;
        f0_bv[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = (σ/nC)*k;
        g = σ;
        b = μ - k*(μ - σ)/nC;
        bv_f0[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = σ + k*(μ - σ)/nC;
        g = σ;
        b = σ - (σ/nC)*k;
        f0_og[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = μ - k*(μ - σ)/nC;
        g = σ;
        b = (σ/nC)*k;
        og_f0[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = σ + k*(μ - σ)/nC;
        g = (σ/nC)*k;
        b = μ - (μ/nC)*k;
        vo_og[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = μ - k*(μ - σ)/nC;
        g = σ - k*σ/nC;
        b = (μ/nC)*k;
        og_vo[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = k*σ/nC;
        g = σ - r;
        b = μ; 
        bv_vo[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        g = k*σ/nC;
        r = σ - r;
        b = μ; 
        vo_bv[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        b = (μ/nC)*k;
        r = μ - b;
        g = σ;
        og_bv[k] = "rgb(" + r + "," + g + "," + b + ")";
        
        r = (μ/nC)*k;
        b = μ - b;
        g = σ;
        bv_og[k] = "rgb(" + r + "," + g + "," + b + ")";
    }
    
    let 
    linkForMove =  [],
    prefics = [],
    frameMove = [],
    styles = [],
    animationMove;
    // Закладка на возможное уточнение по браузерам, если оно будет необходимо
    prefics[3]="-o-";
    prefics[2]="-moz-";
    prefics[1]="-webkit-";
    prefics[0]="";
    maxPrefics = 1;
    ////////// Анимация движения градиента ПЕРВОЕ ВКЛЮЧЕНИЕ ////////////
    for (k = 0; k <= nM; k++) {
        t = k*Tm/nM;
        let gradientPosition = {};
        switch(traectory) {
            case "circle": 
                gradientPosition = get_xy_circle(x0, y0, r0, Tm, 0, t);
                break;
            case "lemniscata": 
                gradientPosition = get_xy_lemniscata(x0, y0, r0, Tm, 0, t);
                break;
        }
            
        xg[k] = gradientPosition.x;
        yg[k] = gradientPosition.y;
        let p = xyToPercentStringFromNumbers(xg[k],yg[k]);
        frameMove[k] =  k*100/nM + "%"+ " " + "{background-position: " + p + "}"; 
        animationMove = animationMove + frameMove[k];
        // передаём КАЖДУЮ позицию, потому что не знаем, как долго будет загружаться
        positionGet = p;
    }
    for (l = 0; l <= maxPrefics; l++) {
        linkForMove[l] = document.styleSheets[document.styleSheets.length - 1];
        linkForMove[l].insertRule("@" + prefics[l] + "keyframes move-gradient " + "{" + animationMove + "}",linkForMove[l].cssRules.length); 
    }
    $(".stroke").css({"animation": "move-gradient " + TmS + " infinite running"});
    
    const CLR = [[[]]];
    const clr = [[[]]];
    CLR[0] = [[]]; clr[0] = [[]];
    CLR[1] = [[]]; clr[1] = [[]];
    CLR[2] = [[]]; clr[2] = [[]];
    CLR[3] = [[]]; clr[3] = [[]];
    
    CLR[0][1] = F0_VO; clr[0][1] = f0_vo;
    CLR[0][2] = F0_BV; clr[0][2] = f0_bv;
    CLR[0][3] = F0_OG; clr[0][3] = f0_og;
    CLR[1][0] = VO_F0; clr[1][0] = vo_f0;
    CLR[2][0] = BV_F0; clr[2][0] = bv_f0;
    CLR[3][0] = OG_F0; clr[3][0] = og_f0;
    CLR[1][3] = VO_OG; clr[1][3] = vo_og;
    CLR[3][1] = OG_VO; clr[3][1] = og_vo;
    CLR[2][1] = BV_VO; clr[2][1] = bv_vo;
    CLR[1][2] = VO_BV; clr[1][2] = vo_bv;
    CLR[3][2] = OG_BV; clr[3][2] = og_bv;
    CLR[2][3] = BV_OG; clr[2][3] = bv_og;
    
    const Γ = [[]]; 
    const γ = [[]];
    Γ[0] = []; γ[0] = [];
    Γ[1] = []; γ[1] = [];
    Γ[2] = []; γ[2] = [];
    Γ[3] = []; γ[3] = [];
    
    for (i = 0; i <= 3; i++) {
        for (j = 0; j <= 3; j++) {
            if (j !== i) {
                Γ[j][i] = "-" + Λ[j] + "-" + Λ[i];
                γ[j][i] = "-" + λ[j] + "-" + λ[i];
            }
        }
    }
        
    frameChangeGradient       = [],
        
    linkForChangeGradient     = [],
    linkForChangeBackground   = [],
    linkForChangeShadow       = [],
    linkForChangeEnter        = [],
        
    animationChangeGradient   = [[]],
    animationChangeBackground = [[]],
    animationChangeShadow     = [[]],
    animationChangeEnter      = [[]];
        
    for (i = 0; i <= 3; i++) {
        animationChangeGradient[i]   = [];
        animationChangeBackground[i] = [];
        animationChangeShadow[i]     = [];
        animationChangeEnter[i]      = [];
    }
    
    // function animationsKeyframes(i, j, t0) {    
    //     for (k = 0; k <= nC; k++) {
    //         let t = k*Tm/nM;
    //         let gradientPosition = {};
    //         switch(traectory) {
    //             case "circle": 
    //                 gradientPosition = get_xy_circle(x0, y0, r0, Tm, t0, t);
    //                 break;
    //             case "lemniscata": 
    //                 gradientPosition = get_xy_lemniscata(x0, y0, r0, Tm, t0, t);
    //                 break;
    //         }
            
    //         xg[k] = gradientPosition.x;
    //         yg[k] = gradientPosition.y;
            
    //         let p = xyToPercentStringFromNumbers(xg[k],yg[k]);
    //         frameChangeGradient[k] =  k*100/nC + "%"+ " " + "{background-position: " + p + "; background-image: radial-gradient(ellipse closest-side, " + String(CLR[j][i][k]) + ", " + String(clr[j][i][k]) + ");}";
    //         animationChangeGradient[j][i] = animationChangeGradient[j][i] + frameChangeGradient[k];
    //         if (k === nC) {
    //             positionGet = p;
    //         }
    //     }
    //     for (l = 0; l <= maxPrefics; l++) {
    //         linkForChangeGradient[l] = document.styleSheets[document.styleSheets.length - 1];
    //         linkForChangeGradient[l].insertRule("@" + prefics[l] + "keyframes change-gradient" + Γ[j][i] + " {" + animationChangeGradient[j][i] + "}",linkForChangeGradient[l].cssRules.length);
            
    //         linkForChangeBackground[l] = document.styleSheets[document.styleSheets.length - 1];
    //         animationChangeBackground[j][i] = "from {background-image: url(images/backgrounds/" + Λ[j] + ".jpg);} to {background-image: url(images/backgrounds/" + Λ[i] + ".jpg);}";
    //         linkForChangeBackground[l].insertRule("@" + prefics[l] + "keyframes change-background" + Γ[j][i] + " {" + animationChangeBackground[j][i] + "}",linkForChangeBackground[l].cssRules.length);
           
    //         linkForChangeShadow[l] = document.styleSheets[document.styleSheets.length - 1];
    //         animationChangeShadow[j][i] = "from {text-shadow: " + shadow[j] + 
    //                                      ";} to {text-shadow: " + shadow[i] + ";}";
    //         linkForChangeShadow[l].insertRule("@" + prefics[l] + "keyframes change-shadow" + Γ[j][i] + " {" + animationChangeShadow[j][i] + "}",linkForChangeShadow[l].cssRules.length);
            
    //         linkForChangeEnter[l] = document.styleSheets[document.styleSheets.length - 1];
    //         animationChangeEnter[j][i] = "from {color: " + csv[j].enter[1] + "; border-color: " + csv[j].enter[1] + "; text-shadow: " + csv[j].enter[2] +" 0.3vmin 0.6vmin;" +
    //                                       "box-shadow: " +   deep_1_0[j] + deep_p10_p10_1[j] + 
    //                                     ";} to {color: " + csv[i].enter[1] + "; border-color: " + csv[i].enter[1] + "; text-shadow: " + csv[i].enter[2] +" 0.3vmin 0.6vmin;" +
    //                                       "box-shadow: " +   deep_1_0[i] + deep_p10_p10_1[i] + ";}";
    //         linkForChangeEnter[l].insertRule("@" + prefics[l] + "keyframes change-enter" + Γ[j][i] + " {" + animationChangeEnter[j][i] + "}",linkForChangeEnter[l].cssRules.length);
    //     }
    //     return positionGet;
    // }
    
    
    // $("." + λ[1]).on("click", console.log("1 vo")); 
    // $("." + λ[2]).on("click", console.log("2 bv"));
    // $("." + λ[3]).on("click", console.log("3 og"));
    
    // $("." + λ[1]).on("click", function(){colorSchemeVariant(1)}); 
    // $("." + λ[2]).on("click", function(){colorSchemeVariant(2)});
    // $("." + λ[3]).on("click", function(){colorSchemeVariant(3)});
    
    ///////////// Анимация изменения градиента /////////////////////////////
    ////// лучше определять её здесь, заранее, тогда она не дёргается //////
    // for (i = 0; i <= 3; i++) {
    //     for (j = 0; j <= 3; j++) {
    //         if (j !== i) {
    //             //console.log("i !== j");
    //             animationsKeyframes(i, j, 0);
    //         }
    //     }
    // }
}

function self(CSV) {
    dataStatic(CSV);
    dataChanges(CSV);
    
    $("body").css({"animation": "on " + 1.2 + " ease-in-out 1"});
    $("body").css({"filter": "brightness(1) blur(0.0vh)"});
            
    function iColorSchemeVariant(CSV) {
        switch (CSV) {
            case 0:
                $("body").css({"background-image": "none"});
                $("canvas").css({"filter": "grayscale(40%)"});
                $("select-csv").css({"display": "none"});
                break;
            case 1:
                $("body").css({"background-image": "url(images/backgrounds/VO-25.jpg)"});
                $("canvas").css({"filter": "grayscale(0%)"});
                $(".select-csv").css({"background-color": csv[CSV].enter[4]});
                break;
            case 2:
                $("body").css({"background-image": "url(images/backgrounds/BV-25.jpg)"});
                $("canvas").css({"filter": "grayscale(0%)"});
                $(".select-csv").css({"background-color": csv[CSV].enter[4]});;
                break;
            case 3:
                $("body").css({"background-image": "url(images/backgrounds/OG-25.jpg)"});
                $("canvas").css({"filter": "grayscale(0%)"});
                $(".select-csv").css({"background-color": csv[CSV].enter[4]});
                break;
        }
        
        $("link[rel$=icon]").remove();
        $("head").append($('<link rel="shortcut icon" type="image/png"/>').attr("href", href="images/logo/icogon.png"));
        
        $("#modal-window" ).css({"background-color": csv[CSV].enter[4]});
        $("#modal-window" ).css({"border-color": csv[CSV].enter[1]}); 
        $(".stroke-h2").css({"background-image": "radial-gradient(ellipse closest-side, " + CS[CSV] + ", " + cs[CSV] + ")"});
        $(".stroke-h2" ).css({"animation": "move-gradient " + TmS_h2  + " infinite reverse running"});
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $("#close-button-test, #close-button-game, #close-button-test-set, #close-button-game-set, begin, end, s-begin, s-end, update-button, set-button, help-button, auto-button, exchange-button, pause, s-pause").css({"border-color": csv[CSV].enter[1]});
        $("#close-button-test, #close-button-game, #close-button-test-set, #close-button-game-set,begin, end, s-begin, s-end, update-button, set-button, help-button, auto-button, exchange-button").css({"color": csv[CSV].enter[1]});
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $("#close-button-test, #close-button-game, #close-button-test-set, #close-button-game-set, begin, end").css({"text-shadow": csv[CSV].enter[2] +" 0.3vmin 0.5vmin"});
        $("#close-button-test, #close-button-game, #close-button-test-set, #close-button-game-set, begin, end, s-begin, s-end").hover(
            function() {
                $(this).css({"background": csv[CSV].enter[3]});
                $(this).css({"transition": "background 1s"});
            },
            function() {
                $(this).css({"background": "#000000b3"});
                $(this).css({"transition": "background 1s"});
            } 
        );
        $("update-button, set-button, help-button, auto-button, exchange-button").css({"background": csv[CSV].enter[3]});
        $("update-button, set-button, help-button, auto-button, exchange-button").hover(
            function() {
                $(this).css({"background": csv[CSV].enter[1]});
                $(this).css({"transition": "background 1.5s"});
            },
            function() {
                $(this).css({"background": csv[CSV].enter[3]});
                $(this).css({"transition": "background 1.5s"});
            } 
        );
        $("pause, s-pause").css({"background": csv[CSV].enter[3]});
        $("pause, s-pause").hover(
            function() {
                $(this).css({"background": csv[CSV].enter[1]});
            },
            function() {
                $(this).css({"background": csv[CSV].enter[3]});
            } 
        );
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $("#close-button-test, #close-button-game, #close-button-test-set, #close-button-game-set, begin, end").css({"box-shadow":  deep_1_0[CSV] + deep_0_p10_1[CSV]});
        $("#close-button-test, #close-button-game, #close-button-test-set, #close-button-game-set, begin, end").mousedown(
            function() {
                $(this).css({"box-shadow": deep_1_0[CSV] + deep_0_p4_1[CSV]});
            }
        );
        $("#close-button-test, #close-button-game, #close-button-test-set, #close-button-game-set, begin, end").on("touchstart", function(e) {
            $(this).css({"box-shadow": deep_1_0[CSV] + deep_0_p4_1[CSV]});
        });   
        $("#close-button-test, #close-button-game, #close-button-test-set, #close-button-game-set, begin, end").mouseup(
            function() {
                $(this).css({"box-shadow": deep_1_0[CSV] + deep_0_p10_1[CSV]});
            }
        );
        $("#close-button-test, #close-button-game, #close-button-test-set, #close-button-game-set, begin, end").on("touchend", function(e) {
            $(this).css({"box-shadow": deep_1_0[CSV] + deep_0_p10_1[CSV]});
        });
        
        // touch можно здесь, а можно в css — без разницы 
        $("l").css({"box-shadow":  deep_1_0[CSV] + deep_p10_p10_1[CSV]});
        $("l").mousedown(
            function() {
                $(this).css({"box-shadow": deep_1_0[CSV] + deep_p4_p4_1[CSV]});
                $(this).css({"top": "0.6vh"});
                $(this).css({"left": "0.6vh"});
            }
        );
        $("l").on("touchstart", function(e) {
            $(this).css({"box-shadow": deep_1_0[CSV] + deep_p4_p4_1[CSV]});
            $(this).css({"top": "0.6vh"});
            $(this).css({"left": "0.6vh"});
        });
        $("l").mouseup(
            function() {
                $(this).css({"box-shadow": deep_1_0[CSV] + deep_p10_p10_1[CSV]});
                $(this).css({"top": "0"});
                $(this).css({"left": "0"});
            }
        );
        $("l").on("touchend", function(e) {
            $(this).css({"box-shadow": deep_1_0[CSV] + deep_p10_p10_1[CSV]});
            $(this).css({"top": "0"});
            $(this).css({"left": "0"});
        });
        
        $("d").css({"box-shadow":  deep_1_0[CSV] + deep_n10_p10_1[CSV]});
        $("d").mousedown(
            function() {
                $(this).css({"box-shadow": deep_1_0[CSV] + deep_n4_p4_1[CSV]});
                $(this).css({"top": "0.6vh"});
                $(this).css({"right": "0.6vh"});
            }
        );
        $("d").on("touchstart", function(e) {
            $(this).css({"box-shadow": deep_1_0[CSV] + deep_n4_p4_1[CSV]});
            $(this).css({"top": "0.6vh"});
            $(this).css({"right": "0.6vh"});
        });
        $("d").mouseup(
            function() {
                $(this).css({"box-shadow": deep_1_0[CSV] + deep_n10_p10_1[CSV]});
                $(this).css({"top": "0"});
                $(this).css({"right": "0"});
            }
        );
        $("d").on("touchend", function(e) {
            $(this).css({"box-shadow": deep_1_0[CSV] + deep_n10_p10_1[CSV]});
            $(this).css({"top": "0"});
            $(this).css({"right": "0"});
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $("pause, s-pause").css({"background": "radial-gradient(ellipse farthest-corner at 50% 50%, " + CS[CSV] + ", " + cs[CSV]});
        $("pause, s-pause").css({"color": CS[CSV]});
        $("pause").css({"box-shadow":  deep_1_0[CSV] + deep_0_p10_1[CSV]});
        $("pause").hover(
            function() {
                $(this).css({"background": "radial-gradient(ellipse farthest-corner at 50% 50%, " + cs[CSV] + ", " + CS[CSV]});
            },
            function() {
                $(this).css({"background": "radial-gradient(ellipse farthest-corner at 50% 50%, " + CS[CSV] + ", " + cs[CSV]});
            }
        );
        $("pause").mousedown(
            function() {
                $(this).css({"background": "radial-gradient(ellipse farthest-corner at 50% 50%, " + cs[CSV] + ", " + CS[CSV]});
                $(this).css({"box-shadow": deep_1_0[CSV] + deep_0_p4_1[CSV]});
            }
        );
        $("pause").on("touchstart", function(e) {
            $(this).css({"background": "radial-gradient(ellipse farthest-corner at 50% 50%, " + cs[CSV] + ", " + CS[CSV]});
            $(this).css({"box-shadow": deep_1_0[CSV] + deep_0_p4_1[CSV]});
        });
        $("pause").mouseup(
            function() {
                $(this).css({"background": "radial-gradient(ellipse farthest-corner at 50% 50%, " + CS[CSV] + ", " + cs[CSV]});
                $(this).css({"box-shadow": deep_1_0[CSV] + deep_0_p10_1[CSV]});
            }
        );
        $("pause").on("touchend", function(e) {
            $(this).css({"background": "radial-gradient(ellipse farthest-corner at 50% 50%, " + CS[CSV] + ", " + cs[CSV]});
            $(this).css({"box-shadow": deep_1_0[CSV] + deep_0_p10_1[CSV]});
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $(".shadow-fix-icogon").css({"text-shadow": ic0deep[CSV]});
       
        $("update-button, set-button, help-button, auto-button, exchange-button").css({"box-shadow":  deep_1_0[CSV] + deep_0_n10_1[CSV]});
        $("update-button, set-button, help-button, auto-button, exchange-button")
        .mousedown(
            function() {
                $(this).css({"box-shadow": deep_1_0[CSV] + deep_0_n4_1[CSV]});
            }
        );
        $("update-button, set-button, help-button, auto-button, exchange-button")
        .mouseup(
            function() {
                $(this).css({"box-shadow": deep_1_0[CSV] + deep_0_n10_1[CSV]});
            }
        );
        $("update-button, set-button, help-button, auto-button, exchange-button").on("touchstart", function(e) {
            $(this).css({"box-shadow": deep_1_0[CSV] + deep_0_n4_1[CSV]});
        });
        
        $("update-button, set-button, help-button, auto-button, exchange-button").on("touchend", function(e) {
            $(this).css({"box-shadow": deep_1_0[CSV] + deep_0_n10_1[CSV]});
        });
    } 
    iColorSchemeVariant(CSV);
    
    if (CSV !== 0) {
        $("l")   .css({"box-shadow": "none"});
        $("d")   .css({"box-shadow": "none"});
        $("l")   .css({"pointer-events": "none"});
        $("d")   .css({"pointer-events": "none"});
        $("s-l").css({"pointer-events": "none" });
        $("s-d").css({"pointer-events": "none" });
    }
    if (CSV === 0) {
        $("l")   .css({"box-shadow": "auto"});
        $("d")   .css({"box-shadow": "auto"});
        $("l")   .css({"pointer-events": "auto"});
        $("d")   .css({"pointer-events": "auto"});
        $("s-l").css({"pointer-events": "auto" });
        $("s-d").css({"pointer-events": "auto" });
    }
    if (play) {
        chooseCSVpauseSign(CSV);
        small_unblock();
        availability("d", !queue);
        availability("l", queue);
    }
    if (!play) {
        chooseCSVplaySign(CSV);
        small_block();
    }
}

function certainlyExecutable(i) {
    switch (i) {
        case 0:
            $(".picture").css({"background-image": "url(/images/empty/0empty.png)"});
            $(".logo").css({"background-image": "url(/images/logo/circ00.png)"}); 
            $(".fon").css({"filter": "grayscale(100%)"});
            $(".emblem").css({"filter": "grayscale(100%)"});
            $(".stroke").css({"background-image": "radial-gradient(ellipse closest-side, " + F0 + ", " + f0 + ")"});
            $("#modal-window" ).css({"background-color": mico[0]}); 
            $("#modal-window" ).css({"border-color": csv[0].enter[1]}); 
            $("#result-window").css({"background-color": mico[0]}); 
            $("#result-window" ).css({"border-color": csv[0].enter[1]}); 
            break;
        case 1:
            $(".picture").css({"background-image": "url(/images/empty/1empty.png)"}); 
            $(".logo").css({"background-image": "url(/images/logo/circVO.png)"});
            $(".fon").css({"background-image": "url(/images/backgrounds/VO.jpg)"});
            $(".emblem").css({"background-image": "url(/images/emblems/VO.gif)"});
            $(".fon").css({"filter": "grayscale(0)"});
            $(".emblem").css({"filter": "grayscale(0)"});
            $(".stroke").css({"background-image": "radial-gradient(ellipse closest-side, " + VO + ", " + vo + ")"});
            $("#modal-window" ).css({"background-color": mico[1]}); 
            $("#modal-window" ).css({"border-color": csv[1].enter[1]});
            $("#result-window").css({"background-color": mico[1]}); 
            $("#result-window" ).css({"border-color": csv[1].enter[1]});
            break;
        case 2:
            $(".picture").css({"background-image": "url(/images/empty/2empty.png)"}); 
            $(".logo").css({"background-image": "url(/images/logo/circBV.png)"});
            $(".fon").css({"background-image": "url(/images/backgrounds/BV.jpg)"});
            $(".emblem").css({"background-image": "url(/images/emblems/BV.gif)"});
            $(".fon").css({"filter": "grayscale(0)"});
            $(".emblem").css({"filter": "grayscale(0)"});
            $(".stroke").css({"background-image": "radial-gradient(ellipse closest-side, " + BV + ", " + bv + ")"});
            $("#modal-window" ).css({"background-color": mico[2]}); 
            $("#modal-window" ).css({"border-color": csv[2].enter[1]});
            $("#result-window").css({"background-color": mico[2]}); 
            $("#result-window" ).css({"border-color": csv[2].enter[1]});
            break;
        case 3:
            $(".picture").css({"background-image": "url(/images/empty/3empty.png)"}); 
            $(".logo").css({"background-image": "url(/images/logo/circOG.png)"});
            $(".fon").css({"background-image": "url(/images/backgrounds/OG.jpg)"});
            $(".emblem").css({"background-image": "url(/images/emblems/OG.gif)"});
            $(".fon").css({"filter": "grayscale(0)"});
            $(".emblem").css({"filter": "grayscale(0)"});
            $(".stroke").css({"background-image": "radial-gradient(ellipse closest-side, " + OG + ", " + og + ")"});
            $("#modal-window" ).css({"background-color": mico[3]}); 
            $("#modal-window" ).css({"border-color": csv[3].enter[1]});
            $("#result-window").css({"background-color": mico[3]});
            $("#result-window" ).css({"border-color": csv[3].enter[1]});
            break;
    }
    
    if ( !DetectDevice() 
        && shader_On_Off) {
        drawShader();
    }
        
    $(".shadow").css({"text-shadow": shadow[i]});
    $("logo").css({"box-shadow":  deep_1_0[i] + deep_0_p10_1[i]}); 
    $("logo")
    .mousedown(
        function() {
            $(this).css({"box-shadow": deep_1_0[i] + deep_0_p4_1[i]}); 
        }
    );
    $("logo")
    .mouseup(
        function() {
            $(this).css({"box-shadow": deep_1_0[i] + deep_0_p10_1[i]});
        }
    );
    $("#up, #down, #down0").css({"background-color": csv[i].updown});
    $("#column").css({"background-color": csv[i].column});
    $("#fon-content").css({"background-color": "#000000"});
    $("#navLeft a, #navCentre a, #navRight a"  ).css({"text-shadow": menu_shadow[i]});
    $("#navLeft a, #navCentre a, #navRight a").css({"color": csv[i].nav});
    $("#navLeft a, #navCentre a, #navRight a")
    .hover(
        function() {
            $(this).css({"color": csv[i].main[1]}); 
            $(this).css({"transition": "color 0.7s"});
        },
        function() {
            $(this).css({"color": csv[i].nav}); 
            $(this).css({"transition": "color 0.7s"});
        } 
    );
    $("#navLeft a, #navCentre a, #navRight a")
    .mousedown(
        function() {
            $(this).css({"color": "#cccccc"}); 
        }
    );
    $("avatar, loadavatar, enter, exit").css({"border-color": csv[i].enter[1]});
    $("avatar, loadavatar, enter, exit").css({"color": csv[i].enter[1]});
    $("avatar, loadavatar, enter, exit").css({"text-shadow": csv[i].enter[2] +" 0.3vmin 0.6vmin"});
    $("avatar, loadavatar").css({"box-shadow":  deep_1_0[i] + deep_n10_p10_1[i]});
    $("avatar, loadavatar")
    .mousedown(
        function() {
            $(this).css({"box-shadow": deep_1_0[i] + deep_n4_p4_1[i]});
        }
    );
    $("avatar, loadavatar")
    .mouseup(
        function() {
            $(this).css({"box-shadow": deep_1_0[i] + deep_n10_p10_1[i]});
        }
    );
    $("enter, exit       ").css({"box-shadow":  deep_1_0[i] + deep_p10_p10_1[i]});
    $("enter, exit, avatar, loadavatar")
    .hover(
        function() {
            $(this).css({"background": csv[i].enter[3]});
            $(this).css({"transition": "background 0.7s"});
        },
        function() {
            $(this).css({"background": "#000000b3"});
            $(this).css({"transition": "background 0.7s"});
        } 
    );
    $("enter, exit")
    .mousedown(
        function() {
            $(this).css({"box-shadow": deep_1_0[i] + deep_p4_p4_1[i]});
        }
    );
    $("enter, exit")
    .mouseup(
        function() {
            $(this).css({"box-shadow": deep_1_0[i] + deep_p10_p10_1[i]});
        }
    ); 
}
    
function conditionallyExecutable(i, j) {
    ////// Зафиксировать позицию по клику
    positionTouch = $(".stroke").css("background-position");
    xyFromPercentStringToNumbers(positionTouch);
    xCatched = gradientPosition.x.toFixed(4);
    yCatched = gradientPosition.y.toFixed(4);
    // normalization2D(x0, y0, r0, xCatched, yCatched);
    xNormilized = Number(gradientPosition.x.toFixed(4));
    yNormilized = Number(gradientPosition.y.toFixed(4));
    // console.log((xNormilized - x0).toFixed(4), (yNormilized-y0).toFixed(4));
    p = xyToPercentStringFromNumbers(xNormilized,yNormilized);
  
    switch(traectory) {
        case "circle": 
            t0 = get_t_circle(x0, y0, r0, Tm, xNormilized, yNormilized);
            break;
        case "lemniscata": 
            t0 = get_t_lemniscata(x0, y0, r0, Tm, xNormilized, yNormilized);
            break;
    }
        
    positionGet = animationsKeyframes(i, j, t0);
    // помимо передачи positionGet ещё и фиксируем позицию, для гладкости
    $(".stroke").css({"background-position": positionGet});
    ////////////////////////// ПЕРЕХОДЫ цветовых схем //////////////////////////////////
    $(".stroke")                              .css({"animation": "change-gradient"   + Γ[j][i] + " " + TcS + " ease-in-out 1"});
    $(".logo")                                .css({"animation": "change-logo"       + Γ[j][i] + " " + TcS + " ease-in-out 1"});
    $(".shadow")                              .css({"animation": "change-shadow"     + Γ[j][i] + " " + TcS + " ease-in-out 1"});
    $("enter, exit")                          .css({"animation": "change-enter"      + Γ[j][i] + " " + TcS + " ease-in-out 1"});
    $("avatar, loadavatar")                   .css({"animation": "change-avatar"     + Γ[j][i] + " " + TcS + " ease-in-out 1"});
    $(".picture")                             .css({"animation": "change-0ava"       + Γ[j][i] + " " + TcS + " ease-in-out 1"});
    $("#navLeft a, #navCentre a, #navRight a").css({"animation": "change-nav"        + Γ[j][i] + " " + TcS + " ease-in-out 1"});
    $("#up, #down, #down0")                   .css({"animation": "change-updown"     + Γ[j][i] + " " + TcS + " ease-in-out 1"});
    $("#column")                              .css({"animation": "change-column"     + Γ[j][i] + " " + TcS + " ease-in-out 1"});
    $(".emblem")                              .css({"animation": "change-emblem"     + Γ[j][i] + " " + TcS + " ease-in-out 1"});
    $(".fon")                                 .css({"animation": "change-background" + Γ[j][i] + " " + TcS + " ease-in-out 1"});
    
    shader_On_Off = false; // пока КОСТЫЛЬ: просто отключает шейдер при переключении цветовой схемы
    window.cancelAnimationFrame(animateShader);
    animateShader = undefined; 
    for (i = 1; i <= nTags; i++){
        deleteChild(i);
    } 
}

//Безусловное оформление кнопок
$(document).ready(function () {
    $("user-opponent"   ).css({ "color": neutralHTML });
    $("l"               ).css({ "color": lightHTML});
    $("d"               ).css({ "color": darkHTML });
    $("l"               ).css({ "border-color": lightHTML});
    $("d"               ).css({ "border-color": darkHTML });
});

// Оформление начальной конфигурации
startConfiguration = () => {
    $(".small-picture").css({"display": "none"});
    $(".s-picture").css({"display": "none"});
        
    if (queue) {
      $("d").css({"border-color": "rgba(0,0,0,0)"});
      $("l").css({"border-color": lightHTML});
    }
    if (!queue) {
      $("l").css({ "border-color": "rgba(0,0,0,0)"});
      $("d").css({ "border-color": darkHTML });
    }
    
    $("s-l").css({"color": lightHTML});
    $("s-l").css({"border-color": lightHTML});
    $("s-d").css({"color": darkHTML });
    $("s-d").css({"border-color": darkHTML });
    
    block();
    availability("pause", true);
    availability("avatar", false);
    canvas_n_pause();
    availability("automove", false);
     
    queue = true;  // переход ХОДА на светлых
    move =1;       // следующий № хода
    
    makeSystem();
    
    play = false;
    conditionDecoration(unit[0]);
    console.log("timer: ", timer);
    table0();
};

// "Обнуление" таблицы состояния
table0 = () => {
    //elemOmega.innerHTML = "баланс";
    elemCheckMate.innerHTML = "процесс";
    elemTime.innerHTML = "таймер";
    elemField.innerHTML = "клетка";
    elemUnit.innerHTML = "фигура";
    elemMove.innerHTML  = "ход";
 
    elemOmega.style.backgroundColor = "#00000000";
    elemCheckMate.style.backgroundColor = "#00000000";
    elemTime.style.backgroundColor = "#00000000";
    elemField.style.backgroundColor = "#00000000";
    elemUnit.style.backgroundColor = "#00000000";
    elemMove.style.backgroundColor = "#00000000";
  
    elemOmega.style.color = neutralHTML;
    elemCheckMate.style.color = neutralHTML;
    elemTime.style.color = neutralHTML;
    elemField.style.color = neutralHTML;
    elemUnit.style.color = neutralHTML;
    elemMove.style.color = neutralHTML;
};

// Оформление таблицы состояния
function conditionDecoration(unit) {
    showTargetFunction(typeΩfull(system));
    showCondition();
    showField(unit.field);
    showUnit (unit);
    showMove (move);
}
function showField(field) {
    if (field.index != 0) {
        if (field.unit.mark) {
            if (field.color == "red") {
                elemField.style.color = "#aa3333";
                elemField.style.backgroundColor = "#00000000";
            }
            if (field.color == "blue") {
                elemField.style.color = "#3333aa";
                elemField.style.backgroundColor = "#00000000";
            }
            if (field.color == "green") {
                elemField.style.color = "#33aa33";
                elemField.style.backgroundColor = "#00000000";
            }
        }
        if (!field.unit.mark) {
            if (field.color == "red") {
                elemField.style.color = "#885555";
                elemField.style.backgroundColor = "#00000000";
            }
            if (field.color == "blue") {
                elemField.style.color = "#555588";
                elemField.style.backgroundColor = "#00000000";
            }
            if (field.color == "green") {
                elemField.style.color = "#558855";
                elemField.style.backgroundColor = "#00000000";
            }
        }
        elemField.innerHTML = field.name;
    } else {
        elemField.innerHTML = " ";
    }
}
function showUnit(unit) {
    let mark  = unit.mark;
    let side  = unit.side;
    elemUnit.style.backgroundColor = "#00000000";
    if (mark && side === lightSide) {
        elemUnit.style.color = lightHTML;
    }
    if (mark &&  side === darkSide) {
        elemUnit.style.color = darkHTML;
    }
    if (!mark && side === lightSide) {
        elemUnit.style.color = deadLightHTML;
    }
    if (!mark && side === darkSide) {
        elemUnit.style.color = deadDarkHTML;
    }
    if (queue === uQueue && unit === empty) {
        elemUnit.style.color = brightHTML;
    }
    if (queue !== uQueue && unit === empty) {
        elemUnit.style.color = neutralHTML;
    }
    elemUnit.innerHTML = unit.name;
}
function showMove(move) {
    elemMove.innerHTML = move + "-й ход ";
    elemMove.style.backgroundColor = "#00000000";
    if (queue) {
        elemMove.style.color = lightHTML;
    }
    if (!queue) {
        elemMove.style.color = darkHTML;
    }
}
function showTime(tShow) {
    if (timerView) {
        if (timer) {
            elemTime.innerHTML = dateFormat(tShow);
            
            if (tShow < 0) {
                tShow = 0;
            }
            if (queue) {
                    elemTime.style.color = lightHTML;
                    elemTime.style.backgroundColor = "#00000000";
                }
            else if (!queue) {
                    elemTime.style.color = darkHTML;
                    elemTime.style.backgroundColor = "#00000000";
                }
            else {
                elemTime.style.color = neutralHTML;
                elemTime.style.backgroundColor = "#00000000";
            } 
        }
        else {
            elemTime.innerHTML = tShow;
            elemTime.style.color = redHTML;
            elemTime.style.backgroundColor = "#00000000";
        }
    }
    if (!timerView) {
        elemTime.innerHTML = "таймер";
        elemTime.style.color = "#ff0000";
        elemTime.style.backgroundColor = "#0000ff55";
    }    
}  
function showCondition() {
    if (CONDITION !== TIME) {
        if (STATUSCOLOR === lightHTML) {
            elemCheckMate.style.color = lightHTML;
            elemCheckMate.style.backgroundColor = "#00000000";
        }
        if (STATUSCOLOR === darkHTML) {
            elemCheckMate.style.color = darkHTML;
            elemCheckMate.style.backgroundColor = "#00000000";
        }
        if (STATUSCOLOR === brightHTML) {
            elemCheckMate.style.color = brightHTML;
            elemCheckMate.style.backgroundColor = "#00000000";
        }
        elemCheckMate.innerHTML = CONDITION;
    }
}  
function showTargetFunction(F) {
    if (F  >  0) {
        elemOmega.style.color = lightHTML;
        elemOmega.style.backgroundColor = "#00000000";
    }
    if (F === 0) {
        elemOmega.style.color = brightHTML;
        elemOmega.style.backgroundColor = "#00000000";
    }
    if (F  <  0) {
        elemOmega.style.color = darkHTML;
        elemOmega.style.backgroundColor = "#00000000";
    }
    elemOmega.innerHTML = "Ω = " + sign(F) + F;
}

const   gsblur = "grayscale(70%) blur(1.7vh)";
const nogsblur = "grayscale( 0%) blur(0vh)";
const gs       = "grayscale(95%)";
const gs80     = "grayscale(80%)";
const nogs     = "grayscale(0%)";

function availability(element, available) {
    switch (available) {
        case true: 
            $(element).css({"pointer-events": "auto"});
            $(element).css({ "filter": nogs});
            $(element).css({ "filter": nogsblur});
            break;
        case false: 
            $(element).css({"pointer-events": "none"});
            $(element).css({ "filter": gs});
            $(element).css({ "filter": gsblur});
            break;
    }
}

canvas_n_pause = () => {
    for (count = 0; count <= 3; count++) {
        if (count === CSV) {
            $(".small-picture-play-" +count).css({"display": "flex" }); 
            $(".small-picture-pause-"+count).css({"display": "none" });
            $(".s-picture-play-" +count).css({"display": "flex" }); 
            $(".s-picture-pause-"+count).css({"display": "none" });
        }
        if (count !== CSV) {
            $(".small-picture-pause-"+count).css({"display": "none" });
            $(".small-picture-play-" +count).css({"display": "none" });
            $(".s-picture-play-" +count).css({"display": "none" }); 
            $(".s-picture-pause-"+count).css({"display": "none" });
        }
    }
};

block_list = (available) => {
    availability("camera", available);
    availability("l", available);
    availability("d", available);
};

block = () => {
    availability("pause", false);
    block_list(false);
    $("canvas").css({"filter": gsblur});
};

unblock = () => {
    availability("pause", true);
    block_list(true);
    $("canvas").css({ "filter": nogsblur});
    if (CSV === 0) {
        $("canvas").css({"filter": "grayscale(60%)"});
    }
};

small_block = () => {
    block_list(false);
    $("canvas").css({ "filter": gsblur});
};

small_unblock = () => {
    block_list(true);
    $("canvas").css({ "filter": nogsblur});
    if (CSV === 0) {
        $("canvas").css({"filter": "grayscale(60%)"});
    }
};

final_block = () => {
    for (count = 1; count <= 3; count++) {
        $(".small-picture-play-" +count).css({"display": "none" }); 
        $(".small-picture-pause-"+count).css({"display": "none" });
        $(".s-picture-play-" +count).css({"display": "none" }); 
        $(".s-picture-pause-"+count).css({"display": "none" });
    }
    $(".small-picture").css({"display": "flex"});
    $(".small-picture").css({"pointer-events": "none" });
    $(".s-picture").css({"display": "flex" }); 
    $(".s-picture").css({"display": "none" });
    
    availability("pause", false);
    block_list(false);
};