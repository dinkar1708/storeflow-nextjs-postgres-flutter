# Regenerate the API client (Flutter)

Run this after **`api-web`** changes OpenAPI (routes, JSDoc `@swagger`, schemas). **Not** needed for Dart/UI-only changes or env-only base URL tweaks — see [README.md](./README.md).

**One-liner** — run inside **`flutter-app/`**. **`api-web`** must be up (`npm run dev` on port **3001**). **`/api/swagger`** uses HTTP Basic Auth — **`curl -u`** must match `SWAGGER_DOCS_USERNAME` / `SWAGGER_DOCS_PASSWORD` in `api-web/.env.development` (defaults below).

```bash
mkdir -p lib/swagger_api && curl -sS -f -u "docs:dev-swagger-docs" "http://localhost:3001/api/swagger" -o lib/swagger_api/storeflow_api.json && dart pub get && dart run build_runner clean && dart run build_runner build --delete-conflicting-outputs
```

**`-f`** makes `curl` fail on HTTP errors so you don’t save `Authentication required` into the JSON by mistake.

**Troubleshooting:** **`curl: (22) The requested URL returned error: 401`** — wrong user/pass or env not loaded; fix **`-u`** to match `api-web` `.env`. If **`build_runner`** says **`FormatException`** on the JSON, re-run **`curl`** with correct **`-u`**, then **`build_runner`** again.

## Steps

1. **Backend:** `cd api-web && npm run dev` → **`http://localhost:3001/api/swagger`**

2. **Save spec** (from **`flutter-app/`**):

   ```bash
   mkdir -p lib/swagger_api
   curl -sS -f -u "docs:dev-swagger-docs" "http://localhost:3001/api/swagger" -o lib/swagger_api/storeflow_api.json
   ```

3. **Codegen** (same folder):

   ```bash
   dart pub get
   dart run build_runner clean
   dart run build_runner build --delete-conflicting-outputs
   ```

4. **Hand-written `lib/`** (outside `api_generated/`): fix renames if generated names changed.

## Commit

**`lib/swagger_api/storeflow_api.json`**, **`lib/api_generated/`**, and any manual Dart fixes — keep JSON and codegen in sync.

**`build.yaml` `include_paths`:** path regexes in the spec, not the JSON filename.

More: [README.md](./README.md) · [api-web/TEST_LOGIN.md](../api-web/TEST_LOGIN.md)
