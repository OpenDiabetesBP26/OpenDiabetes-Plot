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
        this.rectH = 370;//reguläre Hight von rects, fertig!
        this.rectWs = [];//widths von rects für output, fertig!
        this.xPos = []; //xposition von ticks für output, fertig!
        this.tickArray = []; //ticks für inere Verwendung, fertig!
        this.in6StufeOpacity = [0.9, 0.8, 0.7, 0.6, 0.5, 0.6] //6 stufen Opacity für innere Verwendung
        this.in12StufeOpacity = [0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35]//12 stufen Opacity für innere Verwendung
        this.in7tufeOpacity = [0.9, 0.8, 0.7, 0.6, 0.5, 0.6, 0.5]//7 stufen Opacity für innere Verwendung
        this.in15StufeOpacity = [0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2]//15 stufen Opacity für innere Verwendung

    }
    //füge ein ein date-pading ein, die Zeitabstand stimmt mit der von folgenden Ticks überein.
    //读取ticks的日期，并且在index0位置加入一个与后续等距的date
    readTicks(d) {
        this.tickArray = d.ticks();
        var firstDate = d.ticks()[0] - (d.ticks()[1] - d.ticks()[0]);
        var oldfirst = this.tickArray[0]
        var oldsecond = this.tickArray[1]
        //var y = oldfirst.getFullYear() - (oldsecond.getFullYear() - oldfirst.getFullYear())
        //var m = (oldfirst.getMonth() - (oldsecond.getMonth() - oldfirst.getMonth()) + 12) % 12
        // var d = (oldfirst.getMonth() - (oldsecond.getMonth() - oldfirst.getMonth()) + 31) % 31
        //var h = (oldfirst.getHours() - (oldsecond.getHours() - oldfirst.getHours()) + 24) % 24
        // var ms = (oldfirst.getMinutes() - (oldsecond.getMinutes() - oldfirst.getMinutes()) + 60) % 60
        var firstDate = new Date(oldfirst.getTime() - (oldsecond.getTime() - oldfirst.getTime()) + 24 * 60 * 60 * 1000 + 60 * 60 * 1000)
        this.tickArray.splice(0, 0, firstDate);
        //this.tickArray.splice(0, 0, new Date());
        console.log(this.tickArray)
        return this.tickArray;
    }
    //erzeuge ein Array mit x-position von allen ticks
    //第一个位x(0),其他的为scale的绝对位置
    creatXpos(d) {
        this.xPos.push(0)
        for (var i = 1; i < this.tickArray.length; i++) {
            this.xPos.push(d(this.tickArray[i]))
        }
        return this.xPos;
    }
    // erzeuge widths für allen rects.
    getWds() {
        this.xPos.forEach((d, i) => i == this.xPos.length - 1 ? this.rectWs[i] = 940 - this.xPos[i] : this.rectWs[i] = this.xPos[i + 1] - d)
        console.log("rectWs_bevor: " , this.rectWs)
        this.rectWs.forEach((d, i) => d > 1 ? this.rectWs[i] -= 1 : d)
        return this.rectWs;

    }

    ticksFormat() {
        if (this.tickArray.length <= 2) {
            return 'intraday';
        } else {
            var tickStep = this.tickArray[2].getTime() - this.tickArray[1].getTime()
            console.log()
            var result = tickStep >= 350 * 24 * 60 * 60 * 1000 ? 'yearly' : tickStep >= 4 * 7 * 24 * 60 * 60 * 1000 ? 'monthly' : tickStep >= 7 * 24 * 60 * 60 * 1000 ? 'weekly' : tickStep >= 12 * 60 * 60 * 1000 ? 'daily' : tickStep >= 60 * 60 * 1000 ? 'hourly' : tickStep >= 30 * 60 * 1000 ? 'halfhour' : tickStep >= 15 * 60 * 1000 ? 'quarter' : tickStep >= 5*60*1000 ? '5min' : 'min'
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
            case 'hourly':
                return this.creatHourlyOpacity()
            case 'halfhour':
                return this.creathalfhourlyOpacity()
            case 'quarter':
                return this.creatQuarterOpacity()
            case '5min':
                return this.creat5minOpacity()
            case 'min' : 
                return this.creatminOpacity()

        }
    }



    creatYearlyOpacity() {
        var OpacitySeed = []
        var rectOpacity = []
        //console.log("creatYearlyOpacity")
        var OpacitySeed = this.in6tufeOpacity
        var yearBase = this.tickArray[0].getFullYear()
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getFullYear() - yearBase])
        return rectOpacity;
    }


    //erzeuge monthlyOpacity
    creatMonthlyOpacity() {
        var OpacitySeed = []
        var rectOpacity = []
        //console.log("creatMonthlyOpacity")
        var OpacitySeed = this.in6StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getMonth() % 6]);
        return rectOpacity;
    }

    creatWeeklyOpacity() {
        var OpacitySeed = []
        var rectOpacity = []
        console.log("creatWeeklyOpacity")
        //星期数一样，那么就是一周一个刻度
        if (this.tickArray[1].getDay() == this.tickArray[2].getDay()) {
            OpacitySeed = this.in15StufeOpacity
            this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getDate() % 15]);
        } else //日期数一样
        {
            OpacitySeed = this.in7StufeOpacity
            this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getDay() % 7]);
        }

        return rectOpacity;
    }




    creatInDailyOpcaity() {
        var OpacitySeed = []
        var rectOpacity = []
        console.log("creatInDailyOpcaity")
        OpacitySeed = this.in15StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getDate() % 15]);
        return rectOpacity;

    }


    creatHourlyOpacity() {
        //console.log("creatHourlyOpacity")
        var OpacitySeed = []
        var rectOpacity = []
        OpacitySeed = this.in12StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getHours() % 12]);
        return rectOpacity;

    }


    creatQuarterOpacity() {
        //console.log("creatQuarterOpacity")
        var OpacitySeed = []
        var rectOpacity = []
        OpacitySeed = this.in6StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[(d.getHours()*60 + d.getMinutes()) % 4]);
        return rectOpacity;
    }
    creathalfhourlyOpacity() {
        //console.log("creathalfhourlyOpacity")
        var OpacitySeed = []
        var rectOpacity = []
        OpacitySeed = this.in12StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[(d.getHours()*60 + d.getMinutes()) % 12]);
        return rectOpacity;
    }

    creat5minOpacity(){
        //console.log("creat5minOpacity")
        var OpacitySeed = []
        var rectOpacity = []
        OpacitySeed = this.in12StufeOpacity
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[(d.getHours()*60 + d.getMinutes()) % 12]);
        return rectOpacity;
    }
    creatminOpacity(){
        //console.log("creatminOpacity")
        var OpacitySeed = []
        var alpha = 0.9
        for(var i = 0; i < 30; i++){
            OpacitySeed[i] = alpha
            alpha -= (0.9/30)
        }
        var rectOpacity = []
        this.tickArray.forEach((d, i) => rectOpacity[i] = OpacitySeed[d.getMinutes() % 30]);
        return rectOpacity;   
    }

}
export default BackGround