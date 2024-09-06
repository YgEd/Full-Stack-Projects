//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.

import { parse } from "graphql";

export function err(from, msg) {
    throw "Error from '" + from + "': " + msg
}


export function strPrep(string){
    if (typeof(string) != "string"){
        return ""
    }
    return string.trim().toLowerCase();
}

export function lower(string){
    return string.toLowerCase();
}

export function chars(str){
    if (str == ""){
        return 0;
    }
    return chars(str.substring(1))+1;
}

export function isValidStrs(arr){
    if (Array.isArray(arr)){
        for(let i=0; i<arr.length; i++){
            let target = strPrep(arr[i]).trim();
            if (target.length==0){
                return false;
            }
            arr[i] = target;
        }
        return true
    }
    return false
}

export function isValidIngredients(arr){
      if (Array.isArray(arr) && arr.length >= 4){
        for(let i=0; i<arr.length; i++){
            let target = strPrep(arr[i]).trim();
            if (target.length < 4 || target.length> 50){
                return false;
            }
            arr[i] = target;
        }
        return true
    }
    return false
}

export function isValidSteps(arr){
    if (Array.isArray(arr) && arr.length >= 5){
        for(let i=0; i<arr.length; i++){
            let target = strPrep(arr[i]).trim();
            if (target.length < 10){
                return false;
            }
            arr[i] = target;
        }
        return true
    }
    return false
}

export function isNum(str){
    return /^[0-9]+$/.test(str);
}

// export function isAlpha(str){
//     return /^[a-z'\s]+(-[a-z'\s])*$/i.test(str);
// }

export function isAlpha(str){
    return /^[a-z'\s]+$/i.test(str);
}

export function isAlphaNum(str){
    return /^[a-z0-9]+$/i.test(str);
}

export function verPass(str){
    return (str.length >= 8 && (/^(?=.*\d)(?=.*[!@#$%^&*()\-[__+.])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(str)))
    // got regex help from https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a 
}

export function isValidDate(dateString) {
    const regex = /^\d{1,2}[/]\d{1,2}[/]\d{4}$/;
    if (!dateString.match(regex)) return false;
  
    const date = new Date(dateString);
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear().toString();

    const orgDay = dateString.split('/')[1];
    const orgMonth = dateString.split('/')[0];
    const orgYear = dateString.split('/')[2];

    // console.log(`day is ${day}`)
    // console.log(`month is ${month}`)
    // console.log(`year is ${year}`)

    // console.log(`orgDay is ${parseInt(orgDay)}`)
    // console.log(`orgMonth is ${parseInt(orgMonth)}`)
    // console.log(`orgYear is ${parseInt(orgYear)}`)

    if (parseInt(day) !== parseInt(orgDay) || parseInt(month) !== parseInt(orgMonth) || parseInt(year) !== parseInt(orgYear)){
        console.log("failed date check")
        return false;
    }
  
    return true;
  }


  export function isValid_isbn(input){

    let isbn = input.replace(/-/g, '');
    isbn = isbn.toLowerCase();
    if (isbn.length !== 10 && isbn.length !== 13){
        return false;
    }

    let test_is = isbn
    let x = test_is.slice(-1);
    console.log(`x is ${x}`)
    if (x !== 'x' && parseInt(x) === NaN){
        console.log("last is letter and not x")
        return false
    }

    console.log(`isbn is ${isbn}`)

    if (isbn.length === 10){
        let sum = 0;
        for (let i=0; i<9; i++){
            let num = parseInt(isbn[i]);
            if (isNaN(num)){
                return false;
            }
            sum += num * (10-i);
        }
        let last = isbn[9];
        if (last === 'x'){
            sum += 10;
        }
        if (parseInt(last) !== NaN){
            sum += parseInt(last);
        }
        if (sum % 11 === 0){
            return true;
        }

    } else if (isbn.length === 13){
        let sum = 0;
        for (let i=0; i<12; i++){
            let num = parseInt(isbn[i]);
            if (isNaN(num)){
                return false;
            }
            if (i % 2 === 0){
                sum += num;
            } else {
                sum += num * 3;
            }
        }
        let last = isbn[12];
        if (last === 'x'){
            sum += 10;
        }
        if (parseInt(last) !== NaN){
            sum += parseInt(last);
        }
        if (sum % 10 == 0){
            return true
        }
    }


    return false
  }