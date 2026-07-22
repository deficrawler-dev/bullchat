


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


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';


-- Required extensions used by the existing BullChat schema.
CREATE SCHEMA IF NOT EXISTS "extensions";

CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";



CREATE OR REPLACE FUNCTION "public"."check_reserved_username"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
declare
  reservation public.reserved_usernames%rowtype;
begin
  select * into reservation
  from public.reserved_usernames
  where username = new.username;

  if found and (reservation.unlocked_for is null or reservation.unlocked_for <> new.id) then
    raise exception 'Username "%" is reserved and cannot be claimed.', new.username
      using errcode = '23514';
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."check_reserved_username"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enforce_username_cooldown"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  if new.username is distinct from old.username then
    if now() - old.username_changed_at < interval '30 days' then
      raise exception 'Username can only be changed once every 30 days. Next change available on %.',
        (old.username_changed_at + interval '30 days')
        using errcode = '23514';
    end if;

    new.username_changed_at = now();
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."enforce_username_cooldown"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."find_user_by_passcode_lookup"("p_lookup_hash" "text") RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select user_id
  from public.recovery_passcodes
  where passcode_lookup_hash = p_lookup_hash
  limit 1;
$$;


ALTER FUNCTION "public"."find_user_by_passcode_lookup"("p_lookup_hash" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."find_user_by_recovery_passcode"("p_passcode" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  match_user_id uuid;
begin
  select user_id into match_user_id
  from public.recovery_passcodes
  where passcode_hash = extensions.crypt(p_passcode, passcode_hash)
  limit 1;

  return match_user_id;
end;
$$;


ALTER FUNCTION "public"."find_user_by_recovery_passcode"("p_passcode" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."find_user_by_recovery_passcode_legacy"("p_passcode" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  match_user_id uuid;
begin
  select user_id into match_user_id
  from public.recovery_passcodes
  where passcode_lookup_hash is null
    and passcode_hash = extensions.crypt(p_passcode, passcode_hash)
  limit 1;

  return match_user_id;
end;
$$;


ALTER FUNCTION "public"."find_user_by_recovery_passcode_legacy"("p_passcode" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if p_user_id is distinct from auth.uid() then
    raise exception 'Not authorized to set this recovery passcode.' using errcode = '42501';
  end if;

  insert into public.recovery_passcodes (user_id, passcode_hash, updated_at)
  values (p_user_id, extensions.crypt(p_passcode, extensions.gen_salt('bf', 10)), now())
  on conflict (user_id)
  do update set passcode_hash = excluded.passcode_hash, updated_at = now();
end;
$$;


ALTER FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text", "p_lookup_hash" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if p_user_id is distinct from auth.uid() then
    raise exception 'Not authorized to set this recovery passcode.' using errcode = '42501';
  end if;

  insert into public.recovery_passcodes (user_id, passcode_hash, passcode_lookup_hash, updated_at)
  values (p_user_id, extensions.crypt(p_passcode, extensions.gen_salt('bf', 10)), p_lookup_hash, now())
  on conflict (user_id)
  do update set
    passcode_hash = excluded.passcode_hash,
    passcode_lookup_hash = excluded.passcode_lookup_hash,
    updated_at = now();
end;
$$;


ALTER FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text", "p_lookup_hash" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text", "p_lookup_hash" "text", "p_lookup_key_version" smallint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if p_user_id is distinct from auth.uid() then
    raise exception 'Not authorized to set this recovery passcode.' using errcode = '42501';
  end if;

  insert into public.recovery_passcodes (
    user_id, passcode_hash, passcode_lookup_hash, lookup_key_version, updated_at
  )
  values (
    p_user_id, extensions.crypt(p_passcode, extensions.gen_salt('bf', 10)), p_lookup_hash, p_lookup_key_version, now()
  )
  on conflict (user_id)
  do update set
    passcode_hash = excluded.passcode_hash,
    passcode_lookup_hash = excluded.passcode_lookup_hash,
    lookup_key_version = excluded.lookup_key_version,
    updated_at = now();
end;
$$;


ALTER FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text", "p_lookup_hash" "text", "p_lookup_key_version" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."verify_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  stored text;
begin
  select passcode_hash into stored
  from public.recovery_passcodes
  where user_id = p_user_id;

  if stored is null then
    return false;
  end if;

  return stored = extensions.crypt(p_passcode, stored);
end;
$$;


ALTER FUNCTION "public"."verify_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."recovery_passcodes" (
    "user_id" "uuid" NOT NULL,
    "passcode_hash" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "passcode_lookup_hash" "text",
    "lookup_key_version" smallint DEFAULT 1 NOT NULL
);


ALTER TABLE "public"."recovery_passcodes" OWNER TO "postgres";


COMMENT ON TABLE "public"."recovery_passcodes" IS 'Hashed Recovery Passcodes (DATABASE.md "Anonymous Accounts"). Deliberately has zero SELECT/INSERT/UPDATE policies — see below.';



COMMENT ON COLUMN "public"."recovery_passcodes"."passcode_lookup_hash" IS 'HMAC-SHA256(secret, passcode), computed in the application layer only. Never a plaintext or reversible value — see IMPLEMENTATION_LOG_APPEND.md.';



COMMENT ON COLUMN "public"."recovery_passcodes"."lookup_key_version" IS 'Which HMAC key (see HMAC_KEY_ENV_VARS in src/lib/recoveryPasscodeHmac.ts) was used to compute passcode_lookup_hash. Existing rows default to 1 — the only key version that has ever existed. See IMPLEMENTATION_LOG_APPEND.md "Recommended Key Rotation Strategy" for how this will be used once rotation is actually implemented.';



CREATE TABLE IF NOT EXISTS "public"."reserved_usernames" (
    "username" "extensions"."citext" NOT NULL,
    "reserved_type" "text" NOT NULL,
    "note" "text",
    "unlocked_for" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "reserved_usernames_reserved_type_check" CHECK (("reserved_type" = ANY (ARRAY['system'::"text", 'founder'::"text", 'community'::"text"])))
);


ALTER TABLE "public"."reserved_usernames" OWNER TO "postgres";


COMMENT ON TABLE "public"."reserved_usernames" IS 'Usernames blocked from public signup until unlocked_for a specific verified auth.users.id. See DATABASE.md "Reserved Usernames".';



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "username" "extensions"."citext" NOT NULL,
    "username_changed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "display_name" "text" NOT NULL,
    "email" "text",
    "auth_provider" "text" NOT NULL,
    "country" "text",
    "avatar_url" "text",
    "cover_image_url" "text",
    "bio" "text",
    "wallet_address" "text",
    "last_seen" timestamp with time zone,
    "is_online" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "users_auth_provider_check" CHECK (("auth_provider" = ANY (ARRAY['x'::"text", 'google'::"text", 'anonymous'::"text"])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'Primary BullChat account record, one row per auth.users identity. See DATABASE.md "User" section.';



ALTER TABLE ONLY "public"."recovery_passcodes"
    ADD CONSTRAINT "recovery_passcodes_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."reserved_usernames"
    ADD CONSTRAINT "reserved_usernames_pkey" PRIMARY KEY ("username");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



CREATE UNIQUE INDEX "recovery_passcodes_lookup_hash_key" ON "public"."recovery_passcodes" USING "btree" ("passcode_lookup_hash");



CREATE INDEX "users_last_seen_idx" ON "public"."users" USING "btree" ("last_seen");



CREATE INDEX "users_username_idx" ON "public"."users" USING "btree" ("username");



CREATE OR REPLACE TRIGGER "users_a_enforce_username_cooldown" BEFORE UPDATE OF "username" ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_username_cooldown"();



CREATE OR REPLACE TRIGGER "users_check_reserved_username" BEFORE INSERT OR UPDATE OF "username" ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."check_reserved_username"();



CREATE OR REPLACE TRIGGER "users_set_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."recovery_passcodes"
    ADD CONSTRAINT "recovery_passcodes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reserved_usernames"
    ADD CONSTRAINT "reserved_usernames_unlocked_for_fkey" FOREIGN KEY ("unlocked_for") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Profiles are publicly readable" ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "Reserved usernames are publicly readable" ON "public"."reserved_usernames" FOR SELECT USING (true);



CREATE POLICY "Users can insert their own profile" ON "public"."users" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own profile" ON "public"."users" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



ALTER TABLE "public"."recovery_passcodes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reserved_usernames" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."check_reserved_username"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_reserved_username"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_reserved_username"() TO "service_role";



GRANT ALL ON FUNCTION "public"."enforce_username_cooldown"() TO "anon";
GRANT ALL ON FUNCTION "public"."enforce_username_cooldown"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enforce_username_cooldown"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."find_user_by_passcode_lookup"("p_lookup_hash" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."find_user_by_passcode_lookup"("p_lookup_hash" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."find_user_by_passcode_lookup"("p_lookup_hash" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_user_by_passcode_lookup"("p_lookup_hash" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."find_user_by_recovery_passcode"("p_passcode" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."find_user_by_recovery_passcode"("p_passcode" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."find_user_by_recovery_passcode_legacy"("p_passcode" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."find_user_by_recovery_passcode_legacy"("p_passcode" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."find_user_by_recovery_passcode_legacy"("p_passcode" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_user_by_recovery_passcode_legacy"("p_passcode" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text", "p_lookup_hash" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text", "p_lookup_hash" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text", "p_lookup_hash" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text", "p_lookup_hash" "text", "p_lookup_key_version" smallint) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text", "p_lookup_hash" "text", "p_lookup_key_version" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text", "p_lookup_hash" "text", "p_lookup_key_version" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text", "p_lookup_hash" "text", "p_lookup_key_version" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."verify_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."verify_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."verify_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_recovery_passcode"("p_user_id" "uuid", "p_passcode" "text") TO "service_role";



GRANT ALL ON TABLE "public"."recovery_passcodes" TO "anon";
GRANT ALL ON TABLE "public"."recovery_passcodes" TO "authenticated";
GRANT ALL ON TABLE "public"."recovery_passcodes" TO "service_role";



GRANT ALL ON TABLE "public"."reserved_usernames" TO "anon";
GRANT ALL ON TABLE "public"."reserved_usernames" TO "authenticated";
GRANT ALL ON TABLE "public"."reserved_usernames" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







