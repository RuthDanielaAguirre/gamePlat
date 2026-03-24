<div align="center">

# 🎮 GamePlat - Plataforma Gaming Universal

## *La plataforma definitiva para hospedar y gestionar juegos web*

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

![Stars](https://img.shields.io/github/stars/daniela/gameplat?style=social)
![Forks](https://img.shields.io/github/forks/daniela/gameplat?style=social)
![Issues](https://img.shields.io/github/issues/daniela/gameplat)
![License](https://img.shields.io/github/license/daniela/gameplat)

</div>

---

## 🌟 **Características Principales**

### 🎯 **Para Jugadores**
- 🕹️ **Biblioteca Completa** - Accede a una amplia colección de juegos
- 📊 **Estadísticas Avanzadas** - Seguimiento detallado de sesiones y progreso  
- 🏆 **Sistema de Logros** - Desbloquea achievements y records
- 🎨 **Interfaz Moderna** - UI/UX diseñada con TailwindCSS

### 🛠️ **Para Administradores**
- 📋 **Gestión de Juegos** - CRUD completo con preview en tiempo real
- 👥 **Sistema de Roles** - Control granular (Admin, Gestor, Jugador)
- 📈 **Analytics Integrados** - Métricas de uso y engagement
- 🔒 **Seguridad Robusta** - Autenticación con Laravel Sanctum

### 🏗️ **Para Desarrolladores**
- 🚀 **API RESTful** - Endpoints documentados y seguros
- 🔧 **Arquitectura Modular** - Código limpio y escalable
- 🧪 **Testing Suite** - PHPUnit + Feature tests incluidos
- 📦 **Docker Ready** - Containerización lista para producción

---

## 🖼️ **Capturas de Pantalla**

### 🎮 **Panel de Juegos**
> *Vista principal donde los jugadores exploran y seleccionan juegos*

```
🎯 [CAPTURA: Dashboard de juegos con grid de thumbnails y filtros]
```

### 📊 **Gestión Administrativa** 
> *Panel de control completo para administradores*

```
🛠️ [CAPTURA: Panel admin con estadísticas, gestión de usuarios y juegos]
```

### 🕹️ **Experiencia de Juego**
> *Interfaz inmersiva durante las sesiones de juego*

```
🎮 [CAPTURA: Jugador en sesión activa con controles y estadísticas en tiempo real]
```

---

## 🚀 **Instalación Rápida**

### **Prerrequisitos**

```bash
# Tecnologías requeridas
PHP >= 8.3.0
Node.js >= 18.0.0  
pnpm >= 8.0.0
PostgreSQL >= 15.0
Docker & Docker Compose (opcional)
```

### **🔧 Setup del Proyecto**

```bash
# 1️⃣ Clonar repositorio
git clone https://github.com/daniela/gameplat.git
cd gameplat

# 2️⃣ Instalar dependencias PHP
cd app
composer install

# 3️⃣ Instalar dependencias Node.js
pnpm install

# 4️⃣ Configurar entorno
cp .env.example .env
php artisan key:generate
```

### **🐳 Base de Datos (Docker)**

```bash
# Levantar PostgreSQL + pgAdmin
cd ..  # Volver al directorio raíz
docker-compose up -d

# Verificar estado
docker-compose ps
```

### **🗄️ Migrar y Seedear**

```bash
cd app
php artisan migrate --seed

# Esto crea usuarios por defecto:
# 🔑 admin@gameplat.dev    (Administrador)
# 🎯 gestor@gameplat.dev   (Gestor)  
# 🕹️ jugador@gameplat.dev  (Jugador)
```

### **🎉 Levantar Servidores**

```bash
# Terminal 1: Backend Laravel
php artisan serve

# Terminal 2: Frontend Vite
pnpm run dev

# 🌐 Aplicación disponible en: http://localhost:5173
# 🔧 API backend en: http://localhost:8000
```

---

## 📋 **Stack Tecnológico**

### **🔙 Backend**

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Laravel** | `^13.0` | Framework PHP principal |
| **Sanctum** | `^4.0` | Autenticación SPA + API |
| **Inertia.js** | `^2.0` | Bridge Laravel ↔ React |
| **PostgreSQL** | `15+` | Base de datos relacional |

### **🔚 Frontend**

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | `^18.2` | Framework UI |
| **TailwindCSS** | `^3.2` | Styling atomico |
| **Headless UI** | `^2.0` | Componentes accesibles |
| **Vite** | `^8.0` | Build tool + HMR |

### **🛠️ DevOps**

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Docker** | `latest` | Containerización |
| **pnpm** | `^8.0` | Package manager |
| **Laravel Pint** | `^1.27` | Code formatting |
| **PHPUnit** | `^12.5` | Testing suite |

---

## 📊 **Estructura del Proyecto**

```
gameplat/
├── 🐳 docker-compose.yml          # Servicios Docker
├── 📱 app/                        # Aplicación Laravel
│   ├── 🎮 app/
│   │   ├── Http/Controllers/      # Controladores
│   │   │   ├── Api/              # API Controllers  
│   │   │   └── Web/              # Web Controllers
│   │   ├── Models/               # Modelos Eloquent
│   │   ├── Middleware/           # Middleware personalizado
│   │   └── Services/             # Lógica de negocio
│   ├── 🗄️ database/
│   │   ├── migrations/           # Schema de BD
│   │   ├── seeders/             # Data inicial
│   │   └── factories/           # Model factories
│   ├── ⚛️ resources/
│   │   ├── js/                  # React components
│   │   │   ├── Components/      # Componentes reutilizables
│   │   │   ├── Layouts/         # Layouts de página
│   │   │   └── Pages/           # Páginas principales
│   │   └── css/                 # Estilos base
│   ├── 🛣️ routes/
│   │   ├── web.php              # Rutas web
│   │   ├── api.php              # Rutas API
│   │   └── auth.php             # Rutas autenticación
│   └── ⚙️ config/               # Configuración
└── 📖 README.md                  # Este archivo
```

---

## 🔑 **Usuarios por Defecto**

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| 👑 **Admin** | `admin@gameplat.dev` | `password` | Control total del sistema |
| 🎯 **Gestor** | `gestor@gameplat.dev` | `password` | Gestión de juegos y usuarios |
| 🕹️ **Jugador** | `jugador@gameplat.dev` | `password` | Acceso a juegos y estadísticas |

---

## 🚀 **API Endpoints**

### **🔐 Autenticación**
```http
GET    /api/user                 # Datos usuario actual
```

### **🎮 Juegos**
```http
GET    /api/games               # Lista juegos públicos
GET    /api/games/{id}          # Detalles juego específico  
```

### **🎯 Sesiones de Juego**
```http
POST   /api/sessions/start      # Iniciar sesión de juego
POST   /api/sessions/{id}/end   # Finalizar sesión
GET    /api/sessions            # Historial personal
```

> 🔒 *Todas las rutas de sesiones requieren rol "jugador"*

---

## 🧪 **Testing**

```bash
# Ejecutar tests completos
php artisan test

# Tests con coverage
php artisan test --coverage

# Tests específicos
php artisan test --filter=GameSessionTest
```

---

## 📦 **Comandos Útiles**

```bash
# 🔄 Reset completo de DB
php artisan migrate:fresh --seed

# 🧹 Limpiar cache
php artisan optimize:clear

# 🏗️ Build producción
pnpm run build

# 🐳 Reiniciar servicios Docker
docker-compose restart

# 📊 Ver logs en tiempo real
php artisan pail
```

---

## 🤝 **Contribución**

¡Las contribuciones son bienvenidas! 🎉

1. **Fork** el proyecto
2. Crea tu **feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la branch (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### **📋 Guidelines**

- ✅ Sigue PSR-12 para PHP
- ✅ Usa Prettier para JS/CSS
- ✅ Escribe tests para nuevas features
- ✅ Documenta cambios en el CHANGELOG

---

## 📄 **Licencia**

Este proyecto está bajo la licencia **MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 💡 **Soporte**

¿Necesitas ayuda? ¡Estamos aquí para ti! 

- 📧 **Email**: support@gameplat.dev
- 🐛 **Issues**: [GitHub Issues](https://github.com/daniela/gameplat/issues)
- 📖 **Wiki**: [Documentación completa](https://github.com/daniela/gameplat/wiki)
- 💬 **Discord**: [Servidor de la comunidad](https://discord.gg/gameplat)

---

<div align="center">

## 🌟 **¡Dale una estrella si te gusta el proyecto!** ⭐

*Construido con ❤️ por el equipo GamePlat*

**[⬆️ Volver al inicio](#-gameplat---plataforma-gaming-universal)**

</div>