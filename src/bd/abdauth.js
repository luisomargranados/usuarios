import {sql, concetar, desconcetar} from "./mssql";

export async function dbconsultartodos() {
    var query = "Select datainfo from bnk_u001_li";
    var pool = null;
    var result = null;
    var resultEntity = {number: 0,message: "", err: null, result: []};  
    try{
        pool = await concetar();
        result = await pool.request().query(query);
        for (var i = 0; i < result.recordset.length; i++) {
            resultEntity.result.push(JSON.parse(result.recordset[i].datainfo));
        };      
    }
    catch(ex){
        resultEntity.number = ex.number;
        resultEntity.message = ex.message;
        resultEntity.err = ex;
    }
    finally
    {
        return resultEntity;
    }
}

export async function dbautenticar(usr) {
    var query = "select * from bnk_vi_u001_li where usuario = @pusr ";
    var pool = null;
    var result = null;
    var resultEntity = {number: 0,message: "", err: null, result: []};  
    try{
        pool = await concetar();
        result = await pool.request()
        .input("pusr", sql.VarChar, usr)
        .query(query);
        //for (var i = 0; i < result.recordset.length; i++) {
            //resultEntity.result.push(JSON.parse(result.recordset[i].datainfo));
        //};
        resultEntity.result = result.recordset;      
    }
    catch(ex){
        resultEntity.number = ex.number;
        resultEntity.message = ex.message;
        resultEntity.err = ex;
    }
    finally
    {
        return resultEntity;
    }
}

export async function dbconsecutivo(ctable) {
    var query = "Select * from bnk_vi_z002_li where cid = @pctable";
    var qexec = "update bnk_z002_li set datainfo = @pdatainfo where cid = @pctable";
    var pool = null;
    var result = null;
    var resultEntity = {number: 0,message: "", err: null, result: []}; 
    var pdatainfo = "";
    var transaction = null;
    try{
        pool = await concetar();
        transaction = new sql.Transaction(pool);
        transaction.begin();

        result = await pool.request()
        .input("pctable", sql.VarChar, ctable)
        .query(query);
        result.recordset[0].cvalue = String(Number(result.recordset[0].cvalue) + 1);
        pdatainfo = JSON.stringify(result.recordset[0]);
        
        result = await pool.request()
        .input("pdatainfo", sql.VarChar, pdatainfo)
        .input("pctable", sql.VarChar, ctable)
        .query(qexec);
    
        result = await pool.request()
        .input("pctable", sql.VarChar, ctable)
        .query(query);
        resultEntity.result = result.recordset; 
         
    }
    catch(ex){
        if (transaction)
            transaction.rollback();

        if (ex.number)
            resultEntity.number= ex.number;
        resultEntity.message = ex.message;
        resultEntity.err = ex;
        resultEntity.result = [];
    }
    finally
    {
        if (transaction)
            transaction.commit();

        return resultEntity;
    }
}


export async function dbcrear(cid, datainfo) {
    var query = "insert into bnk_u001_li values (@pcid, @pdatainfo) ";
    var pool = null;
    var result = null;
    var resultEntity = {number: 0,message: "", err: null, result: []};  
    try{
        pool = await concetar();
        result = await pool.request()
        .input("pcid", sql.VarChar, cid)
        .input("pdatainfo", sql.VarChar, JSON.stringify(datainfo))
        .query(query);
        resultEntity.result = result.recordset;      
    }
    catch(ex){
        if (ex.number)
            resultEntity.number= ex.number;

        resultEntity.message = ex.message;
        resultEntity.err = ex;
        resultEntity.result = [];
    }
    finally
    {
        return resultEntity;
    }
}