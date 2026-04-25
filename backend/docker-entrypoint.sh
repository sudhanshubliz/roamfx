#!/usr/bin/env sh
set -eu

if [ -n "${DATABASE_HOST:-}" ]; then
  export DATABASE_URL="jdbc:postgresql://${DATABASE_HOST}:${DATABASE_PORT:-5432}/${DATABASE_NAME:-roamfx}"
  export DATABASE_USERNAME="${DATABASE_USER:-${DATABASE_USERNAME:-roamfx}}"
  export DATABASE_PASSWORD="${DATABASE_PASSWORD:-roamfx}"
fi

exec java -jar /app/app.jar
