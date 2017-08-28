--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.0
-- Dumped by pg_dump version 9.6.0

-- Started on 2017-07-26 01:57:06

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12387)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2128 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 186 (class 1259 OID 50169)
-- Name: weather history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "weather history" (
    measure_id bigint NOT NULL,
    temperature numeric(5,2) NOT NULL,
    pressure numeric(7,2) NOT NULL,
    humidity numeric(5,2) NOT NULL,
    creation_date timestamp with time zone DEFAULT now()
);


ALTER TABLE "weather history" OWNER TO postgres;

--
-- TOC entry 185 (class 1259 OID 50167)
-- Name: weather history_measure_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "weather history_measure_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "weather history_measure_id_seq" OWNER TO postgres;

--
-- TOC entry 2129 (class 0 OID 0)
-- Dependencies: 185
-- Name: weather history_measure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "weather history_measure_id_seq" OWNED BY "weather history".measure_id;


--
-- TOC entry 2001 (class 2604 OID 50172)
-- Name: weather history measure_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "weather history" ALTER COLUMN measure_id SET DEFAULT nextval('"weather history_measure_id_seq"'::regclass);


--
-- TOC entry 2004 (class 2606 OID 50174)
-- Name: weather history measure_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "weather history"
    ADD CONSTRAINT measure_id PRIMARY KEY (measure_id);


-- Completed on 2017-07-26 01:57:06

--
-- PostgreSQL database dump complete
--

