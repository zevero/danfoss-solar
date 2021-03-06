var path = __dirname + '/../data/'
  ,  prefix = 'danfoss-'
  ,  wp_string = [4750,3780,4610] //expects 3 numbers. For unused strings put 0 [6500,4000,0]
  ,  shade_free = {from: "13:00", duration: 60}
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
      if (col === undefined) throw new Error('Danfoss: Val "'+val+'" not found');
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
    var i=0, m_last = minutes[minutes.length-1], E_DC;
    if (!minutes.length) return false; //nothing found

    return {
       next: function(){
        if (minutes.length<=i) {
          return false;
        }
        var m = minutes[i++];
        var p_dc=0, eff;
        for(var s=1;s<=3;s++) { p_dc+= D.X(m,'I_DC_'+s) * D.X(m,'U_DC_'+s); }
        eff = (p_dc)? D.X(m,'P_AC')/p_dc:false ;
        return function(val){
           switch (val) {
            case "P_AC_1":
            case "P_AC_2":
            case "P_AC_3":
              var s= val.slice(5);
              var p = (eff)?Math.round(eff * D.X(m,'I_DC_'+s) * D.X(m,'U_DC_'+s))/1000:0;
              //console.log(D.X(m,'TIMESTAMP'),eff,s,p,D.X(m,'P_AC'),p_dc);
              return p;
            default:
              return D.X(m,val);
           }
         };
       },
       date_ger: date.slice(6,8)+'.'+date.slice(3,5)+'.20'+date.slice(0,2),
       string: string,
       E: D.X(m_last,'E_DAY')
    };
  },
  day_highchart_cache: {},
  day_highchart: function(date){
    if (D.day_highchart_cache[date]) {
      return D.day_highchart_cache[date];
    }
    var minutes = D.minutes4day(date);
    var i=-1,m, t, tl, s, p, V, I, p_dc, eff,
        m_last = minutes[minutes.length-1],
        t_now_date = new Date(),
        t_start_date = new Date(D.X(minutes[0],'TIMESTAMP')),
        t_start = t_start_date.getTime(),
        t_y = new Date(t_start - 24*3600*1000),
        t_t = new Date(t_start + 24*3600*1000),
        t_shade_free = Date.parse(t_start_date.toISOString().slice(0,10) + " " + shade_free.from), t_shade_free_minute = 0,
        get_serie = function(){
          return [{name: 'String '+wp_string[0]+' Wp',data: []},{name: 'String '+wp_string[1]+' Wp',data: []},{name: 'String '+wp_string[2]+' Wp',data: []}];
        };
      S={
        DC_E:[0, 0, 0],
        DC_E_shade_free:[0, 0, 0],
        DC_E_tot: 0,
        DC_P: get_serie(),
        DC_rP: get_serie(),
        DC_V: get_serie(),
        DC_I: get_serie(),
        EFF: [{ name: 'Efficiency', data: []}],
        T: [{ name: 'Temperature [°C]', data: []}],
        F: [{ name: 'Frequency [Hz]', data: []}],
        E: D.X(m_last,'E_DAY'),
        OHM: -1,
        t_start: t_start,
        t_yesterday: t_y.toISOString().slice(2,10),
        t_tomorrow: (t_t < new Date())?t_t.toISOString().slice(2,10):false,
        n: minutes.length,
        AC_E: D.X(m_last,'E_DAY'),
        OK: true,
        wp_string: wp_string,
        wp_total: wp_string.reduce(function(a, b) {return a + b;})//summe
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
          //console.log(t_start, t, t_shade_free, t_shade_free_minute);
          S.DC_E[s-1]+=p/60;
          if (t_shade_free <= t && t_shade_free_minute <= shade_free.duration) {
            S.DC_E_shade_free[s-1]+=p/60;
            if (s===3) t_shade_free_minute++;
          }
          //VOLTAGE  
          S.DC_V[s-1].data[i]=V;
          
          //CURRENT  
          S.DC_I[s-1].data[i]=I;
        };

        //OHM (sometimes 0 id no p, so we look for a more interesting value)
        if (p_dc>0) S.OHM = Math.round(D.X(m,'R_DC')/1000);
          
        //EFFICIENCY //done client side
        eff = Math.round(D.X(m,'P_AC')/p_dc*10000)/100;
        S.EFF[0].data[i]=eff;
        
        //TEMPERATURE
        S.T[0].data[i]=D.X(m,'T_WR')*1;
        
        //FREQUENCY
        S.F[0].data[i]=D.X(m,'F_AC')*1;
      };
 
      S.DC_E = S.DC_E.map(function(v){return Math.round(v)/1000;});
      S.DC_E_shade_free = S.DC_E_shade_free.map(function(v){return Math.round(v)/1000;});
      S.DC_E_tot = S.DC_E[0] + S.DC_E[1] + S.DC_E[2];
      S.DC_E_perc= function(i){return Math.round(S.DC_E[i]/S.DC_E_tot*100);};
      S.t_stop = t;
      if (t!==t_start+60*1000*(minutes.length-1)) S.OK = false;
       //console.log(S.OK,t,t_start+60*1000*minutes.length);
       
      if (t_now_date.toISOString().slice(0,10)!== t_start_date.toISOString().slice(0,10)) D.day_highchart_cache[date] = S;
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
  },
  days: function(){
    var data = {days:[], wp_string:wp_string};
     D.dates().forEach(function(date){
       var day = D.day_highchart(date);
       if(!day.DC_E[0]) return;      
       data.days.push({
         date: date,
         E: day.DC_E,
         Esf: day.DC_E_shade_free
       });
     });
     return data;
  }
};
