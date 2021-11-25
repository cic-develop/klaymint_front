fetch('https://geolocation-db.com/json/')
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log('sss');
        const userIp = data.IPv4;
        if (userIp === '49.163.50.132') {
            const root = document.getElementById('root');
            root.remove();
        }
    })
    .catch((error) => console.log(error));
