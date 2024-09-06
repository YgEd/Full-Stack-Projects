

export function strPrep(string){
    string = string.trim().toLowerCase();
    if (typeof(string) != "string" || string == ""){
        return false
    }
    return string
}


export function isNum(str){
  return /^[0-9]+$/.test(str);
}