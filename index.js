const express = require('express');
const app = express();
const route = require('./src/route')

app.use(express.json());
app.use('/', route)



const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})