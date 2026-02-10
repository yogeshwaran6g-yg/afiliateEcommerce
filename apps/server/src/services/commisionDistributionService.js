import { env } from "#config/env.js";
import { queryRunner,transactionRunner } from "#config/db.js";

export default comissionService = {

    getRefComissionConfig : async()=>{
        try {
            const sql = `SELECT * FROM 
                        referral_commission_config 
                        WHERE is_active = 1`
            const result = await queryRunner(sql)
            return result
        } catch (error) {
            throw error
        }
    },

}