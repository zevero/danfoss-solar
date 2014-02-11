$(function () {
  
  var p;
  for(var s=0;s<S.wp_string.length;s++){
    for(var i=0;i<S.DC_V[s].data.length;i++){
      S.DC_P[s].data[i] = p = Math.round(S.DC_V[s].data[i]*S.DC_I[s].data[i]/1000);
      S.DC_rP[s].data[i] = Math.round(1000 * p/S.wp_string[s]);
    }
  }
  S.wp_plotLines = function(){
    if (!S.wp_string[1]) return [];
    if (!S.wp_string[2]) return [{color: '#FF0000',width: 2,value: s.wp_string[0]/S.wp_total}];
    return [{color: '#FF0000',width: 2,value: S.wp_string[0]/S.wp_total*100},{color: '#FF0000',width: 2,value: (S.wp_string[0]+S.wp_string[1])/S.wp_total*100}];
  };
  
  function show_click_stats(val){
    var n = Math.max(0,Math.min(S.n,Math.floor((val - S.t_start)/60/1000))),
        E = [0,0,0], html = '';
   E = E.map(function(v,i){
     var e = S.DC_P[i].data.slice(0,n).reduce(function(pv,cv){
       return pv+cv/60;
     });
     html+= Math.round(e) + '<small> '+Math.round(e/S.DC_E_tot)/10+'%</small> ';
     return Math.round(e);
   });
   
   $('#clickstats').html(html);
  }
  
  
  Highcharts.setOptions({
    global: {
      useUTC: false
    },
    colors: [
     '#3399ee', 
     '#2266bb', 
     '#001188'
    ],
    chart: {
       type: 'spline',
       zoomType: 'xy',    
       events: {
          click: function (e) {
            var t = e.xAxis[0].value;
            for(var i=0;i<Highcharts.charts.length;i++){
              var chart = Highcharts.charts[i];
              if (!chart) continue;
              chart.xAxis[0].removePlotLine();
              chart.xAxis[0].addPlotLine({
                color: 'red',
                dashStyle: 'dot',
                width: 2,
                value: t
              });
            }
            show_click_stats(t);
          }
        }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { 
         month: '%e. %b',
         year: '%b'
      }
    },
    yAxis: {
      min: 0
    },
    plotOptions: {
      series: {
        lineWidth: 3,
        marker: {
          enabled: false
        },
        animation:false,
        shadow: false,
        pointInterval: 60 * 1000,
        pointStart: S.t_start
      }
    },
    tooltip: {
            shared: true,
            crosshairs: true
        }
  });
  var formatter = function(unit) {
    var s='<b>'+Highcharts.dateFormat('%H:%M', this.x) + '<br/>';
    this.points.forEach(function(point){
      s += '<b>'+ point.series.name +'</b> → '+ point.y +' '+ unit +'<br/>';
    });
    return s;
  };
 
  var O_P = {
    chart: {},
    title: {},
    yAxis: {
      title: {}
    },
   tooltip: {
      formatter: function() {
        var s='',t=0;
        this.points.forEach(function(point){t+=point.y;});
        this.points.forEach(function(point){
          s += '<b>'+ point.series.name +'</b> → '+ point.y +' W('+ Math.round(point.y/t*100)+'%)'+'<br/>';
        });
        return '<b>'+Highcharts.dateFormat('%H:%M', this.x) + '</b> →→ '+ t +' W(100%)<br/>' + s;
      }
    },
    plotOptions: { series: { stacking: 'percent' }},
    series: S.DC_P
  };
  var state = -1;
  var start = function(){ //Add percent Stacking 
    state = ++state % 3;
 
    O_P.yAxis.plotLines = [];
    O_P.chart.type = "area";
    switch (state){
      case 1:
        O_P.title.text= 'DC Power - per String (Click this title for percent stacking)';
        O_P.yAxis.title.text='Watt [W]';
        O_P.plotOptions.series.stacking=null;
        O_P.chart.type = "spline";
        break;
      case 2:
        O_P.title.text= 'DC Power - % stacked (Click this title for normal stacking)';
        O_P.yAxis.title.text='Watt [%]';
        O_P.plotOptions.series.stacking='percent';
        O_P.yAxis.plotLines = S.wp_plotLines();
        break;
      default:
        O_P.title.text= 'DC Power - stacked (Click this title to unstack)';
        O_P.yAxis.title.text='Watt [W]';
        O_P.plotOptions.series.stacking='normal';
    }
    
    if ($('#DC_P').highcharts())  $('#DC_P').highcharts().destroy();
    $('#DC_P').empty().highcharts(O_P);

   $('text.highcharts-title').click(start);
  };
  start();




  $('#DC_rP').highcharts({
    chart: {
      type:'spline'
    },
    title: {
      text: 'DC relative Power'
    },
    yAxis: {
      title: {
        text: 'W/kWp'
      }
    },
    tooltip: {
      formatter: function() {
        var s='',t=0,p=0;
        this.points.forEach(function(point,s){
          t+=point.y/S.wp_string[s];
          p+=point.y/1000*S.wp_string[s];
        });
        t = Math.round(t * S.wp_total/10);
        this.points.forEach(function(point){
          s += '<b>'+ point.series.name +'</b> → '+ point.y +' ('+ Math.round(point.y/t*100)+'%)'+'<br/>';
        });
        return '<b>'+Highcharts.dateFormat('%H:%M', this.x) + '</b> →→ '+ t + ' ≙ '+ Math.round(p) +'W<br/>' + s;
      }
    },
    series: S.DC_rP
  });
  
  $('#DC_V').highcharts({
    title: {
      text: 'DC Voltage'
    },
    yAxis: {
      title: {
        text: 'Voltage [V]'
      },
      max: 800
    },
   tooltip: {
      formatter:  function(){return formatter.call(this,'V');}
    },
    series: S.DC_V
  });

  $('#DC_I').highcharts({
    title: {
      text: 'DC Current'
    },
    yAxis: {
      title: {
        text: 'Current [mA]'
      }
    },
   tooltip: {
      formatter:  function(){return formatter.call(this,'mA');}
    },
    series: S.DC_I
  });

  $('#EFF').highcharts({
    title: {
      text: 'EFFICIENCY'
    },
    yAxis: {
      title: {
        text: 'Efficiency [%]'
      },
     min: 90,
     max: 100
    },
    legend: {
      enabled: false
    },
   tooltip: {
      formatter:  function(){return formatter.call(this,'%');}
    },
    series: S.EFF
  });


  $('#T').highcharts({
    title: {
      text: 'Temperature'
    },
    yAxis: {
      title: {
        text: 'Temperature [°C]'
      }
    },
    legend: {
      enabled: false
    },
   tooltip: {
      formatter:  function(){return formatter.call(this,'°C');}
    },
    series: S.T
  });

    //Hide all Strings, which have no Data
    ['#DC_P','#DC_V','#DC_I'].forEach(function(id){
      [0,1,2].forEach(function(s){
        if (!S.DC_E[s]) $(id).highcharts().series[s].hide();
      });
    });
});