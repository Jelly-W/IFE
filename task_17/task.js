function $(id){
	return document.getElementById(id);
};


/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

//柱形颜色
var colors=['#16324a', '#24385e', '#393f65', '#4e4a67', '#5a4563', '#b38e95','#edae9e', '#c1b9c2', '#bec3cb', '#9ea7bb', '#99b4ce', '#d7f0f8'];


// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: '北京',
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
	$('aqi-chart-wrap').innerHTML='';
	var num=0;
	console.log(chartData);
	for (var month in chartData){
		var oDiv=document.createElement('div');
		oDiv.style.height=chartData[month]+'px';
		oDiv.style.background=colors[num%colors.length];
		oDiv.title=month+':'+chartData[month];
		
		$('aqi-chart-wrap').appendChild(oDiv);
		
		num++;
	};
};

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
	// 确定是否选项发生了变化 
	if (pageState.nowGraTime!=this.value){
		pageState.nowGraTime=this.value;
	};
	// 设置对应数据
	initAqiChartData();
	// 调用图表渲染函数
	renderChart();
	
};

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  if (pageState.nowSelectCityA!=this.value){
		pageState.nowSelectCity=this.value;
  };
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
	
};

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
	var aInput=$('form-gra-time').getElementsByTagName('input');
	for (var i=0; i<aInput.length; i++){
		aInput[i].onclick=graTimeChange;
	};
};

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
	for (var city in aqiSourceData){
		$('city-select').innerHTML+='<option>'+city+'</option>';
	};
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
	$('city-select').onchange=citySelectChange;

};

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  var cityAqi=aqiSourceData[pageState.nowSelectCity];
  // 处理好的数据存到 chartData 中
  chartData={};
  if (pageState.nowGraTime=='day'){
		chartData=cityAqi;
  }
  else if (pageState.nowGraTime=='week'){
	  var countNum=0;		//每周的aqi值之和。
	  var dayNum=0;			//每周有几天。
	  var week=0;			//记录是第几周。
	  
	  for (var key in cityAqi){
			countNum+=cityAqi[key];
			dayNum++;
			var m=new Date((new Date(key)).getYear(),(new Date(key)).getMonth()+1>12 ? 0 : (new Date(key)).getMonth()+1);    //用于找到每个月最后一天的变量。
			if ((new Date(key)).getDate()==(new Date(m.setDate(0))).getDate()){			//判断当天是否已是当月最后一天。
				week++;
				chartData['2016-'+((new Date(key)).getMonth()+1)+'月 第'+week+'周']=Math.floor(countNum/dayNum);
				countNum=0;
				dayNum=0;
				week=0;
			}
			else if ((new Date(key)).getDay()==0){										//判断当天是否为星期日（如果是星期日说明已是一周）。
				week++;
				chartData['2016-'+((new Date(key)).getMonth()+1)+'月 第'+week+'周']=Math.floor(countNum/dayNum);
				countNum=0;
				dayNum=0;
			}
	  };
  }
  else if (pageState.nowGraTime=='month'){
		var countNum=0;
		var dayNum=0;
		var month=0;
		
		for (var key in cityAqi){
			var m=new Date((new Date(key)).getYear(),(new Date(key)).getMonth()+1>12 ? 0 : (new Date(key)).getMonth()+1);    //用于找到每个月最后一天的变量。
			if ((new Date(key)).getDate()==(new Date(m.setDate(0))).getDate()){
				month>11 ? month=0 : month++;
				chartData['第'+month+'月']=Math.floor(countNum/dayNum);
				countNum=0;
				dayNum=0;
				console.log(month);
			};
			countNum+=cityAqi[key];
			dayNum++;
		};
  };
}

/**
 * 初始化函数
 */
function init() {
	citySelectChange();
	initGraTimeForm();
	initCitySelector();
	initAqiChartData();
}

init();












