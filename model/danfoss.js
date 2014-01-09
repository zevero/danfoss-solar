var path = __dirname + '/../data/'
  ,  prefix = 'danfoss-'
  ,  fs   = require("fs")
  ,  unique = function unique(value, index, self) { return self.indexOf(value) === index;}
  ;

var D = {
  X: (function(){
    var table = {}, fields = 'INTERVAL;TIMESTAMP;SERIAL;P_AC;E_DAY;T_WR;U_AC;U_AC_1;U_AC_2;U_AC_3;I_AC;F_AC;U_DC_1;I_DC_1;U_DC_2;I_DC_2;U_DC_3;I_DC_3;S;E_WR;M_WR;I_AC_1;I_AC_2;I_AC_3;P_AC_1;P_AC_2;P_AC_3;F_AC_1;F_AC_2;F_AC_3;R_DC;PC;PCS;PCS_LL;COS_PHI;COS_PHI_LL;S_COS_PHI;Current_Day_Energy;current_Day_Offset;ccEnergyOfDay_WithoutOffset';
    fields.split(';').forEach(function(f,i){
       table[f] = i;      
    });
    return function(m,val){
      var col = table[val];
      if (col === undefined) throw new Error('Danfoss: Val not found');
      return m[col];
    };
  }()),
  minutes4day: function(date){
    var minutes=[];
    var files = fs.readdirSync(path); 
   
    files.filter(function(file) { return file.substr(0,prefix.length+6) === prefix+date; })
    .forEach(function(file) {
      var skip = 6;
      fs.readFileSync(path + file).toString().split('\n').forEach(function (minute) {
        if (skip-- > 0) return;
        var m = minute.split(';');
        if (m.length < 2) return;
        minutes.push(m);
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
            return D.X(m,val);
          };
        }
      
    };
  },
  day_json: function(date){
    var minutes = D.minutes4day(date);
    var i=0,m, t, s, p, v, p_dc, eff, S={
        DC_P: [],
        DC_V: [],
        EFF: [{ name: 'Efficiency', data: []}],
        OHM: [{ name: 'Resistance DC [Ω]', data: []}],
        T: [{ name: 'Temperature [°C]', data: []}],
        E: 0
        };
      while(i<minutes.length){
        m = minutes[i++];
        t = new Date(D.X(m,'TIMESTAMP')).getTime();
        p_dc=0;
        for (s=1; s<=3; s++){
          v = D.X(m,'U_DC_'+s)*1;
          
          //POWER
          p = v * D.X(m,'I_DC_'+s)*1;
          if (p) {
            p_dc += p;
            if (!S.DC_P[s-1]) S.DC_P[s-1]= { name: 'String '+s, data: []};
            S.DC_P[s-1].data.push([t,Math.round(p)]);
          }
          
          //VOLTAGE
          if (v) {
            if (!S.DC_V[s-1]) S.DC_V[s-1]= { name: 'String '+s, data: []};
            S.DC_V[s-1].data.push([t,v]);
          }

          
          
          
        };
        //ENERGY_AC
        S.E = D.X(m,'E_DAY');
        
        //EFFICIENCY
        eff = Math.round(D.X(m,'P_AC')/p_dc*10000)/100;
        if (eff) S.EFF[0].data.push([t,eff]);
        
        //TEMPERATURE
        S.T[0].data.push([t,D.X(m,'T_WR')*1]); 
        //OHM
        S.OHM[0].data.push([t,D.X(m,'R_DC')*1]);

      };
      return JSON.stringify(S);
   },
   
   dates: function(){
     console.log(path);
     var dates = [],
         files = fs.readdirSync(path); 
     files.filter(function(file) { return file.substr(0,prefix.length) === prefix; })
       .forEach(function(date) {
         dates.push(date.slice(prefix.length,-6));
       });
     dates = dates.filter(unique);
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
