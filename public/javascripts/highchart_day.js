$(function () {
  Highcharts.setOptions({
   global: {
    useUTC: false
   }
  });
 
        var O_P = {
            chart: {
                type: 'spline',
                zoomType: 'xy'
            },
            title: {
                text: 'DC Power'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { 
                    month: '%e. %b',
                    year: '%b'
                }
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
            plotOptions: {
              series: {
                pointInterval: 60 * 1000,
                pointStart: S.t_start,
                stacking: null
              }
            },
            labels: {
              items: [{
                html: 'Stack',
                style: {
                  left: '550px',
                  top: '328px',
                  'font-size': '18px',
                  cursor: 'pointer'
                }
              }]
            },
            series: S.DC_P
        };
        
        var start = function(){ //Add Stacking / Unstacking for DC_P Chart
          if ($('#DC_P').highcharts())  $('#DC_P').highcharts().destroy();
          $('#DC_P').empty().highcharts(O_P);
          //console.log(O_P);
          var stacking = O_P.plotOptions.series.stacking;
          //if (stack==='normal') O_P.plotOptions.series.stack='percent';
          //if (!stack) O_P.plotOptions.series.stack='normal';
          if (stacking==='percent') {
            O_P.plotOptions.series.stacking=null;
            O_P.chart.type = "spline";
          }
          else {
            O_P.plotOptions.series.stacking='percent';
            O_P.chart.type = "area";
          }
          $('#DC_P tspan:contains("Stack")').on('click',start);
        };
         start();
        
        

        
        $('#DC_V').highcharts({
            chart: {
                type: 'spline',
                zoomType: 'xy'
            },
            title: {
                text: 'DC Voltage'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                }
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
            plotOptions: {
              series: {
                pointInterval: 60 * 1000,
                pointStart: S.t_start
              }
            },
            
            series: S.DC_V
        });
        
        $('#DC_I').highcharts({
            chart: {
                type: 'spline',
                zoomType: 'xy'
            },
            title: {
                text: 'DC Current'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                }
            },
            yAxis: {
                title: {
                    text: 'Current [A]'
                },
                min: 0
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%H:%M', this.x) +' → '+ this.y +' A';
                }
            },
            plotOptions: {
              series: {
                pointInterval: 60 * 1000,
                pointStart: S.t_start
              }
            },
            
            series: S.DC_I
        });
        
        $('#EFF').highcharts({
            chart: {
                type: 'spline',
                zoomType: 'xy'
            },
            title: {
                text: 'EFFICIENCY'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                }
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
            plotOptions: {
              series: {
                pointInterval: 60 * 1000,
                pointStart: S.t_start
              }
            },
            
            series: S.EFF
        });
        
        
        $('#T').highcharts({
            chart: {
                type: 'spline',
                zoomType: 'xy'
            },
            title: {
                text: 'Temperature'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                }
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
            plotOptions: {
              series: {
                pointInterval: 60 * 1000,
                pointStart: S.t_start
              }
            },
            
            series: S.T
        });
        
        
        
        $('#OHM').highcharts({
            chart: {
                type: 'spline',
                zoomType: 'xy'
            },
            title: {
                text: 'Resistance DC'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                }
            },
            yAxis: {
                title: {
                    text: 'Ohm [Ω]'
                },
                min: 0
            },
            legend: {
              enabled: false
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%H:%M', this.x) +' → '+ this.y +' Ω';
                }
            },
            plotOptions: {
              series: {
                pointInterval: 60 * 1000,
                pointStart: S.t_start
              }
            },
            
            series: S.OHM
        });
        
        
        //Hide all Strings, which have no Data
        ['#DC_P','#DC_V','#DC_I'].forEach(function(id){
          [0,1,2].forEach(function(s){
            if (!S.DC_E[s]) $(id).highcharts().series[s].hide();
          });
        });
        

        
    });