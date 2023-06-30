//Author: Ritchie Yapp 
//https://github.com/speckly

function transformGameData(data) {
    data.platformid = data.platformid.split(",")
    data.price = data.price.split(",")
    newList = []
    if (data.platformid.length != data.price.length) {
        return null
    } else {
        //would be good if i can get the value of price but i can only use foreach on one thing
        data.platformid.forEach((platform, priceIndex) => {
            newList.push([data.title, data.description, data.categoryid, data.year, data.price[priceIndex], platform])
        })
        return newList
    }
}

test_case = {
    "title": "Hogwarts Legacy",
    "description": "Hogwarts Legacy is a 2023 action role-playing game developed by Avalanche Software and published by Warner Bros.",
    "price": "69.90,75.5,80",
    "platformid": "1,2,3",
    "categoryid": "1",
    "year":2023 
}

test_error_case = {
    "title": "Hogwarts Legacy",
    "description": "Hogwarts Legacy is a 2023 action role-playing game developed by Avalanche Software and published by Warner Bros.",
    "price": "69.90,75.5,20",
    "platformid": "1,2,3,4",
    "categoryid": "1",
    "year":2023 
}


console.log(transformGameData(test_case))
console.log(transformGameData(test_error_case))