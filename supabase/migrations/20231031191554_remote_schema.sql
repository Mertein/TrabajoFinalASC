
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."Format" AS ENUM (
    'link',
    'file'
);

ALTER TYPE "public"."Format" OWNER TO "postgres";

CREATE TYPE "public"."Identifier" AS ENUM (
    'studentCertificateCourse',
    'studentCertificateWorkshop',
    'userDniFront',
    'userDniBack',
    'userPicture',
    'coursePicture',
    'categoryPicture',
    'branchPicture',
    'userSignature'
);

ALTER TYPE "public"."Identifier" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."assign_student_role"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO user_rol (user_id, rol_id, created_at)
  VALUES (NEW.user_id, (SELECT rol_id FROM rol WHERE rol_name = 'Student'), NOW());
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."assign_student_role"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."hist_branch_offices_hist"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
         INSERT INTO public.branch_offices_hist (
            d_operation, c_user_operation, c_operation, branch_id, branch_name, branch_address, people_capacity, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'U',  old.branch_id, old.branch_name, old.branch_address, old.people_capacity, old.created_at, old.updated_at, old.deleted_at
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.branch_offices_hist (
            d_operation, c_user_operation, c_operation, branch_id, branch_name, branch_address, people_capacity, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'D',  old.branch_id, old.branch_name, old.branch_address, old.people_capacity, old.created_at, old.updated_at, old.deleted_at
        );
    END IF;
    RETURN OLD;
END;
$$;

ALTER FUNCTION "public"."hist_branch_offices_hist"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."hist_category_course_hist"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.category_course_hist (
            d_operation, c_user_operation, c_operation,  category_id, category_name, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'U', old.category_id, old.category_name, old.created_at, old.updated_at, old.deleted_at
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.category_course_hist (
            d_operation, c_user_operation, c_operation,  category_id, category_name, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'D', old.category_id, old.category_name, old.created_at, old.updated_at, old.deleted_at
        );
    END IF;
    RETURN OLD;
END;
$$;

ALTER FUNCTION "public"."hist_category_course_hist"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."hist_class_hist"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
         INSERT INTO public.class_hist (
            d_operation, c_user_operation, c_operation, class_id, course_id, "isVirtual", created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'U', old.class_id, old.course_id, old."isVirtual", old.created_at, old.updated_at, old.deleted_at
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
         INSERT INTO public.class_hist (
            d_operation, c_user_operation, c_operation, class_id, course_id, "isVirtual", created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'D', old.class_id, old.course_id, old."isVirtual", old.created_at, old.updated_at, old.deleted_at
        );
    END IF;
    RETURN OLD;
END;
$$;

ALTER FUNCTION "public"."hist_class_hist"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."hist_course"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
 if(TG_OP = 'UPDATE') THEN
INSERT INTO public.course_hist(
d_operation, c_user_operation, c_operation, user_id, course_name, price_course, description_course, category_id, branch_id, start_date, end_date, "isFree", "isVirtual", description , course_id,created_at, deleted_at , updated_at)
VALUES (now(), current_user , 'U', old.user_id, old.course_name, old.price_course, old.description_course, old.category_id, old.id_branch, old.start_date, old.end_date, old."isFree", old."isVirtual", old.description, old.course_id, old.created_at, old.deleted_at, old.updated_at);
RETURN new;
ELSIF (TG_OP = 'DELETE') THEN
INSERT INTO public.course_hist(
d_operation, c_user_operation, c_operation, user_id, course_name, price_course, description_course, category_id, branch_id, start_date, end_date, "isFree", "isVirtual", description , course_id,created_at, deleted_at , updated_at)
VALUES (now(), current_user , 'D', old.user_id, old.course_name, old.price_course, old.description_course, old.category_id, old.id_branch, old.start_date, old.end_date, old."isFree", old."isVirtual", old.description, old.course_id, old.created_at, old.deleted_at, old.updated_at);
END IF;
RETURN old;
END;
$$;

ALTER FUNCTION "public"."hist_course"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."hist_enrollment_course"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.enrollment_course_hist (
            d_operation, c_user_operation, c_operation, enrollment_id, user_id, course_id, enrollment_date, payment_status, completion_status, feedback_course, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'U', old.enrollment_id, old.user_id, old.course_id, old.enrollment_date, old.payment_status, old.completion_status, old.feedback_course, old.created_at, old.updated_at, old.deleted_at
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.enrollment_course_hist (
            d_operation, c_user_operation, c_operation, enrollment_id, user_id, course_id, enrollment_date, payment_status, completion_status, feedback_course, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'D', old.enrollment_id, old.user_id, old.course_id, old.enrollment_date, old.payment_status, old.completion_status, old.feedback_course, old.created_at, old.updated_at, old.deleted_at
        );
    END IF;
    RETURN OLD;
END;
$$;

ALTER FUNCTION "public"."hist_enrollment_course"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."hist_files"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.files_hist (
            d_operation, c_user_operation, c_operation, link, path, thumbnail, name, size, type, title, format, identifier, certificate_id, class_id, user_id, category_id, course_id, enrollment_id, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'U', old.link, old.path, old.thumbnail, old.name, old.size, old.type, old.title, old.format, old.identifier, old.certificate_id, old.class_id, old.user_id, old.category_id, old.course_id, old.enrollment_id, old.created_at, old.updated_at, old.deleted_at
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.files_hist (
            d_operation, c_user_operation, c_operation, link, path, thumbnail, name, size, type, title, format, identifier, certificate_id, class_id, user_id, category_id, course_id, enrollment_id, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'D', old.link, old.path, old.thumbnail, old.name, old.size, old.type, old.title, old.format, old.identifier, old.certificate_id, old.class_id, old.user_id, old.category_id, old.course_id, old.enrollment_id, old.created_at, old.updated_at, old.deleted_at
        );
    END IF;
    RETURN OLD;
END;
$$;

ALTER FUNCTION "public"."hist_files"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."hist_grade"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.grade_hist (
            d_operation, c_user_operation, c_operation,  grade_id, value, enrollment_id, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'U', old.grade_id, old.value, old.enrollment_id, old.created_at, old.updated_at, old.deleted_at
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
         INSERT INTO public.grade_hist (
            d_operation, c_user_operation, c_operation,  grade_id, value, enrollment_id, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'D', old.grade_id, old.value, old.enrollment_id, old.created_at, old.updated_at, old.deleted_at
        );
    END IF;
    RETURN OLD;
END;
$$;

ALTER FUNCTION "public"."hist_grade"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."hist_payment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.payment_hist (
            d_operation, c_user_operation, c_operation, payment_id, payment_amount, payment_date, payment_method, payment_status, transaction_id, enrollment_id, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'U',  old.payment_id, old.payment_amount, old.payment_date, old.payment_method, old.payment_status, old.transaction_id, old.enrollment_id, old.created_at, old.updated_at, old.deleted_at
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.payment_hist (
            d_operation, c_user_operation, c_operation, payment_id, payment_amount, payment_date, payment_method, payment_status, transaction_id, enrollment_id, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'D',  old.payment_id, old.payment_amount, old.payment_date, old.payment_method, old.payment_status, old.transaction_id, old.enrollment_id, old.created_at, old.updated_at, old.deleted_at
        );
    END IF;
    RETURN OLD;
END;
$$;

ALTER FUNCTION "public"."hist_payment"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."hist_schedules"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.schedules_hist (
            d_operation, c_user_operation, c_operation, schedule_id, class_id, date, start_time, end_time, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'U', old.shedule_id, old.class_id, old.date, old.start_time, old.end_time, old.created_at, old.updated_at, old.deleted_at
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.schedules_hist (
            d_operation, c_user_operation, c_operation, schedule_id, class_id, date, start_time, end_time, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'D', old.shedule_id, old.class_id, old.date, old.start_time, old.end_time, old.created_at, old.updated_at, old.deleted_at
        );
    END IF;
    RETURN OLD;
END;
$$;

ALTER FUNCTION "public"."hist_schedules"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."hist_user"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.user_hist (
            d_operation, c_user_operation, c_operation, user_id, email, date_of_birth, password, gender, dni, first_name, last_name, address, emergency_contact, phone_number, created_at, deleted_at, updated_at
        )
        VALUES (
            NOW(), current_user, 'U', old.user_id, old.email, old.date_of__birth, old.password, old.gender, old.dni, old.first_name, old.last_name, old.address, old.emergency_contact, old.phone_number, old.created_at, old.deleted_at, old.updated_at
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.user_hist (
            d_operation, c_user_operation, c_operation, user_id, email, date_of_birth, password, gender, dni, first_name, last_name, address, emergency_contact, phone_number, created_at, deleted_at, updated_at
        )
        VALUES (
            NOW(), current_user, 'D', old.user_id, old.email, old.date_of__birth, old.password, old.gender, old.dni, old.first_name, old.last_name, old.address, old.emergency_contact, old.phone_number, old.created_at, old.deleted_at, old.updated_at
        );
    END IF;
    RETURN OLD;
END;
$$;

ALTER FUNCTION "public"."hist_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."hist_user_rol"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.user_rol_hist (
            d_operation, c_user_operation, c_operation,  user_id_hist, rol_id_hist, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'U', old.user_id,  old.rol_id, old.created_at, old.updated_at, old.deleted_at
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.user_rol_hist (
            d_operation, c_user_operation, c_operation, user_id_hist, rol_id_hist, created_at, updated_at, deleted_at
        )
        VALUES (
            NOW(), current_user, 'D', old.user_id, old.rol_id, old.created_at, old.updated_at, old.deleted_at
        );
    END IF;
    RETURN OLD;
END;
$$;

ALTER FUNCTION "public"."hist_user_rol"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."insert_default_roles"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Insertar el rol "Student" si no existe
  INSERT INTO public.rol (rol_name, created_at)
  SELECT 'Student', now()
  WHERE NOT EXISTS (SELECT 1 FROM public.rol WHERE rol_name = 'Student');

  -- Insertar el rol "Instructor" si no existe
  INSERT INTO public.rol (rol_name, created_at)
  SELECT 'Instructor', now()
  WHERE NOT EXISTS (SELECT 1 FROM public.rol WHERE rol_name = 'Instructor');

  -- Insertar el rol "Admin" si no existe
  INSERT INTO public.rol (rol_name, created_at)
  SELECT 'Admin', now()
  WHERE NOT EXISTS (SELECT 1 FROM public.rol WHERE rol_name = 'Admin');
END;
$$;

ALTER FUNCTION "public"."insert_default_roles"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."uppercase_branch_name"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.branch_name = UPPER(NEW.branch_name);
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."uppercase_branch_name"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."uppercase_category_name"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.category_name = UPPER(NEW.category_name);
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."uppercase_category_name"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."branch_offices" (
    "people_capacity" integer NOT NULL,
    "branch_name" character varying(30) NOT NULL,
    "branch_address" character varying(40) NOT NULL,
    "branch_id" integer NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "updated_at" timestamp(3) without time zone
);

ALTER TABLE "public"."branch_offices" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."branch_offices_branch_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."branch_offices_branch_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."branch_offices_branch_id_seq" OWNED BY "public"."branch_offices"."branch_id";

CREATE TABLE IF NOT EXISTS "public"."branch_offices_hist" (
    "branch_id_hist" integer NOT NULL,
    "branch_name" character varying(30) NOT NULL,
    "branch_address" character varying(40) NOT NULL,
    "people_capacity" integer NOT NULL,
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone,
    "deleted_at" timestamp(6) without time zone,
    "d_operation" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "c_user_operation" character varying(100),
    "c_operation" character varying(1) NOT NULL,
    "branch_id" integer NOT NULL
);

ALTER TABLE "public"."branch_offices_hist" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."branch_offices_hist_branch_id_hist_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."branch_offices_hist_branch_id_hist_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."branch_offices_hist_branch_id_hist_seq" OWNED BY "public"."branch_offices_hist"."branch_id_hist";

CREATE TABLE IF NOT EXISTS "public"."category_course" (
    "category_name" character varying(40) NOT NULL,
    "category_id" integer NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "updated_at" timestamp(3) without time zone,
    "file_category" "text" NOT NULL
);

ALTER TABLE "public"."category_course" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."category_course_category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."category_course_category_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."category_course_category_id_seq" OWNED BY "public"."category_course"."category_id";

CREATE TABLE IF NOT EXISTS "public"."category_course_hist" (
    "category_id_hist" integer NOT NULL,
    "category_id" integer,
    "d_operation" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "c_user_operation" character varying(100),
    "c_operation" character varying(1) NOT NULL,
    "category_name" character varying(40) NOT NULL,
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone,
    "deleted_at" timestamp(6) without time zone
);

ALTER TABLE "public"."category_course_hist" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."category_course_hist_category_id_hist_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."category_course_hist_category_id_hist_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."category_course_hist_category_id_hist_seq" OWNED BY "public"."category_course_hist"."category_id_hist";

CREATE TABLE IF NOT EXISTS "public"."certificate" (
    "certificate_id" integer NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "updated_at" timestamp(3) without time zone
);

ALTER TABLE "public"."certificate" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."certificate_certificate_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."certificate_certificate_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."certificate_certificate_id_seq" OWNED BY "public"."certificate"."certificate_id";

CREATE TABLE IF NOT EXISTS "public"."class" (
    "class_id" integer NOT NULL,
    "description_class" character varying(255) NOT NULL,
    "course_id" integer NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "updated_at" timestamp(3) without time zone,
    "isVirtual" boolean
);

ALTER TABLE "public"."class" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."class_class_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."class_class_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."class_class_id_seq" OWNED BY "public"."class"."class_id";

CREATE SEQUENCE IF NOT EXISTS "public"."class_course_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."class_course_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."class_course_id_seq" OWNED BY "public"."class"."course_id";

CREATE TABLE IF NOT EXISTS "public"."class_hist" (
    "class_id_hist" integer NOT NULL,
    "d_operation" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "c_user_operation" character varying(100),
    "c_operation" character varying(1) NOT NULL,
    "class_id" integer NOT NULL,
    "course_id" integer,
    "isVirtual" boolean NOT NULL,
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone,
    "deleted_at" timestamp(6) without time zone
);

ALTER TABLE "public"."class_hist" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."class_hist_class_id_hist_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."class_hist_class_id_hist_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."class_hist_class_id_hist_seq" OWNED BY "public"."class_hist"."class_id_hist";

CREATE TABLE IF NOT EXISTS "public"."course" (
    "course_id" integer NOT NULL,
    "course_name" character varying(100) NOT NULL,
    "price_course" double precision NOT NULL,
    "description_course" "text" NOT NULL,
    "user_id" integer NOT NULL,
    "category_id" integer NOT NULL,
    "id_branch" integer NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "updated_at" timestamp(3) without time zone,
    "end_date" timestamp(3) without time zone NOT NULL,
    "start_date" timestamp(3) without time zone NOT NULL,
    "description" "text"[],
    "isFree" boolean,
    "isVirtual" boolean,
    "apply_discount" boolean,
    "discount_percentage" integer,
    "end_date_discount" "date",
    "start_date_discount" "date"
);

ALTER TABLE "public"."course" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."course_category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."course_category_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."course_category_id_seq" OWNED BY "public"."course"."category_id";

CREATE SEQUENCE IF NOT EXISTS "public"."course_course_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."course_course_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."course_course_id_seq" OWNED BY "public"."course"."course_id";

CREATE TABLE IF NOT EXISTS "public"."course_hist" (
    "course_id_hist" integer NOT NULL,
    "d_operation" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "c_user_operation" character varying(100),
    "c_operation" character varying(1) NOT NULL,
    "course_id" integer,
    "course_name" "text" NOT NULL,
    "price_course" double precision NOT NULL,
    "description_course" character varying(400) NOT NULL,
    "user_id" integer NOT NULL,
    "category_id" integer,
    "branch_id" integer,
    "start_date" timestamp(6) without time zone NOT NULL,
    "end_date" timestamp(6) without time zone NOT NULL,
    "description" "text"[],
    "isFree" boolean NOT NULL,
    "isVirtual" boolean,
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone,
    "deleted_at" timestamp(6) without time zone
);

ALTER TABLE "public"."course_hist" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."course_hist_course_id_hist_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."course_hist_course_id_hist_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."course_hist_course_id_hist_seq" OWNED BY "public"."course_hist"."course_id_hist";

CREATE SEQUENCE IF NOT EXISTS "public"."course_id_branch_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."course_id_branch_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."course_id_branch_seq" OWNED BY "public"."course"."id_branch";

CREATE SEQUENCE IF NOT EXISTS "public"."course_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."course_user_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."course_user_id_seq" OWNED BY "public"."course"."user_id";

CREATE TABLE IF NOT EXISTS "public"."enrollment_course" (
    "enrollment_id" integer NOT NULL,
    "feedback_course" character varying(400),
    "enrollment_date" "date" NOT NULL,
    "user_id" integer NOT NULL,
    "course_id" integer NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "updated_at" timestamp(3) without time zone,
    "payment_status" boolean,
    "completion_status" boolean NOT NULL
);

ALTER TABLE "public"."enrollment_course" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."enrollment_course_enrollment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."enrollment_course_enrollment_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."enrollment_course_enrollment_id_seq" OWNED BY "public"."enrollment_course"."enrollment_id";

CREATE TABLE IF NOT EXISTS "public"."enrollment_course_hist" (
    "enrollment_id_hist" integer NOT NULL,
    "d_operation" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "c_user_operation" character varying(100),
    "c_operation" character varying(1) NOT NULL,
    "enrollment_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "course_id" integer,
    "enrollment_date" "date" NOT NULL,
    "payment_status" boolean,
    "completion_status" boolean,
    "feedback_course" character varying(400),
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone,
    "deleted_at" timestamp(6) without time zone
);

ALTER TABLE "public"."enrollment_course_hist" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."enrollment_course_hist_enrollment_id_hist_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."enrollment_course_hist_enrollment_id_hist_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."enrollment_course_hist_enrollment_id_hist_seq" OWNED BY "public"."enrollment_course_hist"."enrollment_id_hist";

CREATE TABLE IF NOT EXISTS "public"."faqs" (
    "id" integer NOT NULL,
    "question" "text" NOT NULL,
    "answer" "text" NOT NULL,
    "category" "text",
    "tags" "text"[],
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone
);

ALTER TABLE "public"."faqs" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."faqs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."faqs_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."faqs_id_seq" OWNED BY "public"."faqs"."id";

CREATE TABLE IF NOT EXISTS "public"."files" (
    "id" integer NOT NULL,
    "link" "text",
    "path" character varying(250),
    "thumbnail" "text",
    "name" character varying(100) NOT NULL,
    "size" numeric(9,0),
    "type" character varying(250),
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone,
    "certificate_id" integer,
    "class_id" integer,
    "user_id" integer,
    "category_id" integer,
    "course_id" integer,
    "enrollment_id" integer,
    "title" character varying(100),
    "format" "public"."Format" NOT NULL,
    "identifier" "public"."Identifier",
    "deleted_at" timestamp(6) without time zone
);

ALTER TABLE "public"."files" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."files_hist" (
    "id_hist" integer NOT NULL,
    "d_operation" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "c_user_operation" character varying(100),
    "c_operation" character varying(1) NOT NULL,
    "link" "text",
    "path" character varying(250) NOT NULL,
    "thumbnail" "text",
    "name" character varying(100) NOT NULL,
    "size" numeric(9,0) NOT NULL,
    "type" character varying(250) NOT NULL,
    "title" character varying,
    "format" "public"."Format" NOT NULL,
    "identifier" "public"."Identifier",
    "certificate_id" integer,
    "class_id" integer,
    "user_id" integer,
    "category_id" integer,
    "course_id" integer,
    "enrollment_id" integer,
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone,
    "deleted_at" timestamp(6) without time zone
);

ALTER TABLE "public"."files_hist" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."files_hist_id_hist_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."files_hist_id_hist_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."files_hist_id_hist_seq" OWNED BY "public"."files_hist"."id_hist";

CREATE SEQUENCE IF NOT EXISTS "public"."files_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."files_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."files_id_seq" OWNED BY "public"."files"."id";

CREATE TABLE IF NOT EXISTS "public"."grade" (
    "grade_id" integer NOT NULL,
    "value" double precision,
    "enrollment_id" integer,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "updated_at" timestamp(3) without time zone
);

ALTER TABLE "public"."grade" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."grade_enrollment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."grade_enrollment_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."grade_enrollment_id_seq" OWNED BY "public"."grade"."enrollment_id";

CREATE SEQUENCE IF NOT EXISTS "public"."grade_grade_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."grade_grade_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."grade_grade_id_seq" OWNED BY "public"."grade"."grade_id";

CREATE TABLE IF NOT EXISTS "public"."grade_hist" (
    "grade_id_hist" integer NOT NULL,
    "d_operation" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "c_user_operation" character varying(100),
    "c_operation" character varying(1) NOT NULL,
    "grade_id" integer,
    "value" double precision,
    "enrollment_id" integer,
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone,
    "deleted_at" timestamp(6) without time zone
);

ALTER TABLE "public"."grade_hist" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."grade_hist_grade_id_hist_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."grade_hist_grade_id_hist_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."grade_hist_grade_id_hist_seq" OWNED BY "public"."grade_hist"."grade_id_hist";

CREATE TABLE IF NOT EXISTS "public"."payment" (
    "payment_id" integer NOT NULL,
    "payment_amount" double precision NOT NULL,
    "payment_date" "date" NOT NULL,
    "payment_method" character varying(30) NOT NULL,
    "payment_status" integer NOT NULL,
    "transaction_id" integer NOT NULL,
    "enrollment_id" integer NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "updated_at" timestamp(3) without time zone
);

ALTER TABLE "public"."payment" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."payment_hist" (
    "payment_id_hist" integer NOT NULL,
    "d_operation" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "c_user_operation" character varying(100),
    "c_operation" character varying(1) NOT NULL,
    "payment_id" integer,
    "payment_amount" double precision,
    "payment_date" "date",
    "payment_method" character varying(30),
    "payment_status" integer,
    "transaction_id" integer,
    "enrollment_id" integer,
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone,
    "deleted_at" timestamp(6) without time zone
);

ALTER TABLE "public"."payment_hist" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."payment_hist_payment_id_hist_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."payment_hist_payment_id_hist_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."payment_hist_payment_id_hist_seq" OWNED BY "public"."payment_hist"."payment_id_hist";

CREATE SEQUENCE IF NOT EXISTS "public"."payment_payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."payment_payment_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."payment_payment_id_seq" OWNED BY "public"."payment"."payment_id";

CREATE TABLE IF NOT EXISTS "public"."rol" (
    "rol_id" integer NOT NULL,
    "rol_name" character varying(20) NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "updated_at" timestamp(3) without time zone
);

ALTER TABLE "public"."rol" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."rol_rol_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."rol_rol_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."rol_rol_id_seq" OWNED BY "public"."rol"."rol_id";

CREATE TABLE IF NOT EXISTS "public"."schedules" (
    "shedule_id" integer NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "updated_at" timestamp(3) without time zone,
    "branch_id" integer,
    "date" "date",
    "end_time" character varying NOT NULL,
    "start_time" character varying NOT NULL,
    "class_id" integer NOT NULL
);

ALTER TABLE "public"."schedules" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."schedules_hist" (
    "schedule_id_hist" integer NOT NULL,
    "d_operation" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "c_user_operation" character varying(100),
    "c_operation" character varying(1) NOT NULL,
    "schedule_id" integer,
    "start_time" character varying(20),
    "end_time" character varying(20),
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone,
    "deleted_at" timestamp(6) without time zone,
    "class_id" integer,
    "date" "date"
);

ALTER TABLE "public"."schedules_hist" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."schedules_hist_schedule_id_hist_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."schedules_hist_schedule_id_hist_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."schedules_hist_schedule_id_hist_seq" OWNED BY "public"."schedules_hist"."schedule_id_hist";

CREATE SEQUENCE IF NOT EXISTS "public"."schedules_shedule_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."schedules_shedule_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."schedules_shedule_id_seq" OWNED BY "public"."schedules"."shedule_id";

CREATE TABLE IF NOT EXISTS "public"."updateTime" (
    "id" integer NOT NULL,
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(6) without time zone,
    "deleted_at" timestamp(6) without time zone,
    "type" "text"
);

ALTER TABLE "public"."updateTime" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."updateTime_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."updateTime_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."updateTime_id_seq" OWNED BY "public"."updateTime"."id";

CREATE TABLE IF NOT EXISTS "public"."user_hist" (
    "user_id_hist" integer NOT NULL,
    "d_operation" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "c_user_operation" character varying(100),
    "c_operation" character varying(1) NOT NULL,
    "user_id" integer NOT NULL,
    "email" character varying(50) NOT NULL,
    "date_of_birth" "date" NOT NULL,
    "password" character varying(100) NOT NULL,
    "gender" character varying(20),
    "dni" numeric NOT NULL,
    "first_name" character varying(30) NOT NULL,
    "last_name" character varying(30) NOT NULL,
    "address" character varying(50) NOT NULL,
    "emergency_contact" numeric,
    "phone_number" numeric NOT NULL,
    "created_at" timestamp(6) without time zone NOT NULL,
    "deleted_at" timestamp(6) without time zone,
    "updated_at" timestamp(3) without time zone
);

ALTER TABLE "public"."user_hist" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."user_hist_user_id_hist_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."user_hist_user_id_hist_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."user_hist_user_id_hist_seq" OWNED BY "public"."user_hist"."user_id_hist";

CREATE TABLE IF NOT EXISTS "public"."user_interactions" (
    "id" integer NOT NULL,
    "user_id" integer,
    "faq_id" integer,
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    "feedback" "text",
    "isLike" boolean,
    "deleted_at" timestamp(6) without time zone,
    "updated_at" timestamp(3) without time zone
);

ALTER TABLE "public"."user_interactions" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."user_interactions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."user_interactions_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."user_interactions_id_seq" OWNED BY "public"."user_interactions"."id";

CREATE TABLE IF NOT EXISTS "public"."user_rol" (
    "user_id" integer NOT NULL,
    "rol_id" integer NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "updated_at" timestamp(3) without time zone
);

ALTER TABLE "public"."user_rol" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_rol_hist" (
    "user_id_hist" integer NOT NULL,
    "rol_id_hist" integer NOT NULL,
    "d_operation" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "c_user_operation" character varying(100),
    "c_operation" character varying(1) NOT NULL,
    "created_at" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone,
    "deleted_at" timestamp(6) without time zone,
    "user_rol_id" integer NOT NULL
);

ALTER TABLE "public"."user_rol_hist" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."user_rol_hist_user_rol_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."user_rol_hist_user_rol_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."user_rol_hist_user_rol_id_seq" OWNED BY "public"."user_rol_hist"."user_rol_id";

CREATE SEQUENCE IF NOT EXISTS "public"."user_rol_rol_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."user_rol_rol_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."user_rol_rol_id_seq" OWNED BY "public"."user_rol"."rol_id";

CREATE SEQUENCE IF NOT EXISTS "public"."user_rol_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."user_rol_user_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."user_rol_user_id_seq" OWNED BY "public"."user_rol"."user_id";

CREATE TABLE IF NOT EXISTS "public"."usser" (
    "user_id" integer NOT NULL,
    "email" character varying(50) NOT NULL,
    "date_of__birth" "date" NOT NULL,
    "password" character varying(1000) NOT NULL,
    "gender" character varying(20),
    "first_name" character varying(30) NOT NULL,
    "dni" numeric NOT NULL,
    "last_name" character varying(30) NOT NULL,
    "address" character varying(50) NOT NULL,
    "emergency_contact" numeric,
    "phone_number" numeric NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" timestamp(3) without time zone,
    "updated_at" timestamp(3) without time zone
);

ALTER TABLE "public"."usser" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."usser_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."usser_user_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."usser_user_id_seq" OWNED BY "public"."usser"."user_id";

ALTER TABLE ONLY "public"."branch_offices" ALTER COLUMN "branch_id" SET DEFAULT "nextval"('"public"."branch_offices_branch_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."branch_offices_hist" ALTER COLUMN "branch_id_hist" SET DEFAULT "nextval"('"public"."branch_offices_hist_branch_id_hist_seq"'::"regclass");

ALTER TABLE ONLY "public"."category_course" ALTER COLUMN "category_id" SET DEFAULT "nextval"('"public"."category_course_category_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."category_course_hist" ALTER COLUMN "category_id_hist" SET DEFAULT "nextval"('"public"."category_course_hist_category_id_hist_seq"'::"regclass");

ALTER TABLE ONLY "public"."certificate" ALTER COLUMN "certificate_id" SET DEFAULT "nextval"('"public"."certificate_certificate_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."class" ALTER COLUMN "class_id" SET DEFAULT "nextval"('"public"."class_class_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."class" ALTER COLUMN "course_id" SET DEFAULT "nextval"('"public"."class_course_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."class_hist" ALTER COLUMN "class_id_hist" SET DEFAULT "nextval"('"public"."class_hist_class_id_hist_seq"'::"regclass");

ALTER TABLE ONLY "public"."course" ALTER COLUMN "course_id" SET DEFAULT "nextval"('"public"."course_course_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."course" ALTER COLUMN "user_id" SET DEFAULT "nextval"('"public"."course_user_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."course" ALTER COLUMN "category_id" SET DEFAULT "nextval"('"public"."course_category_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."course" ALTER COLUMN "id_branch" SET DEFAULT "nextval"('"public"."course_id_branch_seq"'::"regclass");

ALTER TABLE ONLY "public"."course_hist" ALTER COLUMN "course_id_hist" SET DEFAULT "nextval"('"public"."course_hist_course_id_hist_seq"'::"regclass");

ALTER TABLE ONLY "public"."enrollment_course" ALTER COLUMN "enrollment_id" SET DEFAULT "nextval"('"public"."enrollment_course_enrollment_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."enrollment_course_hist" ALTER COLUMN "enrollment_id_hist" SET DEFAULT "nextval"('"public"."enrollment_course_hist_enrollment_id_hist_seq"'::"regclass");

ALTER TABLE ONLY "public"."faqs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."faqs_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."files" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."files_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."files_hist" ALTER COLUMN "id_hist" SET DEFAULT "nextval"('"public"."files_hist_id_hist_seq"'::"regclass");

ALTER TABLE ONLY "public"."grade" ALTER COLUMN "grade_id" SET DEFAULT "nextval"('"public"."grade_grade_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."grade_hist" ALTER COLUMN "grade_id_hist" SET DEFAULT "nextval"('"public"."grade_hist_grade_id_hist_seq"'::"regclass");

ALTER TABLE ONLY "public"."payment" ALTER COLUMN "payment_id" SET DEFAULT "nextval"('"public"."payment_payment_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."payment_hist" ALTER COLUMN "payment_id_hist" SET DEFAULT "nextval"('"public"."payment_hist_payment_id_hist_seq"'::"regclass");

ALTER TABLE ONLY "public"."rol" ALTER COLUMN "rol_id" SET DEFAULT "nextval"('"public"."rol_rol_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."schedules" ALTER COLUMN "shedule_id" SET DEFAULT "nextval"('"public"."schedules_shedule_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."schedules_hist" ALTER COLUMN "schedule_id_hist" SET DEFAULT "nextval"('"public"."schedules_hist_schedule_id_hist_seq"'::"regclass");

ALTER TABLE ONLY "public"."updateTime" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."updateTime_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."user_hist" ALTER COLUMN "user_id_hist" SET DEFAULT "nextval"('"public"."user_hist_user_id_hist_seq"'::"regclass");

ALTER TABLE ONLY "public"."user_interactions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_interactions_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."user_rol" ALTER COLUMN "user_id" SET DEFAULT "nextval"('"public"."user_rol_user_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."user_rol_hist" ALTER COLUMN "user_rol_id" SET DEFAULT "nextval"('"public"."user_rol_hist_user_rol_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."usser" ALTER COLUMN "user_id" SET DEFAULT "nextval"('"public"."usser_user_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."branch_offices_hist"
    ADD CONSTRAINT "branch_offices_hist_pk" PRIMARY KEY ("branch_id_hist");

ALTER TABLE ONLY "public"."branch_offices"
    ADD CONSTRAINT "branch_offices_pkey" PRIMARY KEY ("branch_id");

ALTER TABLE ONLY "public"."category_course_hist"
    ADD CONSTRAINT "category_course_hist_pk" PRIMARY KEY ("category_id_hist");

ALTER TABLE ONLY "public"."category_course"
    ADD CONSTRAINT "category_course_pkey" PRIMARY KEY ("category_id");

ALTER TABLE ONLY "public"."certificate"
    ADD CONSTRAINT "certificate_pkey" PRIMARY KEY ("certificate_id");

ALTER TABLE ONLY "public"."class_hist"
    ADD CONSTRAINT "class_hist_pk" PRIMARY KEY ("class_id_hist");

ALTER TABLE ONLY "public"."class"
    ADD CONSTRAINT "class_pkey" PRIMARY KEY ("class_id");

ALTER TABLE ONLY "public"."course_hist"
    ADD CONSTRAINT "course_hist_pk" PRIMARY KEY ("course_id_hist");

ALTER TABLE ONLY "public"."course"
    ADD CONSTRAINT "course_pkey" PRIMARY KEY ("course_id");

ALTER TABLE ONLY "public"."enrollment_course_hist"
    ADD CONSTRAINT "enrollment_course_hist_pk" PRIMARY KEY ("enrollment_id_hist");

ALTER TABLE ONLY "public"."enrollment_course"
    ADD CONSTRAINT "enrollment_course_pkey" PRIMARY KEY ("enrollment_id");

ALTER TABLE ONLY "public"."faqs"
    ADD CONSTRAINT "faqs_pk" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."files_hist"
    ADD CONSTRAINT "files_hist_pk" PRIMARY KEY ("id_hist");

ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_pk" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."grade_hist"
    ADD CONSTRAINT "grade_hist_pk" PRIMARY KEY ("grade_id_hist");

ALTER TABLE ONLY "public"."grade"
    ADD CONSTRAINT "grade_pkey" PRIMARY KEY ("grade_id");

ALTER TABLE ONLY "public"."payment_hist"
    ADD CONSTRAINT "payment_hist_pk" PRIMARY KEY ("payment_id_hist");

ALTER TABLE ONLY "public"."payment"
    ADD CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id");

ALTER TABLE ONLY "public"."rol"
    ADD CONSTRAINT "rol_pkey" PRIMARY KEY ("rol_id");

ALTER TABLE ONLY "public"."schedules_hist"
    ADD CONSTRAINT "schedules_hist_pk" PRIMARY KEY ("schedule_id_hist");

ALTER TABLE ONLY "public"."schedules"
    ADD CONSTRAINT "schedules_pkey" PRIMARY KEY ("shedule_id");

ALTER TABLE ONLY "public"."updateTime"
    ADD CONSTRAINT "update_time_pk" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_hist"
    ADD CONSTRAINT "user_hist_pk" PRIMARY KEY ("user_id_hist");

ALTER TABLE ONLY "public"."user_interactions"
    ADD CONSTRAINT "user_interactions_pk" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_rol_hist"
    ADD CONSTRAINT "user_rol_hist_pk" PRIMARY KEY ("user_rol_id");

ALTER TABLE ONLY "public"."user_rol"
    ADD CONSTRAINT "user_rol_pkey" PRIMARY KEY ("user_id", "rol_id");

ALTER TABLE ONLY "public"."usser"
    ADD CONSTRAINT "usser_pkey" PRIMARY KEY ("user_id");

CREATE UNIQUE INDEX "branch_offices_branch_name_uindex" ON "public"."branch_offices" USING "btree" ("branch_name");

CREATE UNIQUE INDEX "category_course__index_name" ON "public"."category_course" USING "btree" ("category_name");

CREATE UNIQUE INDEX "files_course_id_uindex" ON "public"."files" USING "btree" ("course_id");

CREATE UNIQUE INDEX "idx_unique_user_id_identifier" ON "public"."files" USING "btree" ("enrollment_id", "identifier");

CREATE UNIQUE INDEX "uk_user_id_identifier" ON "public"."files" USING "btree" ("user_id", "identifier");

CREATE UNIQUE INDEX "user_interactions_user_id_faq_id_uindex" ON "public"."user_interactions" USING "btree" ("user_id", "faq_id");

CREATE UNIQUE INDEX "usser_email_key" ON "public"."usser" USING "btree" ("email");

CREATE OR REPLACE TRIGGER "after_insert_user" AFTER INSERT ON "public"."usser" FOR EACH ROW EXECUTE FUNCTION "public"."assign_student_role"();

CREATE OR REPLACE TRIGGER "before_insert_uppercase" BEFORE INSERT ON "public"."branch_offices" FOR EACH ROW EXECUTE FUNCTION "public"."uppercase_branch_name"();

CREATE OR REPLACE TRIGGER "before_insert_uppercase_category" BEFORE INSERT ON "public"."category_course" FOR EACH ROW EXECUTE FUNCTION "public"."uppercase_category_name"();

CREATE OR REPLACE TRIGGER "hist" BEFORE DELETE OR UPDATE ON "public"."course" FOR EACH ROW EXECUTE FUNCTION "public"."hist_course"();

CREATE OR REPLACE TRIGGER "hist_branch_offices_hist" BEFORE DELETE OR UPDATE ON "public"."branch_offices" FOR EACH ROW EXECUTE FUNCTION "public"."hist_branch_offices_hist"();

CREATE OR REPLACE TRIGGER "hist_category_course_hist" BEFORE DELETE OR UPDATE ON "public"."category_course" FOR EACH ROW EXECUTE FUNCTION "public"."hist_category_course_hist"();

CREATE OR REPLACE TRIGGER "hist_class_hist" BEFORE DELETE OR UPDATE ON "public"."class" FOR EACH ROW EXECUTE FUNCTION "public"."hist_class_hist"();

CREATE OR REPLACE TRIGGER "hist_enrollment_course" BEFORE DELETE OR UPDATE ON "public"."enrollment_course" FOR EACH ROW EXECUTE FUNCTION "public"."hist_enrollment_course"();

CREATE OR REPLACE TRIGGER "hist_files" BEFORE DELETE OR UPDATE ON "public"."files" FOR EACH ROW EXECUTE FUNCTION "public"."hist_files"();

CREATE OR REPLACE TRIGGER "hist_grade" BEFORE DELETE OR UPDATE ON "public"."grade" FOR EACH ROW EXECUTE FUNCTION "public"."hist_grade"();

CREATE OR REPLACE TRIGGER "hist_payment" BEFORE DELETE OR UPDATE ON "public"."payment" FOR EACH ROW EXECUTE FUNCTION "public"."hist_payment"();

CREATE OR REPLACE TRIGGER "hist_schedules" BEFORE DELETE OR UPDATE ON "public"."schedules" FOR EACH ROW EXECUTE FUNCTION "public"."hist_schedules"();

CREATE OR REPLACE TRIGGER "hist_user" BEFORE DELETE OR UPDATE ON "public"."usser" FOR EACH ROW EXECUTE FUNCTION "public"."hist_user"();

CREATE OR REPLACE TRIGGER "hist_user_rol" BEFORE DELETE OR UPDATE ON "public"."user_rol" FOR EACH ROW EXECUTE FUNCTION "public"."hist_user_rol"();

ALTER TABLE ONLY "public"."class"
    ADD CONSTRAINT "class_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."course"("course_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."course"
    ADD CONSTRAINT "course_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category_course"("category_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."course"
    ADD CONSTRAINT "course_id_branch_fkey" FOREIGN KEY ("id_branch") REFERENCES "public"."branch_offices"("branch_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."course"
    ADD CONSTRAINT "course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."usser"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."enrollment_course"
    ADD CONSTRAINT "enrollment_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."course"("course_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."enrollment_course"
    ADD CONSTRAINT "enrollment_course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."usser"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category_course"("category_id");

ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificate"("certificate_id");

ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."class"("class_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."course"("course_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment_course"("enrollment_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."usser"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."grade"
    ADD CONSTRAINT "grade_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment_course"("enrollment_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."payment"
    ADD CONSTRAINT "payment_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment_course"("enrollment_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schedules"
    ADD CONSTRAINT "schedules_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branch_offices"("branch_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schedules"
    ADD CONSTRAINT "schedules_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."class"("class_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_interactions"
    ADD CONSTRAINT "user_interactions_faq_id_fkey" FOREIGN KEY ("faq_id") REFERENCES "public"."faqs"("id");

ALTER TABLE ONLY "public"."user_interactions"
    ADD CONSTRAINT "user_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."usser"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_rol_hist"
    ADD CONSTRAINT "user_rol_hist_rol_id_hist_fkey" FOREIGN KEY ("rol_id_hist") REFERENCES "public"."rol"("rol_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_rol"
    ADD CONSTRAINT "user_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "public"."rol"("rol_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_rol"
    ADD CONSTRAINT "user_rol_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."usser"("user_id") ON DELETE CASCADE;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."assign_student_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."assign_student_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."assign_student_role"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hist_branch_offices_hist"() TO "anon";
GRANT ALL ON FUNCTION "public"."hist_branch_offices_hist"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hist_branch_offices_hist"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hist_category_course_hist"() TO "anon";
GRANT ALL ON FUNCTION "public"."hist_category_course_hist"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hist_category_course_hist"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hist_class_hist"() TO "anon";
GRANT ALL ON FUNCTION "public"."hist_class_hist"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hist_class_hist"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hist_course"() TO "anon";
GRANT ALL ON FUNCTION "public"."hist_course"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hist_course"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hist_enrollment_course"() TO "anon";
GRANT ALL ON FUNCTION "public"."hist_enrollment_course"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hist_enrollment_course"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hist_files"() TO "anon";
GRANT ALL ON FUNCTION "public"."hist_files"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hist_files"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hist_grade"() TO "anon";
GRANT ALL ON FUNCTION "public"."hist_grade"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hist_grade"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hist_payment"() TO "anon";
GRANT ALL ON FUNCTION "public"."hist_payment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hist_payment"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hist_schedules"() TO "anon";
GRANT ALL ON FUNCTION "public"."hist_schedules"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hist_schedules"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hist_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."hist_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hist_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hist_user_rol"() TO "anon";
GRANT ALL ON FUNCTION "public"."hist_user_rol"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hist_user_rol"() TO "service_role";

GRANT ALL ON FUNCTION "public"."insert_default_roles"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert_default_roles"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_default_roles"() TO "service_role";

GRANT ALL ON FUNCTION "public"."uppercase_branch_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."uppercase_branch_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uppercase_branch_name"() TO "service_role";

GRANT ALL ON FUNCTION "public"."uppercase_category_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."uppercase_category_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uppercase_category_name"() TO "service_role";

GRANT ALL ON TABLE "public"."_prisma_migrations" TO "anon";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "service_role";

GRANT ALL ON TABLE "public"."branch_offices" TO "anon";
GRANT ALL ON TABLE "public"."branch_offices" TO "authenticated";
GRANT ALL ON TABLE "public"."branch_offices" TO "service_role";

GRANT ALL ON SEQUENCE "public"."branch_offices_branch_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."branch_offices_branch_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."branch_offices_branch_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."branch_offices_hist" TO "anon";
GRANT ALL ON TABLE "public"."branch_offices_hist" TO "authenticated";
GRANT ALL ON TABLE "public"."branch_offices_hist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."branch_offices_hist_branch_id_hist_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."branch_offices_hist_branch_id_hist_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."branch_offices_hist_branch_id_hist_seq" TO "service_role";

GRANT ALL ON TABLE "public"."category_course" TO "anon";
GRANT ALL ON TABLE "public"."category_course" TO "authenticated";
GRANT ALL ON TABLE "public"."category_course" TO "service_role";

GRANT ALL ON SEQUENCE "public"."category_course_category_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."category_course_category_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."category_course_category_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."category_course_hist" TO "anon";
GRANT ALL ON TABLE "public"."category_course_hist" TO "authenticated";
GRANT ALL ON TABLE "public"."category_course_hist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."category_course_hist_category_id_hist_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."category_course_hist_category_id_hist_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."category_course_hist_category_id_hist_seq" TO "service_role";

GRANT ALL ON TABLE "public"."certificate" TO "anon";
GRANT ALL ON TABLE "public"."certificate" TO "authenticated";
GRANT ALL ON TABLE "public"."certificate" TO "service_role";

GRANT ALL ON SEQUENCE "public"."certificate_certificate_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."certificate_certificate_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."certificate_certificate_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."class" TO "anon";
GRANT ALL ON TABLE "public"."class" TO "authenticated";
GRANT ALL ON TABLE "public"."class" TO "service_role";

GRANT ALL ON SEQUENCE "public"."class_class_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."class_class_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."class_class_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."class_course_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."class_course_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."class_course_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."class_hist" TO "anon";
GRANT ALL ON TABLE "public"."class_hist" TO "authenticated";
GRANT ALL ON TABLE "public"."class_hist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."class_hist_class_id_hist_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."class_hist_class_id_hist_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."class_hist_class_id_hist_seq" TO "service_role";

GRANT ALL ON TABLE "public"."course" TO "anon";
GRANT ALL ON TABLE "public"."course" TO "authenticated";
GRANT ALL ON TABLE "public"."course" TO "service_role";

GRANT ALL ON SEQUENCE "public"."course_category_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."course_category_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."course_category_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."course_course_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."course_course_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."course_course_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."course_hist" TO "anon";
GRANT ALL ON TABLE "public"."course_hist" TO "authenticated";
GRANT ALL ON TABLE "public"."course_hist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."course_hist_course_id_hist_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."course_hist_course_id_hist_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."course_hist_course_id_hist_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."course_id_branch_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."course_id_branch_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."course_id_branch_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."course_user_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."course_user_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."course_user_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."enrollment_course" TO "anon";
GRANT ALL ON TABLE "public"."enrollment_course" TO "authenticated";
GRANT ALL ON TABLE "public"."enrollment_course" TO "service_role";

GRANT ALL ON SEQUENCE "public"."enrollment_course_enrollment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."enrollment_course_enrollment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."enrollment_course_enrollment_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."enrollment_course_hist" TO "anon";
GRANT ALL ON TABLE "public"."enrollment_course_hist" TO "authenticated";
GRANT ALL ON TABLE "public"."enrollment_course_hist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."enrollment_course_hist_enrollment_id_hist_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."enrollment_course_hist_enrollment_id_hist_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."enrollment_course_hist_enrollment_id_hist_seq" TO "service_role";

GRANT ALL ON TABLE "public"."faqs" TO "anon";
GRANT ALL ON TABLE "public"."faqs" TO "authenticated";
GRANT ALL ON TABLE "public"."faqs" TO "service_role";

GRANT ALL ON SEQUENCE "public"."faqs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."faqs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."faqs_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."files" TO "anon";
GRANT ALL ON TABLE "public"."files" TO "authenticated";
GRANT ALL ON TABLE "public"."files" TO "service_role";

GRANT ALL ON TABLE "public"."files_hist" TO "anon";
GRANT ALL ON TABLE "public"."files_hist" TO "authenticated";
GRANT ALL ON TABLE "public"."files_hist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."files_hist_id_hist_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."files_hist_id_hist_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."files_hist_id_hist_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."files_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."files_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."files_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."grade" TO "anon";
GRANT ALL ON TABLE "public"."grade" TO "authenticated";
GRANT ALL ON TABLE "public"."grade" TO "service_role";

GRANT ALL ON SEQUENCE "public"."grade_enrollment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."grade_enrollment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."grade_enrollment_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."grade_grade_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."grade_grade_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."grade_grade_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."grade_hist" TO "anon";
GRANT ALL ON TABLE "public"."grade_hist" TO "authenticated";
GRANT ALL ON TABLE "public"."grade_hist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."grade_hist_grade_id_hist_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."grade_hist_grade_id_hist_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."grade_hist_grade_id_hist_seq" TO "service_role";

GRANT ALL ON TABLE "public"."payment" TO "anon";
GRANT ALL ON TABLE "public"."payment" TO "authenticated";
GRANT ALL ON TABLE "public"."payment" TO "service_role";

GRANT ALL ON TABLE "public"."payment_hist" TO "anon";
GRANT ALL ON TABLE "public"."payment_hist" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_hist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."payment_hist_payment_id_hist_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payment_hist_payment_id_hist_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payment_hist_payment_id_hist_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."payment_payment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payment_payment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payment_payment_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."rol" TO "anon";
GRANT ALL ON TABLE "public"."rol" TO "authenticated";
GRANT ALL ON TABLE "public"."rol" TO "service_role";

GRANT ALL ON SEQUENCE "public"."rol_rol_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rol_rol_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rol_rol_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."schedules" TO "anon";
GRANT ALL ON TABLE "public"."schedules" TO "authenticated";
GRANT ALL ON TABLE "public"."schedules" TO "service_role";

GRANT ALL ON TABLE "public"."schedules_hist" TO "anon";
GRANT ALL ON TABLE "public"."schedules_hist" TO "authenticated";
GRANT ALL ON TABLE "public"."schedules_hist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."schedules_hist_schedule_id_hist_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."schedules_hist_schedule_id_hist_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."schedules_hist_schedule_id_hist_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."schedules_shedule_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."schedules_shedule_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."schedules_shedule_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."updateTime" TO "anon";
GRANT ALL ON TABLE "public"."updateTime" TO "authenticated";
GRANT ALL ON TABLE "public"."updateTime" TO "service_role";

GRANT ALL ON SEQUENCE "public"."updateTime_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."updateTime_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."updateTime_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."user_hist" TO "anon";
GRANT ALL ON TABLE "public"."user_hist" TO "authenticated";
GRANT ALL ON TABLE "public"."user_hist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_hist_user_id_hist_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_hist_user_id_hist_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_hist_user_id_hist_seq" TO "service_role";

GRANT ALL ON TABLE "public"."user_interactions" TO "anon";
GRANT ALL ON TABLE "public"."user_interactions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_interactions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_interactions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_interactions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_interactions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."user_rol" TO "anon";
GRANT ALL ON TABLE "public"."user_rol" TO "authenticated";
GRANT ALL ON TABLE "public"."user_rol" TO "service_role";

GRANT ALL ON TABLE "public"."user_rol_hist" TO "anon";
GRANT ALL ON TABLE "public"."user_rol_hist" TO "authenticated";
GRANT ALL ON TABLE "public"."user_rol_hist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_rol_hist_user_rol_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_rol_hist_user_rol_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_rol_hist_user_rol_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_rol_rol_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_rol_rol_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_rol_rol_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_rol_user_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_rol_user_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_rol_user_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."usser" TO "anon";
GRANT ALL ON TABLE "public"."usser" TO "authenticated";
GRANT ALL ON TABLE "public"."usser" TO "service_role";

GRANT ALL ON SEQUENCE "public"."usser_user_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."usser_user_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."usser_user_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
