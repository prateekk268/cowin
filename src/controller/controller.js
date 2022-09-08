const axios = require('axios');
const fs = require('fs')

function check(num) {
    if (typeof num !== "number") return false;
    if (num < 0) return false;
    let a = Math.floor(num);
    if (a !== num) return false;
    else return true;
}

function dateChecker(str) {
    const regexExp = /(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/gi;
    if (regexExp.test(str)) {
        return true
    } else {
        return false
    }
}

const getHospitals = async function (req, res) {
    try {

        let district_id = req.body.district_id;
        let date = req.body.date;
        let limit = req.body.limit;


        if (!district_id) return res.status(400).send({ code: 500, message: `District_id is required` });
        if (!check(district_id)) return res.status(400).send({ code: 500, message: `Must be non negative number` })


        if (!date) return res.status(400).send({ code: 500, message: 'Date is required' });
        if (dateChecker(date) === false) return res.send({ code: 500, message: "please provide date in valid string format" })

        if (limit) {
            if (!check(limit)) return res.status(400).send({ code: 500, message: `Must be non negative number` })
        } 
            
        


        const option = {
            method: 'get',
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${district_id}&date=${date}`,
        }

        let info = await axios(option);
        let result = []
        let arr = info.data["centers"];
        limit = req.body.limit || 10;
        console.log(limit);

        for (let i = 0; i < limit; i++) {
            let obj = {
                "name": arr[i].name,
                "sessions": []
            }

            let key = arr[i].sessions
            for (let j = 0; j < key.length; j++) {
                let obj1 = {
                    available_capacity: key[j]["available_capacity"],
                    vaccine: key[j]["vaccine"]
                }
                obj.sessions.push(obj1)
            }

            result.push(obj)
        }

        fs.writeFileSync("Hospital.txt", JSON.stringify({
            code: 200,
            message: "Hospitals sent successfully",
            result: result
        }),
            function (err) {
                if (err) console.log(err);
            }
        );
        return res.status(200).send({ code: 200, message: "Hospitals sent successfully", result: result })
    } catch (err) {
        return res.status(500).send({ error: err.message })
    }
}

module.exports = { getHospitals }