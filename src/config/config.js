import  {config} from "dotenv";
config();

export default {
    serverport: Number(process.env.SERVERPORT),
    dbuser: process.env.DBUSER,
    dbpassword: process.env.DBPASSWORD,
    dbserver: process.env.DBSERVER,
    dbdatabase: process.env.DBDATABASE,
    dbport: Number(process.env.DBPORT),
    dbencryt: Boolean(process.env.DBENCRYPT),
    dbtrustServerCertificate: Boolean(process.env.DBTRUSTSERVERCERTIFICATE),
    secret: process.env.SECRET

}