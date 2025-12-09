
const randomValue = "AKDJALFAKFLDAJLAJFKDLASFJAASFKJSARE92I39U83QLKAJDAFADF"

export function hashPassword({size} : {
    size?: number
}){ 
    if(!size){ 
        size = 20;
    }
    let result = '';
    
    for(let i = 0; i<size; i++){ 
        result += randomValue[Math.floor(Math.random() * randomValue.length)];
    }
    
    return result;
}


