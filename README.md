# 🎮 GamePlat — Plataforma de juegos con Laravel

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=websocket&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)

> **Plataforma moderna de gaming con reconocimiento facial, detección de emociones y chat en tiempo real**

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador)                       │
│                                                                  │
│  React + Inertia      face-api.js         Laravel Echo          │
│  (vistas del CRM)   (emociones local)   (WebSocket client)      │
└──────────┬───────────────┬──────────────────┬───────────────────┘
           │ HTTP           │ datos abstractos  │ WebSocket
           ▼                ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LARAVEL (Backend principal)                  │
│                                                                  │
│  Autenticación   API REST    Roles/Permisos   Broadcasting      │
│  web.php         api.php     Middleware        Reverb            │
└──────────┬───────────────────────────────────────────────────────┘
           │ HTTP (POST imágenes)
           ▼
┌──────────────────────────┐    ┌────────────────────────────────┐
│   Microservicio Facial   │    │         PostgreSQL              │
│   Python + FastAPI       │    │                                │
│   DeepFace (Facenet)     │    │  users, roles, games,          │
│   Docker — puerto 5001   │    │  game_sessions, messages,      │
│                          │    │  facial_enrollments,           │
│  Solo compara rostros.   │    │  emotion_events                │
│  No conoce usuarios.     │    └────────────────────────────────┘
│  No decide accesos.      │
└──────────────────────────┘
```

## Principios de diseño

**Laravel es el núcleo.** Gestiona usuarios, roles, rutas, autenticación y todas las decisiones de seguridad. Nunca delega decisiones en servicios externos.

**El microservicio facial solo compara.** Recibe dos imágenes, devuelve un resultado técnico (match, distance, confidence). No conoce usuarios ni gestiona sesiones. Laravel interpreta la respuesta y decide el acceso.

**Las emociones se detectan en cliente.** face-api.js procesa el vídeo localmente en el navegador. No se envían imágenes al servidor. Solo se envían datos abstractos (emoción, confianza, momento de la sesión).

**La API está separada de la web.** `web.php` sirve vistas para el CRM. `api.php` expone servicios JSON consumidos por los juegos y el frontend.

---

## Stack tecnológico

| Capa | Tecnología | Responsabilidad |
|------|-----------|-----------------|
| Backend | Laravel 11 | Auth, roles, API, lógica |
| Frontend | Inertia.js + React | Vistas del CRM |
| Base de datos | PostgreSQL 15 | Persistencia |
| WebSockets | Laravel Reverb | Chat en tiempo real |
| Colas | Laravel Queue | Broadcasting asíncrono |
| Microservicio | Python + FastAPI + DeepFace | Comparación facial |
| Detección emociones | face-api.js (cliente) | Análisis local sin envío de imágenes |
| Contenedores | Docker + Docker Compose | Aislamiento de servicios |

---

## Estructura del proyecto

```
gameplat/
├── docker-compose.yml          # PostgreSQL + pgAdmin + microservicio facial
├── .env                        # Variables de Docker
├── start.sh                    # Levanta todo con un comando
├── microservicio-facial/       # Servicio Python independiente
│   ├── main.py                 # FastAPI + DeepFace
│   ├── requirements.txt
│   └── Dockerfile
└── app/                        # Proyecto Laravel
    ├── app/
    │   ├── Models/             # User, Role, Game, GameSession,
    │   │   └── ...             # Message, FacialEnrollment, EmotionEvent
    │   ├── Http/
    │   │   ├── Controllers/
    │   │   │   ├── Web/        # GameController, PlayerController,
    │   │   │   │               # UserController, FacialController
    │   │   │   └── Api/        # GameApiController, MessageController,
    │   │   │                   # EmotionController
    │   │   └── Middleware/
    │   │       └── CheckRole.php
    │   ├── Services/
    │   │   └── FacialService.php  # Comunicación con el microservicio
    │   └── Events/
    │       └── MessageSent.php    # Evento WebSocket
    ├── routes/
    │   ├── web.php             # Rutas del CRM (devuelven vistas)
    │   └── api.php             # Rutas de la API (devuelven JSON)
    └── resources/js/
        ├── Pages/
        │   ├── Admin/          # Panel de gestión
        │   ├── Player/         # Experiencia del jugador
        │   └── Security/       # Enrolamiento y verificación facial
        └── Components/
            ├── Chat.jsx        # Chat en tiempo real
            └── EmotionTracker.jsx  # Detección local de emociones
```

---

## Roles del sistema

| Rol | Acceso |
|-----|--------|
| `administrador` | Gestión de usuarios, juegos y configuración |
| `gestor` | Crear, editar y publicar juegos |
| `jugador` | Acceder a juegos publicados y jugar |

Los roles se controlan **siempre en el servidor** mediante el middleware `CheckRole`.

---

## API endpoints

### Web (devuelven vistas)
| Ruta | Descripción |
|------|-------------|
| `GET /admin/games` | Panel de gestión de juegos |
| `GET /player/games` | Lista de juegos para el jugador |
| `GET /security` | Enrolamiento facial |
| `GET /verify-face` | Verificación facial |

### API REST (devuelven JSON)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/games` | Juegos publicados |
| POST | `/api/sessions/start` | Iniciar sesión de juego |
| POST | `/api/sessions/{id}/end` | Terminar sesión |
| GET | `/api/chat/{gameId}` | Historial de mensajes |
| POST | `/api/chat` | Enviar mensaje |
| POST | `/api/emotions` | Registrar evento emocional |

---

## Reconocimiento facial

### Enrolamiento
1. Usuario autenticado accede a `/security`
2. La webcam captura una imagen en el navegador
3. Laravel recibe la imagen en base64 y la guarda en `storage/app/private/faces/`
4. **Laravel no analiza la imagen durante el enrolamiento**

### Verificación
1. Usuario captura imagen con la webcam
2. Laravel recibe la imagen
3. Laravel recupera la imagen registrada del usuario
4. **Laravel envía ambas imágenes al microservicio Python**
5. El microservicio devuelve `{ match, distance, confidence }`
6. **Laravel interpreta el resultado y decide el acceso**
7. El navegador nunca habla directamente con el microservicio

---

## Detección de emociones

La detección ocurre **en el navegador** usando `face-api.js`. El proceso:

1. Durante la partida, la webcam analiza expresiones facialmente de forma local
2. Cada 3 segundos se detecta la emoción dominante
3. Se envía a Laravel **solo el dato abstracto**: `{ emotion, confidence, elapsed_ms }`
4. **No se envían imágenes, vídeo ni biometría al servidor**
5. Laravel guarda el evento asociado a la sesión de juego concreta

Esto permite analizar posteriormente cómo responde el jugador a diferentes momentos del juego.

---

## Arranque del entorno

```bash
# Levantar todo (Docker + Laravel + Reverb + Queue + Vite)
cd ~/Documents/gameplat
./start.sh
---

## WebSockets

El chat en tiempo real usa **Laravel Reverb** con canales por juego (`chat.game.{id}`).

```bash
php artisan reverb:start --port=9000
php artisan queue:work
```

El Queue Worker es necesario para que los eventos de broadcasting se procesen y lleguen a los clientes conectados.