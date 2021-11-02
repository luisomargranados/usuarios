import {dbconsecutivo, dbinsertar, dbactualizar, dbconsultar} from "../bd/abdclientes";

export const transac = async (req, res) => {
    var resultEntity = {number: 0,message: "", err: null, result: []};
    var transac = {cia: "", txn: "", type:"", act: "", values: []};
    var tabla = "";
    try{
        transac = req.body;
        
        switch (transac.act.trim()) {
            case 'I':
                tabla = transac.cia.trim() + "_" + transac.txn.trim() + "_" + transac.type.trim();
                resultEntity = await insertar(tabla, transac.values);
                break;
            case 'A':
                tabla = transac.cia.trim() + "_" + transac.txn.trim() + "_" + transac.type.trim();
                resultEntity = await actualizar(tabla, transac.values);
                break;
            case 'S':
                tabla = transac.cia.trim() + "_vi_" + transac.txn.trim() + "_" + transac.type.trim();
                resultEntity = await consultar(tabla, transac.values);
                break;
            
        }  
        res.status(200);
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

async function insertar(ptabla, pvalues){
    var resultEntity = {number: 0,message: "", err: null, result: []};
    var cid = null;
    try{
        for(var element in pvalues) {
            resultEntity = await dbconsecutivo(ptabla);
            if (resultEntity.number != 0) {    
                throw new Error(resultEntity.message);
            }
            cid = Number(resultEntity.result[0].cvalue);
            pvalues[element].cid = String(cid); 

            resultEntity = await dbinsertar(ptabla, cid, pvalues[element]);
            if (resultEntity.number != 0) {    
                throw new Error(resultEntity.message);
            }
            
        }

        resultEntity.result = pvalues;
        
        return resultEntity;

    }catch(err){
        throw err;
    }
}

async function actualizar(ptabla, pvalues){
    var resultEntity = {number: 0,message: "", err: null, result: []};
    var cid = null;
    try{
        for(var element in pvalues) {

            cid = Number(pvalues[element].cid);

            resultEntity = await dbactualizar(ptabla, cid, pvalues[element]);
            if (resultEntity.number != 0) {    
                throw new Error(resultEntity.message);
            }
            
        }

        resultEntity.result = pvalues;
        
        return resultEntity;

    }catch(err){
        throw err;
    }
}

async function consultar(ptabla, pvalues){
    var resultEntity = {number: 0,message: "", err: null, result: []};
    var cid = null;
    var param = null;
    try{
        if (pvalues.length == 0){
            resultEntity = await dbconsultar(ptabla, param);
            if (resultEntity.number != 0) {    
                throw new Error(resultEntity.message);
            }
        }
        else{
            for(var element in pvalues) {
                for (var key in pvalues[element]) {
                    param = " where " + key + " = '" + pvalues[element][key] + "'"; 
                  }

                resultEntity = await dbconsultar(ptabla, param);
                if (resultEntity.number != 0) {    
                    throw new Error(resultEntity.message);
                }
            }
        } 
        return resultEntity;

    }catch(err){
        throw err;
    }
}
