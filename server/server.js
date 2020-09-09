//This is the entry point into our back-end application
require("dotenv").config();
const express = require("express");
const cors = require('cors');
const db = require("./db");
const morgan = require("morgan");
const app = express();

app.use(cors());

//attaches the body property to req
app.use(express.json());

// ROUTES:
// Get all records
app.get("/api/v1/records", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM records WHERE deleted = false ORDER BY fy ASC");
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                records: results.rows
            }
        });
    } catch (err) {
        console.error(err.message);
    }
})

// Get details
app.get("/api/v1/details/:id", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM details WHERE r_id = $1 AND deleted = false ORDER BY v_id ASC", [req.params.id]);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                details: results.rows
            }
        });
    } catch (err) {
        console.error(err.message);
    }
})

// Get record
app.get("/api/v1/records/:x", async (req, res) => {
    try {
        const results = await db.query(`SELECT id, fy, plant, bu, pg, au_stat, proj, country, lead_aud, co_aud, fsml_t, deleted FROM records WHERE to_tsvector(fy || ' ' || plant || ' ' || bu || ' ' || pg || ' ' || au_stat || ' ' || proj || ' ' || country || ' ' || lead_aud || ' ' || co_aud || ' ' || fsml_t ) @@ to_tsquery('${req.params.x}') AND deleted = false;`);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                records: results.rows
            }
        })
    } catch (err) {
        console.error(err.message);
    }
})

// Get detail
app.get("/api/v1/detail/:x/:y", async (req, res) => {
    try {
        const results = await db.query(`SELECT v_id, r_id, dom, dom_loc, fsml_r, issue, c_actions, a_res, a_rev, a_due, a_stat, last_rev, comm, deleted FROM details WHERE to_tsvector(dom || ' ' || dom_loc || ' ' || fsml_r || ' ' || issue || ' ' || c_actions || ' ' || a_res || ' ' || a_rev || ' ' || a_due || ' ' || a_stat || ' ' || last_rev || ' ' || comm) @@ to_tsquery('${req.params.y}') AND r_id = ${req.params.x} AND deleted = false;`);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                details: results.rows
            }
        })
    } catch (err) {
        console.error(err.message);
    }
})

// Get History
app.get("/api/v1/history/:n", async (req, res) => {
    try {
        const results = await db.query(`SELECT * FROM history ORDER BY h_id DESC LIMIT ${req.params.n}`); //LIMIT number
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                history: results.rows
            }
        })
    } catch (err) {
        console.error(err.message);
    }
})

// Create record
app.post("/api/v1/records", async (req, res) => {
    try {
        const results = await db.query("INSERT INTO records (fy,plant,bu,pg,au_stat,proj,country,lead_aud,co_aud,fsml_t,deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false) RETURNING *", [
            req.body.fy,
            req.body.plant,
            req.body.bu,
            req.body.pg,
            req.body.au_stat,
            req.body.proj,
            req.body.country,
            req.body.lead_aud,
            req.body.co_aud,
            req.body.fsml_t,
        ]);
        res.status(201).json({
            status: "success",
            records: results.rows[0]
        });
    } catch (err) {
        console.error(err.message);
    }
})

// Create details
app.post("/api/v1/details/:id", async (req, res) => {
    try {
        const results = await db.query("INSERT INTO details (r_id,dom,dom_loc,fsml_r,issue,c_actions,a_res,a_rev,a_due,a_stat,last_rev,comm,deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, false) RETURNING *", [
            req.params.id,
            req.body.dom,
            req.body.dom_loc,
            req.body.fsml_r,
            req.body.issue,
            req.body.c_actions,
            req.body.a_res,
            req.body.a_rev,
            req.body.a_due,
            req.body.a_stat,
            req.body.last_rev,
            req.body.comm,
        ]);
        res.status(201).json({
            status: "success",
            details: results.rows[0]
        });
    } catch (err) {
        console.error(err.message);
    }
})

// Create History
app.post("/api/v1/history", async (req, res) => {
    try {
        const results = await db.query("INSERT INTO history (info, h_date) VALUES ($1, $2) RETURNING *", [
            req.body.info,
            req.body.h_date
        ]);
        res.status(201).json({
            status: "success",
            history: results.rows[0]
        });
    } catch (err) {
        console.error(err.message);
    }
})

// Update record
app.put("/api/v1/records/:id", async (req, res) => {
    try {
        const results = await db.query("UPDATE records SET fy = $1, plant = $2, bu = $3, pg = $4, au_stat = $5, proj = $6, country = $7, lead_aud = $8, co_aud = $9, fsml_t = $10, deleted = $11 WHERE id = $12 RETURNING *", [
            req.body.fy,
            req.body.plant,
            req.body.bu,
            req.body.pg,
            req.body.au_stat,
            req.body.proj,
            req.body.country,
            req.body.lead_aud,
            req.body.co_aud,
            req.body.fsml_t,
            req.body.deleted,
            req.params.id
        ]);

        res.status(200).json({
            status: "success",
            record: results.rows[0]
        });
    } catch (err) {
        console.error(err.message);
    }
})

// Update detail
app.put("/api/v1/details/:v_id", async (req, res) => {
    try {
        const results = await db.query("UPDATE details SET dom = $1, dom_loc = $2, fsml_r = $3, issue = $4, c_actions = $5, a_res = $6, a_rev = $7, a_due = $8, a_stat = $9, last_rev = $10, comm = $11, deleted = $12 WHERE v_id = $13 RETURNING *", [
            req.body.dom,
            req.body.dom_loc,
            req.body.fsml_r,
            req.body.issue,
            req.body.c_actions,
            req.body.a_res,
            req.body.a_rev,
            req.body.a_due,
            req.body.a_stat,
            req.body.last_rev,
            req.body.comm,
            req.body.deleted,
            req.params.v_id
        ]);

        res.status(200).json({
            status: "success",
            record: results.rows[0]
        });
    } catch (err) {
        console.error(err.message);
    }
})

// Soft-Delete record
app.delete("/api/v1/records/:id", async (req, res) => {
    try {
        await db.query("UPDATE records SET deleted = true WHERE id = $1", [req.params.id]);
        await db.query("UPDATE details SET deleted = true WHERE r_id = $1", [req.params.id]);
        res.status(200).json({
            status: "success",
            deleted: req.params.id
        });
    } catch (err) {
        console.error(err.message);
    }
})

// Soft-Delete detail
app.delete("/api/v1/details/:id", async (req, res) => {
    try {
        const results = await db.query("UPDATE details SET deleted = true WHERE v_id = $1", [
            req.params.id,
        ]);
        res.status(200).json({
            status: "success",
            deleted: req.params.id
        });
    } catch (err) {
        console.error(err.message);
    }
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});