# Usamos una imagen base de Node con soporte para entornos gráficos
FROM node:20

# Instalamos dependencias necesarias para Electron
RUN apt-get update && apt-get install -y \
    libx11-dev \
    libxkbfile-dev \
    libsecret-1-dev \
    libnss3 \
    libgtk-3-0 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de configuración y las dependencias
COPY package*.json ./
RUN npm install

# Copiamos el código fuente
COPY . .

# Construimos el proyecto React para producción
RUN npm run build

# Exponemos el puerto 3000 (por compatibilidad, aunque no lo usaremos directamente)
EXPOSE 3000

# Ejecutamos el servidor de desarrollo (para mantener el contenedor activo)
CMD ["npm", "start"]