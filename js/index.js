/* 
kAKAO: 46ad6c8773cc6a28980b95e7eb75f88e
openweathermap.com icon: http://openweathermap.org/img/wn/10d@2x.png

24시간 전 날씨정보: https://api.openweathermap.org/data/2.5/onecall?lat=37.56322905592715&lon=126.98987106691214&exclude=&appid=02efdd64bdc14b279bc91d9247db4722&units=metric&dt=1620780822
*/


$(function () {

	/*************** 글로벌 설정 *****************/
	var map; // kakao 지도 객체
	var time;
	var timeDivision;
	var mapCenter = {
		lat: 35.80,
		lon: 128.7
	}
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

	var dailyURL = 'https://api.openweathermap.org/data/2.5/weather';
	var todayURL = 'https://api.openweathermap.org/data/2.5/onecall';
	var weeklyURL = 'https://api.openweathermap.org/data/2.5/forecast';
	var yesterdayURL = 'https://api.openweathermap.org/data/2.5/onecall/timemachine';
	var sendData = {
		appid: '02efdd64bdc14b279bc91d9247db4722',
		units: 'metric',
		lang: 'kr'
	};
	var defPath = 'https://via.placeholder.com/40x40/c4f1f1?text=%20';

	var $bgWrapper = $('.bg-wrapper');
	var $map = $('#map');



	/*************** 사용자 함수 *****************/
	initBg();
	initMap();
	initWeather();


	function initBg() {
		var d = new Date();
		time = d.getHours();
		timeDivision =
			(time >= 2 && time < 6) ? 1 :
			(time >= 6 && time < 10) ? 2 :
			(time >= 10 && time < 14) ? 3 :
			(time >= 14 && time < 18) ? 4 :
			(time >= 18 && time < 22) ? 5 : 6;

		for (var i = 1; i <= 6; i++) $bgWrapper.removeClass('active' + i);
		$bgWrapper.addClass('active' + timeDivision);
	}

	function initMap() {
		var options = {
			center: new kakao.maps.LatLng(mapCenter.lat, mapCenter.lon),
			level: 13,
			draggable: false,
			zoomable: false,
		};
		map = new kakao.maps.Map($map[0], options);
		map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN); // 지형도 붙이기

		// 윈도우 사이즈가 변경될 때 지도 중심 맞추기
		$(window).resize(onResize).trigger('resize');

		// 도시정보 가져오기
		$.get('../json/city.json', onGetCity);
	}

	function initWeather() {
		console.log(isIE11);
		var options = isIE11 ? { enableHighAccuracy: false, maximumAge: 50000 } : {};
		navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

		function onSuccess(r) {
			var data = JSON.parse(JSON.stringify(sendData));
			data.lat = r.coords.latitude;
			data.lon = r.coords.longitude;
			$.get(dailyURL, data, onToday);
			$.get(weeklyURL, data, onWeekly);
		}

		function onError(err) {
			var data = JSON.parse(JSON.stringify(sendData));
			data.lat = 37.563229;
			data.lon = 126.989871;
			$.get(dailyURL, data, onToday);
			$.get(weeklyURL, data, onWeekly);
		}
	}

	// openweathermap의 icon 가져오기
	function getIcon(icon) {
		return 'https://openweathermap.org/img/wn/' + icon + '@2x.png';
	}

	/*************** 이벤트 콜백 *****************/
	function onToday(r) {
		console.log(r);
		var $wrapper = $('.weather-wrapper');
		var $title = $wrapper.find('.title-wrap');
		var $summary = $wrapper.find('.summary-wrap');
		var $icon = $wrapper.find('.icon-wrap');
		var $desc = $wrapper.find('.desc-wrap');
		$title.find('.name').text(r.name + ', KR');
		$title.find('.time').text(moment(r.dt * 1000).format('hh시 mm분 기준'));
		$summary.find('span').eq(0).text(r.weather[0].description);
		$summary.find('span').eq(1).text('(' + r.weather[0].main + ')');
		$icon.find('img').attr('src', getIcon(r.weather[0].icon));
		$desc.find('.temp span').text(r.main.temp);
		$desc.find('.temp-feel span').text(r.main.feels_like);

		var data = JSON.parse(JSON.stringify(sendData));
		data.lat = r.coord.lat;
		data.lon = r.coord.lon;
		data.dt = r.dt - 86400;
		$.get(yesterdayURL, data, onYesterday);

		function onYesterday(r2) {
			var gap = (r.main.temp - r2.current.temp).toFixed(1);
			if (gap == 0) {
				$desc.find('.temp-desc .josa').text('와');
				$desc.find('.temp-desc .gap').hide();
				$desc.find('.temp-desc .desc').text('같아요');
			} else {
				$desc.find('.temp-desc .josa').text('보다');
				$desc.find('.temp-desc .gap').show();
				$desc.find('.temp-desc .gap span').text(Math.abs(gap));
				$desc.find('.temp-desc .desc').text((gap > 0) ? '높아요' : '낮아요');
			}
		}
	}

	function onWeekly(r) {
		console.log(r);
	}

	function onGetCity(r) {
		r.city.forEach(function (v, i) {
			var content = '';
			content += '<div class="co-wrapper ' + (v.minimap ? '' : 'minimap') + '" data-lat="' + v.lat + '" data-lon="' + v.lon + '">';
			content += '<div class="co-wrap clearfix ' + (v.name == '독도' || v.name == '울릉도' ? 'dokdo' : '') + '">';
			content += '<div class="icon-wrap">';
			content += '<img src="' + defPath + '" class="icon">';
			content += '</div>';
			content += '<div class="temp-wrap">';
			content += '<span class="temp"></span>℃';
			content += '</div>';
			content += '</div>';
			content += v.name;
			content += '</div>';
			var customOverlay = new kakao.maps.CustomOverlay({
				position: new kakao.maps.LatLng(v.lat, v.lon),
				content: content,
				xAnchor: v.anchor ? v.anchor.x : 0.25,
				yAnchor: v.anchor ? v.anchor.y : 0.65,
			});
			customOverlay.setMap(map);
			$(customOverlay.a).mouseenter(onOverlayEnter);
			$(customOverlay.a).mouseleave(onOverlayLeave);
			$(customOverlay.a).click(onOverlayClick);
		});
		$(window).trigger('resize');
	}

	function onResize() {
		var windowHeight = $(window).innerHeight();
		var lat = (windowHeight > 800 || windowHeight < 600) ? mapCenter.lat : mapCenter.lat + 1;
		map.setCenter(new kakao.maps.LatLng(lat, mapCenter.lon));
		if (windowHeight < 800) {
			$('.minimap').hide();
			$('.map-wrapper .co-wrapper').addClass('active');
			map.setLevel(14);
		} else {
			map.setLevel(13);
			$('.minimap').show();
			$('.map-wrapper .co-wrapper').removeClass('active');
		}
	}


	/*************** 이벤트 등록 *****************/
	function onOverlayClick() {
		var data = JSON.parse(JSON.stringify(sendData));
		data.lat = $(this).find('.co-wrapper').data('lat'); // data-lat
		data.lon = $(this).find('.co-wrapper').data('lon'); // data-lon
		$.get(dailyURL, data, onToday);
	}

	function onOverlayEnter() {
		// this => .co-wrapper중 호버당한 넘 부모(kakao가 생성한 넘)
		$(this).find('.co-wrap').css('display', 'flex');
		$(this).css('z-index', 1);
		var data = JSON.parse(JSON.stringify(sendData));
		data.lat = $(this).find('.co-wrapper').data('lat'); // data-lat
		data.lon = $(this).find('.co-wrapper').data('lon'); // data-lon
		$.get(dailyURL, data, onLoad.bind(this));

		function onLoad(r) {
			// console.log(r);
			$(this).find('.temp').text(r.main.temp);
			$(this).find('.icon').attr('src', getIcon(r.weather[0].icon));
		}
	}

	function onOverlayLeave() {
		$(this).css('z-index', 0);
		$(this).find('.co-wrap').css('display', 'none');
	}

});