$(function () {
        $('#DC_P').highcharts({
            chart: {
                type: 'spline'
            },
            title: {
                text: 'DC Power'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
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
                type: 'spline'
            },
            title: {
                text: 'DC Voltage'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
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
                type: 'spline'
            },
            title: {
                text: 'EFFICIENCY'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
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
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%H:%M', this.x) +' → '+ this.y +' %';
                }
            },
            
            series: S.EFF
        });
        
        
        $('#OHM').highcharts({
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Resistance DC'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                }
            },
            yAxis: {
                title: {
                    text: 'Ohm [Ω]'
                }
                //,
                //min: 0
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