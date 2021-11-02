import sql from "mssql";
import config from "../config/config";

export {sql};

const dbsettings = {
    user: config.dbuser,
    password: config.dbpassword,
    server: config.dbserver,
    database: config.dbdatabase,
    port: config.dbport,
    options: 
    {
        encryt: config.dbencryt,
        trustServerCertificate: config.dbtrustServerCertificate //true de forma local
    }   
}

export async function concetar(){
    try{
        const pool = await sql.connect(dbsettings);
        return pool;
    }catch(err){
        console.log(ex.message);
    }
}

export async function desconcetar(pool){
    try{
        if (pool != null){
            pool.close();
        }
    }catch(err){
        console.log(ex.message);
    }
}
