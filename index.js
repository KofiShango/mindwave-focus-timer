const { createClient } = require("node-thinkgear-sockets");
const say = require('say');
const brain = createClient({ enableRawOutput: false });
const ONE_MINUTE = 60000;
const TEN_MINUTES = 600000;
const ONE_HOUR = 3600000;
let debugLogging = false;
brain.connect();
const history = [];

brain.on('data', data=>{
    const attention = data && data.eSense && data.eSense.attention;
    debugLogging && console.log("Attention: ", attention);
    if(attention){
        history.push(attention)
    }
})

/**
 * Check average every 10 mins
 */
const timer = setInterval(()=>{
    if(history.length){
        let sum = 0;
        history.forEach(num => {
            sum += num;
        });
        const average = sum / history.length 
        history.length = 0;
        debugLogging && console.log(Date.now().toLocaleString(),'Average: ', average);
        if(average > 50){
            console.log("Achieved high focus. Average focus: ", average);
            say.speak('Your focus level is high. Great job!');
        }else{
            console.log("Focus is lower. Average focus: ", average);
            say.speak('Your focus level is lower. You can do it!');
        }
    }
}, ONE_MINUTE);

process.on('SIGTERM', () => clearInterval(timer));

process.on('SIGKILL', () => clearInterval(timer));
