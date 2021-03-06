/**
 * Knowage, Open Source Business Intelligence suite
 * Copyright (C) 2016 Engineering Ingegneria Informatica S.p.A.
 * 
 * Knowage is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Knowage is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


angular.module('chartInitializer')

.service('chartJs',function(){
	
	this.chart =null;
	var chartConfConf = null;
	
	this.initChartLibrary = function(panelId, drillUpText, decimalPoint, thousandsSep){
		
	}
	
	
	
	this.renderChart = function(chartConf,panel,handleCockpitSelection){

		chartConfConf = chartConf;
		// Catch the Title (or Empty message), Subtitle, the Canvas (the rendered chart container) and the Main panel from the DOM. (danristo)
		var panelWidth = angular.copy(panel.offsetParent.clientWidth);
		var panelHeight = angular.copy(panel.clientHeight);
		var mainPanelRegion = angular.element(panel);
		mainPanelRegion.empty();
		var chartPanelSubtitle = angular.element("<div></div>")[0];
		var chartPanelTitleOrNoData = angular.element("<div></div>")[0];
		var chartPanelCanvas = angular.element("<canvas ></canvas>")[0];
		var chartPanelLegend = angular.element("<div id='js-legend' class='chart-legend'></div>")[0];
		var chartPanelCanvasDiv = angular.element("<div flex></div>")[0];
		chartPanelCanvasDiv.append(chartPanelCanvas);
		chartPanelCanvasDiv.append(chartPanelLegend);
		mainPanelRegion.append(chartPanelTitleOrNoData);
		mainPanelRegion.append(chartPanelSubtitle);
		mainPanelRegion.append(chartPanelCanvasDiv);
		
		var setNoDataTitle = function(){
			
		}
		
		
		// No data to represent				
		if ((chartConf.data.labels && chartConf.data.labels.length == 0)
				|| (chartConf.data.datasets && chartConf.data.datasets.length == 0)) {

			if (chartConf.chart.emptyMessage && chartConf.chart.emptyMessage.style
					&& chartConf.chart.emptyMessage.text != '') {
				
					var emptyMessageContainerStyle = {
						padding : '5 20 5 20'
					};

					var emptyMessageStyleKeys = Object.keys(chartConf.chart.emptyMessage.style);
					
					chartPanelTitleOrNoData.style["padding"] = emptyMessageContainerStyle.padding;
					
					for (var i = 0; i < emptyMessageStyleKeys.length; i++) {
						
						var emptyMessageStyleName = emptyMessageStyleKeys[i];

						if (emptyMessageStyleName.toLowerCase() != 'align') {
							chartPanelTitleOrNoData.style[emptyMessageStyleName] = chartConf.chart.emptyMessage.style[emptyMessageStyleName];
						}
						else {
							chartPanelTitleOrNoData.style["text-align"] = chartConf.chart.emptyMessage.style[emptyMessageStyleName];
						}
						
					}

					chartPanelTitleOrNoData.innerHTML = chartConf.chart.emptyMessage.text;
					
			}
			
		} 		
		//The are data to represent 
		else { 
			
			// TITLE management
			if (chartConf.chart.title && chartConf.chart.title.style && chartConf.chart.title.text != '') {
			
				var titleContainerStyle = {
					padding : '5 20 5 20'
				};

				var titleStyleKeys = Object.keys(chartConf.chart.title.style);
				
				chartPanelTitleOrNoData.style["padding"] = titleContainerStyle.padding;
				
				for (var i = 0; i < titleStyleKeys.length; i++) {
					
					var titleStyleName = titleStyleKeys[i];

					if (titleStyleName.toLowerCase() != 'align') {
						chartPanelTitleOrNoData.style[titleStyleName] = chartConf.chart.title.style[titleStyleName];
					}
					else {
						chartPanelTitleOrNoData.style["text-align"] = chartConf.chart.title.style[titleStyleName];
					}
					
				}

				chartPanelTitleOrNoData.innerHTML = chartConf.chart.title.text;
				
			}

			// SUBTITLE management
			if (chartConf.chart.subtitle && chartConf.chart.subtitle.style && chartConf.chart.subtitle.text != '') {
			
				var subtitleContainerStyle = {
					padding : '5 20 5 20'
				};

				var subtitleStyleKeys = Object.keys(chartConf.chart.subtitle.style);
				
				chartPanelSubtitle.style["padding"] = subtitleContainerStyle.padding;
				
				for (var i = 0; i < subtitleStyleKeys.length; i++) {
					
					var subtitleStyleName = subtitleStyleKeys[i];
					
					if (subtitleStyleName.toLowerCase() != 'align') {
						chartPanelSubtitle.style[subtitleStyleName] = chartConf.chart.subtitle.style[subtitleStyleName];
					}
					else {
						chartPanelSubtitle.style["text-align"] = chartConf.chart.subtitle.style[subtitleStyleName];
					}
					
				}

				chartPanelSubtitle.innerHTML = chartConf.chart.subtitle.text;
			} 
			
			var chartType = chartConf.chart.type.toLowerCase();
			
			// Gets the context of the canvas element we want to select
			var ctx = chartPanelCanvas.getContext("2d");
			
			// Destroy the ChartJS instance (the one that is placed inside the canvas HTML element) before reseting the chart (when resizing)
			//myNewChart ? window.myNewChart.destroy() : null;
			
			/* 
				Collect heights of Title and Subtitle of the chart (they should be substracted from the overall height wished by user in 
				order to determine the height of the canvas within which the ChartJS chart will render). 
				@author Danilo Ristovski (danristo, danilo.ristovski@mht.net)
			*/
			var titleDivHeight = chartPanelTitleOrNoData.clientHeight;
			var subtitleDivHeight = chartPanelSubtitle.clientHeight;
					
			var totalTitleSubtitleHeight = 0;
			
			totalTitleSubtitleHeight += titleDivHeight ?  titleDivHeight : 0;
			totalTitleSubtitleHeight += subtitleDivHeight ?  subtitleDivHeight : 0;			
			
			if (!chartConf.chart.height && !chartConf.chart.heightInPerc) {
				
				ctx.canvas.height = mainPanelRegion[0].offsetHeight-1-totalTitleSubtitleHeight;
				//mainPanelRegion.style.height = window.innerHeight-1;
				
//				if (window.myNewChart) { 
//					window.myNewChart.chart.canvas.height = window.innerHeight-1-totalTitleSubtitleHeight;
//				}
			}
			else {
				
				if (chartConf.chart.heightDimType=="pixels") {
					ctx.canvas.height = chartConf.chart.height - totalTitleSubtitleHeight;
					mainPanelRegion[0].style.height = chartConf.chart.height;
				}
				// percentage
				else {
					ctx.canvas.height = chartConf.chart.heightInPerc/100 * mainPanelRegion[0].offsetHeight - 1 - totalTitleSubtitleHeight;
					//mainPanelRegion.style.height = chartConf.chart.heightInPerc/100 * window.innerHeight - 1;
					
//					if (window.myNewChart) { 
//						window.myNewChart.chart.canvas.height = chartConf.chart.heightInPerc/100 * window.innerHeight - 1 - totalTitleSubtitleHeight;
//					}
				}
			}
			
			if (!chartConf.chart.width && !chartConf.chart.widthInPerc) {	
				
				ctx.canvas.width = panelWidth-1;
				//mainPanelRegion.style.width = window.innerWidth-1;	
				
//				if (window.myNewChart) { 
//					window.myNewChart.chart.canvas.width=window.innerWidth-1;
//				}
			}
			else {
				
				if (chartConf.chart.widthDimType=="pixels") {
					ctx.canvas.width = chartConf.chart.width;
					mainPanelRegion[0].style.width = chartConf.chart.width;
				}
				// percentage
				else {
					ctx.canvas.width = chartConf.chart.widthInPerc/100 * mainPanelRegion[0].offsetWidth-1;
					//mainPanelRegion.style.width = chartConf.chart.widthInPerc/100 * window.innerWidth-1;
					
//					if (window.myNewChart) { 
//						window.myNewChart.chart.canvas.width=chartConf.chart.widthInPerc/100 * window.innerWidth-1;
//					}
				}
			}
			
			// For responsive and scaleFontSize that are set as in the beginning (this is changed or commented in the VM however) 
			//ctx.canvas.height = (window.innerHeight+1)/5.1;			
			
			//Sets the background color
			if (chartConf.chart.backgroundColor
					&& chartConf.chart.backgroundColor != '') {				
				mainPanelRegion[0].style.backgroundColor = chartConf.chart.backgroundColor;
			}
			
			/* 
				window.myNewChart - the global variable that will contain the rendered chart configuration 
				(needed for reseting (destroying) the canvas content - the chart itself when resizing).
				@author Danilo Ristovski (danristo, danilo.ristovski@mht.net)
			*/			
		 	if (chartType == 'line') {
				 this.chart = new Chart(ctx).Line(chartConf.data, chartConf.options);
			} else if (chartType == 'pie') {
				var legend = {};
				legend.display = chartConf.chart.showLegend;
				legend.position = chartConf.chart.legendPosition;
				legend.labels = {};
				legend.labels.fontColor = 'rgb(255, 99, 132';
				chartConf.options.legend = legend;
				this.chart = new Chart(ctx).Pie(chartConf.data, chartConf.options);
			} else { // bar
				this.chart = new Chart(ctx).Bar(chartConf.data, chartConf.options);
			}	

		 	var mychart = this.chart
		 /*	var originalShowTooltip = mychart.showTooltip;
		 	var timeout;
		 	mychart.showTooltip = function (activeElements) {
		 	    var delay = (activeElements.length === 0) ? 2000 : 0;
		 	    clearTimeout(timeout);
		 	    timeout = setTimeout(function () {
		 	        originalShowTooltip.call(mychart, activeElements);
		 	    }, delay);
		 	}*/
		 	if (chartConf.chart.showLegend==true){
			 	document.getElementById('js-legend').innerHTML = this.chart.generateLegend()
			 	var legendDivHeight = chartPanelLegend.clientHeight;
			 	mainPanelRegion[0].clientHeight = mainPanelRegion[0].offsetHeight + legendDivHeight;
			}
		 	
		 	
		 	chartPanelCanvas.onclick = function (evt) {
		 		var activePoints = null;
		 		var series = {};
		 		var point = {};
		 		var event = {
		 				point: {
		 					series: {
		 						name: ""
		 					},
		 					y : null,
		 					name: ""
		 				}		
		 		};
		 		
		 		switch(chartType){
		 		
				
				case 'line':
					activePoints = mychart.getPointsAtEvent(evt);
					if(!chartConf.chart.isCockpitEngine){
							handleCrossNavigationTo(activePoints);
					}
			        else {
				 		event.point.series.name = activePoints[0].datasetLabel;
				 		event.point.y = activePoints[0].value;
				 		event.point.name = activePoints[0].label;
			 			handleCockpitSelection(event);
			        }
			        				
					console.log(activePoints);
					break;
				case 'pie':
					activePoints = mychart.getSegmentsAtEvent(evt);
					if(!chartConf.chart.isCockpitEngine){
						handleCrossNavigationTo(activePoints);
					}
			        else {
			        	event.point.series.name = chartConfConf.chart.additionalData.serieName;
				 		event.point.y = activePoints[0].value;
				 		event.point.name = activePoints[0].label;
			 			handleCockpitSelection(event);
			        }
					console.log(activePoints);
					break;
				case 'bar':
					activePoints = mychart.getBarsAtEvent(evt);
					if(!chartConf.chart.isCockpitEngine){
						handleCrossNavigationTo(activePoints);
					}
			        else {
			        	event.point.series.name = activePoints[0].datasetLabel;
				 		event.point.y = activePoints[0].value;
				 		event.point.name = activePoints[0].label;
			 			handleCockpitSelection(event);
			        }
					console.log(activePoints);
					break;
				default: break;
		 		
		 		
		 		};
		 	}
		 	return;
			// TODO: SETTING FOR THE LEGEND
			if (chartConf && chartConf.chart && chartConf.chart.showLegend) {
				var chartPanelLegeng = Ext.create('Ext.panel.Panel', {
					id : 'chartPanelLegeng',
					floating : true,
					layout : 'fit',
					margin : 6,
					draggable : true,
					bodyStyle : 'background:transparent;',
					html : myNewChart.generateLegend()
				});

				mainPanel.add(chartPanelLegeng);
				chartPanelLegeng.show();

				var chartPanelLegengX = mainPanelRegion.right / 2, 
					chartPanelLegengY = mainPanelRegion.bottom / 2;

				var legendPosition = chartConf.chart.legendPosition.toLowerCase();
				if (legendPosition == 'top' || legendPosition == '') {
					chartPanelLegengY = mainPanelRegion.bottom / 10;
				} else if (legendPosition == 'bottom') {
					chartPanelLegengY = mainPanelRegion.bottom * (9 / 10);
				} else if (legendPosition == 'left') {
					chartPanelLegengX = mainPanelRegion.right / 10;
				} else if (legendPosition == 'right') {
					chartPanelLegengX = mainPanelRegion.right * (9 / 10);
				}
				chartPanelLegeng.setPosition(chartPanelLegengX,	chartPanelLegengY, true);
			}

			//myNewChart.draw();
			
			/* var mainPanelIsScrollable = 
				(chartPanelCanvas.clientWidth > mainPanelRegion.right 
					|| (chartPanelCanvas.clientHeight 
							+ chartPanelTitleOrNoData.clientHeight
							+ chartPanelSubtitle.clientHeight) 
								> mainPanelRegion.bottom
							 chartPanelCanvas.getHeight() 
							+ chartPanelTitleOrNoData.getHeight() 
							+ chartPanelSubtitle.getHeight()) 
								> mainPanelRegion.bottom 
								);
				
				mainPanel.setScrollable( mainPanelIsScrollable ); */
				
		}
	}
	var handleCrossNavigationTo =function(e) {
		var t = chartConfConf;
		
			var chart = this;
			
			var categoryName = null;
			var serieName = null;
			
			if(!categoryName && chartConfConf.chart.additionalData){
				categoryName = chartConfConf.chart.additionalData.categoryName;
			}
			
			if(chartConfConf.chart.type.toLowerCase()=='pie'){
				if(!serieName && chartConfConf.chart.additionalData){
					serieName = chartConfConf.chart.additionalData.serieName;
				}
			}
			
			else {
				serieName = e[0].datasetLabel;
			}
			
			var categoryValue = e[0].label;
			var serieValue = e[0].value;
         
			if(parent.execExternalCrossNavigation){
				var navData={
         			chartType:	"CHARTJS",
         			CATEGORY_NAME :categoryName,
         			CATEGORY_VALUE :categoryValue,
         			SERIE_NAME :serieName,
         			SERIE_VALUE :serieValue,
         			stringParameters:null
				}; 
				parent.execExternalCrossNavigation(navData,JSON.parse(driverParams))
			}
		
		
	};
	
})