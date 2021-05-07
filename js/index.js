/* 
kAKAO: 46ad6c8773cc6a28980b95e7eb75f88e
openweathermap.com icon: http://openweathermap.org/img/wn/10d@2x.png
*/


$(function() {

	/*************** 글로벌 설정 *****************/
	var map;	// kakao 지도 객체
	var time;
	var timeDivision;
	var mapCenter = { lat: 35.80, lon: 127.55 }
	var weatherIcon = {
		i01: 'bi-brightness-high',
		i02: 'bi-cloud-sun',
		i03: 'bi-cloud',
		i04: 'bi-clouds',
		i09: 'bi-cloud-rain-heavy',
		i10: 'bi-cloud-drizzle',
		i11: 'bi-cloud-lightning',
		i13: 'bi-cloud-snow',
		i50: 'bi-cloud-haze',
	}

	var $bgWrapper = $('.bg-wrapper');
	var $map = $('#map');



	/*************** 사용자 함수 *****************/
	initBg();
	initMap();


	function initBg() {
		var d = new Date('2021-05-07 03:33:33');
		time = d.getHours();
		timeDivision = 
		(time >= 2 	&& time < 6	) ? 1 : 
		(time >= 6 	&& time < 10) ? 2 :
		(time >= 10 && time < 14) ? 3 :
		(time >= 14 && time < 18) ? 4 :
		(time >= 18 && time < 22) ? 5 : 6;

		for(var i=1; i<=6; i++) $bgWrapper.removeClass('active'+i);
		$bgWrapper.addClass('active'+timeDivision);
	}

	function initMap() {
		var options = {
			center: new kakao.maps.LatLng(mapCenter.lat, mapCenter.lon),
			level: 13,
			draggable: false,
			zoomable: false,
		};
		map = new kakao.maps.Map($map[0], options);
		map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);
		$(window).resize(onResize).trigger('resize');
	}
	
	/*************** 이벤트 콜백 *****************/
	function onResize() {
		var windowHeight = $(window).innerHeight();
		var lat = (windowHeight > 800 || windowHeight < 600) ? mapCenter.lat : mapCenter.lat + 1;
		map.setCenter(new kakao.maps.LatLng(lat, mapCenter.lon));
		map.setLevel(windowHeight > 800 ? 13 : 14);
	}
	
	
	/*************** 이벤트 등록 *****************/
});