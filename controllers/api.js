const axios = require('axios');
const paypal = require('paypal-rest-sdk');

exports.getRelationshipGraph = (req, res) => {
    var chartData = [10,10,10,10,10,10,10,5,5,5,5,10]
    var labels = ['Aries' , 'Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
    res.render('api/relationshipGraph', {
        title: 'Relationship Graph',
        chartLabels : JSON.stringify(labels),
        chartData : JSON.stringify(chartData)
    });
}

/**
 * GET /api/paypal
 * PayPal SDK example.
 */
exports.getPayPal = (req, res, next) => {
   
    paypal.configure({
      mode: 'sandbox',
      client_id: process.env.PAYPAL_ID,
      client_secret: process.env.PAYPAL_SECRET
    });
  
    const paymentDetails = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: process.env.PAYPAL_RETURN_URL,
        cancel_url: process.env.PAYPAL_CANCEL_URL
      },
      transactions: [{
        description: 'Hackathon Starter',
        amount: {
          currency: 'USD',
          total: '1.99'
        }
      }]
    };
  
    paypal.payment.create(paymentDetails, (err, payment) => {
      if (err) { return next(err); }
      const { links, id } = payment;
      req.session.paymentId = id;
      for (let i = 0; i < links.length; i++) {
        if (links[i].rel === 'approval_url') {
          res.render('api/paypal', {
            approvalUrl: links[i].href
          });
        }
      }
    });
  };
  
  /**
   * GET /api/paypal/success
   * PayPal SDK example.
   */
  exports.getPayPalSuccess = (req, res) => {
    const { paymentId } = req.session;
    const paymentDetails = { payer_id: req.query.PayerID };
    paypal.payment.execute(paymentId, paymentDetails, (err) => {
      res.render('api/paypal', {
        result: true,
        success: !err
      });
    });
  };
  
  /**
   * GET /api/paypal/cancel
   * PayPal SDK example.
   */
  exports.getPayPalCancel = (req, res) => {
    req.session.paymentId = null;
    res.render('api/paypal', {
      result: true,
      canceled: true
    });
  };

exports.getFinanceGraph = (req, res) => {
    var chartData = [randomScalingFactor(), 
        randomScalingFactor(), randomScalingFactor(),randomScalingFactor(),
         randomScalingFactor(), randomScalingFactor(), randomScalingFactor(),randomScalingFactor(), 
         randomScalingFactor(), randomScalingFactor(), randomScalingFactor(),
          randomScalingFactor()]
    var labels = ['Aries' , 'Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
    res.render('api/financialGrowth', {
        title: 'Finance Graph',
        chartLabels : JSON.stringify(labels),
        financeData : JSON.stringify(chartData)
    });
}
var randomScalingFactor = function() {
    return (Math.random() > 0.5 ? 1.0 : 1.0) * Math.round(Math.random() * 100);
};

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
                lineTension: 0.1,
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

