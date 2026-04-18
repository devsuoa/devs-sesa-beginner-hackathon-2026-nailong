declare namespace NodeJS {
	interface ProcessEnv {
		DATABASE_URL: string;
		DIRECT_URL: string;
		NEXT_PUBLIC_SUPABASE_URL: string;
		NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
		NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
		SUPABASE_SERVICE_ROLE_KEY: string;
	}
}
