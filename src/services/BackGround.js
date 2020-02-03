import * as d3 from 'd3'



/*
Diese Klass nimmt ein xScale als Parameter(mit function readTicks()), 
gibt 
ein Array mit X-Koordination          (mit function creatXpos()), 
ein Array mit Opacity von allen rects (mit function creatOpacity()),
ein Array mit widths von allen rects  (mit function getWds())
zurück
*sehe function creatBackGround() in D3Sample.js
*/

class BackGround {
    constructor() {
        this.xLen = -1;
        this.rectH = 370; //reguläre Hight von rects, fertig!
        this.rectWs = []; //widths von rects für output, fertig!
        this.xPos = []; //xposition von ticks für output, fertig!
        this.tickArray = []; //ticks für inere Verwendung, fertig!
        this.in6StufeOpacity = [0.4,0.6,0.8,0.7,0.6,0.4] //6 stufen Opacity für innere Verwendung
        this.in12StufeOpacity = [0.4,0.5,0.6,0.7,0.8,0.9,0.8,0.7,0.6,0.5,0.4,0.3] //12 stufen Opacity für innere Verwendung
        this.in7stufeOpacity = [0.5, 0.6, 0.7, 0.8, 0.7, 0.6, 0.5] //7 stufen Opacity für innere Verwendung
        this.in5stufeOpacity = [0.4, 0.6, 0.7, 0.6, 0.4]
        this.in15StufeOpacity = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2] //15 stufen Opacity für innere Verwendung
        this.in30StufeOpacity = [0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.9,0.85,0.8,0.75,0.7,0.65,0.6,0.55,0.5,0.45,0.4,0.35,0.3,0.25,0.2]
        this.in24StufeOpacity = [0.2, 0.3, 0.35, 0.4, 0.5, 0.55, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.9,0.85,0.8,0.75,0.7,0.6,0.55,0.5,0.4,0.35,0.3,0.2]

    }
    //füge ein ein date-pading ein, die Zeitabstand stimmt mit der von folgenden Ticks überein.
    //读取ticks的日期，并且在index0位置加入一个与后续等距的date
    readTicks(d) {
        this.xLen = d.range()[1];
        let diff = d.ticks()[1] - d.ticks()[0];
        let firstDate = new Date(d.ticks()[0].getTime() - diff);
        this.tickArray[0] = firstDate;
        this.tickArray = this.tickArray.concat(d.ticks());
        return this.tickArray;
    }
    //erzeuge ein Array mit x-position von allen ticks
    //第一个位x(0),其他的为scale的绝对位置
    creatXpos(d) {
        this.tickArray.map((e, i) => i == 0 ? this.xPos[i] = 0 : this.xPos[i] = d(e))
        return this.xPos;
    }
    // erzeuge widths für allen rects.
    getWds() {
        this.xPos.forEach((d, i) => i == this.xPos.length - 1 ? this.rectWs[i] = this.xLen - this.xPos[i] : this.rectWs[i] = this.xPos[i + 1] - d)
        this.rectWs.forEach((d, i) => d > 1 ? this.rectWs[i] -= 1 : d)
        return this.rectWs;

    }

    ticksFormat() {
        if (this.tickArray.length <= 2) {
            return 'intraday';
        } else {
            let tickStep = this.tickArray[2].getTime() - this.tickArray[1].getTime()
            let result = '';
            if (tickStep >= 350 * 24 * 60 * 60 * 1000) {
                result = 'yearly'
            } else if (tickStep >= 4 * 7 * 24 * 60 * 60 * 1000) {
                result = 'monthly'
            } else if (tickStep >= 6 * 24 * 60 * 60 * 1000 + 23*60*60*1000) {
                result = 'weekly'
            } else if (tickStep >= 12 * 60 * 60 * 1000) {
                result = 'daily'
            } else if (tickStep >= 6 * 60 * 60 * 1000) {
                result = '6hourly'
            } else if (tickStep >= 60 * 60 * 1000) {
                result = 'hourly'
            } else if (tickStep >= 30 * 60 * 1000) {
                result = 'halfhour'
            } else if (tickStep >= 15 * 60 * 1000) {
                result = 'quarter'
            } else if (tickStep >= 5 * 60 * 1000) {
                result = '5min'
            } else {
                result = 'min'
            }
            return result;
        }
    }
    //erzeuge Opacity für allen ticks, hängt von mod und Abstand zwischen Ticks ab, bzw. 'yearly' ...usw.

    creatOpacity() {
        var ticksFormat = this.ticksFormat()
        switch (ticksFormat) {
            case 'yearly':
                return this.creatYearlyOpacity()
            case 'monthly':
                return this.creatMonthlyOpacity()
            case 'weekly':
                return this.creatWeeklyOpacity()
            case 'daily':
                return this.creatInDailyOpcaity()
            case '6hourly':
                return this.creat6HourlyOpacity()
            case 'hourly':
                return this.creatHourlyOpacity()
            case 'halfhour':
                return this.creathalfhourlyOpacity()
            case 'quarter':
                return this.creatQuarterOpacity()
            case '5min':
                return this.creat5minOpacity()
            case 'min':
                return this.creatminOpacity()

        }
    }



    creatYearlyOpacity() {
        let OpacitySeed = []
        let rectOpacity = []
        //console.log("creatYearlyOpacity")
        OpacitySeed = this.in6StufeOpacity
        let yearBase = this.tickArray[0].getFullYear()
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getFullYear() - yearBase])
        return rectOpacity;
    }


    //erzeuge monthlyOpacity
    creatMonthlyOpacity() {
        let OpacitySeed = []
        let rectOpacity = []
        //console.log("creatMonthlyOpacity")
        console.log("in6StufeOpacity")
        OpacitySeed = this.in6StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getMonth() % 6]);
        return rectOpacity;
    }

    creatWeeklyOpacity() {
        let OpacitySeed = []
        let rectOpacity = []
        console.log("creatWeeklyOpacity")
        OpacitySeed = this.in30StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getDate()]);

        return rectOpacity;
    }




    creatInDailyOpcaity() {
        let OpacitySeed = []
        let rectOpacity = []
        console.log("creatInDailyOpcaity")
        OpacitySeed = this.in15StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getDate() % 15]);
        return rectOpacity;

    }
    creat6HourlyOpacity(){
        console.log("creat6HourlyOpacity")
        let OpacitySeed = []
        let rectOpacity = []
        OpacitySeed = this.in24StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getHours()]);
        console.log("rectOpacity",rectOpacity)
        return rectOpacity;
    }


    creatHourlyOpacity() {
        console.log("creatHourlyOpacity")
        let OpacitySeed = []
        let rectOpacity = []
        OpacitySeed = this.in12StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getHours() % 12]);
        return rectOpacity;

    }


    creatQuarterOpacity() {
        //console.log("creatQuarterOpacity")
        let OpacitySeed = []
        let rectOpacity = []
        OpacitySeed = this.in6StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[(d.getHours() * 60 + d.getMinutes()) % 4]);
        return rectOpacity;
    }
    creathalfhourlyOpacity() {
        console.log("creathalfhourlyOpacity")
        let OpacitySeed = []
        let rectOpacity = []
        OpacitySeed = this.in6StufeOpacity
         console.log("OpacitySeed", OpacitySeed)
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[(2 * (d.getHours()%3)) + (d.getMinutes()/30)]);
        console.log("Opacity",rectOpacity)
        return rectOpacity;
    }

    creat5minOpacity() {
        console.log("creat5minOpacity")
        let OpacitySeed = []
        let rectOpacity = []
        OpacitySeed = this.in12StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getMinutes()/5]);
        return rectOpacity;
    }
    creatminOpacity() {
        //console.log("creatminOpacity")
        let OpacitySeed = []
        let alpha = 0.9
        for (var i = 0; i < 30; i++) {
            OpacitySeed[i] = alpha
            alpha -= (0.9 / 30)
        }
        let rectOpacity = []
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getMinutes() % 30]);
        return rectOpacity;
    }

}
export default BackGround