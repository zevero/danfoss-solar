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
    date = date.replace(/-/g, '');
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
     var string = [1,2,3].map(function(i){ //test for string data
          var positive = function(m){return (D.X(m,'I_DC_'+i)>0);};
          return minutes.some(positive);
        });
    var i=0;
    if (!minutes.length) return false; //nothing found
    return {
        next: function(){
          if (minutes.length<=i) {
            return false;
          }
          var m = minutes[i++];
          
          return function(val){
            return D.X(m,val);
          };
        },
        date_ger: date.slice(6,8)+'.'+date.slice(3,5)+'.20'+date.slice(0,2),
        string: string
    };
  },
  day_highchart: function(date){
    var minutes = D.minutes4day(date);
    var i=-1,m, t, tl, s, p, V, I, p_dc, eff,
        m_last = minutes[minutes.length-1],
        t_start = new Date(D.X(minutes[0],'TIMESTAMP')).getTime(),
        t_y = new Date(t_start - 24*3600*1000),
        t_t = new Date(t_start + 24*3600*1000),
      S={
        DC_E:[0, 0, 0],
        DC_P: [{name: 'String 1',data: []},{name: 'String 2',data: []},{name: 'String 3',data: []}],//3 Strings
        DC_V: [{name: 'String 1',data: []},{name: 'String 2',data: []},{name: 'String 3',data: []}],//3 Strings
        DC_I: [{name: 'String 1',data: []},{name: 'String 2',data: []},{name: 'String 3',data: []}],//3 Strings
        EFF: [{ name: 'Efficiency', data: []}],
        T: [{ name: 'Temperature [°C]', data: []}],
        E: D.X(m_last,'E_DAY'),
        OHM: Math.round(D.X(m_last,'R_DC')/1000),
        t_start: t_start,
        t_yesterday: t_y.toISOString().slice(2,10),
        t_tomorrow: (t_t < new Date())?t_t.toISOString().slice(2,10):false,
        n: minutes.length,
        OK: true
      };
      while(++i<minutes.length){
        m = minutes[i];
        t = new Date(D.X(m,'TIMESTAMP')).getTime();
        p_dc=0;
        for (s=1; s<=3; s++){//3 Strings
          V = D.X(m,'U_DC_'+s)*1;
          I = D.X(m,'I_DC_'+s)*1000;
          
          
          //POWER is done client side
          p =  V*I/1000;
          p_dc +=p;
          //S.DC_P[s-1].data[i] = Math.round(V*I/1000); //is done on client

          //Energy
          S.DC_E[s-1]+=p/60;
          
          //VOLTAGE  
          S.DC_V[s-1].data[i]=V;
          
          //CURRENT  
          S.DC_I[s-1].data[i]=I;
          
          
        };

        
        //EFFICIENCY //done client side
        eff = Math.round(D.X(m,'P_AC')/p_dc*10000)/100;
        S.EFF[0].data[i]=eff;
        
        //TEMPERATURE
        S.T[0].data[i]=D.X(m,'T_WR')*1; 

      };
 
      S.DC_E = S.DC_E.map(function(v){return Math.round(v)/1000;});
      
      S.t_stop = t;
      if (t!==t_start+60*1000*(minutes.length-1)) S.OK = false;
       //console.log(S.OK,t,t_start+60*1000*minutes.length);
      return S;
   },
   
   dates: function(){
     console.log(path);
     var dates = [],
         files = fs.readdirSync(path);
     String.prototype.splice = function( idx, rem, s ) {
       return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
     };
     files.filter(function(file) { return file.substr(0,prefix.length) === prefix; })
       .forEach(function(date) {
         dates.push(date.slice(prefix.length,-6).splice( 4, 0, "-" ).splice( 2, 0, "-" ));
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
  day_highchart: function(date){
     return D.day_highchart(date);
  },
  dates: function(){
     return D.dates();
  }
};
