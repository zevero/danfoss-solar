var path = './data/'
  ,  fs   = require("fs")
  ;
  
var D = {
  minuteTable: (function(){
    var table = {}, fields = 'INTERVAL;TIMESTAMP;SERIAL;P_AC;E_DAY;T_WR;U_AC;U_AC_1;U_AC_2;U_AC_3;I_AC;F_AC;U_DC_1;I_DC_1;U_DC_2;I_DC_2;U_DC_3;I_DC_3;S;E_WR;M_WR;I_AC_1;I_AC_2;I_AC_3;P_AC_1;P_AC_2;P_AC_3;F_AC_1;F_AC_2;F_AC_3;R_DC;PC;PCS;PCS_LL;COS_PHI;COS_PHI_LL;S_COS_PHI;Current_Day_Energy;current_Day_Offset;ccEnergyOfDay_WithoutOffset';
    fields.split(';').forEach(function(f,i){
       table[f] = i;      
    });
    return function(val){
      var col = table[val];
      if (col === undefined) throw new Error('Danfoss: Val not found');
      return col;
    };
  }()),
  minutes4day: function(date){
    var file = path + date + '.log';
    var minutes=[];
    fs.readFileSync(file).toString().split('\n').forEach(function (line) {
      if (!line) return;
      //console.log(line);

      var fb=line.split('|')[2];
      //console.log(fb);

      var f = fb.split('-')[1];
       var skip = 6;
      fs.readFileSync(path + f).toString().split('\n').forEach(function (minute) {
        if (skip-- > 0) return;
        var m = minute.split(';');
        if (m.length < 2) return;
        minutes.push(m);
        //console.log(minute);
        //console.log(m[1] + ' -> ' + m[3]);
        //day[day.length] = [m[1], m[3], m[12],m[14],m[16], Math.round(m[12]*m[13]), Math.round(m[14]*m[15]), Math.round(m[16]*m[17])]; //Date, P_AC, U1, U2, U3, P1, P2, P3
      });
    });
    return minutes;
  },
  day: function(date){
    var minutes = D.minutes4day(date);
    var i=0;
    return {
        next: function(){
          if (minutes.length<=i) {
            return false;
          }
          var m = minutes[i++];
          
          return function(val){
            var col = D.minuteTable(val);
            return minutes[i-1][col];
          };
        }
      
    };
  },
  day_json: function(date){
    var minutes = D.minutes4day(date);
    var i=0,m, t, s, p, v, p_dc, eff, ohm, S={
        DC_P: [],
        DC_V: [],
        EFF: [{ name: 'Efficiency', data: []}],
        OHM: [{ name: 'Resistance DC [Ω]', data: []}]
        };
      while(i<minutes.length){
        m = minutes[i++];
        t = new Date(m[D.minuteTable('TIMESTAMP')]).getTime();
        p_dc=0;
        for (s=1; s<=3; s++){
          v = m[D.minuteTable('U_DC_'+s)]*1;
          
          //POWER
          p = v * m[D.minuteTable('I_DC_'+s)]*1;
          if (p) {
            p_dc += p;
            if (!S.DC_P[s-1]) S.DC_P[s-1]= { name: 'String '+s, data: []};
            S.DC_P[s-1].data.push([t,p]);
          }
          
          //VOLTAGE
          if (v) {
            if (!S.DC_V[s-1]) S.DC_V[s-1]= { name: 'String '+s, data: []};
            S.DC_V[s-1].data.push([t,v]);
          }          
        };
        
        //EFFICIENCY
        eff = Math.round(m[D.minuteTable('P_AC')]/p_dc*10000)/100;
        if (eff) S.EFF[0].data.push([t,eff]);
            
        //OHM
        ohm = m[D.minuteTable('R_DC')]*1;
        S.OHM[0].data.push([t,ohm]);

      };
      return JSON.stringify(S);
   },
   
   dates: function(){
     var dates = [];
     /*fs.readdir(path, function(err, files) { //DOES NOT WORK WITH EJS!!!
       files.filter(function(file) { return file.substr(-4) === '.log'; })
         .forEach(function(date) {
           dates.push(date);
         });
       dates.sort();
       dates.reverse();
       return ['a','b','s'];
       return dates;    
     });*/
     
     var files = fs.readdirSync(path); 
       files.filter(function(file) { return file.substr(-4) === '.log'; })
         .forEach(function(date) {
           dates.push(date.slice(0,-4));
         });
       dates.sort();
       dates.reverse();
       return dates;    
   }
  
};


module.exports = {
  day: function(date){
    return D.day(date);
  },
  day_json: function(date){
     return D.day_json(date);
  },
  dates: function(){
     return D.dates();
  }
};
