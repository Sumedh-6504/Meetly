// getKey from .env file and export it as a constant

export const getKey=(key:string, defaultValue: string="")=>{
    const value = process.env[key];
    if(value == undefined){
        if(defaultValue){
            return defaultValue
        }
        throw new Error(`Environment variable key ${key} not set`);
    }
    return value;
}