var miBand,
    infoSections;
$(function(){
  Chart.defaults.global.legend.display = false;
  miBand = new Band();
  infoSections = $('.general-info-section, .steps-section, .battery-section');

  $(document).on('click', '.connect-btn', function(){
    var button = $(this);
    button.text('Connecting...');
    miBand.connect().then(result => {
      if (result) {
        initEverything(miBand);
        showInfoSections()
        $('html, body').animate({scrollTop: $(".general-info-section").offset().top}, 800);
      }
      else {
        alert("User chose the blue pill");
      }
      button.text('Connect');
    })
  })

  if ('serviceWorker' in navigator) {
      navigator.serviceWorker
               .register('./js/worker.js')
               .then(function() { console.log('Service Worker Registered'); });
    }
})

function initEverything(miBand){
  let reset = (localStorage.length === 0);
    initBatterySection(miBand);
    initGeneralInfoSection(miBand);
    initStepsInfoSection();
    startScanSteps(miBand);
}

function hideInfoSections(){
  infoSections.addClass('hidden');
}

function showInfoSections(){
  infoSections.removeClass('hidden');
}

function initBatterySection(miBand){
  miBand.getBatteryInfo().then(data => {
    var batteryLevel = parseInt(data.get('batteryLevel'));
    var chartData = {
          labels: [
              "Charge Level",
              "Lost charge"
          ],
          datasets: [
              {
                  data: [batteryLevel, 100 - batteryLevel],
                  backgroundColor: [
                      "#82c91e",
                      "#636363",
                  ],
                  borderWidth: 0
              }]
      };


    var chart = new Chart($('#batteryLevel'), {
      type:'doughnut',
      data: chartData
    });

     $('.last-charge .value').text(data.get('batteryLastCharge').toLocaleString());
     $('.charges .value').text(data.get('batteryCharges'));
     $('.status .value').text(data.get('batteryStatusText'));
  })
}

function initGeneralInfoSection(miBand){
  miBand.getDeviceInfo().then(data => {
    $('.firmware-version .value').text(data.get('firmwareVersion'));
    $('.profileVersion .value').text(data.get('profileVersion'));
  });

  miBand.getBluetoothConnectionParameters().then(data => {
    $('.ble-latency .value').text(data.get('latency'));
    $('.ble-connectionInterval .value').text(data.get('connectionInterval'));
  });

  $('.device-name .value').text(miBand.getDeviceName())
}

function startScanSteps(miBand){
  miBand.scanSteps(updateSteps);
}

function updateSteps(value){
    var today = new Date().toJSON().slice(0, 10);
    var prevSteps = localStorage.setItem(today, value);
  $('.steps .value').text(value);
}

function initStepsInfoSection(){
    var today = new Date().toJSON().slice(0, 10);
    var prevSteps = localStorage.getItem(today) || 0;
    updateSteps(prevSteps);
}
