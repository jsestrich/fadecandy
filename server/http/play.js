rangesObj = {
  i: 0,
  ranges: [],
  highestPixel: 0
};
handleServerInfo = function(server_info) {
  console.log(server_info);
  ranges = []
  highestPixel = 0
  for (var d = 0; d < server_info.config.devices.length; d++) {
    if (server_info.config.devices[d].type == 'fadecandy') {
      for (var m = 0; m < server_info.config.devices[d].map.length; m++) {
        ranges.push({
          "start": server_info.config.devices[d].map[m][1],
          "length": server_info.config.devices[d].map[m][3]});
        if (highestPixel
            < (server_info.config.devices[d].map[m][1]
            + server_info.config.devices[d].map[m][3])) {
          highestPixel =
              server_info.config.devices[d].map[m][1]
              + server_info.config.devices[d].map[m][3];
        }
      }
    }
  }
  console.log(ranges);
  rangesObj.ranges = ranges;
  rangesObj.highestPixel = highestPixel;
}

ws = new WebSocket("ws://localhost:8080")

ws.onopen = function(event) {
  ws.onmessage = function (event) {
    event = JSON.parse(event.data);
    if (event.type == 'server_info') {
      handleServerInfo(event);
    }
  };
  ws.send('{ "type": "server_info" }');
}

setInterval(
    function() {
      rangesObj.i += 1;
      var index = Math.floor(rangesObj.i / 2) % rangesObj.ranges.length;
      console.log(index)
      var range = rangesObj.ranges[index];
      var invert = (rangesObj.i % 2) == 0;
      var invert = false
      var state = range.start == 0 ? 'middle' : 'begin'
      var data = [0,0,0,0];
      for (var i = 0; i < rangesObj.highestPixel; i++) {
        if (state == 'begin') {
          if (i + 1 >= range.start) {
            state = 'middle';
            console.log('switch to middle [' + i + ']');
          }
          data.push(invert ? 255 : 0);
          data.push(0);
          data.push(0);
        } else if (state == 'middle') {
          if (i + 1 >= range.start + range.length) {
            state = 'end';
            console.log('switch to end [' + i + ']');
          }
          data.push(invert ? 0 : 255);
          data.push(0);
          data.push(0);
        } else if (state == 'end') {
          data.push(invert ? 255 : 0);
          data.push(0);
          data.push(0);
        }
      }
      ws.send(new Uint8Array(data));
    },
    100);
