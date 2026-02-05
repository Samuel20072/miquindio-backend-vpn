# 🌄 MiQuindío Backend

Backend API REST para el portal **miquindio.com**, una plataforma de publicación de productos y servicios en el departamento del Quindío, Colombia.

<div align="center">

[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Variables de Entorno](#-variables-de-entorno)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características

- 🔐 **Autenticación JWT** con roles y permisos
- 📝 **Publicación de productos y servicios** con categorías y tipos
- 🖼️ **Gestión de imágenes** con procesamiento y optimización
- 💬 **Sistema de comentarios** en publicaciones
- 🏙️ **Filtrado por ciudades** del departamento del Quindío
- 📊 **Categorización flexible** de productos y servicios
- 🛡️ **Validación de contenido** con filtro de lenguaje inapropiado
- 🔄 **Sincronización en tiempo real** con TypeORM
- 🌍 **CORS configurado** para múltiples entornos
- 🚀 **CI/CD automatizado** con GitHub Actions

---

## 🛠️ Tecnologías

### Core
- **[NestJS](https://nestjs.com/)** v11 - Framework backend progresivo para Node.js
- **[TypeScript](https://www.typescriptlang.org/)** v5.7 - Superset tipado de JavaScript
- **[Node.js](https://nodejs.org/)** v22 - Runtime de JavaScript

### Base de Datos
- **[TypeORM](https://typeorm.io/)** v0.3 - ORM para TypeScript
- **[MySQL](https://www.mysql.com/)** - Base de datos relacional

### Autenticación y Seguridad
- **[Passport](http://www.passportjs.org/)** - Middleware de autenticación
- **[JWT](https://jwt.io/)** - JSON Web Tokens
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de contraseñas

### Validación y Procesamiento
- **[class-validator](https://github.com/typestack/class-validator)** - Validación de DTOs
- **[class-transformer](https://github.com/typestack/class-transformer)** - Transformación de objetos
- **[leo-profanity](https://github.com/jojoee/leo-profanity)** - Filtro de lenguaje inapropiado

### Manejo de Archivos
- **[Multer](https://github.com/expressjs/multer)** - Middleware para multipart/form-data
- **[Sharp](https://sharp.pixelplumbing.com/)** - Procesamiento de imágenes

### Desarrollo
- **[ESLint](https://eslint.org/)** - Linter de código
- **[Prettier](https://prettier.io/)** - Formateador de código
- **[Jest](https://jestjs.io/)** - Framework de testing

---

## 🏗️ Arquitectura

El proyecto sigue una arquitectura modular basada en NestJS:

```
src/
├── auth/          # Autenticación y autorización
├── users/         # Gestión de usuarios
├── posts/         # Publicaciones (productos y servicios)
├── categories/    # Categorías de publicaciones
├── types/         # Tipos de publicaciones
├── cities/        # Ciudades del Quindío
├── comments/      # Comentarios en publicaciones
├── images/        # Gestión de imágenes
├── roles/         # Roles de usuarios
└── config/        # Configuración por entornos
```

### Módulos Principales

| Módulo | Descripción |
|--------|-------------|
| **Auth** | JWT, login, guards de roles |
| **Users** | CRUD de usuarios, perfiles |
| **Posts** | Publicaciones de productos/servicios |
| **Categories** | Categorización de contenido |
| **Cities** | Ciudades del departamento del Quindío |
| **Comments** | Sistema de comentarios |
| **Images** | Upload y optimización de imágenes |

---

## 📦 Requisitos Previos

- **Node.js** >= 22.x
- **npm** >= 10.x
- **MySQL** >= 8.0
- **Git**

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/miquindio-backend.git
cd miquindio-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales (ver [Variables de Entorno](#-variables-de-entorno)).

### 4. Configurar la base de datos

Crea una base de datos MySQL:

```sql
CREATE DATABASE jorgepiq_miquindio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

TypeORM se encargará de crear las tablas automáticamente en el primer inicio.

---

## ⚙️ Configuración

### Configuración por Entornos

El proyecto soporta 3 entornos:

- **Local** (`local`) - Desarrollo en tu máquina
- **Development** (`development`) - Servidor de desarrollo
- **Production** (`production`) - Servidor de producción

Cada entorno tiene su archivo de configuración en `src/config/environments/`.

### Archivo de Configuración

```typescript
// src/config/environments/local.ts
export const localConfig = {
  port: parseInt(process.env.APP_PORT || '3000', 10),
  database: { /* ... */ },
  jwt: { /* ... */ },
  frontend: {
    url: 'http://localhost:4200'
  },
  cors: {
    origin: 'http://localhost:4200'
  }
};
```

---

## 🎯 Uso

### Desarrollo Local

```bash
# Iniciar en modo watch
npm run start:local
```

El servidor estará disponible en `http://localhost:3000`.

### Desarrollo con Hot Reload

```bash
npm run start:dev
```

### Debug

```bash
npm run start:debug
```

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run start:local` | Inicia el servidor en modo local con hot reload |
| `npm run start:dev` | Inicia el servidor en modo development |
| `npm run start:prod` | Inicia el servidor en modo producción |
| `npm run build` | Compila el proyecto |
| `npm run build:local` | Compila para entorno local |
| `npm run build:dev` | Compila para entorno development |
| `npm run build:prod` | Compila para entorno production |
| `npm run lint` | Ejecuta ESLint y corrige errores |
| `npm run format` | Formatea el código con Prettier |
| `npm run test` | Ejecuta los tests |
| `npm run test:watch` | Ejecuta los tests en modo watch |
| `npm run test:cov` | Ejecuta los tests con cobertura |
| `npm run test:e2e` | Ejecuta los tests end-to-end |

---

## 📁 Estructura del Proyecto

```
miquindio-backend/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD con GitHub Actions
├── dist/                       # Archivos compilados
├── node_modules/               # Dependencias
├── src/
│   ├── auth/                   # Módulo de autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── roles.guard.ts
│   │   └── roles.decorator.ts
│   ├── users/                  # Módulo de usuarios
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── user.entity.ts
│   │   └── user.Dto.ts
│   ├── posts/                  # Módulo de publicaciones
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   ├── post.entity.ts
│   │   ├── create-post.dto.ts
│   │   └── update-post.dto.ts
│   ├── categories/             # Módulo de categorías
│   ├── cities/                 # Módulo de ciudades
│   ├── comments/               # Módulo de comentarios
│   ├── images/                 # Módulo de imágenes
│   ├── roles/                  # Módulo de roles
│   ├── types/                  # Módulo de tipos
│   ├── config/                 # Configuración
│   │   ├── configuration.ts
│   │   └── environments/
│   │       ├── local.ts
│   │       ├── development.ts
│   │       └── production.ts
│   ├── app.module.ts           # Módulo raíz
│   └── main.ts                 # Punto de entrada
├── test/                       # Tests e2e
├── uploads/                    # Archivos subidos (imágenes)
├── .env                        # Variables de entorno (no commitear)
├── .env.example                # Ejemplo de variables de entorno
├── .gitignore
├── nest-cli.json               # Configuración de NestJS CLI
├── package.json
├── tsconfig.json               # Configuración de TypeScript
├── GITHUB_SECRETS.md           # Guía de secrets para CI/CD
└── README.md
```

---

## 🌐 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Login de usuario | No |
| POST | `/auth/register` | Registro de usuario | No |

### Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/users` | Listar usuarios | Admin |
| GET | `/users/:id` | Obtener usuario | JWT |
| PUT | `/users/:id` | Actualizar usuario | JWT |
| DELETE | `/users/:id` | Eliminar usuario | Admin |

### Publicaciones

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/posts` | Listar publicaciones | No |
| GET | `/posts/:id` | Obtener publicación | No |
| POST | `/posts` | Crear publicación | JWT |
| PUT | `/posts/:id` | Actualizar publicación | JWT (Owner) |
| DELETE | `/posts/:id` | Eliminar publicación | JWT (Owner/Admin) |

### Categorías

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/categories` | Listar categorías | No |
| POST | `/categories` | Crear categoría | Admin |
| PUT | `/categories/:id` | Actualizar categoría | Admin |
| DELETE | `/categories/:id` | Eliminar categoría | Admin |

### Ciudades

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/cities` | Listar ciudades del Quindío | No |
| POST | `/cities` | Crear ciudad | Admin |

### Comentarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/posts/:postId/comments` | Listar comentarios | No |
| POST | `/posts/:postId/comments` | Crear comentario | JWT |
| DELETE | `/comments/:id` | Eliminar comentario | JWT (Owner/Admin) |

### Imágenes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/images/upload` | Subir imagen | JWT |
| GET | `/uploads/images/:filename` | Obtener imagen | No |

---

## 🚢 Deployment

El proyecto utiliza GitHub Actions para CI/CD automatizado.

### Despliegue Automático

- **Push a `dev`** → Despliega a `https://dev.miquindio.com`
- **Push a `main`** → Despliega a `https://miquindio.com`

### Workflow de Deployment

1. ✅ Checkout del código
2. ✅ Setup de Node.js 22
3. ✅ Instalación de dependencias
4. ✅ Creación del archivo `.env` desde GitHub Secrets
5. ✅ Build del proyecto
6. ✅ Deploy vía rsync al servidor
7. ✅ Restart del servicio con PM2

### Configurar Secrets en GitHub

Para que el deployment funcione, debes configurar los siguientes secrets en GitHub:

Ve a **Settings** → **Secrets and variables** → **Actions** y agrega:

#### Development
- `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET`

#### Production
- `DB_HOST_PROD`, `DB_USERNAME_PROD`, `DB_PASSWORD_PROD`, `DB_DATABASE_PROD`
- `JWT_SECRET_PROD`

#### Hosting
- `HOSTING_HOST`, `HOSTING_USERNAME`, `HOSTING_SSH_KEY`

Para más detalles, consulta [GITHUB_SECRETS.md](./GITHUB_SECRETS.md).

---

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_NAME=jorgepiq_miquindio

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h

# Aplicación
APP_PORT=3000
```

### Generar JWT_SECRET Seguro

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 👥 Contribución

### Flujo de Trabajo

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- Seguir las reglas de ESLint configuradas
- Usar Prettier para formatear el código
- Escribir tests para nuevas funcionalidades
- Documentar funciones y métodos complejos

---

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública. Todos los derechos reservados.

**Desarrollado por:** Genios Soft S.A.S.

---

## 🤝 Soporte

Para soporte o consultas, contacta a:

- **Email:** [email protected]
- **Website:** [https://miquindio.com](https://miquindio.com)

---

<div align="center">

**Hecho con ❤️ para el Quindío, Colombia 🇨🇴**

</div># miquindio-backend-vpn
# miquindio-backend-vpn
# miquindio-backend-vpn
# miquindio-backend-vpn
# miquindio-backend-vpn
