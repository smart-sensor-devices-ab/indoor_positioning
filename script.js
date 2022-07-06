import * as my_dongle from 'bleuio'
document.getElementById('connect').addEventListener('click', function(){
  my_dongle.at_connect()
  document.getElementById('checkLocation').removeAttribute("disabled");

})
//List of Close Beacons and their name based on mac address
let beaconArray={
  "Conference Room":"[D0:76:50:80:00:3A]",
  "Entrance":"[D0:76:50:80:00:97]",
  "SSD lab":"[D0:76:50:80:0B:9D]",
  "IAD lab":"[D0:76:50:80:0F:49]",
  "Office":"[D0:76:50:80:02:30]",
}
document.getElementById('checkLocation').addEventListener('click', function(){ 
  document.getElementById("loading").style.display = "block";
  document.getElementById('connect').setAttribute("disabled","");
// put the dongle on central role ,so that we can scan
  my_dongle.at_central().then(()=>{
    //enable rssi for the scan response
    my_dongle.at_showrssi(1).then(()=>{
      //filter advertised data , so it only shows close beacon on the response
      my_dongle.at_findscandata('9636C6F7',6).then((data)=>{
        //convert array string to array of object with key value
        const formated = data.map((item) => {
          if(item.length>30){
            const splitted= item.split(' ');
            let mac=splitted[2]
            let rssi=splitted[1]
            return { mac,rssi};
          }
        });
         //sort based on rssi value       
        formated.sort((a, b) => parseInt(b.rssi) > parseInt(a.rssi) && 1 || -1)
        // get the name of the close beacon by mac address
        let locationName=Object.keys(beaconArray).find(key => beaconArray[key] === formated[0]['mac']);
        document.getElementById("loading").style.display = "none";
        // print out the location
        document.getElementById("theLocation").innerHTML = "You are at <strong>"+locationName+"</strong";       
      })
    }) 
  })
})