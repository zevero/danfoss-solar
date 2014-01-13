$(function () {
  for(var s=0;s<S.DC_V.length;s++){
    for(var i=0;i<S.DC_V[s].data.length;i++){
      S.DC_P[s].data[i] = Math.round(S.DC_V[s].data[i]*S.DC_I[s].data[i]/1000);
    }
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
       zoomType: 'xy'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { 
         month: '%e. %b',
         year: '%b'
      }
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
    }
  });
 
  var O_P = {
    title: {
      text: 'DC Power per String (Click here for normal stacking)'
    },
    yAxis: {
      title: {
        text: 'Watt [W]'
      },
      min: 0
    },
    tooltip: {
      formatter: function() {
        return '<b>'+ this.series.name +'</b><br/>'+
        Highcharts.dateFormat('%H:%M', this.x) +' → '+ this.y +' W';
      }
    },
    plotOptions: { series: { stacking: null }},
    series: S.DC_P
  };
   
  var start = function(){ //Add percent Stacking 
    //if ($('#DC_P').highcharts())  $('#DC_P').highcharts().destroy();
    $('#DC_P').empty().highcharts(O_P);
    var stacking = O_P.plotOptions.series.stacking;
    if (stacking==='percent') {
      O_P.title.text= 'DC Power - per String (Click this title for normal stacking)';
      O_P.plotOptions.series.stacking=null;
      O_P.chart.type = "spline";
    }
    else if (stacking==='normal') {
      O_P.title.text= 'DC Power - stacked (Click this title for percent stacking)';
      O_P.plotOptions.series.stacking='percent';
      O_P.chart.type = "area";
    }
    else if (stacking===null){
      O_P.title.text= 'DC Power - percent stacked (Click this title to unstack)';
      O_P.plotOptions.series.stacking='normal';
      O_P.chart.type = "area";
    }

   $('text.highcharts-title').click(start);
  };
  start();




  $('#DC_V').highcharts({
    title: {
      text: 'DC Voltage'
    },
    yAxis: {
      title: {
        text: 'Voltage [V]'
      },
      min: 0
    },
    tooltip: {
      formatter: function() {
        return '<b>'+ this.series.name +'</b><br/>'+
        Highcharts.dateFormat('%H:%M', this.x) +' → '+ this.y +' V';
      }
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
      },
      min: 0
    },
    tooltip: {
      formatter: function() {
        return '<b>'+ this.series.name +'</b><br/>'+
        Highcharts.dateFormat('%H:%M', this.x) +' → '+ this.y +' mA';
      }
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
      formatter: function() {
        return '<b>'+ this.series.name +'</b><br/>'+
        Highcharts.dateFormat('%H:%M', this.x) +' → '+ this.y +' %';
      }
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
      },
      min: 0
    },
    legend: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return '<b>'+ this.series.name +'</b><br/>'+
        Highcharts.dateFormat('%H:%M', this.x) +' → '+ this.y +' °C';
      }
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