# Delilah Restó API

Proyecto Backend del curso de Desarrollo Web Full Stack de Acámica.

## Tecnologías utilizadas

- Node.js
- Libreria Nodemon
- Libreria Express
- Libreria Sequelize
- Json Web Token (JWT)
- MySQL
- Postman 
- Swagger

### Paso 1: Clonar Proyecto:

Clonar repositorio desde el [siguiente link](https://github.com/KaribelBT/delilah_resto.git)

Abrir terminal y ejecutar 

`git clone https://github.com/KaribelBT/delilah_resto.git`

### Paso 2: Instalar dependencias 

En el directorio donde se clonó el proyecto ejecutar desde la terminal:

`npm install`

### Paso 3: Configurar contraseña Json Web Token

- Abrir el archivo `config_sample.js` ubicado dentro de la carpeta `config` del proyecto clonado
- Reemplazar el string `escribeTuContraseñaSuperSecreta` por una contraseña secreta y guardar el cambio
- Renombrar el archivo como `config.js`

### Paso 4: Crear la base de datos

- Si no tiene instalado XAMPP, por favor dirigirse a [este link](https://www.apachefriends.org/es/index.html)
- Abrir XAMPP Panel Control, iniciar los servicios de Apache y MySQL y corroborar que el puerto sobre el cual se está ejecutando la base de datos es `3306`
- Si no encuentra XAMPP Panel de Control, por terminal ejecutar:
`sudo /opt/lampp/lampp start` 
- Ingresar desde el navegador a la ruta `http://localhost/phpmyadmin/index.php`
- Abrir el archivo `db_queries.sql` ubicado dentro de la carpeta `data_base` del proyecto clonado
- Crear la base de datos, se puede importar el archivo o se puede copiar su contenido y pegar en la solapa de SQL

### Paso 5: Iniciar el servidor

Desde la terminal ubicandose en la raiz del proyecto, ejecutar:

`node server.js`

### Paso 6: Hacer consultas a la API

- Si no tiene instalado Postman, por favor dirigirse a [este link](https://www.postman.com/downloads/)
- Abrir Postman, click en `File`, click en `Import`, click en `Import From Link` y pegar lo siguiente `https://www.getpostman.com/collections/c7f3375d229da08a0ed8` 
- Hacer las consultas deseadas

## Documentación de la API

Para ver la documentación de la API, puede abrir el archivo `delilah_resto_docs.yml` ubicado en el directorio raiz del proyecto o puede ingresar a [este link](https://app.swaggerhub.com/apis/KaribelBT/delilah_resto_documentation/1.0.0)