const express = require('express');
const app = express();
const port = 3300;
const bodyparser = require('body-parser');
const translate = require('@k3rn31p4nic/google-translate-api');

// Body-parser middleware 
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

let cache = {};
/**
 * Function to translate text to other languages
 */
app.post('/translateText', (req, res) => {
  let reqText = req.body.text;
  let reqFrom = req.body.from;
  let reqTo = req.body.to;
  let result = cache[reqText+reqFrom+reqTo];
  if (result != null) {
    console.log("Cache hit");
    res.send(result);
  } else {
    translate(reqText, {from: reqFrom, to: reqTo}).then(result => {
        cache[reqText+reqFrom+reqTo] = result.text;
        console.log("Cache miss");
        res.send(result.text);
    }).catch(err => {
        console.error(err)
    })
}
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
