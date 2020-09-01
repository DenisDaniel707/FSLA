
CREATE TABLE records (
    id BIGSERIAL PRIMARY KEY,
    fy VARCHAR(20),
    plant VARCHAR(20),
    bu VARCHAR(20),
    pg VARCHAR(20),
    au_stat VARCHAR(20),
    proj TEXT,
    country TEXT,
    lead_aud TEXT,
    co_aud TEXT,
    fsml_t CHAR(5)
);

CREATE TABLE details (
    v_id BIGSERIAL,
    r_id BIGINT,
    dom VARCHAR(20),
    dom_loc TEXT,
    fsml_r VARCHAR(5),
    issue TEXT,
    c_actions TEXT,
    a_res TEXT,
    a_rev TEXT,
    a_due DATE,
    a_stat TEXT,
    last_rev DATE,
    comm TEXT
);

CREATE TABLE history (
    h_id BIGSERIAL PRIMARY KEY,
    fy VARCHAR(20),
    plant VARCHAR(20),
    bu VARCHAR(20),
    pg VARCHAR(20),
    au_stat VARCHAR(20),
    proj TEXT,
    country TEXT,
    lead_aud TEXT,
    co_aud TEXT,
    fsml_t CHAR(5)
);

INSERT INTO records (fy,plant,bu,pg,au_stat,proj,country,lead_aud,co_aud,dom,dom_loc,fsml_t,fsml_r,issue,c_actions,a_res,a_rev,a_due,a_stat,last_rev,comm) VALUES ('FY18/19','HAN','GL','RCL','performed','Skoda_SK316','Czech R, Ostrawa','Ioana Cocean','Peter Iwanek','SW','HAN','B','na','na','na','na','na',DATE '2015-12-17','na','na','na');

-- records
SELECT id, fy, plant, bu, pg, au_stat, proj, country, lead_aud, co_aud, fsml_t, deleted FROM records WHERE to_tsvector(fy || ' ' || plant || ' ' || bu || ' ' || pg || ' ' || au_stat || ' ' || proj || ' ' || country || ' ' || lead_aud || ' ' || co_aud || ' ' || fsml_t ) @@ to_tsquery('some_string');


-- details
SELECT v_id, r_id, dom, dom_loc, fsml_r, issue, c_actions, a_res, a_rev, a_due, a_stat, last_rev, comm, deleted FROM details WHERE to_tsvector(dom || ' ' || dom_loc || ' ' || fsml_r || ' ' || issue || ' ' || c_actions || ' ' || a_res || ' ' || a_rev || ' ' || a_due || ' ' || a_stat || ' ' || last_rev || ' ' || comm) @@ to_tsquery('some_string');
