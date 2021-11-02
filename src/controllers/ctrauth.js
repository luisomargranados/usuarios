import {dbconsultartodos, dbautenticar, dbconsecutivo, dbcrear} from "../bd/abdauth";
import config from "../config/config";
import {createHmac} from "crypto";

const secret = config.secret;
const jwt = require('jsonwebtoken');

export const consultartodos = async (req, res) => {
    var resultEntity = {number: 0,message: "", err: null, result: []};  
    try{
        resultEntity = await dbconsultartodos();
        if (resultEntity.number != 0){
            res.status(500);
            res.json(resultEntity);
        }
        res.json(resultEntity);
    }
    catch(ex){
        res.status(500);
        res.send(ex.message);
    }
}

export const autenticar = async (req, res) => {
    var resultEntity = {number: 0,message: "", err: null, result: []};
    var tokenok = {ok: false, cid:null, usr: "", jwt: ""};
    var ljwt = "";
    try{
        var {usr, psw} = req.body;
        if (usr == null || usr.trim() == ""){
            resultEntity.number = -1;
            throw new Error("Usurio inválido")
        }
        if (psw == null || psw.trim() == ""){
            resultEntity.number = -1;
            throw new Error("Contraseña inválida")
        }
            
        resultEntity = await dbautenticar(usr);

        if (resultEntity.number != 0) {    
            res.status(500);
            res.json(resultEntity);
        }

        if (resultEntity.result.length == 0){
            resultEntity.number = -1;
            throw new Error("Usuario o Contraseña inválido");
        }

        if (resultEntity.result[0].clave != generarsha256(psw.trim())){
            resultEntity.number = -1;
            throw new Error("Usuario o Contraseña inválido");
        }

        ljwt = generarjwt(resultEntity.result[0].usuario);
        
        tokenok = {
            ok:true,
            cid:resultEntity.result[0].cid,
            usr:resultEntity.result[0].usuario,
            jwt:ljwt
        }
        resultEntity.result = [];
        resultEntity.result.push(tokenok) ;
        res.json(resultEntity);
    }
    catch(ex){
        if (ex.number)
            resultEntity.number= ex.number;
        else
            resultEntity.number = -1;
        resultEntity.message = ex.message;
        resultEntity.err = ex;
        resultEntity.result = [];
        res.status(500).json(resultEntity)
    }
}

function generarsha256(ppsw){
    try{
        var hash = createHmac('sha256', secret)
               .update(ppsw)
               .digest('HEX');
        return(hash);
    }catch(err){
        throw err;
    }
}

function generarjwt(puser){
    let token = "";
    try{
        let token = jwt.sign({
            "user": puser
        }, 'seed', {expiresIn: '24h'});
        return(token);
    }catch(err){
        throw err;
    }
}

export const crear = async (req, res) => {
    var resultEntity = {number: 0,message: "", err: null, result: []};
    var datainfo = {cid:null, usuario:"", clave:"",estatus:0};
    var ljwt = "";
    try{
        var {usr, psw} = req.body;
        if (usr == null || usr.trim() == ""){
            resultEntity.number = -1;
            throw new Error("Usurio inválido")
        }

        if (psw == null || psw.trim() == ""){
            resultEntity.number = -1;
            throw new Error("Contraseña inválida")
        }

        resultEntity = await dbautenticar(usr, psw);
        if (resultEntity.number != 0) {    
            res.status(500);
            res.json(resultEntity);
        }

        if (resultEntity.result.length != 0){
            resultEntity.number = -1;
            throw new Error("Usuario existente");
        }

        resultEntity = await dbconsecutivo("bnk_u001_li");
        if (resultEntity.number != 0) {    
            res.status(500);
            res.json(resultEntity);
        }

        datainfo.cid = Number(resultEntity.result[0].cvalue);
        datainfo.usuario = usr.trim();
        datainfo.clave = generarsha256(psw.trim());
        datainfo.estatus = 1;

        resultEntity = await dbcrear(datainfo.cid, datainfo);
        if (resultEntity.number != 0) {    
            res.status(500);
            res.json(resultEntity);
        }

        resultEntity.result = datainfo;
        
        res.json(resultEntity);
    }
    catch(ex){
        if (ex.number)
            resultEntity.number= ex.number;
        else
            resultEntity.number = -1;

        resultEntity.message = ex.message;
        resultEntity.err = ex;
        resultEntity.result = [];
        res.status(500).json(resultEntity)
    }
}

export const actualizar = async (req, res) => {
    var resultEntity = {number: 0,message: "", err: null, result: []};
    var datainfo = {cid:null, usuario:"", clave:"",estatus:0};
    var ljwt = "";
    try{
        var {usr, psw} = req.body;
        if (usr == null || usr.trim() == ""){
            resultEntity.number = -1;
            throw new Error("Usurio inválido")
        }

        if (psw == null || psw.trim() == ""){
            resultEntity.number = -1;
            throw new Error("Contraseña inválida")
        }

        resultEntity = await dbautenticar(usr, psw);
        if (resultEntity.number != 0) {    
            res.status(500);
            res.json(resultEntity);
        }

        if (resultEntity.result.length != 0){
            resultEntity.number = -1;
            throw new Error("Usuario existente");
        }

        resultEntity = await dbconsecutivo("bnk_u001_li");
        if (resultEntity.number != 0) {    
            res.status(500);
            res.json(resultEntity);
        }

        datainfo.cid = Number(resultEntity.result[0].cvalue);
        datainfo.usuario = usr.trim();
        datainfo.clave = generarsha256(psw.trim());
        datainfo.estatus = 1;

        resultEntity = await dbcrear(datainfo.cid, datainfo);
        if (resultEntity.number != 0) {    
            res.status(500);
            res.json(resultEntity);
        }

        resultEntity.result = datainfo;
        
        res.json(resultEntity);
    }
    catch(ex){
        if (ex.number)
            resultEntity.number= ex.number;
        else
            resultEntity.number = -1;

        resultEntity.message = ex.message;
        resultEntity.err = ex;
        resultEntity.result = [];
        res.status(500).json(resultEntity)
    }
}

