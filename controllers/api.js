const axios = require('axios');
exports.getChart = async (req, res, next) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=compact&apikey=${process.env.ALPHA_VANTAGE_KEY}`;
    axios.get(url)
      .then((response) => {
        let radarData = [];
        const arr = response.data['Time Series (Daily)'];
        let dates = [];
        let closing = []; // stock closing value
        const keys = Object.getOwnPropertyNames(arr);
        for (let i = 0; i < 100; i++) {
          dates.push(keys[i]);
          closing.push(arr[keys[i]]['4. close']);
        }
        // reverse so dates appear from left to right
        dates.reverse();
        closing.reverse();
        var numcomments = [10,20,1,8,7,4,8,9,12];
        for(index = 0; index < 13; index++) {
            //numcomments.push(index);
        }
        radarData = {
            labels: ['Aries' , 'Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'],
            datasets: [{
                label: "Education",
                lineTension: 0.1,
                backgroundColor: "rgba(178, 223, 219,0.2)",
                borderColor: "#009688",
                pointBackgroundColor: "#004D40",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#ff00",
                pointHoverBorderColor: "rgba(255,99,132,1)",
                data: numcomments
            },
            {
                label: "Finance",
                lineTension: 0,
                backgroundColor: "pink",
                borderColor: "red",
                pointBackgroundColor: "black",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#ff00",
                pointHoverBorderColor: "rgba(255,99,132,1)",
                data: [1,2,6,8,4,5,3,9,10,6,11]
            }]
        }
        var color = ["rgba(241,28,39,1)", //red
            "rgba(28,145,241,1)",//blue
            "rgba(231,221,28,1)", //yellow
            "rgba(38,231,28,1)", //green
            "rgba(28,231,221,1)", //cyan
            "rgba(231,228,211,1)", //pink
            "rgba(3,1,3,1)", // black
            "rgba(236,176,179,1)", //light pink
            "rgba(239,107,51,1)", //orange
            "rgba(157,51,239,1)", //violet
            "rgba(16,82,248,1)", //royalblue
            "rgba(241,28,39,1)"];

        ChartData = {}; 
        ChartData.labels = []; 
        ChartData.datasets = []; 
        for (index = 0; index < 5; index++) {
            temp = [];
            ChartData.datasets.push({});
            dataset = ChartData.datasets[index]
            dataset.backgroundColor = color[index],
            dataset.borderColor = color[index],
            dataset.label =  ["label1","label2","label3"]; //labels
            dataset.data = []; //data on Y-Axis
            ChartData.datasets[index].data = [10,20,30,40,50]; //data
        } 

        dates = JSON.stringify(dates);
        closing = JSON.stringify(closing);
        radarData = JSON.stringify(radarData);
        res.render('api/chart', {
          title: 'Chart',
          dates,
          closing,
          radarData
        });
        
      }).catch((err) => {
        next(err);
      });
      

  };