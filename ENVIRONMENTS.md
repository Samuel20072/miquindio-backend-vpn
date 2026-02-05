# Configuración de Entornos - Backend

Este documento describe cómo configurar y ejecutar el backend en diferentes entornos.

## Entornos Disponibles

### 1. Local (Desarrollo Local)
- **URL Frontend**: http://localhost:4200
- **URL Backend**: http://localhost:3000
- **Base de Datos**: localhost:3306

**Comandos:**
```bash
# Desarrollo con watch mode
npm run start:local

# Build para local
npm run build:local
```

### 2. Development (Servidor de Desarrollo)
- **URL Frontend**: https://dev.miquindio.com
- **URL Backend**: https://devapi.miquindio.com
- **Base de Datos**: Configurada via variables de entorno

**Comandos:**
```bash
# Desarrollo con watch mode
npm run start:dev

# Build para desarrollo
npm run build:dev
```

### 3. Production (Servidor de Producción)
- **URL Frontend**: https://miquindio.com
- **URL Backend**: https://api.miquindio.com
- **Base de Datos**: Configurada via variables de entorno

**Comandos:**
```bash
# Build para producción
npm run build:prod

# Ejecutar en producción
npm run start:prod
```

## Variables de Entorno

Para los entornos de desarrollo y producción, asegúrate de configurar las siguientes variables de entorno:

```bash
# Configuración de la aplicación
NODE_ENV=development|production
PORT=3000

# Configuración de la base de datos
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASS=your-db-password
DB_NAME=your-db-name

# Configuración JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# URLs del frontend
FRONTEND_URL=https://dev.miquindio.com|https://miquindio.com
CORS_ORIGIN=https://dev.miquindio.com|https://miquindio.com
```

## GitHub Actions

El proyecto incluye configuración de GitHub Actions que:

1. **Rama `dev`**: Despliega automáticamente al servidor de desarrollo
2. **Rama `main`**: Despliega automáticamente al servidor de producción

### Secrets Requeridos

Configura los siguientes secrets en GitHub:

- `HOSTING_HOST`: 162.0.209.84
- `HOSTING_USERNAME`: jorgepiq
- `HOSTING_SSH_KEY`: Contenido de la clave privada SSH (~/.ssh/id_hosting)
- `DB_HOST`: Host de la base de datos
- `DB_USERNAME`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_DATABASE`: Nombre de la base de datos
- `JWT_SECRET`: Secreto para JWT
- `DB_HOST_PROD`: Host de la base de datos de producción
- `DB_USERNAME_PROD`: Usuario de la base de datos de producción
- `DB_PASSWORD_PROD`: Contraseña de la base de datos de producción
- `DB_DATABASE_PROD`: Nombre de la base de datos de producción
- `JWT_SECRET_PROD`: Secreto para JWT de producción

## Estructura de Configuración

```
src/
├── config/
│   ├── configuration.ts          # Configuración principal
│   └── environments/
│       ├── local.ts             # Configuración local
│       ├── development.ts       # Configuración desarrollo
│       └── production.ts        # Configuración producción
```

Cada archivo de entorno define la configuración específica para ese ambiente, incluyendo URLs, credenciales de base de datos y configuraciones de CORS.
