$(function () {
        $('body>h1').append(' ' + S.E + ' kWh');
  
        $('#DC_P').highcharts({
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
            
            series: S.DC_P
        });
        
        
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
            
            series: S.DC_V
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
            
            series: S.OHM
        });
    });